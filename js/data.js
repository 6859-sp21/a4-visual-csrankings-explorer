const DataService = (function(){
    let authorInfo;
    let countryInfo;
    let venueInfo;

    async function initialize() {
        authorInfo = await Utils.fetchJson('./data/generated-author-info.json');
        countryInfo = await Utils.fetchJson('./data/country-info.json');
        venueInfo = await Utils.fetchJson('./data/venue-info.json');
    }

    function getVenues() {
        return venueInfo;
    }

    function generateData() {
        const selectedVenues = Venues.getSelected();
        const keyedUniversityInfo = {};
        authorInfo.forEach(entry => {
            const university = entry.dept;
            const venue = entry.area;
            const venueCount = entry.count;
            const author = entry.name;
            if (_isSelectedVenue({ selectedVenues, venue }) && _isUSUnversity(university)) {
                let universityEntry;
                if (keyedUniversityInfo[university]) {
                    universityEntry = keyedUniversityInfo[university];
                } else {
                    universityEntry = {
                        total: 0,
                        venues: {},
                        faculty: {}
                    };
                    keyedUniversityInfo[university] = universityEntry;
                    selectedVenues.forEach(venue => {
                        universityEntry.venues[venue] = 0;
                    });
                }
                universityEntry.total += venueCount;
                universityEntry.venues[venue] += venueCount;
                let facultyEntry;
                if (universityEntry.faculty[author]) {
                    facultyEntry = universityEntry.faculty[author]
                } else {
                    facultyEntry = {
                        total: 0
                    };
                    selectedVenues.forEach(venue => {
                        facultyEntry[venue] = 0;
                    });
                    universityEntry.faculty[author] = facultyEntry;
                }
                universityEntry.faculty[author].total += venueCount;
                universityEntry.faculty[author][venue] += venueCount;
            }
        });
        const universityInfoArray = Object.keys(keyedUniversityInfo)
            .map((university) => {
                const faculty = Object.keys(keyedUniversityInfo[university].faculty)
                    .map(faculty => {
                        return {
                            name: faculty,
                            ...keyedUniversityInfo[university].faculty[faculty]
                        }
                    })
                return {
                    name: university,
                    ...keyedUniversityInfo[university],
                    faculty
                }
            });
        
        return universityInfoArray
    }

    function _isUSUnversity(university) {
        return !countryInfo[university];
    }

    function _isSelectedVenue({ selectedVenues, venue }) {
        return selectedVenues.includes(venue);
    }

    return {
        initialize,
        getVenues,
        generateData
    }
})();