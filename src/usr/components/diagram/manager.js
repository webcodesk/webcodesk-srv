/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as d3 from 'd3';
import { getSeparation, adjustDimensions, createPropertiesAndLinks } from './utils';

export function createRoots(rootSelection, flare, basket) {

  const treemap = d3.tree()
    .nodeSize([60, 400])
    .separation(getSeparation);

  const root = d3.hierarchy(flare, item => item.children);
  const treeData = treemap(root);
  // Compute the new tree layout.
  // Assigns the x and y position for the nodes
  let nodes = treeData.descendants();

  nodes.forEach((item, index) => {
    adjustDimensions(item);
  });

  let links = [];
  nodes.forEach((item, index) => {
    const _links = createPropertiesAndLinks(item);
    links = links.concat(_links);
  });

  // Update the nodes...
  const rootNode = rootSelection
    .selectAll('g.node')
    .data(nodes, function(item) { return item.data.key; });
  // Update the links...
  const rootLink = rootSelection
    .selectAll('path.link')
    .data(links, function(item) { return item.id; });

  return {
    root,
    rootNode,
    rootLink,
  }

}
