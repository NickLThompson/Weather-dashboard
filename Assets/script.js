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
function currentConditionsRequest(searchValue) {

    // grabs the url for call
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    // fetch OpenWeatherAPI data (hard part)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class = 'text-muted' id = 'current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentTemperature.text(response.main.temp);
        currentTemperature.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        var latitude = response.coord.lat;
        var longitude = response.coord.lat;

        var UVIndexURL = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + latitude + "&lon=" + longitude + "&appid=" + APIkey;

        // fetching the 5 day forecast
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $("five-Day-Forecast").empty();
            for (var i = 1; i < response.list.length; i+=8) {
                
                var forecastDateString = moment(response.list[i].dt_txt).format("L");
                console.log(forecastDateString);

