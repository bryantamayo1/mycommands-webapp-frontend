// Generated by https://quicktype.io

export interface InterfaceCommands {
    status:         string;
    total:          number;
    resultsForPage: number;
    page:           number;
    pages:           number;
    limitPage:      number;
    lang:           string;
    data:           CommandData[];
}

export interface SubCategory {
    _id:   string;
    en:    string;
    color: string;
    found: boolean;
}

export interface CommandData {
    command:       string;
    subCategories: SubCategory[];
    language:      Language;
    updatedAt:     string;
    en:            string;
    es:            string;
    _id:           string;
    active?:       boolean,
    categoryFather: CategoryFather
}

export interface CategoryFather {
    category:      string;
    version:       string;
    _id:           string;
}

export enum Language {
    Bash = "bash",
    Git = "git",
    JS = "js",
    SQL = "sql",
}