import uniqueId from 'lodash/uniqueId';
import * as d3 from 'd3';

class DiagramContext {

  draggedItem;
  handleItemDblClick = () => { console.error('handleItemDblClick is not set'); };
  handleItemClick = () => { console.error('handleItemClick is not set'); };
  handleDropNew = () => { console.error('handleDropNew is not set'); };
  handleErrorClick = () => { console.error('handleErrorClick is not set'); };
  handleDragEnd = () => { console.error('handleDragEnd is not set'); };

  setDraggedItem(item) {
    this.draggedItem = item;
  }

  getDraggedItem() {
    return this.draggedItem;
  }

  setHandleItemDblClick(value) {
    this.handleItemDblClick = value;
  }

  getHandleItemDblClick() {
    return this.handleItemDblClick;
  }

  setHandleItemClick(value) {
    this.handleItemClick = value;
  }

  getHandleItemClick() {
    return this.handleItemClick;
  }

  setHandleDropNew(value) {
    this.handleDropNew = value;
  }

  getHandleDropNew() {
    return this.handleDropNew;
  }

  setHandleErrorClick(value) {
    this.handleErrorClick = value;
  }

  getHandleErrorClick() {
    return this.handleErrorClick;
  }

  setHandleDragEnd(value) {
    this.handleDragEnd = value;
  }

  getHandleDragEnd() {
    return this.handleDragEnd;
  }

  onDragOver() {
    d3.event.preventDefault();
  }

  onDrop(self, item) {
    const rectNode = d3.select(self);
    rectNode.classed('acceptable', false);
    d3.event.preventDefault();
    if (this.draggedItem) {
      const { props: {acceptableTypes} } = item.data;
      if (acceptableTypes && acceptableTypes.length > 0) {
        if (acceptableTypes.indexOf(this.draggedItem.type) >= 0) {
          this.handleDropNew(this.draggedItem, item.data);
        }
      }
    }
  }

  onDragEnter(self, item) {
    // Get the location on screen of the element.
    const { props: { acceptableTypes } } = item.data;
    if (this.draggedItem) {
      if (acceptableTypes && acceptableTypes.length > 0) {
        if (acceptableTypes.indexOf(this.draggedItem.type) >= 0) {
          const rectNode = d3.select(self);
          rectNode.classed('acceptable', true);
        }
      }
    }
  }

  onDragLeave(self, item) {
    const rectNode = d3.select(self);
    rectNode.classed('acceptable', false);
  }

}


export function initDragLineContext(svg, rootSelection, connectProperties) {

  const dragLineIdPrefix = uniqueId('dragLine');
  const dragContext = {
    mouseDownProperty: undefined,
    mouseUpProperty: undefined,
    dragProperty: undefined,
  };
  let dragLine = undefined;
  let dragLineStartPoint = undefined;

  // define arrow markers for graph links
  svg.append('svg:defs').append('svg:marker')
    .attr('id', `${dragLineIdPrefix}end-arrow`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

  dragContext.dragProperty = d3.drag()
    .subject(function (d) { return d; })
    .on('start', (item) => {
      d3.event.sourceEvent.stopPropagation();
      if (!dragLine && !dragContext.mouseDownProperty && !dragLineStartPoint) {
        dragContext.mouseDownProperty = item;
        dragLineStartPoint = {x: item.globalX + item.pointX, y: item.globalY + item.pointY};
        dragLine = rootSelection
          .append('svg:path')
          .attr('class', 'dragline')
          .style('marker-end', `url(#${dragLineIdPrefix}end-arrow)`)
          .attr('d', `M ${dragLineStartPoint.x} ${dragLineStartPoint.y} L ${dragLineStartPoint.x} ${dragLineStartPoint.y}`);
      }
    })
    .on('drag', function(item) {
      // update drag line
      if (dragLine && dragContext.mouseDownProperty && dragLineStartPoint) {
        const endPointX = (item.globalX + d3.event.x + item.pointX) - item.x;
        const endPointY = (item.globalY + d3.event.y + item.pointY) - item.y;
        dragLine
          .attr('d', `M ${dragLineStartPoint.x} ${dragLineStartPoint.y} L ${endPointX} ${endPointY} `);
      }
    })
    .on('end', function() {
      if (dragLine && dragContext.mouseDownProperty && dragLineStartPoint) {
        // hide drag line
        dragLine.remove();
        if (connectProperties && dragContext.mouseUpProperty) {
          connectProperties(
            dragContext.mouseDownProperty.key, dragContext.mouseDownProperty.name,
            dragContext.mouseUpProperty.key, dragContext.mouseUpProperty.name
          );
        }
        dragLine = undefined;
        dragContext.mouseDownProperty = undefined;
        dragLineStartPoint = undefined;
      }
    });

  return dragContext;
}

export function initDiagramContext() {
  return new DiagramContext();
}