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

import * as d3 from 'd3';
import constants from '../../../commons/constants';

const duration = 300;

const defaultLineHeight = 30;
const defaultTitleHeight = 50;
const defaultRectWidth = 250;

function topRoundedRect(x, y, width, height, radius) {
  return "M" + x + "," + y
    + "v" + (radius - height)
    + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
    + "h" + (width - (2 * radius))
    + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
    + "v" + (height - radius)
    + "z";
}

const adjustDimensions = (item) => {
  // Normalize for fixed-depth.
  item.y = item.depth * 480;
  item.dimensions = {};
  const {data: {props}} = item;
  if (props) {
    const { inputs, outputs } = props;
    const inputsLength = inputs ? inputs.length : 0;
    const outputLength = outputs ? outputs.length : 0;
    item.dimensions.rectWidth = defaultRectWidth;
    item.dimensions.rectHeight = (
      defaultLineHeight * (inputsLength + outputLength)
    );
    item.dimensions.rectHeight += defaultTitleHeight;
    item.dimensions.titleHeight = defaultTitleHeight;
    item.dimensions.lineHeight = defaultLineHeight;
  }
};

const createPropsAndLinks = (item) => {
  let properties = [];
  const links = [];
  const {
    x,
    y,
    dimensions: { lineHeight, titleHeight, rectWidth },
    data: {key, props}, parent
  } = item;
  if (props) {
    const { inputs, outputs, recordIds } = props;
    const ownDataCount = recordIds ? recordIds.length : 0;
    let parentOutputs;
    let parentInputs;
    let parentDimensions;
    if (parent) {
      const {props: parentProps} = parent.data;
      parentOutputs = parentProps.outputs || [];
      parentInputs = parentProps.inputs || [];
      parentDimensions = parent.dimensions;
    }
    let inputDataCount = 0;
    let outputDataCount = 0;
    const inputsLength = inputs ? inputs.length : 0;
    const outputLength = outputs ? outputs.length : 0;
    if (inputsLength > 0) {
      let hasInputData;
      inputs.forEach((input, index) => {
        hasInputData = input.recordIds && input.recordIds.length > 0;
        properties.push({
          key,
          id: `${key}_in_${input.name}_${index}`,
          y: x + (index * lineHeight + titleHeight),
          x: y,
          name: input.name,
          pointX: 0,
          pointY: 15,
          textX: 10,
          textY: 20,
          textWidth: rectWidth - 20,
          isOut: false,
          isSelected: input.isSelected,
          hasData: hasInputData
        });
        if (hasInputData) {
          inputDataCount++;
        }
        if (input.connectedTo && parentOutputs && parentOutputs.length > 0) {
          const foundOutputIndex = parentOutputs.findIndex(i => i.name === input.connectedTo);
          if (foundOutputIndex >= 0) {
            const foundOutput = parentOutputs[foundOutputIndex];
            links.push({
              key,
              id: `${key}_${foundOutput.name}_${input.name}`,
              startX: parent.x + (
                (parentInputs.length + foundOutputIndex)
                * parentDimensions.lineHeight + parentDimensions.titleHeight + 15
              ),
              startY: parent.y + parentDimensions.rectWidth,
              endX: x + (index * lineHeight + titleHeight + 15),
              endY: y,
              hasData: hasInputData && foundOutput.recordIds && foundOutput.recordIds.length > 0,
            });
          }
        }
      });
    }
    if (outputLength > 0) {
      let hasOutputData;
      outputs.forEach((output, index) => {
        hasOutputData = output.recordIds && output.recordIds.length > 0;
        properties.push({
          key,
          id: `${key}_out_${output.name}_${index}`,
          y: x + ((inputsLength + index) * lineHeight + titleHeight),
          // x has to be assigned to y because d3 tree's x and y is exchanged
          x: y,
          name: output.name,
          pointX: rectWidth,
          pointY: 15,
          textX: rectWidth - 10,
          textY: 20,
          textWidth: rectWidth - 20,
          isOut: true,
          dragStartX: rectWidth,
          dragStartY: 15,
          isSelected: output.isSelected,
          hasData: hasOutputData
        });
        if (hasOutputData) {
          outputDataCount++;
        }
      });
    }
    item.data.hasData = (ownDataCount + inputDataCount + outputDataCount) > 0;
  }
  return { properties, links };
};

// const getNodeLength = (item) => {
//   const { data: { props } } = item;
//   if (props) {
//     const inputsLength = props.inputs ? props.inputs.length : 0;
//     const outputLength = props.outputs ? props.outputs.length : 0;
//     return outputLength + inputsLength;
//   }
//   return 1;
// };

// this function is invoked before adjustment in adjustDimensions
function getSeparation(bottomItem, topItem) {
  const { data: { props: topProps, } } = topItem;
  const { data: { props: bottomProps } } = bottomItem;
  if (topProps) {
    const topInputsLength = topProps.inputs ? topProps.inputs.length : 0;
    const topOutputLength = topProps.outputs ? topProps.outputs.length : 0;
    const bottomInputsLength = bottomProps.inputs ? bottomProps.inputs.length : 0;
    const bottomOutputsLength = bottomProps.outputs ? bottomProps.outputs.length : 0;
    const topLength = topInputsLength
      + topOutputLength
      + 2;
    const bottomLength = bottomInputsLength
      + bottomOutputsLength
      + 2;
    let value = (topLength * 0.5) + 1.3;
    if (bottomItem.parent !== topItem.parent) {
      value = (bottomLength * 0.5) + 1.3;
    }
    return value;
  }
  return (bottomItem.parent === topItem.parent ? 1 : 2);
}

// const countTreeHeight = children => {
//   let resultCount = 0;
//   if (children && children.length > 0) {
//     children.forEach(item => {
//       if (item.children && item.children.length > 0) {
//         resultCount += countTreeHeight(item.children);
//       } else {
//         resultCount++;
//       }
//     });
//   }
//   return resultCount;
// };

// Creates a curved (diagonal) path from parent to the child nodes
const diagonal = (s, d) => {
  return `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
};

export const createRoots = (rootSelection, flare) => {
  const treemap = d3.tree()
    .nodeSize([60, 400])
    .separation(getSeparation);
  const root = d3.hierarchy(flare, item => item.children);
  // Assigns the x and y position for the nodes
  const treeData = treemap(root);
  // Compute the new tree layout.
  const nodes = treeData.descendants();


  nodes.forEach((item, index) => {
    adjustDimensions(item);
  });

  let properties = [];
  let links = [];
  nodes.forEach((item, index) => {
    const propsAndLinks = createPropsAndLinks(item);
    properties = properties.concat(propsAndLinks.properties);
    links = links.concat(propsAndLinks.links);
  });

  // Update the nodes...
  const rootNode = rootSelection
    .selectAll('g.node_debug')
    .data(nodes, function(item) { return item.data.key; });
  // Update the links...
  const rootLink = rootSelection
    .selectAll('path.link_debug')
    .data(links, function(item) { return item.id; });
  // Update the properties...
  const rootProperty = rootSelection
    .selectAll('g.property_debug')
    .data(properties, function(item) { return item.id });

  return {
    root,
    rootNode,
    rootLink,
    rootProperty,
    nodes,
  }

};

// ---------------------------------------------------------------------------------------------------------------------
// Group decorators

export const decorateNodeEnter = (node, options) => {
  const decoratedNode = node
    .enter()
    .append('g')
    .attr('id', item => item.data.key)
    .attr('class', 'node_debug')
    .attr("transform", item => {
      return "translate(" + item.y + "," + item.x + ")";
    });
  if (options) {
    if (options.onDblClick) {
      decoratedNode.on('dblclick', options.onDblClick);
    }
  }

  decoratedNode
    .select(function(item) {
      const nodeGroup = d3.select(this);
      const {
        dimensions: {
          titleHeight,
          rectWidth,
          rectHeight,
        }
      } = item;

      nodeGroup
        .append('rect')
        .attr('class', 'node_debug')
        .attr('rx', 8)
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .on('click', function() {
          if (item.data.hasData && options.onClick) {
            d3.event.preventDefault();
            options.onClick(item.data);
          }
        });

      if (item.data.hasData) {
        nodeGroup
          .append('svg:path')
          .attr('class', 'header_debug')
          .attr('d', topRoundedRect(0, titleHeight - 5, rectWidth, titleHeight - 5, 8))
          .on('click', function() {
            if (item.data.hasData && options.onClick) {
              d3.event.preventDefault();
              options.onClick(item.data);
            }
          });
      }

      nodeGroup
        .append('text')
        .attr('class', 'title_debug')
        .attr('y', 30)
        .attr('x', 10)
        .on('click', function() {
          if (item.data.hasData && options.onClick) {
            d3.event.preventDefault();
            options.onClick(item.data);
          }
        });

      nodeGroup
        .append('line')
        .attr('class', 'node_debug')
        .attr('y1', titleHeight - 5)
        .attr('x1', 0)
        .attr('y2', titleHeight - 5)
        .attr('x2', rectWidth);

    });

  return decoratedNode
};

export const decorateNodeUpdate = (node, nodeEnter) => {
  const decoratedNode = nodeEnter
    .merge(node)
    .transition()
    .duration(duration)
    .attr("transform", item => {
      return "translate(" + item.y + "," + item.x + ")";
    });

  decoratedNode
    .select('rect.node_debug')
    .each(function(item) {
      const { data:{ type, hasData, props: {isSelected} } } = item;
      d3.select(this)
        .classed('function', type === constants.FLOW_USER_FUNCTION_TYPE && hasData)
        .classed('component', type === constants.FLOW_COMPONENT_INSTANCE_TYPE && hasData)
        .classed('application', type === constants.FLOW_APPLICATION_STARTER_TYPE && hasData)
        .classed('page', type === constants.FLOW_PAGE_TYPE && hasData)
        .classed('selected', isSelected)
        .classed('blank', !hasData);
    })
    .attr('height', function (item) {
      return item.dimensions.rectHeight;
    });

  decoratedNode
    .select('path.header_debug')
    .each(function(item) {
      const { data:{ type, props: {isSelected} } } = item;
      d3.select(this)
        .classed('function', type === constants.FLOW_USER_FUNCTION_TYPE)
        .classed('component', type === constants.FLOW_COMPONENT_INSTANCE_TYPE)
        .classed('application', type === constants.FLOW_APPLICATION_STARTER_TYPE)
        .classed('page', type === constants.FLOW_PAGE_TYPE)
        .classed('selected', isSelected);
    });

  decoratedNode
    .select('text.title_debug')
    .each(function (item) {
      const { data: { hasData } } = item;
      d3.select(this)
        .classed('blank', !hasData);
    })
    .text(function (item) {
      return item.data.props.title;
    });

};

export const decorateNodeExit = (node) => {
  node
    .exit()
    .remove();
};

// ---------------------------------------------------------------------------------------------------------------------
// Link properties

export const decoratePropertyEnter = (node, options) => {
  const decoratedNode = node
    .enter()
    .append('g')
    .attr('id', item => item.id)
    .attr('class', 'property_debug')
    .attr("transform", item => {
      return "translate(" + item.x + "," + item.y + ")";
    });

  decoratedNode
    .select(function(item) {
      const nodeGroup = d3.select(this);

      if (item.isOut) {
        // Out properties
        nodeGroup
          .append('circle')
          .attr('class', 'property_debug out')
          .attr('cx', item => item.pointX)
          .attr('cy', item => item.pointY)
          .attr('r', 0)
          .on('click', function (item) {
            if (item.hasData && options.onPropertyClick) {
              d3.event.preventDefault();
              options.onPropertyClick({ key: item.key, outputName: item.name });
            }
          });

        nodeGroup
          .append('text')
          .attr('class', 'property_debug out')
          .attr('x', item => item.textX)
          .attr('y', item => item.textY)
          .attr('text-anchor', 'end')
          .text(item => item.name)
          .on('click', function (item) {
            if (item.hasData && options.onPropertyClick) {
              d3.event.preventDefault();
              options.onPropertyClick({key: item.key, outputName: item.name});
            }
          });

        // Out property may

        nodeGroup
          .classed('out', true)
          .on('mouseenter', function(item) {
            if (item.hasData) {
              nodeGroup.select('circle')
                .classed('acceptable', true)
                .transition()
                .duration(100)
                .attr('r', 12);
              nodeGroup.select('text')
                .classed('acceptable', true);
            }
          })
          .on('mouseleave', function(item) {
            if (item.hasData) {
              nodeGroup.select('circle')
                .classed('acceptable', false)
                .transition()
                .duration(100)
                .attr('r', 8);
              nodeGroup.select('text')
                .classed('acceptable', false);
            }
          });


      } else if (!item.isOut) {
        // In properties
        nodeGroup
          .append('circle')
          .attr('class', 'property_debug')
          .attr('cx', item => item.pointX)
          .attr('cy', item => item.pointY)
          .attr('r', 0)
          .on('click', function (item) {
            if (item.hasData && options.onPropertyClick) {
              d3.event.preventDefault();
              options.onPropertyClick({key: item.key, inputName: item.name});
            }
          });

        nodeGroup
          .append('text')
          .attr('class', 'property_debug')
          .attr('x', item => item.textX)
          .attr('y', item => item.textY)
          .attr('text-anchor', 'start')
          .text(item => item.name)
          .on('click', function (item) {
            if (item.hasData && options.onPropertyClick) {
              d3.event.preventDefault();
              options.onPropertyClick({key: item.key, inputName: item.name});
            }
          });

        // In property should be acceptable when the drag line is

        nodeGroup
          .on('mouseenter', function(item) {
            if (item.hasData) {
              nodeGroup.select('circle')
                .classed('acceptable', true)
                .transition()
                .duration(100)
                .attr('r', 12);
              nodeGroup.select('text')
                .classed('acceptable', true);
            }
          })
          .on('mouseleave', function(item) {
            if (item.hasData) {
              nodeGroup.select('circle')
                .classed('acceptable', false)
                .transition()
                .duration(100)
                .attr('r', 8);
              nodeGroup.select('text')
                .classed('acceptable', false);
            }
          });
      }
    });

  return decoratedNode;
};

export const decoratePropertyUpdate = (node, nodeEnter) => {
  const decoratedNode = nodeEnter
    .merge(node)
    .transition()
    .duration(duration)
    .attr("transform", item => {
      return "translate(" + item.x + "," + item.y + ")";
    });

  decoratedNode
    .select('text.property_debug')
    .each(function(item) {
      d3.select(this)
        .classed('selected', item => item.isSelected)
        .classed('blank', item => !item.hasData)
        .classed('caughtException', item.name === 'caughtException' && item.hasData);
    });

  decoratedNode
    .select('circle.property_debug')
    .each(function(item) {
      d3.select(this)
        .classed('selected', item => item.isSelected)
        .classed('blank', item => !item.hasData)
        .classed('caughtException', item.name === 'caughtException' && item.hasData);
    })
    .transition()
    .duration(duration)
    .attr('r', 8);

};

export const decoratePropertyExit = (node) => {
  node
    .exit()
    .remove();
};


// ---------------------------------------------------------------------------------------------------------------------
// Link decorators

export const decorateLinkEnter = (node) => {
  return node
    .enter()
    .insert('path', "g")
    .attr("class", "link_debug")
    .classed('blank', item => !item.hasData)
    .attr('d', function(item){
      const {startX, startY} = item;
      return diagonal({x: startX, y: startY}, {x: startX, y: startY});
    });
};

export const decorateLinkUpdate = (node, nodeEnter, scale) => {
  return nodeEnter
    .merge(node)
    .transition()
    .duration(duration)
    .attr('d', function(item){
      const {startX, startY, endX, endY} = item;
      return diagonal({x: startX, y: startY}, {x: endX, y: endY});
    });
};

export const decorateLinkExit = (node) => {
  return node
    .exit()
    .remove();
};
