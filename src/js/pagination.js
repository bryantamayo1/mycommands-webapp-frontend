import { getCommands } from "./main";
import { getQueries } from "./utils";

/**
 * Hnadle pagination according to GET /commands
 * @param {object} data 
 */
export const handlePagination = (data) => {
    console.log("data: ", data);
    const amount_pages = Math.ceil(data.total / data.limitPage);
    const buffer_pagination = [];
    const limit_btns = 5;
    
    // Push buffer_pagination
    for(let i = 1; i <= amount_pages; i++){
        buffer_pagination.push({ active: false, page : i });
    }
    buffer_pagination[data.page - 1] = {active: true, page: data.page}
    console.log(buffer_pagination)

    createBtnPagination(amount_pages, limit_btns);

    // Paint btn active
    const btn_active = document.getElementsByClassName("btn-pagination")[data.page - 1];
    btn_active.classList.add("btn-pagination-active");

    // Put btn next
    if(amount_pages > limit_btns){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleNextPagination(event));
        btn_pagination.appendChild( document.createTextNode(">") );
        pagination_container.appendChild(btn_pagination);
    }
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
 */
const createBtnPagination = (amount_pages, limit_btns) => {
    let btn_currents = 0;

    // Clean pagination
    const pagination_container = document.querySelectorAll(".btn-pagination")
    .forEach(item => item.remove());

    // Create btns in pagination
    if(amount_pages <= limit_btns){
        btn_currents = amount_pages;
    }else{
        btn_currents = limit_btns;
    }
    for(let i = 1; i <= btn_currents; i++){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleBtnPagination(event, i) );
        btn_pagination.appendChild( document.createTextNode(i) );
        pagination_container.appendChild(btn_pagination);
    }
}

/**
 * Handle btn Next in pagination
 * @param {*} event 
 */
const handleNextPagination = (event) => {
    createBtnPagination();
}