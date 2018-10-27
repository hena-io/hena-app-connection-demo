export function fetchPost(apiStem, parameter) {
    return fetch(apiStem, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameter)
    })
    .then(response => response.json())
    .then(responseJson => {
        console.log('Fetch', responseJson.result, responseJson.data);
        return ({
            result: responseJson.result,
            success: (responseJson.result === 'Success'),
            data: responseJson.data
        });
    });
}