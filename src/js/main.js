import '../styles/normalize.css';
import '../styles/main.css';
import { Services } from './services';

// Local variables
let inputValue = "";

/**
 * Hnadle input’s focus search
 */
const  handleFocusInputSearch = () => {
    const input = document.getElementsByClassName("search__input")[0];
    const search__container = document.getElementsByClassName("search")[0];
    
    // Handle style css
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
 * Show 20 commands
 * @param {string} lan 
 * @param {number} page 
 */
const getCommands = async(lan, page, category, command, meaning) => {
    // Clean data
    const list_container = document.querySelectorAll(".list-container")
    .forEach(item => item.remove());
    console.log("list-container")
    console.log(list_container);
    // list_container?.remove();
    console.log(list_container);

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
 * Hnadle input’s value
 */
const handleInputSearch = () => {
    const lan = "/en", page = 1, category = "all";
    const input = document.getElementsByClassName("search__input")[0];
    input.addEventListener("keydown", async(event) => {
        // Get input's value'
        if(event.key === "Enter"){
            // Get commands
            getCommands(lan, page, category, input.value);

            console.log(input.value);
        }
    });
}

function init(){
    console.log("init----");
    console.log(window.location);
    document.addEventListener("DOMContentLoaded", () => {
        handleFocusInputSearch();
        getCommands("/en", 1);
        handleButtonsLanguage();
        handleInputSearch();
    });
}

init();
