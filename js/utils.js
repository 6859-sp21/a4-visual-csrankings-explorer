const Utils = (function(){
    function fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
    }
    return {
        fetchJson
    }
})()