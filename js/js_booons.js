var sAPIServer = 'http://www.booons.nl/apiv4/';

function CheckStatus() {
	$.ajax({url: sAPIServer + "apiv4.asp?method=checkstatus",
			dataType: "jsonp",
			statusCode: {
				500: function (response) {
					$(".pageContainer").hide();
					$("#pageStopApp").show();
					alert('The API seems to be corrupted with a 500, grumble!');
				},
				404: function (response) {
					$(".pageContainer").hide();
					$("#pageStopApp").show();
					alert('Where did the API go? Its gone with the 404');
				}
			}                        
	 });
}

function GetDeviceDefaults(sDeviceId){
	CheckStatus();
	var sMethode		= 'GetDeviceDefaults';
	var sQueryString 	= 'deviceid='+ sDeviceId +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	$.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
		deviceid: sDeviceId,
		method: sMethode,
		hashKey: sHashKey
	})
	.done(function( data ) {
		SetDeviceDefaults( data );
	});
}

function LoginUser(sDeviceId, sUsername, sGroupname){
	var sMethode		= 'LoginUser';
	var sQueryString 	= 'deviceid='+ sDeviceId +'username='+ sUsername +'groupname='+ sGroupname +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    deviceid: sDeviceId,
	    username: sUsername,
	    groupname: sGroupname,
	    method: sMethode,
	    hashKey: sHashKey
	})
	.done(function( data ) {
		SetLoggedIn( data );
	});
}

function GetMessages(){
	var sMethode		= 'GetMessages';
	var sQueryString 	= '&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	$.getJSON( sAPIServer + "apiv4/apiv4.asp?jsoncallback=?", {
		method: sMethode,
		hashKey: sHashKey
	})
	.done(function( data ) {
		SetMessageList( data );
	});
}

function GetGroup(sGroupname){
	console.log('starting GetGroup('+ sGroupname +')');
	var sMethode		= 'GetGroup';
	var sQueryString 	= 'groupname='+ sGroupname +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for GetGroup:');
				console.dir( data );
				SetGroup( data );
		});	    	
	});
}

var max_time = 5;
var cinterval;
	
function startRoundCountDown(iSecondsLeft) {
    clearInterval(cinterval);
	max_time = iSecondsLeft;
	cinterval = setInterval('countdown_timer()', 1000);
}

function countdown_timer(){
  max_time--;
  $("#lblCountDown").text(max_time);
  if(max_time == 0){
  	setTimeout(function() {
	alert('Time is up'); },500);
    clearInterval(cinterval);
  }
}

function StartRoundInGroup(sGroupname,sDeviceId, sUsername) {
	console.log('starting StartRoundInGroup('+ sGroupname +')');
	var sMethode		= 'GetGroup';
	var sStartRound		= 'yes'
	var sQueryString 	= 'deviceid='+ sDeviceId +'groupname='+ sGroupname +'&startround=yes&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
		deviceid: sDeviceId,
	    groupname: sGroupname,
		startround: sStartRound,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for StartRoundInGroup:');
				console.dir( data );
				GetOrderProduct(sGroupname, sUsername)
				// SetOrderProduct( data );
		});	    	
	});
}

function GetGroupConfig(sGroupname) {
	console.log('starting... GetGroupConfig('+ sGroupname +')');
	var sMethode		= 'GetGroupProducts';
	var sStartRound		= 'yes'
	var sQueryString 	= 'groupname='+ sGroupname +'&config=yes&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
		config: 'yes',
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for GetGroupConfig:');
				console.dir( data );
				SetGroupProducts( data );
		});	    	
	});
}

function GetOrderProduct(sGroupname, sUsername) {
	console.log('starting GetOrderProduct('+ sGroupname +')');
	var sMethode		= 'GetGroupProducts';
	var sQueryString 	= 'groupname='+ sGroupname +'&username='+ sUsername +'&config=no&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
		username: sUsername,
		config: 'no',
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for GetOrderProduct:');
				console.dir( data );
//				alert('just got the product list and ready to show to get the order');
				SetOrderProducts( data );
		});	    	
	});
}

function SaveGroupConfig(sGroupname, sProductStatus, sProductname) {
	console.log('starting SaveGroupConfig('+ sGroupname +', '+ sProductStatus +', '+ sProductname +')');
	var sMethode		= 'GetGroupProducts';
	var sGroupname		= sGroupname;
	var sProductStatus	= sProductStatus;
	var sProductname	= sProductname;
	var sQueryString 	= 'groupname='+ sGroupname +'&productstatus='+ sProductStatus +'&productname='+ sProductname +'&saveproductingroup=yes&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
		productstatus: sProductStatus,
		productname: sProductname,
		saveproductingroup: 'yes',
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for SaveGroupConfig:');
				console.dir( data );
				SetGroupProducts( data );
		});	    	
	});
}

function SaveOrder(sGroupname, sUsername, sProduct, sSugar, sSweetner, sMilk) {
	console.log('starting SaveOrder('+sGroupname+', '+sUsername+', '+sProduct+', '+sSugar+', '+sSweetner+', '+sMilk+')');
	var sMethode		= 'SaveOrder';
	var sGroupname		= sGroupname;
	var sProductStatus	= sProductStatus;
	var sProductname	= sProductname;
	var sQueryString 	= 'groupname='+ sGroupname +'&username='+ sUsername +'&product='+ sProduct +'&sugar='+ sSugar +'&sweetner='+ sSweetner +'&milk='+ sMilk +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
		username: sUsername,
		product: sProduct,
		sugar: sSugar,
		sweetner: sSweetner,
		milk: sMilk,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for SaveOrder:');
				console.dir( data );
				alert('ambush screen !');
				GetOrderAmbushes(sGroupname, sUsername);
				// SetGroup( data );
		});	    	
	});
}

function GetOrderAmbushes(sGroupname, sUsername) {
	console.log('starting GetOrderAmbushes('+ sGroupname +', '+ sUsername +')');
	var sMethode		= 'GetOrderAmbushes';
	var sQueryString 	= 'groupname='+ sGroupname +'&username='+ sUsername +'&config=no&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( sAPIServer + "apiv4.asp?jsoncallback=?", {
	    groupname: sGroupname,
		username: sUsername,
		config: 'no',
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			$(function(){
				console.log('Result for GetOrderAmbushes:');
				console.dir( data );
//				alert('just got the product list and ready to show to get the order');
				SetOrderAmbushes( data, sUsername );
		});	    	
	});
}	


