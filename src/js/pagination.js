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
    
    // Push buffer_pagination, because this function is called several times
    if(!buffer_pagination.length){
        for(let i = 1; i <= limit_btns; i++){
            buffer_pagination.push({ active: false, page: i });
        }
        buffer_pagination[data.page - 1] = {active: true, page: data.page}
    }
    console.log(buffer_pagination)

    createBtnPagination(amount_pages, limit_btns, data);
}

/**
 * Clean and create btns of pagination
 * @param {number} increase
 */
const createBtnPagination = (amount_pages, limit_btns, data, increase = 0) => {
    // Clean pagination
    document.querySelectorAll(".btn-pagination")
    .forEach(item => item.remove());
    const pagination_container_aux = document.getElementsByClassName("pagination-container")[0];
    if(!data.results){
        pagination_container_aux.classList.add("not-visible");
        return;
    }else{
        pagination_container_aux.classList.remove("not-visible");
    }

    // Create btns in pagination
    const rest = data.page % limit_btns;
    let indexStartPagination = 1;
    if(rest){
        indexStartPagination = data.page - rest + 1;
    }else{
        indexStartPagination = data.page - limit_btns + 1;
    }
    
    // Move pagination to other 5 btns. Better copy with classic for and not forEach
    buffer_pagination.forEach(item => {
        if(increase === 1){
            item.page+=limit_btns;
        }else if(increase === -1){
            item.page-=limit_btns;
        }
    });

    // Calculate limite of pages inn pagination
    let limit_buffer_pagination = 5;
    console.log("buffer_pagination v2: ", buffer_pagination);
    console.log("amount_pages: ", data.amount_pages);
    let find_limit_n_buffer_pagination = buffer_pagination.map(i => i.page).indexOf(data.amount_pages);
    console.log("find_limit_n_buffer_pagination: ", find_limit_n_buffer_pagination)
    if(find_limit_n_buffer_pagination === -1){
        find_limit_n_buffer_pagination = limit_buffer_pagination;
    }

    for(let i = 0; i < find_limit_n_buffer_pagination;  i++){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleBtnPagination(event, buffer_pagination[i].page) );
        btn_pagination.appendChild( document.createTextNode( buffer_pagination[i]?.page ) );
        pagination_container.appendChild(btn_pagination);
    }

    // Paint btn active
    // const btn_active = document.getElementsByClassName("btn-pagination")[data.page - 1];
    // btn_active.classList.add("btn-pagination-active");
    const btns_pagination_calcule_active = document.querySelectorAll(".btn-pagination");
    btns_pagination_calcule_active.forEach(item => {
        if(item.innerHTML === ""+data.page){
            item.classList.add("btn-pagination-active");
        }
    });
    buffer_pagination.forEach(item => {
        item.active = false;
        if(item.page === data.page){
            item.active = true;
        }
    });

    // Put btn next
    if(amount_pages > limit_btns){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleNextPagination(event, amount_pages, limit_btns, data, 1));
        btn_pagination.appendChild( document.createTextNode(">") );
        pagination_container.appendChild(btn_pagination);
    }
    
    // Put btn before
    if(buffer_pagination[0].page !== 1){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination_first = document.getElementsByClassName("btn-pagination")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", event => handleNextPagination(event, amount_pages, limit_btns, data, -1));
        btn_pagination.appendChild( document.createTextNode("<") );
        pagination_container.insertBefore(btn_pagination, btn_pagination_first);
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
 * Handle btn Next in pagination
 * @param {*} event 
 */
const handleNextPagination = (event, amount_pages, limit_btns, data, index_to_move) => {
    // 1º Clean buffer
    buffer_pagination.forEach(item => item.active = false);
    createBtnPagination(amount_pages, limit_btns, data, index_to_move);
}