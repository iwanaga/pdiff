import EdgeGrid from 'edgegrid';
import os from 'os';

const edgeGrid = new EdgeGrid({
  path: `${os.homedir()}/.edgerc`,
  section: 'test_center'
});

export const searchProperties = async (propertyHostname, accountSwitchKey) => {
  edgeGrid.auth({
    path: `/papi/v1/search/find-by-value?accountSwitchKey=${accountSwitchKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PAPI-Use-Prefixes': true
    },
    body: {hostname: propertyHostname}
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

export const getPropertyRuleTree = async (propertyId, propertyVersion, contractId, groupId, accountSwitchKey) => {
  edgeGrid.auth({
    path: `/papi/v1/properties/${propertyId}/versions/${propertyVersion}/rules?contractId=${contractId}&groupId=${groupId}&accountSwitchKey=${accountSwitchKey}`,
    method: 'GET',
    headers: {
      'PAPI-Use-Prefixes': true
    }
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