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
import { CommandData, InterfaceCommands } from '../../interfaces/Commands';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CodeIcon from '@mui/icons-material/Code';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { SessionStorage } from '../../utils/SessionStorage';
import { ModalCreateCommand } from './ModalCreateCommand';
import { ModalConfirmDelete } from '../common/ModalConfirmDelete';
import { ModalEditCommand } from './ModalEditCommand';

type typeStateInitial = {
  categories: InterfaceGetFilters,
  commands: InterfaceCommands,
  commandsBackup: InterfaceCommands,
  selectedSearchCommandFilter: string,
  selectedCategoryFilter: string,
  checkCommandAndMenaning: boolean,
  checkCommands: boolean,
  checkMeaning: boolean,
  openModalDelete: boolean

  // List of commands
  selectedCommand: CommandData
}

const StateInitial:typeStateInitial = {
  categories: {} as InterfaceGetFilters,
  commands: {} as InterfaceCommands,
  commandsBackup: {} as InterfaceCommands,
  selectedSearchCommandFilter: '',
  selectedCategoryFilter: "",
  checkCommandAndMenaning: true,
  checkCommands: false,
  checkMeaning: false,
  openModalDelete: false,

  // List of commands
  selectedCommand: {} as CommandData
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
    setState(prevState => ({ ...prevState, categories: resp, selectedCategoryFilter: "all" }));
  }

  const getCommands = async (query: any) => {
    const resp = await ServicesCommands.getCommands(query);

    // Fill with property active
    resp.data.map(item => {
      item.active = false;
    });
    console.log("resp: ", resp)
    setState(prevState => ({ ...prevState, commands: resp, commandsBackup: resp }));
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setState(prevState => ({ ...prevState, selectedCategoryFilter: event.target.value }));
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

  /**
   * Update command in property command of StateInitial
   * @param {string} property It can be command, es or en
   */
  const onChangeCommand = (value: any, viewUpdate: any, selectedItem: CommandData, property: string) => {
    const updatedCommands = state.commands.data.map(item => {
      if(selectedItem._id === item._id){
        // @ts-ignore
        item[property] = value;
      }
      return item;
    });
    const newCommands = {
      ...state.commands,
      data:updatedCommands
    }
    setState(prevState => ({ ...prevState, commands: newCommands }));
  };

  const handleSearchCommand = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, selectedSearchCommandFilter: target.value }));
  }

  const searchCommands = () => {
    // Prepare query
    const {selectedSearchCommandFilter, selectedCategoryFilter, 
    checkCommandAndMenaning, checkCommands, checkMeaning} = state;
    const query: any = {}

    if(checkCommandAndMenaning){
      query.command = selectedSearchCommandFilter;
      query.meaning = selectedSearchCommandFilter;
    }else if (checkCommands){
      query.command = selectedSearchCommandFilter;
    }else if (checkMeaning){
      query.meaning = selectedSearchCommandFilter;
    }

    getCommands({
      page: 1,
      category: selectedCategoryFilter? selectedCategoryFilter : "all",
      ...query
    });
  }

  ///////////
  // Commands
  ///////////
  const enableEditCommand = (clickedItem: CommandData) => {
    
    // const newData = structuredClone(state.commands);
    // newData.data.forEach( (item: CommandData) => {
    //   if(item._id === clickedItem._id){
    //     item.active = true;
    //   }
    // });
    // setState(prevState => ({ ...prevState, commands: newData }));
  }

  const openConfirmDeleteCommand  = (clickedItem: CommandData) => {
    setState(prevState => ({ ...prevState, selectedCommand: clickedItem, openModalDelete: true }));
  }

  const copyText = (clickedItem: CommandData, property: string) => {
    // @ts-ignore
    navigator.clipboard.writeText(clickedItem[property]);
  }

  ///////////////////////
  // Modal delete command
  ///////////////////////
  const handleCloseModalDelete = () => {
    setState(prevState => ({ ...prevState, openModalDelete: false }));
  }

  const deleteCommand =  async () => {
    await ServicesCommands.deleteCommand(state.selectedCommand.categoryFather._id, state.selectedCommand._id);
    searchCommands();
    handleCloseModalDelete();
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
            value={state.selectedCategoryFilter}
            label="Categories"
            onChange={handleChangeSelect}
          >
            {state.categories.data?.map( category => (
              <MenuItem key={category._id} value={category._id}>{parseVersion(category)}</MenuItem>
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

      <ModalCreateCommand getCommands={searchCommands}/>

      {/* List of commands */}
      <div className='mc-container-commands'>
        {state.commands.data?.map(item => (
          <div className='mc-container-row' key={item._id}>

            {/* Options */}
            <div className='mc-container-commands__options mc-code-style'>
              
              {/* <Button variant="contained" color='secondary' size='small' style={{ minWidth: 40, width: 40 }}>
                <ContentCopyIcon fontSize="small"/>
              </Button>

              <Button variant="contained" color='secondary' size='small' style={{ minWidth: 40, width: 40 }}>
                <CodeIcon fontSize="small"/>
              </Button> */}
              <ModalEditCommand getCommands={searchCommands} item={item}/>


              <Button variant="contained" color='secondary' size='small'
                style={{ minWidth: 40, width: 40 }}
                onClick={() => openConfirmDeleteCommand(item)}
              >
                <DeleteForeverIcon fontSize="small"/>
              </Button>
            </div>
              
            {/* Code */}
            <div style={{ maxWidth: "90vw" }}>
              <div className='mc-container-command'>
                <span>
                  <Button variant="contained" color='secondary' size='small' style={{ minWidth: 40, width: 40 }}
                      onClick={() => copyText(item, "command")}
                  >
                    <ContentCopyIcon fontSize="small"/>
                  </Button>
                </span>
                <CodeMirror
                  value={item.command}
                  height="150px"
                  maxHeight='150px'

                  // @ts-ignore
                  extensions={[loadLanguage("sql")]}
                  theme={xcodeDark}
                  onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "command")}
                  editable={item.active}
                  className='mc-container-commands__command mc-code-style'
                />
              </div>
               {/* <Editor
                value={item.command}
                height="150px"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "command")}
              /> */}
              <div className='mc-container-commands__meanings'>
                <div className='mc-container-command'>
                  <span>
                    <Button variant="contained" color='secondary' size='small' style={{ minWidth: 40, width: 40 }}
                      onClick={() => copyText(item, "en")}
                    >
                      <ContentCopyIcon fontSize="small"/>
                    </Button>
                  </span>
                  <CodeMirror
                    value={item.en}
                    height="150px"
                    maxHeight='150px'

                    // @ts-ignore
                    extensions={[loadLanguage("sql")]}
                    theme={xcodeDark}
                    onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "en")}
                    editable={item.active}
                    className='mc-code-style'
                  />
                </div>
                {/* <Editor
                  value={item.en}
                  height="150px"
                  theme="vs-dark"
                  defaultLanguage="javascript"
                  defaultValue="// some comment"
                  onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "en", item.active!)}
                /> */}
                <div className='mc-container-command'>
                  <span>
                    <Button variant="contained" color='secondary' size='small' style={{ minWidth: 40, width: 40 }}
                      onClick={() => copyText(item, "es")}
                    >
                      <ContentCopyIcon fontSize="small"/>
                    </Button>
                  </span>
                  <CodeMirror
                    value={item.es}
                    height="150px"
                    maxHeight='150px'
                    // @ts-ignore
                    extensions={[loadLanguage("sql")]}
                    theme={xcodeDark}
                    onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "es")}
                    editable={item.active}
                    className='mc-code-style'
                  />
                </div>
                {/* <Editor
                  value={item.es}
                  height="150px"
                  theme="vs-dark"
                  defaultLanguage="javascript"
                  defaultValue="// some comment"
                  onChange={(value, viewUpdate) => onChangeCommand(value, viewUpdate, item, "es", item.active!)}
                /> */}
              </div>
            </div>

          </div>
        ))}
      </div>
      {/* <Editor
        value=''
        height="10vh"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// some comment"
      /> */}

      {/* Modal: delete command */}
      <ModalConfirmDelete
          open={state.openModalDelete}
          onClose={handleCloseModalDelete}
          ariaLabelledby="modal-modal-title-delete"
          ariaDescribedby="modal-modal-description-delete"
          title={`Delete command`}
          message="Are you sure you want to delete this command"
          deleteItem={deleteCommand}
      />
    </div>
  )
}