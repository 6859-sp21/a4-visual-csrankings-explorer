const TimePeriod = (function(){
    let years;
    function initialize(data) {
        years = data;
        render();
    }
    function render() {
        const timePeriod = document.querySelector("#time-period");
        timePeriod.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = `From ${years[0]} to ${years[years.length - 1]}`;
        timePeriod.append(p);
    }
    return {
        initialize,
        render
    }
})();