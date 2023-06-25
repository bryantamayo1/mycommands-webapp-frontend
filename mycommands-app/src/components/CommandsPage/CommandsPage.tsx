import './CommandsPage.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { ServicesCategories } from '../../services/ServicesCategories';
import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { InterfaceGetFilters } from '../../interfaces/Categories';
import { parseVersion } from '../../utils/ParseData';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ServicesCommands } from '../../services/ServicesCommands';

import CodeMirror from '@uiw/react-codemirror';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import {xcodeDark} from '@uiw/codemirror-theme-xcode';

type typeStateInitial = {
  categories: InterfaceGetFilters,
  selectedCategory: string,
  checkCommandAndMenaning: boolean,
  checkCommands: boolean,
  checkMeaning: boolean
}

const StateInitial:typeStateInitial = {
  categories: {} as InterfaceGetFilters,
  selectedCategory: "",
  checkCommandAndMenaning: true,
  checkCommands: false,
  checkMeaning: false
}


export const CommandsPage = () => {
  ////////
  // Hooks
  ////////
  const [state, setState] = useState(StateInitial);

  useEffect(() => {
    getCategories();
    getCommands();
  }, []);

  const getCategories = async () => {
    const resp = await ServicesCategories.getCategories();
    setState(prevState => ({ ...prevState, categories: resp }));
  }

  const getCommands = async () => {
    const resp = await ServicesCommands.getCommands();
    console.log(resp)
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setState(prevState => ({ ...prevState, selectedCategory: event.target.value }));
  }

  const handleChangeCheckbox = ( {target}: ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, [target.name]: target.checked }));
  }

  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const onChange = useCallback((value: any, viewUpdate: any) => {
    console.log('value:', value);
  }, []);

  const htmlCode = `
    <div>
      <h1> PrismJS Tutorial </h1>
      <p>
      Prism is a lightweight, extensible syntax highlighter, built with modern web standards in mind.
      </p>
    </div>
`;

  return (
    <div className='mc-container-page'>
      {/* Filters */}
      <div className='mc-container-box'>
        <TextField id="outlined-basic" size='small' label="Outlined" color="secondary"
          variant="outlined"
        />
        
        <FormControl size="small">
          <InputLabel
            id="select-categories"
          >
            Categories
          </InputLabel>
          <Select
            labelId="select-categories"
            id="demo-simple-select"
            value={state.selectedCategory}
            label="Categories"
            onChange={handleChangeSelect}
          >
            {state.categories.data?.map( category => (
              <MenuItem value={category._id}>{parseVersion(category)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          className='mc-label'
          label="Command && Meaning"
          control={
            <Checkbox
              checked={state.checkCommandAndMenaning}
              onChange={ event => handleChangeCheckbox(event)}
              inputProps={{ 'aria-label': 'controlled' }}
              color="secondary"
              name="checkCommandAndMenaning"
            />
          }
        />
        <FormControlLabel
          className='mc-label'
          label="Command"
          control={
            <Checkbox
              checked={state.checkCommands}
              onChange={ event => handleChangeCheckbox(event)}
              inputProps={{ 'aria-label': 'controlled' }}
              color="secondary"
              name="checkCommands"
            />
          }
        />
        <FormControlLabel
          className='mc-label'
          label="Meaning"
          control={
            <Checkbox
              checked={state.checkMeaning}
              onChange={ event => handleChangeCheckbox(event)}
              inputProps={{ 'aria-label': 'controlled' }}
              color="secondary"
              name="checkMeaning"
            />
          }
        />
        <Button variant="contained" color="secondary" size="small">
          <SearchIcon fontSize="small"/>
        </Button>
      </div>

      {/* Commands */}
      <div className='mc-container-box'>
        code
      </div>
      ---------------------------------------------
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        // @ts-ignore
        extensions={[loadLanguage("css")]}
        theme={xcodeDark}
        onChange={onChange}
      />
    </div>
  )
}