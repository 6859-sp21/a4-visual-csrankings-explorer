const DataService = (() => {
    let authorInfo;
    let countryInfo;
    let bubbleChartData;
    let facultyInfo;
    let areasInfo;
    let years;

    async function initialize() {
        authorInfo = await Utils.fetchJson('./data/generated-author-info.json');
        countryInfo = await Utils.fetchJson('./data/country-info.json');
        facultyInfo = await Utils.fetchJson('./data/csrankings.json');
        areasInfo = await Utils.fetchJson("./data/areas.json");
        years = _generateYears(); 
    }

    function getAreas() {
        return Object.keys(areasInfo).sort();
    }

    function getFacultyInfo(name) {
        return facultyInfo[name];
    }

    function generateBubbleChartData({ selectedAreas, fromYear, toYear }) {
        const keyedUniversityInfo = {};
        authorInfo.forEach(entry => {
            const university = entry.dept;
            const venue = entry.area;
            const area = _getVenueArea({ venue });
            const venueCount = entry.count;
            const author = entry.name;
            const year = entry.year;
            if (_inYearRange({ year, fromYear, toYear }) && _isSelectedArea({ selectedAreas, area }) && _isUSUnversity(university) && area) {
                let universityEntry;
                if (keyedUniversityInfo[university]) {
                    universityEntry = keyedUniversityInfo[university];
                } else {
                    universityEntry = {
                        total: 0,
                        areas: {},
                        faculty: {}
                    };
                    keyedUniversityInfo[university] = universityEntry;
                    selectedAreas.forEach(area => {
                        universityEntry.areas[area] = 0;
                    });
                }
                universityEntry.total += venueCount;
                universityEntry.areas[area] += venueCount;
                let facultyEntry;
                if (universityEntry.faculty[author]) {
                    facultyEntry = universityEntry.faculty[author]
                } else {
                    facultyEntry = {
                        initials: author.split(" ").map(v => v[0]).join(""),
                        total: 0
                    };
                    selectedAreas.forEach(area => {
                        facultyEntry[area] = 0;
                    });
                    universityEntry.faculty[author] = facultyEntry;
                }
                universityEntry.faculty[author].total += venueCount;
                universityEntry.faculty[author][area] += venueCount;
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

        universityInfoArray.sort((a, b) => b.total - a.total )

        bubbleChartData = universityInfoArray;
        
        return universityInfoArray
    }

    function generateBarChartData({ university }) {
        const barChartData = bubbleChartData.find(x => x.name === university).faculty;
        barChartData.sort((a, b) => b.total - a.total);
        return barChartData.slice(0, 20);
    }

    function generateTimePeriod() {
        return Array.from(years).sort();
    }

    function _isUSUnversity(university) {
        return !countryInfo[university];
    }

    function _isSelectedArea({ selectedAreas, area }) {
        return selectedAreas.includes(area);
    }

    function _inYearRange({ year, fromYear, toYear }) {
        if (fromYear && toYear) {
            return year >= fromYear && year <= toYear;
        }
        return true;
    }

    function _generateYears() {
        const years = new Set([]);
        authorInfo.forEach(entry => {
            const university = entry.dept;
            const year = entry.year;
            if (_isUSUnversity(university)) {
                years.add(year);
            }
        });
        return years;    
    }

    function _getVenueArea({ venue }) {
        const areas = Object.keys(areasInfo);
        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            if (areasInfo[area].includes(venue)) {
                return area;
            }
        }
        return null;
    }

    return {
        initialize,
        getAreas,
        generateBubbleChartData,
        generateBarChartData,
        generateTimePeriod,
        getFacultyInfo
    }
})();