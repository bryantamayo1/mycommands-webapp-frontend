export interface InterfaceGetFilters {
    status:        string;
    lang:          string;
    totalCommands: number;
    results:       number;
    data:          CategoryData[];
}

export interface CategoryData {
    category:       string;
    subCategories?: SubCategory[];
    version:        string;
    createdAt:        string;
    updatedAt:        string;
    results:        number;
    _id:            string;
}

export interface SubCategory {
    en:    string;
    color: string;
    _id:   string;
}
