import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import AccountSwitchKey from './api/AccountSwitchKey.mjs'
import Property from './api/SearchProperty.mjs';
import getPropertyRuleTree from './api/GetRuleTree.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 9000;

const app = express();
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.get('/api/id-management/account-switch-key/:accountName', AccountSwitchKey);
app.post('/api/papi/search-properties', Property);
app.post('/api/papi/get-property-rule-tree', getPropertyRuleTree);

app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', `server ready: listen port ${PORT}`);
});
