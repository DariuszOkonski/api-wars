export const data_handler = {
    _data: {

    },
    _api_get: function (url, callback) {
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(err => console.log("ERR: ", err))
    },
    updateResidents(url, callback) {
        this._api_get(url, (data) => {
            callback(data);
        });
    },
};