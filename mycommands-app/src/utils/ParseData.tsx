import { CategoryData } from "../interfaces/Categories";

/**
 * Return a string with his name and version together
 * @param {object} CategoryData
 * @returns string
 */
export const parseVersion = ({category, version}: CategoryData) => {
    if(category.indexOf("[") !== -1 && category.indexOf("]") !== -1){
        return category
    }else{
        return category + " " + version
    }
}