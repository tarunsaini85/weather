(function (){
	var widgetComponent = Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				// Initialize by setting internal variables to the values provided by the user(or to default values if not specified by the user)
				var t = this;
				var dataObj = JSON.parse(t.getAttribute('data-obj'));
				var city = (dataObj && dataObj.city) ? dataObj.city : null;
				var region = (dataObj && dataObj.region) ? dataObj.region : null;
				var onRequestFail = (dataObj && dataObj.onRequestFail) ? dataObj.onRequestFail : "<h5>Oops! Could not fetch data<br />Try again.</h5>";

				// Stop execution if any of the mandatory parameters are not defined by the user
				if(!city || !region){
					t.innerHTML = '<h5>Please specify city & region</h5>';
					return;
				}

				// Show loader inside the widget
				t.innerHTML = '<div class="innerRingThrob"><div class="div1"></div><div class="div2"></div><div class="div3"></div></div>';

				// Make XHR to fetch weather data as per the parameters provided by the user
				var fetchURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20%28select%20woeid%20from%20geo.places%281%29%20where%20text%3D%22"+city+"%2C%20"+region+"%22%29&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithke";
				fetch(fetchURL)
				  .then(function(res) {
				    return res.json();
				  }).then(function(json) {

				  	  // Handle successfull API response & convert respose data into html and populate inside the widget
				      var result = json.query.results;
				      if(result){
				      	var lis = '';
				      	for(var i=0; i<5; i++){
				      		lis += '<li><p>'+result.channel.item.forecast[i].day+'</p><p>'+result.channel.item.forecast[i].high+' / '+result.channel.item.forecast[i].low+'</p></li>';
				      	}
				      	t.innerHTML = '<h1>'+result.channel.location.city+', '+result.channel.location.region+'</h1><div class="wt"><p class="temp">'+result.channel.item.condition.temp+'<sup>&#176;</sup></p><p><img src="'+result.channel.item.description.substring(result.channel.item.description.indexOf('<img src="')+10,result.channel.item.description.indexOf('.gif')+4)+'" /><span>'+result.channel.item.condition.text+'</span></p></div><ul>'+lis+'</ul>';
				      }
				      else{

				      	// If API does not return data as expected. . Show failure message as provided by the user (or default message if not provided by the user)
				      	t.innerHTML = onRequestFail;
				      }
				  })
				  .catch(function(){

				  	// Handle API request fail. Show failure message as provided by the user (or default message if not provided by the user)
				  	t.innerHTML = onRequestFail;
				  })
			}
		}
	});
	document.registerElement('weather-widget', {
		prototype: widgetComponent
	});
}());