import { getIndexFileText } from '../fileTemplates';

it('noop', () => {});

// it('test getIndexFileText', () => {
//   const importFiles = [
//     {
//       membersListString: 'function1, function2',
//       importPath: 'usr/api/myFunctions/exposed',
//     },
//     {
//       membersListString: 'api',
//       importPath: './api',
//     }
//   ];
//   const templateData = {
//     importFiles,
//   };
//   const fileText = getIndexFileText(templateData);
//   console.info(fileText);
// });