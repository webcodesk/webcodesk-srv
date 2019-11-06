import {PropTypes, checkPropTypes} from '../index';

it('noop', () => {});

// it('test checkPropTypes', async () => {
//   const myPropTypes = {
//     name: PropTypes.string,
//     age: PropTypes.number,
//     value: PropTypes.exact({
//       money: PropTypes.number,
//       code: PropTypes.string.isRequired,
//     })
//   };
//
//   const props = {
//     name: 'hello', // is valid
//     age: 'world', // not valid,
//     value: { // not valid
//       money: '120.45', // not valid,
//       code: 'QW123'
//     }
//   };
//
//   let errors = [];
//   let propTypesErrors = checkPropTypes(myPropTypes, props, 'property', 'Input endpoint');
//   errors = errors.concat(propTypesErrors);
//
//   errors.forEach(errorItem => {
//     console.info(errorItem);
//   });
//
//   console.info('// -------- //');
//   console.info('// -------- //');
//   console.info('// -------- //');
//
// });