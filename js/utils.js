const Utils = (() => {
    const { DOM } = new observablehq.Library;
    const Colors = {
        GREY: "#262626",
        BLACK: "black",
        WHITE: "white"
    }

    function fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
    }



    return {
        fetchJson,
        DOM,
        Colors
    }
})()