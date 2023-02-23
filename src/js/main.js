import '../styles/normalize.css';
import '../styles/main.css';
import '../styles/pagination.css';
import '../styles/footer.css';
import '../styles/spinner.css';
import '../styles/modal.css';
import { Services } from './services';
import { closeMenuFilter, handleCloseFilters, handleFilters, handleFocusInputSearch } from './effects';
import { getQueries, parseQuery } from './utils';
import { handlePagination } from './pagination';
import { closeModal, copyInClipboardModalCommand, copyInClipboardModalMeaning, openModal } from './modal';

// Global variables
// Store state of each filters
let global_buffer_filters_categories = [];
let global_buffer_filters_queries = [
    {category: "Command && Meaning", index: 0, active: true, query: "&command=&meaning="},
    {category: "Command", index: 1, active: false, query: "&command="},
    {category: "Meaning", index: 2, active: false, query: "&meaning="},
];
let global_lang = "/en";
let global_page = 1;

/**
 * Show 20 commands and create list with them.
 * Paint total commands.
 * hnadle pagination.
 * Query command and meaning is searched in host’s url
 * @param {string} lang 
 * @param {number} page 
 * @param {string} category 
 */
export const getCommands = async(lang, page, category) => {
    // Clean data
    document.querySelectorAll(".list-container")
    .forEach(item => item.remove());
    // Clean pagination
    document.querySelectorAll(".btn-pagination")
    .forEach(item => item.remove());

    // Get commands
    // Prepare queries
    // 1ª Search actived toggle in global_buffer_filters_queries
    const input_value_direct = document.getElementsByClassName("search__input")[0];

    const commandAndMeaning = parseQuery(global_buffer_filters_queries, input_value_direct.value);

    // Active spinner
    const spinner_container_active = document.getElementsByClassName("spinner-container")[0];
    spinner_container_active.classList.remove("not-visible");

    // Disable total numbers
    const total_numbers_active = document.getElementsByClassName("total-numbers")[0];
    total_numbers_active.classList.add("not-visible");
    
    // Delete padding by default in pagination
    const pagination_container_without_padding = document.getElementsByClassName("pagination-container")[0];
    pagination_container_without_padding.classList.add("pagination-container--padding");

    const data = await Services.getCommands(
        lang,
        page,
        category,
        commandAndMeaning
    );
    // Disable spinner
    const spinner_container_not_Active = document.getElementsByClassName("spinner-container")[0];
    spinner_container_not_Active.classList.add("not-visible");

    // Add padding by default in pagination
    const pagination_container_with_padding = document.getElementsByClassName("pagination-container")[0];
    pagination_container_with_padding.classList.remove("pagination-container--padding");

    // Disable total numbers
    const total_numbers_not_active = document.getElementsByClassName("total-numbers")[0];
    total_numbers_not_active.classList.remove("not-visible");

    showTotalCommands(data.total);
    handlePagination(data);
    const lang_response = data.lang;

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
        column_2.addEventListener("click", event => openModal(event, data.data[i], data.lang));
        
        column_3.appendChild( document.createTextNode(data.data[i].command) );
        column_3.classList.add("command-text");

        // Chage color in character hash #
        if(data.data[i][lang_response].charAt(0) === "#"){
            const span = document.createElement("span");
            span.innerHTML = "# ";
            span.classList.add("hash-in-meaning");   
            column_4.appendChild(span);
            column_4.appendChild( document.createTextNode(data.data[i][lang_response].slice(2, data.data[i].length)) );
        }else{
            column_4.appendChild( document.createTextNode(data.data[i][lang_response]) );
        }
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
    div.appendChild( document.createTextNode("Copied!") );
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
 * Handle buttons language 'es' and 'es'.
 * Seach commands with selected language
 */
const handleButtonsLanguage = () => {
    const es = document.getElementById("es");
    const en = document.getElementById("en");
    let query = window.location.search.split("");
    const lang_index = window.location.search.indexOf("lang=");
    
    es.addEventListener("click", () => {
        // Change query in window.history
        if (history.pushState){
            query.splice(lang_index + 4, 2, "e");
            query.splice(lang_index + 6, 1, "s");
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query.join("");
            window.history.pushState({path:newurl},'',newurl);
            getCommands("/es");
        }
    });
    en.addEventListener("click", () => {
        // Change query in window.history
        if (history.pushState){
            query.splice(lang_index + 4, 2, "e");
            query.splice(lang_index + 6, 1, "n");
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query.join("");
            window.history.pushState({path:newurl},'',newurl);
            getCommands("/en");

        }
    });
}

/**
 * Hnadle input’s value and button magnifying glass
 */
const handleInputSearch = () => {
    const button = document.getElementsByClassName("search__button search__button--left")[0];
    const input = document.getElementsByClassName("search__input")[0];
    
    input.addEventListener("keydown", async(event) => {
        let filter = global_buffer_filters_categories.find(item => item.active === true);
        // Get input's value'
        if(event.key === "Enter"){
            // Get commands
            getCommands(global_lang, global_page, filter._id);
        }
    });
    button.addEventListener("click", () => {
        let filter = global_buffer_filters_categories.find(item => item.active === true);
        // Search active filter
        getCommands(global_lang, global_page, filter._id);
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
    global_buffer_filters_queries.forEach( (item, i) => {
        const container_filters = document.getElementsByClassName("container-filters")[i];
        const span = document.createElement("span");
        span.classList.add("toggle__slider");

        const btn = document.createElement("button");
        btn.classList.add("toggle");
        btn.appendChild(span);
        btn.addEventListener("click", event => handleBtnToggleQueries(event, i, global_buffer_filters_queries.length));

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
    global_buffer_filters_categories[0] = {index: 0, active: true, _id: "all"}
    const btn = document.getElementById("id-btn-all");
    const circle = document.getElementById("id-span-all");
    btn.classList.add("toggle-active");
    circle.classList.add("toggle__slider--move-to-right");
    btn.addEventListener("click", event => handleBtnToggleCategories(event, 0, global_buffer_filters_queries.length));

    for(let i = 0; i < info.length; i++){       
        const span = document.createElement("span");
        span.classList.add("toggle__slider");

        const btn = document.createElement("button");
        btn.classList.add("toggle");
        btn.appendChild(span);
        global_buffer_filters_categories[i + 1] = {index: i + 1, active: false, ...info[i]}
        btn.addEventListener("click", (event) => handleBtnToggleCategories(event, i + 1, global_buffer_filters_queries.length));

        const div = document.createElement("div");
        div.appendChild( btn );
        
        const version = document.createElement("p");
        version.classList.add("version-filter");

        // Parse property version. This is a particular case
        let aux_category = "";
        if(info[i].category.includes("[") && info[i].category.includes("]")){
            aux_category = info[i].category;
        }else{
            aux_category = info[i].category + " " + info[i].version;
        }
        version.appendChild( document.createTextNode( aux_category ) );
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
 
    // Search actived toggle in global_buffer_filters_categories
    const filterActived = global_buffer_filters_categories.findIndex(item => item.active === true);
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
            global_buffer_filters_categories[index].active = false; 
        });

        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
        global_buffer_filters_categories[i].active = true;
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

    // Search actived toggle in global_buffer_filters_queries
    const filterActived = global_buffer_filters_queries.findIndex(item => item.active === true);
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
            global_buffer_filters_queries[index].active = false; 
        });

        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
        global_buffer_filters_queries[i].active = true;
    }
}

/**
 * hnadle btn Apply in menu filters and get commands
 */
const handleBtnApply = (event) => {
    const filter = global_buffer_filters_categories.find(item => item.active === true);
    const query = getQueries(window.location.search);
    getCommands("/" + query.lang, query.page, filter._id, query.category);
    closeMenuFilter();
}

function init(){
    document.addEventListener("DOMContentLoaded", () => {
        getCommands("/en", 1);
        handleButtonsLanguage();
        handleInputSearch();
        handleToggleFiletrs();
        
        // Effects in style
        handleFocusInputSearch();
        handleFilters();
        handleCloseFilters();
        closeModal();
        copyInClipboardModalCommand();
        copyInClipboardModalMeaning();
    });
}

init();
