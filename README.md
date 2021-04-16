# Blind CSRankings.org
Explore the CSRankings.org dataset, US universities ranked by the numberof academic publications of faculty, without seeing the names of the universities and faculty! The goal is to remove the bias towards brand name universities and famous faculty and focus the exploration process on the research output of universities and their faculty.

Universites are visualized with a bubble chart, with each bubble (a university) sized by the number of publications of its faculty in the selected research areas and specified time period. In line with the theme of blind exploration, the selected research area (checkboxes on the left) when the page is loaded is picked randomly everytime. The time period is set to 5 fives before the current year to the current year as most users will likely be most interested in recent data.

Hovering over a bubble will highlight it and reveal a tooltip that shows the number of publications, in the selected area(s) and specified time period, of the associated university and a nudge to click on it for more details. Clicking on a bubble creates a bar chart to its right that shows anonymized faculty by publications in selected areas in the specified time period. In a similar vein, hovering over a bar will highlight it and reveal a tooltip with the number of publications of the associated faculty number and nudge to click on it to visit the faculty members website which will contain their name and university affliation.

To summarize, the key interaction points of Blind CSRankings.org are:
- Checkboxes  which determine what research areas to include in the visualized set of publications
- Dropdowns which determine what years to the visualized set of publications should span
- A bublble chart visualizing universityes sized by the publications of their faculty in the selected research areas and specified time period
- A bar chart visualizing faculty sized by their publications in the selected research areas and specified time period
- Toolips on both the bubble and bar charts to provide additional information and nudge user behavior

I considered using a tree map instead of a bubble chart because I initially wanted to include animations as the checkboxes and dropdowns were used but realized that bubble charts built from circle packing don't easily lend themselves to animations that make sense and add value. Another thought I had was to use a nested bubble chart to visualize a universities and faculty members but decided that that would require zooming into a bubble which would lose the view of the overal picture.

I worked as a team of one which means that I built this visualization by myself from start to finish. It was definitely challenging, especially once I got to the animation features of D3. I was able to generate animitations for the bubble and bar charts but excluded them from the final submission because I felt that they were hard to follow and did not add value. 

The dataset used in this visualization was obtained from the CSRankings.org github page. The research area data (on the left in my visualization) was not available in the form that I needed it so I recreated it manually by inspecting the website's HTML:

https://github.com/emeryberger/CSrankings

The code for the bubble and bar charts was obtained from Mike Bostock's tutorials on observablehq.com:
- https://observablehq.com/@d3/bubble-chart
- https://observablehq.com/@d3/horizontal-bar-chart

