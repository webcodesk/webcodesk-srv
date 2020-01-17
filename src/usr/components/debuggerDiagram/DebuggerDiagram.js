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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './DebuggerDiagram.css';

import {
  createRoots,
  decorateNodeEnter,
  decorateNodeUpdate,
  decorateNodeExit,
  decoratePropertyEnter,
  decoratePropertyUpdate,
  decoratePropertyExit,
  decorateLinkEnter,
  decorateLinkUpdate,
  decorateLinkExit,
} from './decorators';

class DebuggerDiagram extends Component {
  static propTypes = {
    treeData: PropTypes.object,
    onItemClick: PropTypes.func,
    onItemPropertyClick: PropTypes.func,
    focusedKey: PropTypes.string,
  };

  static defaultProps = {
    treeData: {},
    focusedKey: '',
    onItemClick: () => {
      console.info('MyTree.onItemClick is not set.');
    },
    onItemPropertyClick: () => {
      console.info('MyTree.onItemPropertyClick is not set.');
    },
  };

  componentDidMount() {

    // Init zoom callback function
    this.zoom = d3.zoom()
      .scaleExtent([.1, 0.8])
      .on("zoom", this.zoomed)
      .on('end', this.zoomEnd);

    // Init svg object
    this.svg = d3.select(this.containerSVG)
      .on('click', this.stopped, true);

    // Init container that holds all inner components, it will be transformed on zoom event
    this.container = d3.select(this.rootGroup);

    this.svg.call(this.zoom).on('dblclick.zoom', this.stopped, true);

    // this.zoom.scaleTo(this.svg, 0.3);

    const { treeData } = this.props;
    this.updateTree(this.container, treeData, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { treeData } = this.props;
    return treeData !== nextProps.treeData;
  }

  componentDidUpdate(prevProps, prevState) {
    const { treeData, focusedKey } = this.props;
    if (treeData !== prevProps.treeData) {
      this.updateTree(this.container, treeData, false, focusedKey);
    }
  }

  updateTree = (rootSelection, flare, focusRoot = false, key = undefined) => {

    const { root, rootNode, rootLink, rootProperty, nodes } = createRoots(rootSelection, flare);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = decorateNodeEnter(rootNode, {
      onDblClick: this.focusItem,
      onClick: this.handleItemClick,
    });
    decorateNodeUpdate(rootNode, nodeEnter);
    decorateNodeExit(rootNode);

    const propertyEnter = decoratePropertyEnter(rootProperty, {
      onPropertyClick: this.handlePropertyClick,
    });
    decoratePropertyUpdate(rootProperty, propertyEnter);
    decoratePropertyExit(rootProperty);

    // Enter any new links at the parent's previous position.
    const linkEnter = decorateLinkEnter(rootLink);
    decorateLinkUpdate(rootLink, linkEnter);
    decorateLinkExit(rootLink);

    if (focusRoot) {
      this.setInitialPosition(root);
    }

    if (key) {
      const foundNode = nodes.find(i => i.data.key === key);
      if (foundNode) {
        this.focusItem(foundNode);
      }
    }

  };

  handleItemClick = (node) => {
    if (node) {
      this.props.onItemClick(node.key);
    }
  };

  focusItem = (node) => {
    if (node) {
      const {k} = d3.zoomTransform(this.svg.node());
      // let scaleK = k * scaleKoef <= 2 ? scaleKoef : 1;
      let scaleK = k;
      // let newK = k * scaleK;
      let newK = 0.5;
      const {data, x: itemX, y: itemY} = node;
      const selectorNode = this.container.select(`#${data.key}`).node();
      if (selectorNode) {
        const svgBounds = this.svg.node().getBoundingClientRect();

        const itemBoundingClientRect = selectorNode.getBoundingClientRect();
        // Calculate the dimensions when it is scaled already
        const x = (itemY * newK) + ((itemBoundingClientRect.width * scaleK) / 2);
        const y = (itemX * newK) + ((itemBoundingClientRect.height * scaleK) / 2);

        // SVG center x coordinate
        const svgx = svgBounds.width / 2;
        // SVG center y coordinate
        const svgy = svgBounds.height / 2;

        // Because we are using the root component as the starting point in SVG with coordinates 0, 0
        const gLeft = svgx - x;
        const gTop = svgy - y;

        try {
          const transform = d3.zoomIdentity
            .translate(gLeft, gTop)
            .scale(newK);

          this.svg
            .transition()
            .duration(500)
            .call(this.zoom.transform, transform);
        } catch (e) {
          // do nothing
        }

      } else {
        console.error('Selector node is not found ');
      }
    }
  };

  setInitialPosition = (node) => {
    if (node) {
      const {k} = d3.zoomTransform(this.svg.node());
      // let scaleK = k * scaleKoef <= 2 ? scaleKoef : 1;
      let scaleK = k;
      // let newK = k * scaleK;
      let newK = 0.5;
      const {data, x: itemX, y: itemY} = node;
      const selectorNode = this.container.select(`#${data.key}`).node();
      if (selectorNode) {
        const svgBounds = this.svg.node().getBoundingClientRect();

        const itemBoundingClientRect = selectorNode.getBoundingClientRect();
        // Calculate the dimensions when it is scaled already
        const x = (itemY * newK) + ((itemBoundingClientRect.width * scaleK) / 2);
        // const x = 10;
        const y = (itemX * newK) + ((itemBoundingClientRect.height * scaleK) / 2);
        // const y = 100;

        // SVG center y coordinate
        const svgy = svgBounds.height / 2;

        // Because we are using the root component as the starting point in SVG with coordinates 0, 0
        const gLeft = x;
        const gTop = svgy - y;

        try {
          const transform = d3.zoomIdentity
            .translate(gLeft, gTop)
            .scale(newK);

          this.svg
            .transition()
            .duration(500)
            .call(this.zoom.transform, transform);
        } catch (e) {
          // do nothing
        }

      } else {
        console.error('Selector node is not found ');
      }
    }
  };

  zoomed = () => {
    // const { k } = d3.event.transform;
    // const { scaleK } = this.state;
    // const newZoomK = Math.floor(k / 0.5);
    // if (scaleK !== newZoomK) {
    //   this.setState({scaleK: newZoomK});
    // }
    this.container.attr("transform", d3.event.transform);
  };

  zoomEnd = () => {
    // console.info('Zooming is finished');
  };

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  stopped = () => {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  };

  handlePropertyClick = ({key, outputName, inputName}) => {
    this.props.onItemPropertyClick({key, outputName, inputName});
  };

  render() {
    return (
      <svg ref={me => this.containerSVG = me} width="100%" height="100%">
        <g ref={me => this.rootGroup = me}>
        </g>
      </svg>
    );
  }
}

export default DebuggerDiagram;