import * as restClient from '../restClient';

it('noop', () => {});

// it('get new-project.json file', async () => {
//   try {
//     const fileData = await restClient.getRaw('/repos/webcodesk/webcodesk/contents/new-projects.json');
//     console.info('File data: ', fileData);
//   } catch (error) {
//     if (error) {
//       const {response, message} = error;
//       if (response) {
//         const {status, data} = response;
//         if (status === 403 || status === 401) {
//           // not authenticated
//           console.info('Error r: ', status, message)
//         } else if (status === 400) {
//           // bad request in this case is the server response about wrong data in the request
//           console.info('Error r: ', status, message)
//         } else {
//           console.info('Error r: ', message);
//         }
//       } else {
//         // connection error
//         console.info('Error: ', error);
//       }
//     }
//   }
// });

// it('get README.md file', async () => {
//   try {
//     const fileData = await restClient.getRaw('/repos/webcodesk/webcodesk/contents/README.md');
//     console.info('File data: ', fileData.content);
//     console.info('File data: ', fileData);
//   } catch (error) {
//     if (error) {
//       const {response, message} = error;
//       if (response) {
//         const {status, data} = response;
//         if (status === 403 || status === 401) {
//           // not authenticated
//           console.info('Error r: ', status, message)
//         } else if (status === 400) {
//           // bad request in this case is the server response about wrong data in the request
//           console.info('Error r: ', status, message)
//         } else {
//           console.info('Error r: ', message);
//         }
//       } else {
//         // connection error
//         console.info('Error: ', error);
//       }
//     }
//   }
// });
