export class Services{
    /**
     * @param {string} lan 
     * @param {number} page 
     * @param {string} category 
     * @param {string} command 
     * @param {string} meaning 
     * @returns Promise
     */
    static async getCommands(lan = "/en", page = 1, category = "all", command, meaning){
        let query = "";
        if(command){
            query = query + "&command=" + command;
        }else if(meaning){
            query = query + "&meaning=" + meaning;
        }
        const data = await fetch(process.env.API_URL + lan + `/?page=${page}&category=${category}${query}`)
        return data.json();
    }
}