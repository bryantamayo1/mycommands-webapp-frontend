/**
 * Hnadler of all endpoints
 * @param {string} endpoint e.g. '/filters'
 * @returns Promise
 */
const Api = async (endpoint = "", query = "") => {
    const data = await fetch(process.env.API_URL + endpoint + query);
    if(data.ok){
        return data.json();
    }else{
        const resp = await data.json(); 
        throw resp.message;
    }
}
/**
 * Endpoints
 */
export class Services{
    /**
     * Get commands and change query in url of host
     * @param {string} lang is always '/es' or '/en'
     * @param {number} page 
     * @param {string} category 
     * @param {string} commandAndMeaning 
     * @param {boolean} fromQueryUrl avoid update url, false = update, true = not update
     * @param {boolean} defaultSearch search with page = 1, lang = "en" and category = "all"
     * @returns Promise
     */
    static async getCommands(lang = "/en", page = 1, categoryAndSubCategoryToSearch = {category: "all"}, commandAndMeaning, fromQueryUrl, defaultSearch, firstSearch){
        const subCategory = categoryAndSubCategoryToSearch.subCategory;
        let urlToSearch = "";
        // Unique case, only it’s executed when the web page is loaded the first time
        if(firstSearch){
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${categoryAndSubCategoryToSearch.category}`;
            if(subCategory && subCategory !== "all") newurl += "&subcategory=" + categoryAndSubCategoryToSearch.subCategory;
            window.history.replaceState({path:newurl},'',newurl);

        // Update query in window.history
        }else if (history.pushState && !fromQueryUrl && !defaultSearch) {
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${categoryAndSubCategoryToSearch.category}${commandAndMeaning}`;
            if(subCategory && subCategory !== "all") newurl += "&subcategory=" + categoryAndSubCategoryToSearch.subCategory;
            window.history.pushState({path:newurl},'',newurl);
        }

        // Create query
        let query = "";
        if(commandAndMeaning){
            query = commandAndMeaning;
        }

        if(history.pushState && defaultSearch){
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${categoryAndSubCategoryToSearch.category}`;
            if(subCategory && subCategory !== "all") newurl += "&subcategory=" + categoryAndSubCategoryToSearch.subCategory;
            window.history.pushState({path:newurl},'',newurl);
            query = "";
        }

        urlToSearch = `/commands${lang}?page=${page}&category=${categoryAndSubCategoryToSearch.category}${query}`;
        if(subCategory && subCategory !== "all") urlToSearch += "&subcategory=" + categoryAndSubCategoryToSearch.subCategory;
        return Api(urlToSearch);
    }

    /**
     * Get all filters
     */
    static getFilters(lang = "/en"){
        return Api("/filters"+lang);
    }
}