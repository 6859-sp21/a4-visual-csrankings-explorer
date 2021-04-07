const Venues = (function() {
    let venues;
    function initialize(data) {
        venues = data;
        render();
    }

    function render() {
        const selectedVenues = document.querySelector("#selected-venues");
        selectedVenues.innerHTML = "";
        Object.keys(venues).forEach(venue => {
            const p = document.createElement('p');
            p.textContent = `[x] ${getLabel(venue)}`;
            selectedVenues.append(p);
        })
    }

    function getSelected() {
        return Object.keys(venues);
    }

    function getLabel(venue) {
        return venues[venue]
    }

    return {
        initialize,
        render,
        getSelected,
        getLabel
    }
})()