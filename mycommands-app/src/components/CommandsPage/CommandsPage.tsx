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
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import Prism from "prismjs";
import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css'; //Example style, you can use another
// import "prismjs/components/prism-javascript"
import { highlight, languages } from 'prismjs';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import CodeEditor from '@uiw/react-textarea-code-editor';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

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
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, languages.js, "js")}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            color: '#FFF'
          }}
        />
      </div>

      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        data-color-mode="dark"
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#2d2d2d",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}

      />
      ---------------------------------------------
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        // @ts-ignore
        extensions={[loadLanguage("css")]}
        theme={okaidia}
        onChange={onChange}
      />
      ////////////////////////////////////////////////
      <Code code={htmlCode} language="html" />
    </div>
  )
}

export function Code({ code, language }: any) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div className="Code">
      <h2> Code Syntax Block {language}</h2>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}