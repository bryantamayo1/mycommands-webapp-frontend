export class Services{
    static async getCommands(lan = "/en", page = 1){
        const data = await fetch(process.env.API_URL + lan + `/?page=${page}&category=all`)
        return data.json();
    }
}