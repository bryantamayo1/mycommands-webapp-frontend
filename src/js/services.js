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
    static async getCommands(lang = "/en", page = 1, category = "all", commandAndMeaning, fromQueryUrl, defaultSearch, firstSearch){
        // Unique case, only it’s executed when the web page is loaded the first time
        if(firstSearch){
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${category}`;
            window.history.replaceState({path:newurl},'',newurl);

        // Update query in window.history
        }else if (history.pushState && !fromQueryUrl && !defaultSearch) {
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${category}${commandAndMeaning}`;
            window.history.pushState({path:newurl},'',newurl);
        }

        // Create query
        let query = "";
        if(commandAndMeaning){
            query = commandAndMeaning;
        }

        if(history.pushState && defaultSearch){
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${category}`;
            window.history.pushState({path:newurl},'',newurl);
            query = "";
        }


        return Api("/commands" + lang, `?page=${page}&category=${category}${query}` );
    }

    /**
     * Get all filters
     */
    static getFilters(){
        return Api("/filters");
    }
}