import EdgeGrid from 'akamai-edgegrid';
import os from 'os';

const edgeGrid = new EdgeGrid({
  path: `${os.homedir()}/.edgerc`,
  section: 'pdiff'
});

export const listAccountSwitchKeys = async (accountName) => {
  edgeGrid.auth({
    path: `/identity-management/v2/api-clients/self/account-switch-keys?search=${accountName}`,
    method: 'GET',
    header: {},
  });

  return new Promise((resolve, reject) => {
    edgeGrid.send((err, response, bodyString) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(JSON.parse(bodyString));
    });
  });
};
