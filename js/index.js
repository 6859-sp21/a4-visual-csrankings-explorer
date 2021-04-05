(async function(){
    await DataService.initialize();
    const selectedVenues = DataService.getSelectedVenues();
    const data = DataService.generateData({ selectedVenues });
    console.log(data);
})()