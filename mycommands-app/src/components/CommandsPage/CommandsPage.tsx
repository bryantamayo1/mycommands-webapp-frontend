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
import Editor from '@monaco-editor/react';
import { InterfaceCommands } from '../../interfaces/Commands';


type typeStateInitial = {
  categories: InterfaceGetFilters,
  commands: InterfaceCommands,
  selectedSearchCommand: string,
  selectedCategory: string,
  checkCommandAndMenaning: boolean,
  checkCommands: boolean,
  checkMeaning: boolean
}

const StateInitial:typeStateInitial = {
  categories: {} as InterfaceGetFilters,
  commands: {} as InterfaceCommands,
  selectedSearchCommand: '',
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

    getCommands({
      page: 1,
      category: 'all'
    });
  }, []);

  ////////////
  // Functions
  ////////////
  const getCategories = async () => {
    const resp = await ServicesCategories.getCategories();
    setState(prevState => ({ ...prevState, categories: resp, selectedCategory: "all" }));
  }

  const getCommands = async (query: any) => {
    const resp = await ServicesCommands.getCommands(query);
    setState(prevState => ({ ...prevState, commands: resp }));
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setState(prevState => ({ ...prevState, selectedCategory: event.target.value }));
  }
;
  /**
   * Always one checkBox is actived at least
   * @param param0 
   */
  const handleChangeCheckbox = ( {target}: ChangeEvent<HTMLInputElement>) => {
    if(state.checkCommandAndMenaning && target.name === "checkCommandAndMenaning") return;

    if(state.checkCommands && target.name === "checkCommands") return;
    
    if(state.checkMeaning && target.name === "checkMeaning") return;

    if(target.name === "checkCommandAndMenaning"){
      setState(prevState => ({ ...prevState, [target.name]: target.checked, checkCommands: false, checkMeaning: false }));
    }else if(target.name === "checkCommands"){
      setState(prevState => ({ ...prevState, [target.name]: target.checked, checkCommandAndMenaning: false, checkMeaning: false }));
    }else if(target.name === "checkMeaning"){
      setState(prevState => ({ ...prevState, [target.name]: target.checked, checkCommandAndMenaning: false, checkCommands: false }));
    }
  }

  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const onChange = useCallback((value: any, viewUpdate: any) => {
    console.log('value:', value);
  }, []);

  const handleSearchCommand = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, selectedSearchCommand: target.value }));
  }

  const searchCommands = () => {
    // Prepare query
    const {selectedSearchCommand, selectedCategory, 
    checkCommandAndMenaning, checkCommands, checkMeaning} = state;
    const query: any = {}

    if(checkCommandAndMenaning){
      query.command = selectedSearchCommand;
      query.meaning = selectedSearchCommand;
    }else if (checkCommands){
      query.command = selectedSearchCommand;
    }else if (checkMeaning){
      query.meaning = selectedSearchCommand;
    }

    getCommands({
      page: 1,
      category: selectedCategory? selectedCategory : "all",
      ...query
    });
  }

  return (
    <div className='mc-container-page'>
      {/* Filters */}
      <div className='mc-container-box'>
        
        <TextField id="search-command" size='small' label="Search" color="secondary"
          variant="outlined" style={{ width: 300 }}
          onChange={handleSearchCommand}
        />
        
        <FormControl size="small" style={{ width: 300 }}>
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

        <Button variant="contained" color="secondary" size="small" style={{ minWidth: 50 }}
          onClick={searchCommands}
        >
          <SearchIcon fontSize="small"/>
        </Button>
      </div>

      {/* Commands */}
      <div className='mc-container-box mc-container-commands'>
        {state.commands.data?.map(item => (
          <div className='mc-container-row'>
            <div className="mc-container-commands__command">
              <Editor height="200px" defaultLanguage={item.language} defaultValue={item.command}
                theme="vs-dark"
              />
            </div>

            <div className="mc-container-commands__meaning">
              {item.en}
            </div>

          </div>
        ))}
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

      -----------------------
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment"
        theme="vs-dark"
      />
    </div>
  )
}