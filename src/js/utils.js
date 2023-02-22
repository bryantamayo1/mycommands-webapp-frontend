/**
 * Parse queries
 */
export const parseQuery = (buffer, input_value) => {
    // 1ª Search actived toggle in global_buffer_filters_queries
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

/**
 * Parse string query to object with queries
 * @param {string} queryString e.g. ?numero=1&empresa=c&fin=30&pec=1&total=2&estado=3&fecha=fecha&inicio=inicio
 * @returns {Object} object with queries
 */
 export const getQueries = (queryString) => {
    const query = new URLSearchParams(queryString);
    const queryAux = {}
    query.forEach(function(value, key) {
        queryAux[key] = value;
    });
    return queryAux;
}
