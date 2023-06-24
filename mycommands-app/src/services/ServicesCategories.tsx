import { Api } from "../api/Api";
import { InterfaceGetFilters } from "../interfaces/Categories";

export abstract class ServicesCategories{
    static getCategories(){
        return Api.get<InterfaceGetFilters>("/filters/en");
    }
}