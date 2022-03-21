import './App.css';
import { GoDiff } from 'react-icons/go';
import { AppBar, Autocomplete, createFilterOptions, Grid, TextField, Toolbar, Typography } from '@mui/material';
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

  return (
    <div className="App">
      <header className="App-header">
        <h1><GoDiff />&nbsp;&nbsp; pdiff</h1>
      </header>

      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6">Input</Typography>  
        </Toolbar>
      </AppBar>

      <div className="form-box">
        <div className="form-text">
          <Autocomplete
            options={options}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.accountName }
            filterOptions={filterOptions}
            autoComplete
            includeInputInList
            value={accountName}
            label="Account Name"
            required
            className="wide-text-field"
            renderInput={(params) => <TextField {...params} label="Account Name" />}
            isOptionEqualToValue={(option, value) => option.accountName }
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue.accountName, ...options] : options);
              setAccountSwitchKey(newValue ? newValue.accountSwitchKey : '');
            }}
            onInputChange={(event, newInputValue) => {
              setAccountName(newInputValue);
            }}
          />
        </div>

        <div className="form-text">
          <TextField
            value={accountSwitchKey}
            onChange={(event) => { if (event.target) { setAccountSwitchKey(event.target.value) } }}
            label="Account Switch Key"
            required
            className="wide-text-field"
            disabled
          />
        </div>
      </div>
    </div>
  );
}

export default App;
