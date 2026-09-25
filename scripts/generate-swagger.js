import { writeFileSync } from 'node:fs';
import swaggerDocument from '../swagger.js';

writeFileSync('swagger.json', JSON.stringify(swaggerDocument, null, 2));
console.log('Swagger documentation generated.');
