function httpGetRequest (saddress, callback, options) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = true;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (typeof callback == 'function') {
                callback(xmlHttp.responseText, options);
            }
        }

        else if (xmlHttp.status == 500 && options && options.onServerCallError && typeof options.onServerCallError == 'function') {
            options.onServerCallError();
        }
    }

    // True for asynchronous
    xmlHttp.open("GET", saddress, true);
    xmlHttp.send(null);
}

function httpPostRequest(saddress, callback, options) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = true;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (typeof callback == 'function') {
                callback(xmlHttp.responseText, options);
            }
        }

        else if (xmlHttp.status == 500 && options && options.onServerCallError && typeof options.onServerCallError == 'function') {
            options.onServerCallError();
        }
    }

    xmlHttp.open("POST", saddress, "/json-handler", true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(options.data));
}
