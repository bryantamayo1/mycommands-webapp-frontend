import { getCommands } from "./main";
import { getQueries } from "./utils";

// Global variables
const buffer_pagination = [];
const limit_btns = 5;

/**
 * Hnadle pagination according to GET /commands
 * @param {object} data 
 */
export const handlePagination = (data) => {
    console.log("data: ", data);
    const amount_pages = Math.ceil(data.total / data.limitPage);
    data.amount_pages = amount_pages;
    
    // Push buffer_pagination
    for(let i = 1; i <= amount_pages; i++){
        buffer_pagination.push({ active: false, page : i });
    }
    buffer_pagination[data.page - 1] = {active: true, page: data.page}
    console.log(buffer_pagination)

    createBtnPagination(amount_pages, limit_btns, data);
}

/**
 * Handle btns of pagination
 * @param {*} event 
 * @param {number} page 
 */
const handleBtnPagination = (event, indexPage) => {
    const query = getQueries(window.location.search);
    getCommands("/" + query.lang, indexPage, query.category);
}

/**
 * Clean and create btns of pagination
 * @param {number} increase
 */
const createBtnPagination = (amount_pages, limit_btns, data, increase = 0) => {
    let btn_currents = 0;
    // console.log("buffer_pagination: ", buffer_pagination);
    // console.log("data: ", data);

    // Clean pagination
    const pagination_container = document.querySelectorAll(".btn-pagination")
    .forEach(item => item.remove());
    if(!data.results){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        pagination_container.classList.add("not-visible");
        return;
    }

    // Create btns in pagination
    const rest = data.page % limit_btns;
    let indexStartPagination = 1;
    if(rest){
        indexStartPagination = data.page - rest + 1;
    }else{
        indexStartPagination = data.page - limit_btns + 1;
    }
    
    // Move pagination to other 2 btns. Better copy with classic for and not forEach
    for(let i = 0; i < buffer_pagination.length; i++){
        if(increase){
            buffer_pagination[i].page+=limit_btns;
        }
    }
    console.log("buffer_pagination: ", buffer_pagination);

    if(amount_pages <= limit_btns){
        // Show btns with according to page
        btn_currents = amount_pages;
    }else{
        // Show only 5 btns
        btn_currents = limit_btns;
    }
    for(let i = indexStartPagination - 1; i < indexStartPagination + limit_btns - 1;  i++){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleBtnPagination(event, buffer_pagination[i].page) );
        btn_pagination.appendChild( document.createTextNode( buffer_pagination[i]?.page ) );
        pagination_container.appendChild(btn_pagination);
    }

    // Paint btn active
    const btn_active = document.getElementsByClassName("btn-pagination")[data.page - 1];
    btn_active.classList.add("btn-pagination-active");

    // Put btn next
    if(amount_pages > limit_btns){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleNextPagination(event, amount_pages, limit_btns, data));
        btn_pagination.appendChild( document.createTextNode(">") );
        pagination_container.appendChild(btn_pagination);
    }
}

/**
 * Handle btn Next in pagination
 * @param {*} event 
 */
const handleNextPagination = (event, amount_pages, limit_btns, data) => {
    createBtnPagination(amount_pages, limit_btns, data, 1);
}