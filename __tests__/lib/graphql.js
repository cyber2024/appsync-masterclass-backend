const http = require('axios');
const _ = require('lodash');

const throwOnErrors = ({query, variables, errors}) => {
    // console.log({query, variables, errors})
    if(errors){
        const errorMessage = `
        query: ${query}
        
        variables: ${JSON.stringify(variables, null, 2)}
        
        error: ${JSON.stringify(errors, null, 2)}
        `
        throw new Error(errorMessage);
    }
}

module.exports = async (url, query, variables = {}, auth) => {
    const headers = {};
    console.log({query, variables})
    if(auth){
        headers.Authorization = auth;
    }

    try {
        const response = await http({
            method: 'post',
            url,
            headers,
            data: {
                query,
                variables: JSON.stringify(variables)
            }
        })
        
        const {data, errors} = response.data;
        throwOnErrors({query, variables, errors});
        return data;
    } catch (err) {
        const errors = _.get(err, 'response.data.errors');
        throwOnErrors({query, variables, errors});
        throw err;
    }
}