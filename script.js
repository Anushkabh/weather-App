let weather={
    API_KEY:"e4592f735336106b15ccc01d6ae0628a",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city 
        + "&units=metric&appid=" + this.API_KEY).then
        ((response)=>response.json())
        .then((data)=>this.displayWeather(data));
    },
    displayWeather: function(data){
        const {name}=data;
        const {icon,description}=data.weather[0];
        const {temp,humidity}=data.main;
        const {speed}=data.wind;
        document.querySelector(".city").innerText="Weather in "+name;
        document.querySelector(".icon").src=
        "https://openweathermap.org/img/wn/"+icon+".png";
        document.querySelector(".description").innerText=description;
        document.querySelector(".temp").innerText=temp+"°C";
        document.querySelector(".humidity").innerText="Humidity: "+humidity+"%";
        document.querySelector(".wind").innerText="Wind Speed: "+speed+"km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage=
        "url('https://source.unsplash.com/1600x900/?"+name+"')";
    },
    search: function(){
        this.fetchWeather(document.querySelector(".city-search").value);
    }
}

let geocode={
    reverseGeocode: function(latitude,longitude){
        var api_key = '5fa52282cf594e6b9117c8cb9c86d5c1';

  
  var query = latitude + ',' + longitude;


  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(query)
    + '&pretty=1'
    + '&no_annotations=1';

 

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
  

    if (request.status === 200){
      // Success!
      var data = JSON.parse(request.responseText);
      //console.log(data.results[0]); // print the location
        weather.fetchWeather(data.results[0].components.city);

    } else if (request.status <= 500){

      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {

      console.log("server error");

    }
  };

  request.onerror = function() {
    
    console.log("unable to connect to server");
  };

  request.send();  
    },
    getLocation: function(){
        function success(data){
            geocode.reverseGeocode(data.coords.latitude,data.coords.longitude);
        }
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success,error);
        }
        else{
            weather.fetchWeather("Delhi");
        }
        function error(){
            weather.fetchWeather("Delhi");
        }
    }

}



// ...




document.querySelector(".city-search").addEventListener("click",function(){
    weather.search();
})
document.querySelector(".city-search").addEventListener("keyup",function(event){
    if(event.key=="Enter"){
        weather.search();
    }
})


function clearDropdown() {
    const dropdownContainer = document.getElementById('results');
    dropdownContainer.innerHTML = '';
  }
  
  let selectedCity = '';
  
  function searchCities() {
    const searchInput = document.querySelector('.city-search');
    const cityName = searchInput.value;
  
    // Clear previous results
    clearDropdown();
  
    // Show dropdown only if there's a search query
    
    if (cityName) {
        getCitiesByPrefix(cityName)
          .then(cities => {
            populateDropdown(cities);
            isDropdownVisible = true; // Set dropdown visibility to true
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        isDropdownVisible = false; // Set dropdown visibility to false
      }
    
      updateWindBlur(); // Update wind blur based on dropdown visibility
    }
    
    function updateWindBlur() {
      const windElement = document.querySelector('.wind');
    
      if (isDropdownVisible) {
        windElement.classList.add('blurred'); // Add blurred class to wind speed
      } else {
        windElement.classList.remove('blurred'); // Remove blurred class from wind speed
      }
    }
    
  
  async function getCitiesByPrefix(prefix) {
    const apiKey = '5679206aa5msh1d130bfb46f7a8bp1e6d56jsn9d46ba8926ac'; // Replace with your actual API key
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${prefix}`, {
      headers: {
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        'X-RapidAPI-Key': apiKey
      }
    });
  
    if (!response.ok) {
      throw new Error('Unable to fetch cities.');
    }
  
    const data = await response.json();
    return data.data.map(city => city.city);
  }
  
  function populateDropdown(cities) {
    const dropdownContainer = document.getElementById('results');
    dropdownContainer.innerHTML = '';
  
    cities.forEach(city => {
      const option = document.createElement('div');
      option.textContent = city;
      option.classList.add('option');
      option.addEventListener('click', () => {
        selectCity(city);
      });
      dropdownContainer.appendChild(option);
    });
  }
  
  function selectCity(city) {
    const searchInput = document.querySelector('.city-search');
    selectedCity = city;
    searchInput.value = selectedCity;
    clearDropdown();
    isDropdownVisible = false; // Set dropdown visibility to false
    updateWindBlur(); // Update wind blur based on dropdown visibility
  
    weather.fetchWeather(selectedCity); // Fetch weather for the selected city
  }
  



geocode.getLocation();


