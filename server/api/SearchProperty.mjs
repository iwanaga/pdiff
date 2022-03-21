import { searchProperties } from './lib/PropertyManager.mjs';

export default async function Property(req, res) {
  console.log('\x1b[32m%s\x1b[0m', req.originalUrl);
  const response = await searchProperties(req.body.hostname, req.query.switchKey);
  console.log(JSON.stringify(response, null ,2));
  res.send(response);
}
