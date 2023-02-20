/**
 * Hnadle input’s focus search
 */
 export const  handleFocusInputSearch = () => {
    const input = document.getElementsByClassName("search__input")[0];
    const search__container = document.getElementsByClassName("search")[0];
    
    // Handle style css
    input.addEventListener("focus", () => {
        search__container.style.boxShadow  = "0px 0px 15px 1px #ce04a2";
        search__container.style.outline = "2px solid #ce04a2";

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
 * Open menu filters
 */
export const handleFilters = () => {
    const button_filters = document.getElementsByClassName("search__button search__button--right")[0];
    const filters = document.getElementsByClassName("filters")[0];

    button_filters.addEventListener("click", () => {   
        filters.style.display = "block";
        setTimeout(() => {
            filters.style.width = "30%";
        }, 100);
    });
}

export const closeMenuFilter = () => {
    const filters = document.getElementsByClassName("filters")[0];
    filters.style.width = 0;
    setTimeout(() => {
        filters.style.display = "none";
    }, 1000);
}

/**
 * Close menu filters
 */
export const handleCloseFilters = () => {
    const filters__btn__close = document.getElementsByClassName("filters__btn__close")[0];
    filters__btn__close.addEventListener("click", () => {   
        closeMenuFilter();
    });
}


