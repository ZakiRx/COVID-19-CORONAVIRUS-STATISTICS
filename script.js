console.log(localStorage.getItem("country"))
if (localStorage.getItem("country") == null) {
    var countrySelected = "Morocco"; //My Country :) ;)
} else {
    var countrySelected = localStorage.getItem("country");
}
startApi();

function changeCountry() {
    var e = document.getElementById("country");
    countrySelected = e.options[e.selectedIndex].value;
    localStorage.setItem("country", countrySelected);
    location.reload();
    startApi();
}

function startApi() {
    //First API Get All  Statistics Days

    var country = document.getElementById("country");
    var settings2 = {
        async: true,
        crossDomain: true,
        url: "https://pomber.github.io/covid19/timeseries.json",
        method: "GET"
    };

    var dates = []; //Create Table to set Date Corona Country
    var dataC = []; //Create Table to set confirmed Corona in country selected
    $.ajax(settings2).done(function (response) {
        for (let i = 0; i < response[countrySelected].length; i++) {
            dates.push(response[countrySelected][i].date);
            dataC.push(response[countrySelected][i].confirmed);
        }
    });

    //Seconde API For Statistics Real-time
    var settings = {
        async: true,
        crossDomain: true,
        url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
        method: "GET",
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "8e52a5d66dmsh6ca59f3b14a33a0p1fb12ajsn937494676904"
        }
    };

    $.ajax(settings).done(function (response) {
        var newRes = JSON.parse(response);
        console.log(newRes.countries_stat);
        dates.push("Now"); //Add Latest Date Corona Confirmed

        //Fill Table
        $("#bootstrap-data-table").DataTable({
            data: newRes.countries_stat,
            columns: [{
                    data: "country_name"
                },
                {
                    data: "cases"
                },
                {
                    data: "deaths"
                },
                {
                    data: "total_recovered"
                },
                {
                    data: "new_deaths"
                },
                {
                    data: "new_cases"
                }
            ]
        });

        for (let i = 0; i < newRes.countries_stat.length; i++) {
            //Fill dropDown Country
            var option = document.createElement("option");
            option.textContent = newRes.countries_stat[i].country_name;
            option.value = newRes.countries_stat[i].country_name;
            country.appendChild(option);
            if (newRes.countries_stat[i].country_name == countrySelected) {
                dataC.push(newRes.countries_stat[i].cases); //Add Latest Corona Confirmed to table (Real Time)

                confirmed = newRes.countries_stat[i].cases.replace(",", "");
                deaths = newRes.countries_stat[i].deaths.replace(",", "");
                recovered = newRes.countries_stat[i].total_recovered.replace(
                    ",",
                    ""
                );
            }
        }

        document.getElementById("Confirmed-s").textContent = confirmed;
        document.getElementById("death-s").textContent = deaths;
        document.getElementById("recovered-s").textContent = recovered;

        var ctx = document.getElementById("lineChart");
        new Chart(document.getElementById("lineChart"), {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    data: dataC,
                    label: "Confirmed",
                    borderColor: "#3e95cd",
                    fill: true
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Coronavirus Statistics (in " + countrySelected + ")"
                }
            }
        });
        var ctx2 = document.getElementById("circleChart");
        var myChart2 = new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: ["deaths", "confirmed", "recovered"],
                datasets: [{
                    label: "# of Tomatoes",
                    data: [deaths, confirmed, recovered],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 175, 226, 0.2)",
                        "rgba(75, 192, 192, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255,99,132,1)",
                        "rgba(68, 175, 226, 1)",
                        "rgba(75, 192, 192, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                //cutoutPercentage: 40,
                responsive: true
            }
        });
    });
}