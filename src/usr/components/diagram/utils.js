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

import constants from '../../../commons/constants';

// Creates a curved (diagonal) path from parent to the child nodes
export function diagonal(s, d) {
  return `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
}

export function topRoundedRect(x, y, width, height, radius) {
  return "M" + x + "," + y
    + "v" + (radius - height)
    + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
    + "h" + (width - (2 * radius))
    + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
    + "v" + (height - radius)
    + "z";
}

export function getSeparation(bottomItem, topItem) {
  const { data: { type: topType, props: topProps, } } = topItem;
  const { data: { type: bottomType, props: bottomProps } } = bottomItem;
  if (topType === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
    || topType === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
    || bottomType === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
    || bottomType === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE) {
    return 0;
  }
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

const defaultLineHeight = 30;
const defaultTitleHeight = 50;
const defaultRectWidth = 370;

export function adjustDimensions(item) {
  const {data: {type, props}} = item;
  if (type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
    || type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE) {
    if (props) {
      const { position } = props;
      item.x = position.x;
      item.y = position.y;
    } else {
      item.x = 0;
      item.y = 0;
    }
  } else {
    // Normalize for fixed-depth.
    item.y = item.depth * 600;
  }
  item.dimensions = {};
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
}

export function createPropertiesAndLinks(item) {
  const links = [];
  const {
    x,
    y,
    dimensions: {
      lineHeight,
      titleHeight,
      rectWidth
    },
    data: {
      key,
      type,
      props
    },
    parent
  } = item;
  const isInBasket = type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE ||
    type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE;
  if (props) {
    const { inputs, outputs } = props;

    item.inputProperties = [];
    item.outputProperties = [];

    let parentOutputs;
    let parentInputs;
    let parentDimensions;
    if (parent) {
      const {props: parentProps} = parent.data;
      parentOutputs = parentProps.outputs || [];
      parentInputs = parentProps.inputs || [];
      parentDimensions = parent.dimensions;
    }
    const inputsLength = inputs ? inputs.length : 0;
    const outputLength = outputs ? outputs.length : 0;
    if (inputsLength > 0) {
      inputs.forEach((input, index) => {
        item.inputProperties.push({
          key,
          id: `${key}_in_${input.name}_${index}`,
          globalY: x + (index * lineHeight + titleHeight),
          globalX: y,
          y: (index * lineHeight + titleHeight),
          x: 0,
          name: input.name,
          pointX: 0,
          pointY: 15,
          textX: 10,
          textY: 20,
          textWidth: rectWidth - 20,
          isOut: false,
          isInBasket,
          error: input.error,
          isSelected: input.isSelected,
        });
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
              isSelected: input.isSelected,
            });
          }
        }
      });
    }
    if (outputLength > 0) {
      outputs.forEach((output, index) => {
        item.outputProperties.push({
          key,
          id: `${key}_out_${output.name}_${index}`,
          globalY: x + ((inputsLength + index) * lineHeight + titleHeight),
          globalX: y,
          y: ((inputsLength + index) * lineHeight + titleHeight),
          // x has to be assigned to y because d3 tree's x and y is exchanged
          x: 0,
          name: output.name,
          possibleConnectionTargets: output.possibleConnectionTargets,
          pointX: rectWidth,
          pointY: 15,
          textX: rectWidth - 10,
          textY: 20,
          textWidth: rectWidth - 20,
          isOut: true,
          isInBasket,
          error: output.error,
          isSelected: output.isSelected,
        });
      });
    }
  }
  return links;
}
