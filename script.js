// adding event listener to every city button
document.querySelectorAll(".city").forEach(function(button) {
    button.addEventListener("click", function(event) {
        let city = event.target.innerText;
        let cityID = city.toLowerCase().replaceAll(" ", "_");

        if (cities.includes(cityID)) {
            // removing the city
            allData = allData.filter(data => data.name !== city);
            cities = cities.filter(c => c !== cityID)
            // updating graph
            updateGraph(allData);
        } else {
            // loading the data
            d3.csv(`${cityID}.csv`, formatData).then(function(d) {
                // storing the data
                allData.push({name: city, data: d});
                cities.push(cityID);
                // updating graph
                updateGraph(allData);
            });
        }
    });
});