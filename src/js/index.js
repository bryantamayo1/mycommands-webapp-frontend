import '../styles/normalize.css';
import '../styles/index.css';
import '../styles/filter.css';
import '../styles/pagination.css';
import '../styles/footer.css';
import '../styles/spinner.css';
import '../styles/modal.css';
import '../styles/handleErros.css';
import { Services }         from './services';
import { closeMenuFilter, handleCloseFilters, handleFilters, handleFocusInputSearch } from './effects';
import { colorsEnum, getQueries, getQueriesCommanMeaning, parseQuery } from './utils';
import { handlePagination } from './pagination';
import { closeModal, copyInClipboardModalCommand, copyInClipboardModalMeaning, openModal } from './modal';
import { handleLanguages }  from './handleLanguages';
import dataJson             from './data.json';
import { handleErrors }     from './handleErrors';
import { activeOrDesactiveToggles, createSubCategories, template_Menu_filter } from './menuFilter';

// Global variables
// Store state of each filters
let global_buffer_filters_categories = [{index: 0, active: false, _id: "all"}];
// Get default query according to url of window.location.search
const {command: queryCommand, meaning: queryMeaning} = getQueries(window.location.search);
let global_buffer_filters_queries = [
    {category: "Command && Meaning", index: 0, active: false, query: "&command=&meaning="},
    {category: "Command", index: 1, active: false, query: "&command="},
    {category: "Meaning", index: 2, active: false, query: "&meaning="},
];
if(queryCommand && queryMeaning){
    global_buffer_filters_queries[0].active = true;
}else if(queryCommand){
    global_buffer_filters_queries[1].active = true;
}else if(queryMeaning){
    global_buffer_filters_queries[2].active = true;
}else{
    global_buffer_filters_queries[0].active = true;
}

let queryOfFirstChargePage = {};

////////////
// Functions
////////////

/**
 * Execute only one time like a React’s componentDidMount
 */
const componentDidMount = () => {
    document.addEventListener("DOMContentLoaded", () => {
        // Check category in query
        const {category, command, meaning} = getQueries(window.location.search);
        if(category) queryOfFirstChargePage.category = category;
        if(command) queryOfFirstChargePage.command = command;
        if(meaning) queryOfFirstChargePage.meaning = meaning;
    }, {once: true});
}

/**
 * Go home btn with default values.
 * Charge text of default language 'en'
 */
const goHome = () => {
    const btn_house = document.getElementById("btn-house");
    btn_house.addEventListener("click", () => {
        const input_value_direct = document.getElementsByClassName("search__input")[0];
        input_value_direct.value = "";
        const categoryAndSubCategoryToSearch = {category: "all"}
        getCommands("/en", 1, categoryAndSubCategoryToSearch, "",  false, true);
        resetFilters();

        // Charge text of default language
        handleLanguages("en");
    });
}

const getInitialQueries = () => {
    const queryObject = getQueries(window.location.search);
    const {lang, page, category} = queryObject;
    // Validations
    if(lang && page && category){
        const categoryAndSubCategoryToSearch = {category}
        getCommands("/"+lang, page, categoryAndSubCategoryToSearch, getQueriesCommanMeaning(queryObject), true);
    }else{
        const categoryAndSubCategoryToSearch = {category: "all"}
        getCommands("/en", 1, categoryAndSubCategoryToSearch, "", false, false, true);
    }
}

/**
 * Show 20 commands and create list with them.
 * Paint total commands.
 * hnadle pagination.
 * Query command and meaning is searched in host’s url
 * @param {string} lang 
 * @param {number} page 
 * @param {string} category 
 * @param {string} parameterCommandAndMeaning It comes of url, It can be exist or not
 * @param {boolean} fromQueryUrl avoid update url, true = update, false = not update
 * @param {boolean} defaultSearch search with page = 1, lang = "en" and category = "all"
 * @param {boolean} firstSearch search only when the web page is loaded the first time. It’s an unique case
 */
export const getCommands = async(lang, page, category, parameterCommandAndMeaning, fromQueryUrl, defaultSearch, firstSearch)  => {
    // Clean data
    document.querySelectorAll(".container-list")
    .forEach(item => item.remove());
    // Clean pagination
    document.querySelectorAll(".btn-pagination")
    .forEach(item => item.remove());

    // Get commands
    // Prepare queries
    // 1ª Search actived toggle in global_buffer_filters_queries
    const input_value_direct = document.getElementsByClassName("search__input")[0];

    // Set up when page is reload
    let input_value_of_url = "";
    const {command: queryCommand, meaning: queryMeaning} = getQueries(window.location.search);
    if(input_value_direct.value || !parameterCommandAndMeaning){
        input_value_of_url = input_value_direct.value;
    }else if(queryCommand && queryMeaning){
        input_value_of_url = queryCommand;
    }else if(queryCommand){
        input_value_of_url = queryCommand;
    }else if(queryMeaning){
        input_value_of_url = queryMeaning;
    }else{
        input_value_of_url = input_value_direct.value;
    }
    input_value_direct.value = input_value_of_url;
    if(defaultSearch){
        input_value_direct.value = "";
    }

    parameterCommandAndMeaning = parseQuery(global_buffer_filters_queries, input_value_direct.value);

    // Active spinner
    const spinner_container_active = document.getElementsByClassName("spinner-container")[0];
    spinner_container_active.classList.remove("not-visible");

    // Disable total numbers
    const total_numbers_active = document.getElementsByClassName("total-numbers")[0];
    total_numbers_active.classList.add("not-visible");
    
    // Delete padding by default in pagination
    const pagination_container_without_padding = document.getElementsByClassName("pagination-container")[0];
    pagination_container_without_padding.classList.add("pagination-container--padding");

    try{
        const data = await Services.getCommands(
            lang,
            page,
            category,
            parameterCommandAndMeaning,
            fromQueryUrl,
            defaultSearch,
            firstSearch
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
    
        // Show total found commands 
        showTotalCommands(data.total);
        
        // Handle pagination: create, paint selected page, ...
        handlePagination(data);
        const lang_response = data.lang;
    
        // Show data in list
        const my_container = document.getElementsByClassName("my-container")[0];
        for(let i = 0; i< data.data.length; i++){
            const container_list = document.createElement("div");
            const row_1 = document.createElement("div");
            const row_2 = document.createElement("div");
            const column_1 = document.createElement("button");
            const column_2 = document.createElement("button");
            const column_3 = document.createElement("p");
            const column_4 = document.createElement("p");
            const icon_copy = document.createElement("i");
            const icon_info = document.createElement("i");
            const span_subCategory = document.createElement("span");
    
            icon_copy.classList.add("fa-solid");
            icon_copy.classList.add("fa-copy");
            column_1.classList.add("container-icon");
            column_1.appendChild(icon_copy);
            column_1.addEventListener("click", (event) => copyClipboard(event, data.data[i].command, column_1, data.lang))
    
            icon_info.classList.add("fa-solid");
            icon_info.classList.add("fa-circle-info");
            column_2.classList.add("container-icon");
            column_2.appendChild(icon_info);
            column_2.addEventListener("click", event => openModal(event, data.data[i], data.lang));
            
            column_3.classList.add("command-text");
            column_3.appendChild( document.createTextNode(data.data[i].command) );
    
            // Chage color in character hash #
            if(data.data[i][lang_response].charAt(0) === "#"){
                const span = document.createElement("span");
                span.innerHTML = "# ";
                span.classList.add("hash-in-meaning");   
                column_4.appendChild(span);
                column_4.classList.add("command-info");
                column_4.appendChild( document.createTextNode(data.data[i][lang_response].slice(2, data.data[i].length)) );
            }else{
                column_4.appendChild( document.createTextNode(data.data[i][lang_response]) );
            }
            row_1.appendChild(column_1);
            row_1.appendChild(column_2);
            row_1.appendChild(column_3);
            row_1.appendChild(column_4);
            row_1.classList.add("list-container");

            if(data.data[i].subCategories.length > 0){
                span_subCategory.appendChild( document.createTextNode(data.data[i].subCategories[0][lang_response]) );
                span_subCategory.classList.add("list-container__row-2__subCategory");
                span_subCategory.style.backgroundImage  = colorsEnum[data.data[i].subCategories[0].color];
                row_2.classList.add("list-container__row-2");
            }
            row_2.appendChild( span_subCategory );
            
            container_list.classList.add("container-list");
            
            container_list.appendChild(row_1);
            container_list.appendChild(row_2);
            my_container.appendChild(container_list);
        }
    }finally{
        // Disable spinner
        const spinner_container_not_Active = document.getElementsByClassName("spinner-container")[0];
        spinner_container_not_Active.classList.add("not-visible");
    }
}

/**
 * Copy in clipboard a command
 * @param {event} event 
 * @param {string} command 
 * @param {NodeElement} btn 
 * @param {string} lang 
 */
const copyClipboard = (event, command, btn, lang) => {
    navigator.clipboard.writeText(command);
    // show popover with copied successfully
    const div = document.createElement("div");
    div.appendChild( document.createTextNode(dataJson.content["copied"][lang]) );
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
    total_numbers.innerHTML = t.join("") + " commands";
}

/**
 * Handle buttons language 'es' and 'es'.
 * Seach commands with selected language
 */
const handleButtonsLanguage = () => {
    const es = document.getElementById("es");
    const en = document.getElementById("en");
    
    es.addEventListener("click", () => {

        let query = window.location.search.split("");
        const lang_index = window.location.search.indexOf("lang=");
        // Change query in window.history
        if (history.pushState){
            const queryObject = getQueries(window.location.search);
            const {page, category} = queryObject;
            query.splice(lang_index + 5, 2, "e");
            query.splice(lang_index + 6, 0, "s");
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query.join("");
            window.history.pushState({path:newurl},'',newurl);

            const categoryAndSubCategoryToSearch = {category}
            getCommands("/es", page, categoryAndSubCategoryToSearch, getQueriesCommanMeaning(queryObject), true);
            handleToggleFiletrs("/es");
        }
    });
    en.addEventListener("click", () => {
        let query = window.location.search.split("");
        const lang_index = window.location.search.indexOf("lang=");
        // Change query in window.history
        if (history.pushState){
            const queryObject = getQueries(window.location.search);
            const {page, category} = queryObject;
            query.splice(lang_index + 5, 2, "e");
            query.splice(lang_index + 6, 0, "n");
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query.join("");
            window.history.pushState({path:newurl},'',newurl);

            const categoryAndSubCategoryToSearch = {category}
            getCommands("/en", page, categoryAndSubCategoryToSearch, getQueriesCommanMeaning(queryObject), true);
            handleToggleFiletrs("/en");
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
        const {lang} = getQueries(window.location.search);
        const filter = global_buffer_filters_categories.find(item => item.active === true);
        // Get input's value'
        if(event.key === "Enter"){
            // Get commands
            const categoryAndSubCategoryToSearch = {category: filter._id}
            getCommands("/"+lang, 1, categoryAndSubCategoryToSearch, input.value);
        }
    });
    button.addEventListener("click", () => {
        const {lang} = getQueries(window.location.search);
        let filter = global_buffer_filters_categories.find(item => item.active === true);
        // Search active filter
        const categoryAndSubCategoryToSearch = {category: filter._id}
        getCommands("/"+lang, 1, categoryAndSubCategoryToSearch, input.value);
    });
}

/**
 * Handle toggles filters, create and handle elements
 * Besides, add btn apply
 */
const handleToggleFiletrs = async(lang = "/en") => {
    // Reset menu filter
    const filters_base = document.getElementsByClassName("filters")[0];
    filters_base.innerHTML = template_Menu_filter;

    const filters = document.getElementsByClassName("filters")[0];
    const data = await Services.getFilters(lang);
    const info = data.data;

    /**
     * Push filters of 'Search by: 
     *      - Command && Meaning
     *      - Command
     *      - Meaning
     */
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

    // Put active toggle. By default 'Commands && Meaning'
    const filterSearchBy = global_buffer_filters_queries.map(i => i.active).findIndex(i => i === true);
    const btn_command_meaning = document.getElementsByClassName("toggle")[filterSearchBy];
    btn_command_meaning.classList.add("toggle-active");
    const span_command_meaning = document.getElementsByClassName("toggle__slider")[filterSearchBy];
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
    // title_categories.appendChild( document.createTextNode("Categories") );
    const bar_separated = document.getElementsByClassName("bar-separated")[0];
    bar_separated.after(title_categories);

    // Hnadle btn 
    const btn = document.getElementById("id-btn-all");
    const circle = document.getElementById("id-span-all");
    btn.addEventListener("click", event => handleBtnToggleCategories(event, 0, global_buffer_filters_queries.length));

    // Buildind toggles with Categories
    for(let i = 0; i < info.length; i++){  
        const category = info[i];
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
        version.id = info[i]._id;

        // Parse property version. This is a particular case
        let aux_category = "";
        if(info[i].category.includes("[") && info[i].category.includes("]")){
            aux_category = info[i].category.replace(/[\[\]]/g, '');
        }else{
            aux_category = info[i].category + " " + info[i].version;
        }
        version.appendChild( document.createTextNode( aux_category ) );
        div.appendChild( version );

        if(category.subCategories?.length > 0){
            createSubCategories(div, category, lang);
        }else{
            div.classList.add("toggle-container");
        }
        div.classList.add("container-filters");

        filters.appendChild(div);
    }

    
    // Active btn and put style enabled according to category which is in query. 
    // Only it works first time in load page
    if(queryOfFirstChargePage.category){
        const indexCategory = global_buffer_filters_categories.map(i => i._id).findIndex(i => i === queryOfFirstChargePage.category);
        if(indexCategory !== -1){
            global_buffer_filters_categories[indexCategory] = {...global_buffer_filters_categories[indexCategory], active: true}
            // Apply styles
            // 1º Find btn toggle according to category query
            const bufferWithToggles = document.querySelectorAll(".version-filter");
            let indexFoundCategory = 0;
            bufferWithToggles.forEach((item, indexSelectedCategory) => {
                if(item.id === global_buffer_filters_categories[indexCategory]._id){
                    indexFoundCategory = indexSelectedCategory;
                }
            });
            const btnIndexFoundCategory = document.getElementsByClassName("toggle")[indexFoundCategory];
            const toggle__slider = document.getElementsByClassName("toggle__slider")[indexFoundCategory];;
            if(btnIndexFoundCategory){
                btnIndexFoundCategory.classList.add("toggle-active");
                toggle__slider.classList.add("toggle__slider--move-to-right");
            }
        }else{
            // Push first category All
            global_buffer_filters_categories[0] = {index: 0, active: true, _id: "all"}
            btn.classList.add("toggle-active");
            circle.classList.add("toggle__slider--move-to-right");
        }
    }else{
        // Push first category All
        global_buffer_filters_categories[0] = {index: 0, active: true, _id: "all"}
        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");
    }
    // Create btn to apply filters
    const text_apply = document.createElement("p");
    text_apply.classList.add("text_apply");
    // text_apply.appendChild( document.createTextNode("Apply")  );

    const btn_apply = document.createElement("button");
    btn_apply.addEventListener("click", handleBtnApply);
    btn_apply.classList.add("btn_apply");
    btn_apply.appendChild(text_apply);
    
    const btn_apply_container = document.createElement("div");
    btn_apply_container.classList.add("btn-apply-container");
    btn_apply_container.appendChild(btn_apply);

    filters.appendChild(btn_apply_container);

    // Charge text of default language
    handleLanguages(lang.split("").splice(1).join(""));
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
    const filterActived = global_buffer_filters_categories.map(i => i.active).findIndex(item => item === true);
    if(i === filterActived){
        return;
    }else{
        // Clean all properties father
        global_buffer_filters_categories.forEach(j => {
            j.subCategories?.forEach(k => {
                k.father = false;
            })
        });

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
        
        // Active btn and put style disabled
        btn_filter.forEach( (item, index) => {
            item.classList.remove("toggle-active");
            toggle__slider[index].classList.remove("toggle__slider--move-to-right");
            global_buffer_filters_categories[index].active = false; 
        });

        global_buffer_filters_categories[i].active = true;
        btn.classList.add("toggle-active");
        circle.classList.add("toggle__slider--move-to-right");

        // Only assign father = true when the father has subCategories
        global_buffer_filters_categories[i].subCategories?.forEach(subCategory => {
            subCategory.father = true;
        });
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
 * Handle click on btn Apply in menu filters and get commands
 */
const handleBtnApply = (event) => {
    console.log("global_buffer_filters_categories: ", global_buffer_filters_categories);
    const filter = global_buffer_filters_categories.find(item => item.active);
    const subCategories = filter.subCategories?.find(item => item.active);
    let subCategory = "";
    if(subCategories) subCategory = subCategories._id;
    const query = getQueries(window.location.search);
    const findFilterQuery = global_buffer_filters_queries.find(item => item.active);

    // Create category and subCategory to search
    const categoryAndSubCategoryToSearch = {category: filter._id, subCategory}
    getCommands("/" + query.lang, 1, categoryAndSubCategoryToSearch, findFilterQuery.category);
    closeMenuFilter();
}

const handleCHangesUrl = () => {
    window.onpopstate = function(){
        const queryObject = getQueries(window.location.search);
        const {page, lang, category} = queryObject;
        const categoryAndSubCategoryToSearch = {category}
        getCommands("/"+lang, page, categoryAndSubCategoryToSearch, getQueriesCommanMeaning(queryObject), true);
    }
}

/**
 * Reset filters with default options
 */
const resetFilters = () => {
    // Reset queries
    global_buffer_filters_queries = global_buffer_filters_queries.map(( item, index) => {
        if(index === 0){
            return {...item, active: true}
        }else{
            return {...item, active: false}
        }
    });

    /**
     * Reset categories and subCategories. And put first item as actived by default
     * inside categories and subCategories
     */
    global_buffer_filters_categories = global_buffer_filters_categories.map(( item, index) => {
        const subCategories = item.subCategories;
        if(subCategories?.length > 0){
            item.subCategories = subCategories.map((c, i) => {
                if(i === 0) return {...c, active: true}
                return {...c, active: false}
            });
        }
        if(index === 0){
            return {...item, active: true}
        }else{
            return {...item, active: false}
        }
    });

    // Change style of toggles by default
    const all_togggles = document.querySelectorAll(".toggle");
    all_togggles.forEach(item => {
        item.classList.remove("toggle-active");
    });
    const toggle__slider = document.querySelectorAll(".toggle__slider");
    toggle__slider.forEach(item => {
        item.classList.remove("toggle__slider--move-to-right");
    });

    // Active toggle by default Search by Command && Meaning and Categories All
    const btn_commands_meaning = document.getElementsByClassName("toggle")[0];
    const span__toggle__slider = document.getElementsByClassName("toggle__slider")[0];
    const btn_all = document.getElementById("id-btn-all");
    const btn_span = document.getElementById("id-span-all");
    
    btn_all.classList.add("toggle-active");
    btn_commands_meaning.classList.add("toggle-active");
    
    span__toggle__slider.classList.add("toggle__slider--move-to-right");
    btn_span.classList.add("toggle__slider--move-to-right");

    // Active toggle by default in subCategories
    global_buffer_filters_categories.forEach(p => {
        if(p.subCategories?.length > 0){
            activeOrDesactiveToggles(p.subCategories, 0);
        }
    });
}

/**
 * First function in executing
 */
function init(){
    componentDidMount();
    handleErrors();
    document.addEventListener("DOMContentLoaded", () => {
        goHome();
        getInitialQueries();
        handleButtonsLanguage();
        handleInputSearch();
        handleToggleFiletrs();
        handleCHangesUrl();
        
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
