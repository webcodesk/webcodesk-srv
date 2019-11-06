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
