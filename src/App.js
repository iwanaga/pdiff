import './App.css';
import { ImFilesEmpty } from 'react-icons/im';
import { GoGitPullRequest } from 'react-icons/go'
import { Autocomplete, Button, createFilterOptions, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { FiDownloadCloud } from 'react-icons/fi';
import ReactDiffViewer from 'react-diff-viewer';
import { useEffect, useState } from 'react';

function App() {

  // Autocomplete Account Switch Key
  const [accountName, setAccountName] = useState('');
  const [options, setOptions] = useState([]);
  const [accountSwitchKey, setAccountSwitchKey] = useState('');

  useEffect(() => {
    async function fetchAccountSwitchKeys (){
      let response = await fetch(`/api/id-management/account-switch-key/${accountName}`, {
        method: 'GET',
        redirect: 'follow'
      });
      response = await response.json();
      setOptions(response);
    }
    if (accountName.length <= 3) {
      setOptions([]);
      return null;
    }
    fetchAccountSwitchKeys();
  }, [accountName, accountSwitchKey]);

  const filterOptions = createFilterOptions({
    stringify: option => option.accountName
  });

  // Input fields
  const [propertyHostname, setPropertyHostname] = useState('');
  const [versionBefore, setVersionBefore] = useState('');
  const [versionAfter,  setVersionAfter ] = useState('');

  // diff
  const [before, setBefore] = useState('');
  const [after,  setAfter ] = useState('');

  // getDiff
  const getDiff = async () => {
    console.log(propertyHostname);
    let response = await fetch(`/api/papi/search-properties?switchKey=${accountSwitchKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({hostname: propertyHostname})
    });
    let properties = await response.json();
    if (properties.versions.items.length === 0) { console.log('Not matched'); }

    console.log(properties.versions.items[0].contractId);
    console.log(properties.versions.items[0].groupId);
    console.log(properties.versions.items[0].propertyId);

    response = await fetch(`/api/papi/get-property-rule-tree?switchKey=${accountSwitchKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({
        propertyId: properties.versions.items[0].propertyId,
        contractId: properties.versions.items[0].contractId,
        groupId: properties.versions.items[0].groupId,
        propertyVersion: versionBefore
      })
    });
    let ruleTreeBefore = await response.json();
    console.log(ruleTreeBefore);
    // TODO: error handling
    setBefore(ruleTreeBefore);

    response = await fetch(`/api/papi/get-property-rule-tree?switchKey=${accountSwitchKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({
        propertyId: properties.versions.items[0].propertyId,
        contractId: properties.versions.items[0].contractId,
        groupId: properties.versions.items[0].groupId,
        propertyVersion: versionAfter
      })
    });
    let ruleTreeAfter = await response.json();
    console.log(ruleTreeAfter);
    // TODO: error handling
    setAfter(ruleTreeAfter);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>&nbsp;<ImFilesEmpty />&nbsp; pdiff</h1>
      </header>
      <div className="form-box">
        <Stack spacing={2} sx={{width: 400}}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.accountName }
            filterOptions={filterOptions}
            autoComplete
            includeInputInList
            value={accountName}
            label="Account Name"
            required
            renderInput={(params) => <TextField {...params} label="Account Name" variant="standard" />}
            isOptionEqualToValue={(option, value) => option.accountName }
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue.accountName, ...options] : options);
              setAccountSwitchKey(newValue ? newValue.accountSwitchKey : '');
            }}
            onInputChange={(event, newInputValue) => {
              setAccountName(newInputValue);
            }}
          />

          <TextField
            variant="standard"
            value={accountSwitchKey}
            onChange={(event) => { if (event.target) { setAccountSwitchKey(event.target.value) } }}
            label="Account Switch Key"
            required
            disabled
          />

          <TextField
            variant="standard"
            value={propertyHostname}
            onChange={(event) => { if (event.target) { setPropertyHostname(event.target.value) } }}
            label="Property Hostname"
            required
          />

          <Stack direction="row" spacing={2}>
            <TextField
              variant="standard"
              value={versionBefore}
              onChange={(event) => { if (event.target) { setVersionBefore(event.target.value) } }}
              label="Version From"
              required
              className="narrow-text-field"
            />

            <TextField
              variant="standard"
              value={versionAfter}
              onChange={(event) => { if (event.target) { setVersionAfter(event.target.value) } }}
              label="Version To"
              required
              className="narrow-text-field"
            />
          </Stack>
        </Stack>

        <div className="button-wrap">
          <Button onClick={getDiff} variant="contained" startIcon={<FiDownloadCloud />}>Show diff</Button>
        </div>
      </div>

      {before && after ?
      <div>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}><GoGitPullRequest /> &nbsp;diff</Typography>
        </Toolbar>
        <div style={{fontSize: '12px'}}>
          <ReactDiffViewer
            oldValue={JSON.stringify(before, null, 2)}
            newValue={JSON.stringify(after,  null, 2)}
            compareMethod="diffWords"
            leftTitle={`v${versionBefore}`}
            rightTitle={`v${versionAfter}`}
          />
        </div>
      </div>
      : <></>}
    </div>
  );
}

export default App;
