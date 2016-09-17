var tempC;
var tempF;

//use "https://www.wunderground.com" api to get the weather data
function getWeather(weatherData){
	if(!weatherData){
		var weatherJson = "http://api.wunderground.com/api/8fe96a315926e247/conditions/q/autoip.json";
	}
	else{
		//http://api.wunderground.com/api/8fe96a315926e247/forecast/q/zmw:31003.1.99999.json
		weatherJson = "http://api.wunderground.com/api/8fe96a315926e247/conditions"+weatherData+".json";
	}
	
	//call the weatherUrl
	$.getJSON(weatherJson).done(function(weather){
		var allData = weather.current_observation;
		//console.log(weatherData);
		var locationData = allData.display_location;
		tempF = allData.temp_f; // temperature with F
		tempC = allData.temp_c;
		var condition = allData.weather; //description of the weather
		var icon_url = allData.icon_url; //image of the weather condition
		var wd = Math.floor(allData.wind_mph *0.868976);
		var wd_dir = allData.wind_dir;

		//show the data into page
		//1:some country's city doesnt' has the state name
		if(locationData.state!==''){
			$('#city').text(locationData.city +', ' + locationData.state +', '+ locationData.country_iso3166);
		}
		else{
			$('#city').text(locationData.city +', '+ locationData.country);	
		}
		
		//2:show the weather condition picture
		$('#w_icon').html('<img src="'+icon_url+'">'); 
		
		//3:temperature with F and C
		//find two letters of country:  http://eeieio.accountsupport.com/Country-Abbreviations.html 
		//These countries use F: Bahamas, Belize, the Cayman Islands, Palau,US and Canada.
		var F = ['BS','BZ','KY','PW','US','CA'];
		if(F.indexOf(locationData.country)!==-1){
			$('#temp').text(tempF + '°F');   //use F 
		}
		else{
			$('#temp').text(tempC + '°C'); 
		}

		//4:also you can use the button to change the temp to celsius / fahrenheit
		
		//5:show the condition
		$('#condition').text("Sky is " + condition);

		//6:show the wind
		$('#wd').text(wd_dir + ' '+ wd + " knots");

		//7:change the background color based on the condition
		//var imgUrl = "https://github.com/Hmay61/Show-the-local-weather/blob/master/Cloudy.jpg?raw=true";
		var imgUrl = "https://github.com/Hmay61/Show-the-local-weather/blob/master/";
		
		if(condition.indexOf('Cloud')>-1){
			display = "Cloudy";
		}
		else if(condition.indexOf('Rain')>-1 || condition.indexOf('Squalls')>-1 || condition.indexOf('Drizzle')>-1 ){
			display = "Rain";
		}
		else if(condition.indexOf('Thunderstorm')>-1 || condition.indexOf('Hail')>-1){
			display = "Thunderstorm";
		}
		else if(condition.indexOf('Snow')>-1 || condition.indexOf('Flurries')>-1 || condition.indexOf('Ice')>-1 ){
			display = "Snow";
		}
		else if(condition.indexOf('Overcast')>-1 ||condition.indexOf('Haze')>-1){
			display = "Fog";
		}
		else{
			display = "Clear";
		}

		$('body').css({backgroundImage:'url('+imgUrl+display+'.jpg?raw=true)',backgroundRepeat:'no-repeat',backgroundSize:'100%'});
		//$('body').css({backgroundImage:'url(./images/Snow.jpg)',backgroundRepeat:'no-repeat',backgroundSize:'100%'});
	});//end of getJSON done 
}//end of getWeather()

var cities = [];
function returnCity(){
	//we need to add the cb=? to return the data
	var cityAutoUrl = 'https://autocomplete.wunderground.com/aq?cb=?&query='+$('#search').val();
	//console.log(cityAutoUrl);
	cities.length = 0;
	//get the city and country
	$.getJSON(cityAutoUrl).done(function(data){
		$.each(data.RESULTS,function(i){
			var city = data.RESULTS[i].name;
			if(city.indexOf(',')!==-1 && cities.indexOf(city) < 0)  { //no dupilicate and choose the data with ',',because these cities have the l attribution
	        	cities.push(city,data.RESULTS[i].l);  //data.RESULTS[i].l will use it later;
	        }//end of if
		});//end of each
	}); //end of getJSON

	//console.log(cities);
}


$(document).ready(function(){
	getWeather();

	$('#search').autocomplete({
	 	source: cities,   //from the returnCity function
   		minLength:3,
   		select: function(event,ui){
   		 	getWeather(cities[cities.indexOf(ui.item.value)+1]);  //it will get l:  q/zmw:31003.1.99999
   			ui.item.value = '';
   		}
	}).keyup(function(){
		returnCity();
	});

	//4:also you can use the button to change the temp to celsius / fahrenheit
	$('#tempChange').click(function(){
		if($('#temp').text().indexOf('F')!==-1){
			$('#temp').text(tempC + '°C');  
		}
		else{ //==-1.Means no F, so change to F
			$('#temp').text(tempF + '°F');
		}
		$(this).blur(); //lose foucus;
	}); //end of #tempChange

	//search input click
	$('#search').click(function(){
		$(this).val('');
	});

}); //end of ready






