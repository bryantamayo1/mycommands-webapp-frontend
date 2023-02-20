import '../styles/normalize.css';
import '../styles/main.css';
import { Services } from './services';
import { closeMenuFilter, handleCloseFilters, handleFilters, handleFocusInputSearch } from './effects';

// Local variables
// Store state of each filters
let buffer_filters_categories = [];
let buffer_filters_queries = [
    {category: "Command && Meaning", index: 0, active: true, query: "?command=&meaning="},
    {category: "Command", index: 1, active: false, query: "?command="},
    {category: "Meaning", index: 2, active: false, query: "?meaning="},
];
let local_lan = "/en";
let local_page = 1;
let loca_input_value = "";

/**
 * Show 20 commands and create list with them
 * @param {string} lan 
 * @param {number} page 
 * @param {string} category 
 * @param {string} command 
 * @param {string} meaning 
 */
const getCommands = async(lan, page, category, command, meaning) => {
    // Clean data
    const list_container = document.querySelectorAll(".list-container")
    .forEach(item => item.remove());


    const data = await Services.getCommands(lan, page, category, command, meaning);
    showTotalCommands(data.total);

    // Show data in list
    const my_container = document.getElementsByClassName("my-container")[0];
    for(let i = 0; i< data.data.length; i++){
        const div = document.createElement("div");
        const column_1 = document.createElement("button");
        const column_2 = document.createElement("button");
        const column_3 = document.createElement("p");
        const column_4 = document.createElement("p");
        const icon_copy = document.createElement("i");
        const icon_info = document.createElement("i");

        icon_copy.classList.add("fa-solid");
        icon_copy.classList.add("fa-copy");
        column_1.classList.add("container-icon");
        column_1.appendChild(icon_copy);
        column_1.addEventListener("click", (event) => copyClipboard(event, data.data[i].command, column_1))

        
        icon_info.classList.add("fa-solid");
        icon_info.classList.add("fa-circle-info");
        column_2.classList.add("container-icon");
        column_2.appendChild(icon_info);
        

        column_3.appendChild( document.createTextNode(data.data[i].command) );
        column_4.appendChild( document.createTextNode(data.data[i].en) );
        div.appendChild(column_1);
        div.appendChild(column_2);
        div.appendChild(column_3);
        div.appendChild(column_4);
        div.classList.add("list-container");
        
        my_container.appendChild(div);
    }
}

/**
 * Copy in clipboard a command
 * @param {event} event 
 * @param {string} command 
 * @param {NodeElement} btn 
 */
const copyClipboard = (event, command, btn) => {
    navigator.clipboard.writeText(command);
    // show popover with copied successfully
    const div = document.createElement("div");
    div.appendChild( document.createTextNode("Copied") );
    div.classList.add("popover-clipboard");
    btn.appendChild(div);

    setTimeout(() => {
        div.style.display = "none";
    }, 1000);
}

/**
 * Show total commands with commas
 * @param {number} total 
 */
const showTotalCommands = (total) => {
    const total_numbers = document.getElementsByClassName("total-numbers")[0];
    const t = total.toString().split("");
    for(let i = t.length - 1; i >= 0 ; i--){
        if((i % 3) === 0){
            t.splice(i - 3, 0, ",");
        }
    }
    if(t[0] === ",") t.shift();
    total_numbers.innerHTML = t.join("");
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
    const button = document.getElementsByClassName("search__button search__button--left")[0];
    const input = document.getElementsByClassName("search__input")[0];
    
    input.addEventListener("keydown", async(event) => {
        let filter = buffer_filters_categories.find(item => item.active === true);
        // Get input's value'
        if(event.key === "Enter"){
            loca_input_value = input.value;
            // Get commands
            getCommands(local_lan, local_page, filter._id, loca_input_value);
        }
    });
    button.addEventListener("click", () => {
        loca_input_value = input.value;
        let filter = buffer_filters_categories.find(item => item.active === true);
        // Search active filter
        getCommands(local_lan, local_page, filter._id, loca_input_value);
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
    // Push filters of searching by commands and meaning
    buffer_filters_queries.forEach( (item, i) => {
        const container_filters = document.getElementsByClassName("container-filters")[i];
        const span = document.createElement("span");
        span.classList.add("toggle__slider");

        const btn = document.createElement("button");
        btn.classList.add("toggle");
        btn.appendChild(span);
        btn.addEventListener("click", event => handleBtnToggleQueries(event, i, buffer_filters_queries.length));

        const div = document.createElement("div");
        div.appendChild( btn );

        const version = document.createElement("p");
        version.classList.add("version-filter");
        version.appendChild( document.createTextNode( item.category ) );
        div.appendChild( version );
        div.classList.add("toggle-container");
        div.classList.add("container-filters");

        container_filters.after(div);
    });

    const btn_command_meaning = document.getElementsByClassName("toggle")[0];
    btn_command_meaning.classList.add("toggle-active");
    const span_command_meaning = document.getElementsByClassName("toggle__slider")[0];
    span_command_meaning.classList.add("toggle__slider--move-to-right");

    // Put line to separate filters
    const container_filters_aux_1 = document.getElementsByClassName("container-filters")
    [document.getElementsByClassName("container-filters").length - 2];
    const bar = document.createElement("section");
    bar.classList.add("bar-separated");
    container_filters_aux_1.after(bar);

    // Put title Categories
    const title_categories = document.createElement("p");
    title_categories.classList.add("container-filters");
    title_categories.classList.add("container-filters__title");
    title_categories.appendChild( document.createTextNode("Categories") );
    const bar_separated = document.getElementsByClassName("bar-separated")[0];
    bar_separated.after(title_categories);

    // Push first category All
    buffer_filters_categories[0] = {index: 0, active: true, _id: "all"}
    const btn = document.getElementById("id-btn-all");
    const circle = document.getElementById("id-span-all");
    btn.classList.add("toggle-active");
    circle.classList.add("toggle__slider--move-to-right");
    btn.addEventListener("click", event => handleBtnToggleCategories(event, 0, buffer_filters_queries.length));

    for(let i = 0; i < info.length; i++){       
        const span = document.createElement("span");
        span.classList.add("toggle__slider");

        const btn = document.createElement("button");
        btn.classList.add("toggle");
        btn.appendChild(span);
        buffer_filters_categories[i + 1] = {index: i + 1, active: false, ...info[i]}
        btn.addEventListener("click", (event) => handleBtnToggleCategories(event, i + 1, buffer_filters_queries.length));

        const div = document.createElement("div");
        div.appendChild( btn );
        
        const version = document.createElement("p");
        version.classList.add("version-filter");
        version.appendChild( document.createTextNode( info[i].category ) );
        div.appendChild( version );
        div.classList.add("toggle-container");
        div.classList.add("container-filters");

        filters.appendChild(div);
    }

    // Create btn to apply filters
    const text_apply = document.createElement("p");
    text_apply.classList.add("text_apply");
    text_apply.appendChild( document.createTextNode("Apply")  );

    const btn_apply = document.createElement("button");
    btn_apply.addEventListener("click", handleBtnApply);
    btn_apply.classList.add("btn_apply");
    btn_apply.appendChild(text_apply);
    
    const btn_apply_container = document.createElement("div");
    btn_apply_container.classList.add("btn-apply-container");
    btn_apply_container.appendChild(btn_apply);

    filters.appendChild(btn_apply_container);
}

/**
 * Modify style according to active or not button
 * Only one filter can be actived
 * @param{number} sizePreviouslyFilters
 */
const handleBtnToggleCategories = (event, i, sizePreviouslyFilters) => {
    const btn = document.getElementsByClassName("toggle")[i + sizePreviouslyFilters];
    const circle = document.getElementsByClassName("toggle__slider")[i + sizePreviouslyFilters];
 
    // Search actived toggle in buffer_filters_categories
    const filterActived = buffer_filters_categories.findIndex(item => item.active === true);
    if(i === filterActived){
        return;
    }else{
        // Clone only items that we need
        const all_togggles = document.querySelectorAll(".toggle");
        const btn_filter = [];
        // Copy only filters of categories
        for(let i = sizePreviouslyFilters; i < all_togggles.length; i++){
            btn_filter.push(all_togggles[i]);
        }
        const all_toggle__slider = document.querySelectorAll(".toggle__slider");
        const toggle__slider = [];
        for(let i = sizePreviouslyFilters; i < all_toggle__slider.length; i++){
            toggle__slider.push(all_toggle__slider[i]);
        }
        
        btn_filter.forEach( (item, index) => {
            item.classList.remove("toggle-active");
            toggle__slider[index].classList.remove("toggle__slider--move-to-right");
            buffer_filters_categories[index].active = false; 
        });

        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
        buffer_filters_categories[i].active = true;
    }
}

/**
 * Modify style according to active or not button in filters by queries "Seacrh by"
 * Only one filter can be actived
 * @param{number} sizeFilters

 */
const handleBtnToggleQueries = (event, i, sizeFilters) => {
    const btn = document.getElementsByClassName("toggle")[i];
    const circle = document.getElementsByClassName("toggle__slider")[i];

    // Search actived toggle in buffer_filters_queries
    const filterActived = buffer_filters_queries.findIndex(item => item.active === true);
    if(i === filterActived){
        return;
    }else{
        // Clone only items that we need
        const all_togggles = document.querySelectorAll(".toggle");
        const btn_filter = [];
        // Copy only filters of categories
        for(let i = 0; i < sizeFilters; i++){
            btn_filter.push(all_togggles[i]);
        }
        const all_toggle__slider = document.querySelectorAll(".toggle__slider");
        const toggle__slider = [];
        for(let i = 0; i < sizeFilters; i++){
            toggle__slider.push(all_toggle__slider[i]);
        }

        btn_filter.forEach( (item, index) => {
            item.classList.remove("toggle-active");
            toggle__slider[index].classList.remove("toggle__slider--move-to-right");
            buffer_filters_queries[index].active = false; 
        });

        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
        buffer_filters_queries[i].active = true;
    }
}

/**
 * hnadle btn Apply in menu filters
 */
const handleBtnApply = (event) => {
    let filter = buffer_filters_categories.find(item => item.active === true);
    getCommands(local_lan, local_page, filter._id, loca_input_value);
    closeMenuFilter();
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
