const Utils = (function(){
    const { DOM } = new observablehq.Library;

    function fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
    }

    return {
        fetchJson,
        DOM
    }
})()