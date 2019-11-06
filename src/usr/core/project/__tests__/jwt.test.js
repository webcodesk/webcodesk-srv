import jwt from 'jsonwebtoken';
import {infok} from '../../utils/electronUtils';
import {testText} from "../../utils/textUtils";

it('noop', () => {});

// it('test jwt', () => {
//
//   const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTsxNTQ5MTA3MjYzODg3OzE1NTAzMTY4NjM4ODc7Sm9objtEb3VnaDtfbmV3X3Rlc3RAZW1haWwuY29tOzE1NDkxMDcyNjM5NDkiLCJleHAiOjE1NDk3MTIwNjN9.8gbcOI9OBBRcXprqZlejHfpQQnhvrrxgT9BMJfDpqaGxZRNNfXxolELCYC-qmEn0zwFl5p4JIW5zrctm4wfIsA';
//
//   try {
//     const decoded = jwt.verify(token, `${infok}${testText}`, {
//       algorithms: ['HS512'],
//       ignoreExpiration: true,
//     });
//     console.info('Decoded token: ', JSON.stringify(decoded, null, 4));
//   } catch (err) {
//     console.error('Decoded: ', err);
//   }
//
//   console.info('----------');
//   console.info('----------');
//   console.info('----------');
//   console.info('----------');
//
// });

