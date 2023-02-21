/**
 * Parse queries
 */
export const parseQuery = (buffer, input_value) => {
    // 1ª Search actived toggle in buffer_filters_queries
    const filterActived = buffer.find(item => item.active === true);
    let query = filterActived.query;
    if(input_value !== ""){
        switch (filterActived.index) {
            // &command=&meaning=
            case 0:
                const queries = filterActived.query.split("=");
                queries.pop();
                for(let i = 0; i < queries.length; i++) {
                    queries[i] = queries[i] + "="+ input_value;
                }
                return queries.join("");
            case 1:
                return query + input_value;
            case 2:
                return query + input_value;
        }
        return query;
    }else{
        return "";
    }
}