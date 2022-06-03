// integrating elements from html
var citySearchInput = $("city-search");
var citySearchButton = $("city-search-button");
var searchHistoryList = $("#search-history-list");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#current-Temperature")
var currentWindSpeed = $("#current-WindSpeed");
var currentHumidity = $("#current-Humidity");
var currentUVIndex = $("#current-UVIndex");
var weather = $("#weather");

// OpenWeather API key
var APIkey = "3fdde447036153404c03c29fb68bf330";

// open city array
var cityArray = [];

// get the current date and the display in the title
var currentDate = moment().format("L");
$("current-date").text("(" + currentDate + ")");

// check the search history when the page loads
initializeHistory();
showClearHistory();


// when the search button is clicked this will add the value to the search history
citySearchButton.on("click", function(event) {
    event.preventDefault();

    // grabbing saved value from the search bar
    var searchBarValue = citySearchInput.val();

    currentConditionsRequest(searchBarValue)
    searchHistory(searchBarValue);
    citySearchInput.val("");
})

// however, this does the same thing but when hitting enter on your keyboard 
$(document).on("submit", function() {
    // this stops the page from refreshing
    event.preventDefault();

    // this saves the value put inside the search bar
    var searchBarValue = citySearchInput.val();

    currentConditionsRequest(searchBarValue)
    searchHistory(searchBarValue);
    citySearchInput.val("");
});

// when you click the Clear History button.. 
clearHistoryButton.on("click", function() {
    
    // this clears the city list history array
    cityArray = [];
    // this updates the city list history in the local storage, which is now cleared
    listArray();

    $(this).addClass("hide");
});

searchHistoryList.on("click", "li.city-btn", function(event) {
    var value = $(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value);
});


// this function will request open weather api based on the user input
function currentConditionsRequest(searchBarValue) {

    // grabs the url for call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + APIkey;

    // fetch OpenWeatherAPI data (hard part)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        

        var coordinates = "lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIkey;
        fetch("https://api.openweathermap.org/data/2.5/onecall?" + coordinates)
        .then(function (response) {
            return response.json();
        });

        // Code goes here



// function that saves and displays the city search history
function searchHistory(searchBarValue) {
    
    // when characters are put into the search bar
    if (searchBarValue) {
        // this places the value into the city array, and checks if it's a new value
        if (cityArray.indexOf(searchBarValue) === -1) {
            cityArray.push(searchBarValue);

            // this lists the city array and all from the history
            listArray();
            clearHistoryButton.removeClass("hide");
            weather.removeClass("hide");

        } else {
            // ifthe value isn't new, this removes the value from the array..
            var removeFromHistory = cityArray.indexOf(searchBarValue);
            cityArray.splice(removeFromHistory, 1);
            cityArray.push(searchBarValue);

            // and this adds the value to the array again, keeping it in the search history list
            listArray();
            cityArray.splice(removeFromHistory, 1);
            cityArray.push(searchBarValue);
        }
    }
}

// this function shows the array for the search history on the sidebar
function listArray() {
    searchHistoryList.empty();

    cityArray.forEach(function(city) {
        var searchHistoryObject = $('<li class = "list-group-item city-btn">');
        searchHistoryObject.attr("data-value", city);
        searchHistoryObject.text(city);
        searchHistoryList.prepend(searchHistoryObject);
    });
    localStorage.setItem("cities", JSON.stringify(cityArray));
}

// this function grabs the city array from the local storage and
// updates the array for the search history bar
function initializeHistory() {
    if (localStorage.getItem("cities")) {
        cityArray = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityArray.length - 1;
        listArray();
        // This displays the last city viewed if the page happens to be refreshed
        if (cityArray.length !== 0) {
            currentConditionsRequest(cityArray[lastIndex]);
            weather.removeClass("hide");
        }
    }
}

// shows the clear history button but only if there are elements in the serach history sidebar to be clear
function showClearHistory() {
    if (searchHistoryList.text() !== "") {
        clearHistoryButton.removeClass("hide");
    }
}