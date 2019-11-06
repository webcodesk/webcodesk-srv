import constants from '../../../commons/constants';
import ResourceAdapter from '../ResourceAdapter';

it('noop', () => {});

// it('test ResourceAdapter 1', () => {
//   const resourceObject = {
//     [constants.RESOURCE_IN_USER_FUNCTIONS_TYPE]: {
//       name: 'Test'
//     }
//   };
//   const resourceAdapter = new ResourceAdapter.Builder(resourceObject).build();
//   expect(resourceAdapter.isInUserFunctions).toBe(true);
//
// });

// it('test ResourceAdapter 2', () => {
//   const resourceObject = { type: constants.GRAPH_MODEL_USER_FUNCTION_TYPE, props: {
//     resourceType: constants.RESOURCE_IN_USER_FUNCTIONS_TYPE
//   }};
//   const resourceAdapter = new ResourceAdapter(resourceObject);
//   expect(resourceAdapter.isInUserFunctions()).toBe(true);
// });
