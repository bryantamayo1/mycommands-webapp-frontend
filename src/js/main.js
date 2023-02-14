import '../styles/normalize.css';
import '../styles/main.css';

const  handleFocusInputSearch = () => {
    const input = document.getElementsByClassName("search__input")[0];
    const search__container = document.getElementsByClassName("search__container")[0];
    
    input.addEventListener("focus", () => {
        search__container.style.boxShadow  = "0px 0px 10px 2px rgb(66, 50, 216)";
        search__container.style.outline = "1px solid blue";
    });
    input.addEventListener("blur", () => {
        search__container.style.boxShadow  = "";
        search__container.style.outline = "";
    });

}

function init(){
    document.addEventListener("DOMContentLoaded", () => {
        handleFocusInputSearch();
    });
}

init();
