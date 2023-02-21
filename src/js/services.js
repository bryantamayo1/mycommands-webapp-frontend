/**
 * Endpoints
 */
export class Services{
    /**
     * Get commands and change query in url of host
     * @param {string} lang is always '/es' or '/en'
     * @param {number} page 
     * @param {string} category 
     * @param {string} command 
     * @param {string} meaning 
     * @returns Promise
     */
    static async getCommands(lang = "/en", page = 1, category = "all", commandAndMeaning){
        // Update query in window.history
        if (history.pushState) {
            let newurl = window.location.protocol + "//" + window.location.host +
            `?page=${page}&lang=${lang.slice(1, lang.length)}&category=${category}${commandAndMeaning}`;
            window.history.pushState({path:newurl},'',newurl);
        }

        let query = "";
        if(commandAndMeaning){
            query = commandAndMeaning;
        }
        const data = await fetch(process.env.API_URL + "/commands" + lang + `/?page=${page}&category=${category}${query}`)
        return data.json();
    }

    /**
     * Get all filters
     */
    static async getFilters(){
        const data = await fetch(process.env.API_URL + "/filters")
        return data.json();
    }
}