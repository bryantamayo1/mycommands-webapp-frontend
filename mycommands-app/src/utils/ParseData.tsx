import { CategoryData } from "../interfaces/Categories";

export const parseVersion = ({category, version}: CategoryData) => {
    if(category.indexOf("[") !== -1 && category.indexOf("]") !== -1){
        return category
    }else{
        return category + " " + version
    }
}