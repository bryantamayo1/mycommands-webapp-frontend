import '../styles/normalize.css';
import '../styles/main.css';
import { Services } from './services';

/**
 * Hnadle input’s focus search
 */
const  handleFocusInputSearch = () => {
    const input = document.getElementsByClassName("search__input")[0];
    const search__container = document.getElementsByClassName("search")[0];
    
    input.addEventListener("focus", () => {
        search__container.style.boxShadow  = "0px 0px 10px 1px #ce04a2";
        search__container.style.outline = "1px solid #ce04a2";

        // Other style
        // search__container.style.boxShadow  = "0px 0px 10px 2px rgb(66, 50, 216)";
        // search__container.style.outline = "1px solid blue";
    });
    input.addEventListener("blur", () => {
        search__container.style.boxShadow  = "";
        search__container.style.outline = "";
    });
}

/**
 * Show first 20 commands by default
 */
const showDefaultsCoomands = async() => {
    const lan = "/en", page = 1;
    const data = await Services.getCommands(lan, page);
    // Show data in table
    const table = document.getElementsByClassName("table")[0].childNodes[1];
    console.log(table)
    for(let i = 0; i< data.data.length; i++){
        const tr = document.createElement("tr");
        const column_1 = document.createElement("td");
        const column_2 = document.createElement("td");
        column_1.appendChild( document.createTextNode(data.data[i].command) );
        column_2.appendChild( document.createTextNode(data.data[i].en) );
        tr.appendChild(column_1);
        tr.appendChild(column_2);
        table.appendChild(tr);
    }
}

const handleButtonsLanguage = () => {
    const es = document.getElementById("es");
    const en = document.getElementById("en");
    es.addEventListener("click", () => {
        window.location.href = "#lan=es";
    });
    en.addEventListener("click", () => {
        window.location.href = "#lan=en";
    });
}

function init(){
    console.log("init----");
    console.log(window.location);
    document.addEventListener("DOMContentLoaded", () => {
        handleFocusInputSearch();
        // showDefaultsCoomands();
        handleButtonsLanguage();
    });
}

init();
