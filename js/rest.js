async function getData(url = '') {
    var response = await fetch(url, {
        method: 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache'
    });
    return await response.json();
}

async function postData(url = '', data = {}) {
    var response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        body: data
    });
    return await response;
}