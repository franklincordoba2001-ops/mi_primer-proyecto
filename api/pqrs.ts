import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pqrs.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(fileContents);
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Error al leer el archivo data/pqrs.json' }));
  }
}
