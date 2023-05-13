import dataJson from './data.json';
import { handleCloseFilters } from './effects';

/**
 * Change all words according to selected language
 * @param {string} lang 
 */
export const handleLanguages = (lang = "en") => {
    handleCloseFilters();
    const data = dataJson.content;

    // Change footer
    const copyright = document.getElementsByClassName("copyright")[0];
    copyright.textContent = data["footer"][lang];
    
    // Change search_by
    const search_by = document.getElementsByClassName("container-filters container-filters__title")[0];
    search_by.innerHTML = data["search_by"][lang];

    // Change Command && Meaning
    const command_and_meaning = document.getElementsByClassName("version-filter")[0];
    command_and_meaning.innerHTML = data["CommandsAndMeaning"][lang];

    // Change Command && Meaning
    const command = document.getElementsByClassName("version-filter")[1];
    command.innerHTML = data["Command"][lang];
    
    // Change Command && Meaning
    const meaning = document.getElementsByClassName("version-filter")[2];
    meaning.innerHTML = data["Meaning"][lang];

    // Change in menu filter categories
    const categories = document.getElementsByClassName("container-filters container-filters__title")[1];
    categories.innerHTML = data["categories"][lang];

    // Change in menu filter all
    const all = document.getElementsByClassName("version-filter")[3];
    all.innerHTML = data["all"][lang];

    // Change in menu filter text_apply
    const text_apply = document.getElementsByClassName("text_apply")[0];
    text_apply.innerHTML = data["btn_apply"][lang];

    // Change in copy clipboard copied
    const copied = document.querySelectorAll(".popover-clipboard");
    copied.forEach(item => {
        item.innerHTML = data["copied"][lang];
    });

    // Change version in footer
    const version = document.getElementsByClassName("version-app")[0];
    version.innerHTML = data["version"][lang];

    // Version 0.0.1_1
    const v_0_0_1_1 = document.getElementById("0.0.1_1");
    v_0_0_1_1.innerHTML = data["0.0.1_1"][lang];

    // Version 0.0.1_2
    const v_0_0_1_2 = document.getElementById("0.0.1_2");
    v_0_0_1_2.innerHTML = data["0.0.1_2"][lang];
}