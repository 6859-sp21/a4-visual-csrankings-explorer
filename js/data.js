const DataService = (function(){
    let authorInfo;
    let countryInfo;
    let venueInfo;

    async function initialize() {
        authorInfo = await Utils.fetchJson('/data/generated-author-info.json');
        countryInfo = await Utils.fetchJson('/data/country-info.json');
        venueInfo = await Utils.fetchJson('/data/venue-info.json');
    }

    function getSelectedVenues() {
        return Object.keys(venueInfo);
    }

    function generateData({ selectedVenues }) {
        const universityInfo = {};
        authorInfo.forEach(entry => {
            const university = entry.dept;
            const venue = entry.area;
            const venueCount = entry.count;
            const author = entry.name;
            if (_isSelectedVenue({ selectedVenues, venue }) && _isUSUnversity(university)) {
                let universityEntry;
                if (universityInfo[university]) {
                    universityEntry = universityInfo[university];
                } else {
                    universityEntry = {
                        publications: 0,
                        faculty: {}
                    };
                    universityInfo[university] = universityEntry
                }
                universityEntry.publications += venueCount;
                let facultyEntry;
                if (universityEntry.faculty[author]) {
                    facultyEntry = universityEntry.faculty[author]
                } else {
                    facultyEntry = {
                        publications: 0,
                        venues: {}
                    };
                    selectedVenues.forEach(venue => {
                        facultyEntry.venues[venue] = 0;
                    });
                    universityEntry.faculty[author] = facultyEntry;
                }
                universityEntry.faculty[author].publications += venueCount;
                universityEntry.faculty[author].venues[venue] += venueCount;
            }
        });
        return universityInfo;
    }

    function _isUSUnversity(university) {
        return !countryInfo[university];
    }

    function _isSelectedVenue({ selectedVenues, venue }) {
        return selectedVenues.includes(venue);
    }

    return {
        initialize,
        getSelectedVenues,
        generateData
    }
})();