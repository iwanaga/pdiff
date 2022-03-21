import { listAccountSwitchKeys } from './lib/IdentityManagement.mjs';

export default async function AccountSwithKeys(req, res) {
  console.log('\x1b[32m%s\x1b[0m', req.originalUrl);
  const response = await listAccountSwitchKeys(req.params.accountName);
  console.log(JSON.stringify(response, null ,2));
  res.send(response);
}
