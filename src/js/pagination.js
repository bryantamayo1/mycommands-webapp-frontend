/**
 * Hnadle pagination according to GET /commands
 * @param {object} data 
 */
export const handlePagination = (data) => {
    const amount_pages = Math.ceil(data.total / data.limitPage);
    const buffer_pagination = [];
    const limit_btns = 5;
    
    // Push buffer_pagination
    for(let i = 1; i < limit_btns + 1; i++){
        buffer_pagination.push({ active: false, page : i });
    }
    buffer_pagination[data.page - 1] = {active: true, page: data.page}
    console.log(buffer_pagination)

    // Create btns in pagination
    for(let i = 1; i < limit_btns + 1; i++){
        const pagination_container = document.getElementsByClassName("pagination-container")[0];
        const btn_pagination = document.createElement('button');
        btn_pagination.classList.add("btn-pagination");
        btn_pagination.addEventListener("click", () => {console.log( window.location )})
        btn_pagination.appendChild( document.createTextNode(i) );
        pagination_container.appendChild(btn_pagination);
    }

    // Paint btn active
    const btn_active = document.getElementsByClassName("btn-pagination")[data.page - 1];
    btn_active.classList.add("btn-pagination-active");
}