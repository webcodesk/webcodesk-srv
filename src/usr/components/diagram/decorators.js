/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import isEmpty from 'lodash/isEmpty';
import * as d3 from 'd3';
import constants from '../../../commons/constants';
import * as utils from './utils';

const duration = 300;

class DiagramDecorator {

  dragContext = null;
  diagramContext = null;
  drag = null;

  constructor (dragContext, diagramContext) {
    this.dragContext = dragContext;
    this.diagramContext = diagramContext;
    const self = this;
    this.drag = d3.drag()
      .subject(function (d) { return d; })
      .on('start', function(){
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).raise();
      })
      .on('drag', function () {
        d3.select(this).attr('transform', item => {
          item.x += d3.event.dy;
          item.y += d3.event.dx;
          return 'translate(' + item.y + ',' + item.x + ')';
        });
      })
      .on('end', function(d) {
        const {data: {key}} = d;
        self.diagramContext.getHandleDragEnd()(key, {x: d.x, y: d.y});
      });

  }

// ---------------------------------------------------------------------------------------------------------------------
// Group decorators

  // dragstarted (d) {
  //   d3.event.sourceEvent.stopPropagation();
  //   d3.select(this).raise();
  // }
  //
  // dragged (d) {
  //   const self = d3.select(this);
  //   self.attr('transform', item => {
  //     item.x += d3.event.dy;
  //     item.y += d3.event.dx;
  //     return 'translate(' + item.y + ',' + item.x + ')';
  //   });
  // }
  //
  // dragended (d) {
  //   const {data: {key}} = d;
  //   this.diagramContext.getHandleDragEnd()(key, {x: d.x, y: d.y});
  // }


  decorateNodeEnter (node) {
    const self = this;
    const decoratedNode = node
      .enter()
      .append('g')
      .attr('id', item => item.data.key)
      .attr('class', 'node')
      .attr('transform', item => {
        return 'translate(' + item.y + ',' + item.x + ')';
      });

    decoratedNode
      .select(function (item) {
        const nodeGroup = d3.select(this);
        const {
          dimensions: {
            titleHeight,
            rectWidth,
            rectHeight,
          },
          data: {
            props: { errors }
          },
        } = item;

        // append rectangle
        nodeGroup
          .append('rect')
          .attr('class', 'node')
          .attr('rx', 8)
          .attr('x', 0)
          .attr('y', 0)
          .attr('height', rectHeight)
          .attr('width', rectWidth)
          .on('click', () => {
            d3.event.preventDefault();
            self.diagramContext.getHandleItemClick()(item.data);
          });

        // append header
        nodeGroup
          .append('svg:path')
          .attr('class', 'header')
          .attr('d', utils.topRoundedRect(0, titleHeight - 5, rectWidth, titleHeight - 5, 8))
          .on('click', () => {
            d3.event.preventDefault();
            self.diagramContext.getHandleItemClick()(item.data);
          });

        // append header text
        nodeGroup
          .append('text')
          .attr('class', 'title')
          .attr('y', 30)
          .attr('x', 10)
          .on('click', () => {
            d3.event.preventDefault();
            self.diagramContext.getHandleItemClick()(item.data);
          });

        // append initial error circle
        nodeGroup
          .append('circle')
          .attr('class', 'error')
          .attr('cx', rectWidth - 10)
          .attr('cy', 10)
          .attr('r', 0)
          .on('click', () => {
            d3.event.preventDefault();
            self.diagramContext.getHandleErrorClick()(errors);
          });

        // append the icon to the error circle
        nodeGroup
          .append('use')
          .attr('href', '#icon-notification')
          .attr('class', 'error')
          .attr('x', rectWidth - 10)
          .attr('y', 10)
          .attr('width', 0)
          .attr('height', 0)
          .on('click', () => {
            d3.event.preventDefault();
            self.diagramContext.getHandleErrorClick()(errors);
          });

      });
    return decoratedNode;
  }

  decorateNodeUpdate (node, nodeEnter) {
    const self = this;
    const decoratedNode = nodeEnter
      .merge(node)
      .transition()
      .duration(duration)
      .attr('transform', item => {
        return 'translate(' + item.y + ',' + item.x + ')';
      });

    // clear all rectangles for drop zones
    decoratedNode
      .selectAll('rect.dropzone-node')
      .remove();

    decoratedNode.select(function (item) {
      const nodeGroup = d3.select(this);
      const {
        data: { type },
        dimensions: {
          rectWidth,
          rectHeight,
        }
      } = item;
      nodeGroup
        .append('title')
        .text(item => {
          return item.data.props.functionName || item.data.props.componentName || item.data.props.pagePath;
        });
      if (type === constants.FLOW_PAGE_IN_BASKET_TYPE
        || type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
        || type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE) {
        nodeGroup
          .classed('inbasket', true)
          .call(self.drag);
      } else {

        nodeGroup.on('dblclick', self.diagramContext.getHandleItemDblClick());

        // remove drag behaviour
        nodeGroup
          .classed('inbasket', false)
          .on('.drag', null);
        if (self.diagramContext.getDraggedItem()) {
          // append rectangle
          nodeGroup
            .append('rect')
            .attr('class', 'dropzone-node')
            .attr('rx', 8)
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', rectHeight)
            .attr('width', rectWidth)
            .on('dragover', function() { self.diagramContext.onDragOver(); })
            .on('drop', function(item) { self.diagramContext.onDrop(this, item); })
            .on('dragenter', function(item) { self.diagramContext.onDragEnter(this, item); })
            .on('dragleave', function(item) { self.diagramContext.onDragLeave(this, item); });
        }
      }
    });

    // update rectangle
    decoratedNode
      .select('rect.node')
      .each(function (item) {
        const { data: { type, props: { isSelected } } } = item;
        const selectThis = d3.select(this);
        selectThis
          .classed(
            'function',
            type === constants.FLOW_USER_FUNCTION_TYPE || type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
          )
          .classed(
            'component',
            type === constants.FLOW_COMPONENT_INSTANCE_TYPE || type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
          )
          .classed(
            'application',
            type === constants.FLOW_APPLICATION_STARTER_TYPE
          )
          .classed(
            'page',
            type === constants.FLOW_PAGE_TYPE || type === constants.FLOW_PAGE_IN_BASKET_TYPE
          )
          .classed(
            'inbasket',
            type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE ||
            type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE ||
            type === constants.FLOW_PAGE_IN_BASKET_TYPE
          )
          .classed('selected', isSelected);
      })
      .duration(0)
      .attr('height', function (item) {
        return item.dimensions.rectHeight;
      });

    // update header
    decoratedNode
      .select('path.header')
      .each(function (item) {
        const { data: { type, props: { isSelected } } } = item;
        d3.select(this)
          .classed(
            'function',
            type === constants.FLOW_USER_FUNCTION_TYPE || type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
          )
          .classed(
            'component',
            type === constants.FLOW_COMPONENT_INSTANCE_TYPE || type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
          )
          .classed(
            'application',
            type === constants.FLOW_APPLICATION_STARTER_TYPE
          )
          .classed(
            'page',
            type === constants.FLOW_PAGE_TYPE || type === constants.FLOW_PAGE_IN_BASKET_TYPE
          )
          .classed('selected', isSelected);
      });

    // update header text
    decoratedNode
      .select('text.title')
      .text(function (item) {
        return item.data.props.title;
      });

    // update error circle
    decoratedNode
      .select('circle.error')
      .transition()
      .duration(duration)
      .attr('r', function (item) {
        if (item.data.props.errors && !isEmpty(item.data.props.errors)) {
          return 20;
        }
        return 0;
      });

    // update error circle icon
    decoratedNode
      .select('use.error')
      .attr('x', function (item) {
        if (item.data.props.errors && !isEmpty(item.data.props.errors)) {
          return item.dimensions.rectWidth - 30;
        }
        return item.dimensions.rectWidth - 10;
      })
      .attr('y', function (item) {
        if (item.data.props.errors && !isEmpty(item.data.props.errors)) {
          return -10;
        }
        return 10;
      })
      .attr('width', function (item) {
        if (item.data.props.errors && !isEmpty(item.data.props.errors)) {
          return 40;
        }
        return 0;
      })
      .attr('height', function (item) {
        if (item.data.props.errors && !isEmpty(item.data.props.errors)) {
          return 40;
        }
        return 0;
      });

    decoratedNode
      .select(function (item) {
        const { inputProperties, outputProperties } = item;
        const nodeGroup = d3.select(this);
        const property = nodeGroup
          .selectAll('g.property')
          .data([].concat(inputProperties, outputProperties), function (i) { return i.id; });

        const propertyEnter = self.decoratePropertyEnter(property);
        self.decoratePropertyUpdate(property, propertyEnter);
        self.decoratePropertyExit(property);

        nodeGroup.raise();
      });

  }

  decorateNodeExit (node) {
    node
      .exit()
      .remove();
  }

// ---------------------------------------------------------------------------------------------------------------------
// Property decorators

  decoratePropertyEnter (node) {
    const self = this;
    const decoratedNode = node
      .enter()
      .append('g')
      .attr('id', item => item.id)
      .attr('class', 'property')
      .attr('transform', item => {
        return 'translate(' + item.x + ',' + item.y + ')';
      });

    decoratedNode
      .select(function (item) {
        const nodeGroup = d3.select(this);

        if (item.isOut) {
          // Out properties
          nodeGroup
            .append('circle')
            .attr('class', 'property out')
            .attr('cx', item => item.pointX)
            .attr('cy', item => item.pointY)
            .attr('r', 8)
            .on('click', function () {
              if (item.error && item.error.length > 0) {
                d3.event.preventDefault();
                self.diagramContext.getHandleErrorClick()(item.error);
              }
            });

          nodeGroup
            .append('text')
            .attr('class', 'property out')
            .attr('x', item => item.textX)
            .attr('y', item => item.textY)
            .attr('text-anchor', 'end')
            .text(item => item.name)
            .on('click', function () {
              if (item.error && item.error.length > 0) {
                d3.event.preventDefault();
                self.diagramContext.getHandleErrorClick()(item.error);
              }
            });

          if (!item.isInBasket) {
            nodeGroup
              .classed('out', true)
              .on('mouseenter', function () {
                if (!self.dragContext.mouseDownProperty) {
                  nodeGroup.select('circle')
                    .classed('acceptable', true)
                    .transition()
                    .duration(100)
                    .attr('r', 12);
                  nodeGroup.select('text')
                    .classed('acceptable', true);
                }
              })
              .on('mouseleave', function () {
                nodeGroup.select('circle')
                  .classed('acceptable', false)
                  .transition()
                  .duration(100)
                  .attr('r', 8);
                nodeGroup.select('text')
                  .classed('acceptable', false);
              });
          }

        } else if (!item.isOut) {
          // In properties
          nodeGroup
            .append('circle')
            .attr('class', 'property')
            .attr('cx', item => item.pointX)
            .attr('cy', item => item.pointY)
            .attr('r', 8)
            .on('click', function () {
              if (item.error && item.error.length > 0) {
                d3.event.preventDefault();
                self.diagramContext.getHandleErrorClick()(item.error);
              }
            });

          nodeGroup
            .append('text')
            .attr('class', 'property')
            .attr('x', item => item.textX)
            .attr('y', item => item.textY)
            .attr('text-anchor', 'start')
            .text(item => item.name)
            .on('click', function () {
              if (item.error && item.error.length > 0) {
                d3.event.preventDefault();
                self.diagramContext.getHandleErrorClick()(item.error);
              }
            });

          // In property should be acceptable when the drag line is
          nodeGroup
            .on('mouseenter', function (item) {
              if (self.dragContext.mouseDownProperty) {
                self.dragContext.mouseUpProperty = item;
                nodeGroup.select('circle')
                  .classed('acceptable', true)
                  .transition()
                  .duration(100)
                  .attr('r', 12);
                nodeGroup.select('text')
                  .classed('acceptable', true);
              }
            })
            .on('mouseleave', function () {
              self.dragContext.mouseUpProperty = undefined;
              nodeGroup.select('circle')
                .classed('acceptable', false)
                .transition()
                .duration(100)
                .attr('r', 8);
              nodeGroup.select('text')
                .classed('acceptable', false);
            });
        }
      });

    return decoratedNode;
  }

  decoratePropertyUpdate (node, nodeEnter) {
    const self = this;
    const decoratedNode = nodeEnter
      .merge(node)
      .transition()
      .duration(duration)
      .attr('transform', item => {
        return 'translate(' + item.x + ',' + item.y + ')';
      });

    decoratedNode
      .select('text.property')
      .each(function (item) {
        const { error } = item;
        d3.select(this)
          .classed('caughtException', item.name === 'caughtException')
          .classed('error', error && error.length > 0);
      });

    decoratedNode
      .select('circle.property')
      .each(function (item) {
        const { error, isInBasket, isOut, isSelected } = item;
        const circle = d3.select(this);
        circle
          .classed('selected', isSelected)
          .classed('caughtException', item.name === 'caughtException')
          .classed('error', error && error.length > 0);

        if (!isInBasket && isOut) {
          circle.call(self.dragContext.dragProperty);
        }

      });

  }

  decoratePropertyExit (node) {
    node
      .exit()
      .remove();
  }

// ---------------------------------------------------------------------------------------------------------------------
// Link decorators

  decorateLinkEnter (node) {
    return node
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .classed('hidden', function (item) {
        return item.isHidden;
      })
      .attr('d', function (item) {
        const { startX, startY } = item;
        return utils.diagonal({ x: startX, y: startY }, { x: startX, y: startY });
      });
  }

  decorateLinkUpdate (node, nodeEnter, scale) {
    return nodeEnter
      .merge(node)
      .attr('d', function (item) {
        const { startX, startY, endX, endY } = item;
        return utils.diagonal({ x: startX, y: startY }, { x: endX, y: endY });
      })
      .each(function(item) {
        const { isSelected, hasTransformScript } = item;
        const link = d3.select(this);
        link.classed('selected', isSelected);
        link.classed('transforming', hasTransformScript);
        // if (isSelected) {
        //   link.raise();
        // }
      });
  }

  decorateLinkExit (node) {
    return node
      .exit()
      .remove();
  }

}

export default DiagramDecorator;
