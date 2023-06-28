import { Api } from "../api/Api";
import { InterfaceCommands } from "../interfaces/Commands";

export abstract class ServicesCommands{
    static getCommands(){
        return Api.get<InterfaceCommands>("/commands/en?page=1&category=all");
    }
}