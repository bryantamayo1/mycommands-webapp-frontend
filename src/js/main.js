import '../styles/normalize.css';
import '../styles/main.css';
import { Services } from './services';
import { handleCloseFilters, handleFilters, handleFocusInputSearch } from './effects';

// Local variables
let inputValue = "";
let buffer_filters = [];

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
        }
    });
    button.addEventListener("click", () => {
        getCommands(lan, page, category, input.value);
    });
}

/**
 * Handle toggles filters, create and handle elements
 * Besides, add btn apply
 */
const handleToggleFiletrs = async() => {
    const filters = document.getElementsByClassName("filters")[0];
    const data = await Services.getFilters();
    const info = data.data;
    for(let i = 0; i < info.length; i++){
        const span = document.createElement("span");
        span.classList.add("toggle__slider");

        const btn = document.createElement("button");
        btn.dataset.id = i;
        btn.classList.add("toggle");
        btn.appendChild(span);
        buffer_filters[i] = {index: i, active: false, ...info[i]}
        btn.addEventListener("click", (event) => handleBtnToggle(event, i));

        const div = document.createElement("div");
        div.appendChild( btn );
        
        const version = document.createElement("p");
        version.appendChild( document.createTextNode( info[i].category ) );
        div.appendChild( version );
        div.classList.add("toggle-container");

        filters.appendChild(div);
    }

    // Create btn to apply filters
    const btn_apply = document.createElement("button");
    btn_apply.appendChild( document.createTextNode( "Apply" ) );
    btn_apply.classList.add("btn_apply");
    
    const btn_apply_container = document.createElement("div");
    btn_apply_container.appendChild(btn_apply);

    filters.appendChild(btn_apply_container);
}

/**
 * Modify style according to active or not button
 */
const handleBtnToggle = (event, i) => {
    const btn = document.getElementsByClassName("toggle")[i];
    const circle = document.getElementsByClassName("toggle__slider")[i];
    if(buffer_filters[i].active){
        btn.classList.remove("toggle-active");
        circle.classList.remove("toggle__slider--move-to-right");
        buffer_filters[i].active = false;
    }else{
        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
        buffer_filters[i].active = true;
    }
}

function init(){
    console.log("init----");
    console.log(window.location);
    document.addEventListener("DOMContentLoaded", () => {
        getCommands("/en", 1);
        handleButtonsLanguage();
        handleInputSearch();
        handleToggleFiletrs();
        
        // Effects in style
        handleFocusInputSearch();
        handleFilters();
        handleCloseFilters();
    });
}

init();
