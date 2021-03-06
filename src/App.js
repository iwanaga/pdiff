import './App.css';
import { ImFilesEmpty } from 'react-icons/im';
import { FaExclamationTriangle, FaCopy } from 'react-icons/fa';
import { Autocomplete, Button, createFilterOptions, Stack, Paper, TextField, Snackbar, Alert, Stepper, StepLabel, Step, StepContent } from '@mui/material';
import { FiDownloadCloud } from 'react-icons/fi';
import ReactDiffViewer from 'react-diff-viewer';
import { useEffect, useState } from 'react';

function App() {

  const diffStyles = {
    variables: {
      dark: {
        diffViewerTitleColor: '#ccc',
        diffViewerTitleBackground: '#161b22',
        codeFoldGutterBackground: 'rgba(56,139,253,0.4)',
        codeFoldContentColor: '#aaa',
        codeFoldBackground: 'rgba(56,139,253,0.15)',
        gutterBackground: '#0d1117',
        gutterColor: '#484f58',
        diffViewerBackground: '#0d1117',
        gutterBackgroundDark: '#0d1117',
        removedGutterBackground: 'rgba(248,81,73,0.3)',
        removedGutterColor: '#c9d1d9',
        removedBackground: 'rgba(248,81,73,0.15)',
        wordRemovedBackground: 'rgba(248,81,73,0.4)',
        addedGutterBackground: 'rgba(63,185,80,0.3)',
        addedGutterColor: '#c9d1d9',
        addedBackground: 'rgba(46,160,67,0.15)',
        wordAddedBackground: 'rgba(46,160,67,0.4)',
        emptyLineBackground: '#0d1117'
      }
    },
    line: {
      pre: {
        lineHeight: '1.5em',
        fontSize: '12px',
        fontWeight: '500',
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace'
      }
    },
    wordDiff: {
      padding: 1
    },
    gutter: {
      pre: {
        opacity: 100
      }
    },
    codeFold: {
      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
      fontSize: '12px',
      lineHeight: '1.2em',
      height: 'auto'
    }
  };

  // query parameters
  const params = new URLSearchParams(document.location.search);

  // Autocomplete Account Switch Key
  const [accountName, setAccountName] = useState(params.get('accountName') || '');
  const [options, setOptions] = useState([]);
  const [accountSwitchKey, setAccountSwitchKey] = useState(params.get('accountSwitchKey') || '');

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
  const [propertyHostname, setPropertyHostname] = useState(params.get('propertyHostname') || '');
  const [versionBefore, setVersionBefore] = useState(params.get('versionFrom') || '');
  const [versionAfter,  setVersionAfter ] = useState(params.get('versionTo') || '');

  const [shareURL, setShareURL] = useState('');

  // fetch status
  const [activeStep, setActiveStep] = useState(0);
  const [apiError, setApiError] = useState('');

  function getSteps() {
    return [
      'Enter the form and click the button above',
      `API: Searching property by property hostname.`,
      `API: Fetching rule tree, old version. (takes 5 seconds)`,
      `API: Fetching rule tree, new version. (takes 5 seconds)`,
      'See diff below'
    ];
  }

  const handleReset = () => {
    setActiveStep(0);
  };

  // diff
  const [before, setBefore] = useState('');
  const [after,  setAfter ] = useState('');

  // getDiff
  const getDiff = async () => {
    handleReset();

    setActiveStep(1);
    console.log(`Search ${propertyHostname}`);
    let response = await fetch(`/api/papi/search-properties?switchKey=${accountSwitchKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({hostname: propertyHostname})
    });
    console.log(response);

    let properties = await response.json();
    console.log(properties);

    if (response.status > 400) {
      setApiError(properties.detail);
      return;
    }
    if (properties.versions.items.length === 0) {
      setApiError('Property not found. Please check account name.');
      return;
    }

    console.log(properties.versions.items[0].contractId);
    console.log(properties.versions.items[0].groupId);
    console.log(properties.versions.items[0].propertyId);

    setActiveStep(2);
    console.log(`Fetch v${versionBefore}`);
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
    console.log(response);

    let ruleTreeBefore = await response.json();
    console.log(ruleTreeBefore);

    if (response.status > 400) {
      setApiError(ruleTreeBefore.detail);
      return;
    }
    setBefore(ruleTreeBefore);

    setActiveStep(3);
    console.log(`Fetch v${versionAfter}`);
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
    console.log(response);

    let ruleTreeAfter = await response.json();
    console.log(ruleTreeAfter);
    if (response.status > 400) {
      setApiError(ruleTreeAfter.detail);
      return;
    }
    setAfter(ruleTreeAfter);
    setShareURL(`http://localhost:${document.location.port}/?accountName=${accountName}&accountSwitchKey=${accountSwitchKey}&propertyHostname=${propertyHostname}&versionFrom=${versionBefore}&versionTo=${versionAfter}`);

    setActiveStep(4);
  };

  const [open, setOpen] = useState(false);
  const showMessage = () => {
    setOpen(true);
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
            renderInput={(params) => <TextField {...params} label="Account Name" variant="filled" />}
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
            variant="filled"
            value={propertyHostname}
            onChange={(event) => { if (event.target) { setPropertyHostname(event.target.value) } }}
            label="Property Hostname"
            placeholder="www.example.com"
            required
          />

          <Stack direction="row" spacing={2}>
            <TextField
              variant="filled"
              value={versionBefore}
              onChange={(event) => { if (event.target) { setVersionBefore(event.target.value) } }}
              placeholder="1"
              type="number"
              label="Version From"
              required
              className="narrow-text-field"
            />

            <TextField
              variant="filled"
              value={versionAfter}
              onChange={(event) => { if (event.target) { setVersionAfter(event.target.value) } }}
              label="Version To"
              placeholder="2"
              type="number"
              required
              className="narrow-text-field"
            />
          </Stack>
        </Stack>

        <div className="button-wrap">
          <Button onClick={getDiff} variant="contained" color="secondary" startIcon={<FiDownloadCloud />}>Show diff</Button>
        </div>
      </div>

      <div className="form-box">
        <Stepper activeStep={activeStep} orientation="vertical">
          {getSteps().map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>{index === 1 && apiError !== '' ?
                <div style={{fontSize: "14px"}}>
                  <div style={{color: "#c2185b", fontWeight:"bold"}}><FaExclamationTriangle className="button-icon" />{apiError}</div>
                </div> : ''}</StepContent>
            </Step>
          ))}
        </Stepper>
      </div>

      {before && after ?
      <div>
        <Stack>
          <Paper
            style={{padding: '15px', fontSize: '12px', cursor: 'pointer'}}
            onClick={() => { navigator.clipboard.writeText(shareURL); showMessage();}}>
            <span style={{fontSize: '15px', fontWeight: '600'}}><FaCopy />&nbsp; Copy URL to clipboard: </span><span style={{color: 'rgb(102, 178, 255)'}}>{shareURL}</span>
          </Paper>
        </Stack>
        <Snackbar open={open} autoHideDuration={1600} onClose={() => { setOpen(false); }}>
          <Alert onClose={() => { setOpen(false); }} severity="success" sx={{ width: '100%' }}>
          Copied to clipboad!
        </Alert>
      </Snackbar>
        <div style={{fontSize: '12px'}}>
          <ReactDiffViewer
            oldValue={JSON.stringify(before, null, 2)}
            newValue={JSON.stringify(after,  null, 2)}
            compareMethod="diffWords"
            useDarkTheme="true"
            splitView={false}
            styles={diffStyles}
            leftTitle={`v${versionBefore} -> v${versionAfter}`}
            rightTitle={`v${versionAfter}`}
          />
        </div>
      </div>
      : <></>}
    </div>
  );
}

export default App;
