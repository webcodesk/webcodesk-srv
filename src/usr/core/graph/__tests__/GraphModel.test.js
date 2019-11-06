import GraphModel from '../GraphModel';

import model from './model.json';
import modelWithKeys from './modelWithKeys.json';
import modelWithReplacedNode from './modelWithReplacedNode.json';
import modelWithAppendedNode from './modelWithAppendedNode.json';
import modelWithDeletedNode from './modelWithDeletedNode.json';

// it('new GraphModel instance', () => {
//   expect(new GraphModel()).not.toBeNull();
// });

// it('init graph model success', () => {
//   const graphModel = new GraphModel();
//   graphModel.initModel(model);
//   const testModel = graphModel.getSerializedModel();
//   expect(testModel).toEqual(model);
// });

// it('init graph model failure', () => {
//   const graphModel = new GraphModel();
//   expect(graphModel.initModel).toThrow();
// });
//
// it('replace model node success', () => {
//   const graphModel = new GraphModel();
//   graphModel.initModel(modelWithKeys);
//   graphModel.replaceNode('node9', {type: 'TestComponent', props: {
//       name: "My Name is TestComponent"
//     }});
//   graphModel.replaceNode('node5', {type: 'NewComponent', props: {
//       name: "My Name is NewComponent"
//     }});
//   const replacedModel = graphModel.getSerializedModel();
//   expect(replacedModel).toEqual(modelWithReplacedNode);
// });
//
// it('append model node success', () => {
//   const graphModel = new GraphModel();
//   graphModel.initModel(modelWithKeys);
//   graphModel.appendNode('node3', {
//     type: "span",
//     text: "With Text",
//     props: {},
//   });
//   graphModel.appendNode('node4', {
//     type: "div",
//     props: {
//       onClick: "test"
//     }
//   });
//   const replacedModel = graphModel.getSerializedModel();
//   expect(replacedModel).toEqual(modelWithAppendedNode);
// });
//
// it('delete model node success', () => {
//   const graphModel = new GraphModel();
//   graphModel.initModel(modelWithKeys);
//   graphModel.deleteNode('node5');
//   graphModel.deleteNode('node3');
//   const replacedModel = graphModel.getSerializedModel();
//   expect(replacedModel).toEqual(modelWithDeletedNode);
// });

it('noop', () => {});