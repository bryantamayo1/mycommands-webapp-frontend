import { Api } from "../api/Api";
import { InterfaceCommands } from "../interfaces/Commands";

export abstract class ServicesCommands{
    static getCommands(query: any){
        
        let path =
        "/commands/en?page=" + query.page + 
        "&category=" + query.category;

        if(query.subcategory) path += "&subcategory=" + query.subcategory;

        if(query.command && query.meaning){
            path += "&command=" + query.command;
            path += "&meaning=" + query.meaning;
        }else if(query.command ){
            path += "&command=" + query.command;
        }else if(query.meaning){
            path += "&meaning=" + query.meaning;
        }
        return Api.get<InterfaceCommands>(path);
    }
}