import '../styles/normalize.css';
import '../styles/main.css';
import { Services } from './services';
import { handleCloseFilters, handleFilters, handleFocusInputSearch } from './effects';

// Local variables
let inputValue = "";

/**
 * Show 20 commands
 * @param {string} lan 
 * @param {number} page 
 */
const getCommands = async(lan, page, category, command, meaning) => {
    // Clean data
    const list_container = document.querySelectorAll(".list-container")
    .forEach(item => item.remove());


    const data = await Services.getCommands(lan, page, category, command, meaning);
    // Show data in list
    const my_container = document.getElementsByClassName("my-container")[0];
    for(let i = 0; i< data.data.length; i++){
        const div = document.createElement("div");
        const column_1 = document.createElement("p");
        const column_2 = document.createElement("p");
        column_1.appendChild( document.createTextNode(data.data[i].command) );
        column_2.appendChild( document.createTextNode(data.data[i].en) );
        div.appendChild(column_1);
        div.appendChild(column_2);
        div.classList.add("list-container");
        my_container.appendChild(div);
    }
}

/**
 * Handle buttons language 'es' and 'es'
 */
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

/**
 * Hnadle input’s value and button magnifying glass
 */
const handleInputSearch = () => {
    const lan = "/en", page = 1, category = "all";
    const button = document.getElementsByClassName("search__button search__button--left")[0];
    const input = document.getElementsByClassName("search__input")[0];
    input.addEventListener("keydown", async(event) => {
        // Get input's value'
        if(event.key === "Enter"){
            // Get commands
            getCommands(lan, page, category, input.value);
            
            console.log(input.value);
        }
    });
    button.addEventListener("click", () => {
        getCommands(lan, page, category, input.value);
    });
}

function init(){
    console.log("init----");
    console.log(window.location);
    document.addEventListener("DOMContentLoaded", () => {
        getCommands("/en", 1);
        handleButtonsLanguage();
        handleInputSearch();
        
        // Effects in style
        handleFocusInputSearch();
        handleFilters();
        handleCloseFilters();
    });
}

init();
