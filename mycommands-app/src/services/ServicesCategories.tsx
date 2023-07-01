import { Api } from "../api/Api";
import { InterfaceCreateCategory, InterfaceGetFilters } from "../interfaces/Categories";

export abstract class ServicesCategories{
    static getCategories(){
        return Api.get<InterfaceGetFilters>("/filters/en");
    }

    static createCategory(body: any){
        return Api.post<InterfaceCreateCategory>("/filters", body);
    }

    static editCategory(id: string, body: any){
        return Api.patch<InterfaceCreateCategory>("/filters/" + id, body);
    }

    static deleteCategory(id: string){
        return Api.delete<InterfaceCreateCategory>("/filters/" + id);
    }
}