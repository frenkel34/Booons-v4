function setupApp(){
	// system
	var sDeviceId = '01234567890123456789';
	// debug
	$("#dbgDeviceId").val(sDeviceId);
	GetDeviceDefaults(sDeviceId);			
	// gui
	$(".pageContainer").hide();
	$(".debug").show();
	$("#pageLogin").show();
}

function SetDeviceDefaults(returnData){
	// system
	var sUsername = returnData.defaultUsername;
	var sGroupname = returnData.defaultGroup;
	// debug 
	console.log('Data object:');
	console.log(returnData)
	// gui 
	if (sGroupname=='' || sUsername==''){
		$("#formLogin").show();
		$("#divLogin").hide();
		$("#txtUsername").show();
		$("#txtGroupname").show();
		$("#btnLoginNotMe").hide();
	} else {
		$("#formLogin").hide();
		$("#divLogin").show();
		$("#lblUsername").append(sUsername);
		$("#lblGroupname").append(sGroupname);
		$("#txtUsername").hide();
		$("#txtGroupname").hide();
		$("#txtUsername").val(sUsername);
		$("#txtGroupname").val(sGroupname);
	}
}

function cleanLoginForm() {
	$("#txtUsername").val('');
	$("#txtGroupname").val('');
	$("#txtUsername").show('');
	$("#txtGroupname").show('');
	$("#lblUsername").hide('');
	$("#lblGroupname").hide('');
	$("#btnLoginNotMe").hide('');

}

function SetLoggedIn(returnData) {
	console.log('starting SetLoggedIn(object)');
	// system
	var sUsername 		= returnData.userName;
	var sGroupname 		= returnData.groupName;
	var iPointBalance 	= returnData.user.pointBalance;
	var aMessages 		= returnData.messages;
	var bIsArray 		= Array.isArray(aMessages);
	// debug 
	$("#dbgUsername").val(sUsername);
	$("#dbgGroupname").val(sGroupname);
	$("#dbgPoints").val(iPointBalance);
	// gui
	$(".pageContainer").hide();
	if (bIsArray == true) {
		var iArrayLength = aMessages.length;
		$("#pageLoggedIn").show();
		$(".lblGroupName").text('News');
		for (var i = 0; i < iArrayLength; i++) {
			var sDateTime 	= aMessages[i].dateTime
			var sText	 	= aMessages[i].text
			$("#lstMessages").append("<li>"+ sDateTime +" - "+ sText +"</li>")	
		}
	} else {
	//	$("#divUsers").hide();
	//	$("#divStatus").show();
		$(".lblGroupName").text(sGroupname);
		GetGroup(sGroupname);
	}
}

function SetMessageList(returnData) {
	console.log('starting SetMessageList(object)');
	// system
	var sGroupname = returnData.groupname;
	// debug
	console.log('Showing messages to user after login');
	// gui
	$("#pageLoggedIn").show();
	
}

function SetGroup(returnData){
	// system
	console.log('starting SetGroup(object)');
	var sGroupname 	= returnData.groupName;
	console.log('>>> group: '+ sGroupname +'');
	$(".lblGroupName").text(sGroupname);
	if (returnData.round != undefined) {
		var iCountdown 	= returnData.round.secondsLeft;
		var iPoints		= returnData.round.points;
	} else {
		var iCountdown 	= -1;
		var iPoints		= 0;	
	}
	var oUsers		= returnData.User
	// debug
	console.log('Setting group for: '+sGroupname);
	// gui
		// Set timer
		console.log('>>> Timer: '+ iCountdown +'');
		$("#lblCountDown").text(iCountdown);
		if ((returnData.round != undefined)) {
			startRoundCountDown(iCountdown);
			$("#divCountDown").show();			
			$("#divStartRound").hide();
		}	else {
			$("#divCountDown").hide();
			$("#divStartRound").show();
			
		}
	
		// Set points
		console.log('>>> Points: '+ iPoints +'');
		var sPointsHtml = '<img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT1sCR2nyQwj5p_3rkAKV6vCN37Nvf72tNCmB8XEzkAczpO4z3M" width="25px"/> ';
		$("#divPoints").html('');
		for (i = 0; i < iPoints; i++) { 
			$("#divPoints").append(sPointsHtml);
		}

		// Create userlist
		var aUsers = returnData.users;
		var bIsArray = Array.isArray(aUsers);
		console.log('>>> Users: '+ bIsArray +'');

		if (bIsArray == true) {
			var iArrayLength = aUsers.length;
			for (var i = 0; i < iArrayLength; i++) {
				var sDateTime 	= aUsers[i].lastActivity
				var sUsername	= aUsers[i].username
				$("#lstUsers").append("<li>"+ sDateTime +" - "+ sUsername +"</li>")	
			}
		}
		$(".pageContainer").hide();
		$("#pageGroupIdle").show();
		$("#divUsers").hide();
		$("#divStatus").show();

		// Create orderlist
		console.log('>>> done !');
}

function SetOrderProduct(returnData) {
	alert('Im setting orders and ambushes and than return to group');
	SetGroup(returnData);
}

function SetGroupProducts(returnData){
	console.log('starting SetGroupProducts(object)');
	// system
	var sGroupname = returnData.groupName;
	// debug
	console.log('Showing group products list');
	// gui
	
	var slistGroupProduct = '';
	var aProducts = returnData.products;
	console.dir(aProducts);
	var bIsArray = Array.isArray(aProducts);
		console.log('>>> Products in group: '+ bIsArray +'');

		if (bIsArray == true) {
			var iArrayLength = aProducts.length;
			$("#lstGroupProductsList").html('');
			for (var i = 0; i < iArrayLength; i++) {
				var sProducts = aProducts[i].name
				var sStatus = aProducts[i].status
				if (sStatus == false){
					var sColor = 'grey';
				}
				else {
					var sColor = 'green';
				}
				$("#lstGroupProductsList").append('<li id="' +sProducts +'" class="lstGroupProductItem" style="background-color:' + sColor +';">' +sProducts +'</li><input type="hidden" value=' +sStatus +'>')
			}
		}
	
	//Togle the items from true<>false when the used is clicking	
	$(".lstGroupProductItem").click(function(){
		var sProductname = $(this).attr('id');
		var sCurrentValue = $(this).closest('div');
		sCurrentValue = $(this).next('input').val();
		if (sCurrentValue == 'true') {
			sToggleValue = 'false';
		} else {
			sToggleValue = 'true';
		}
		
		//At the end, the change made by the user will be sent back to booons to be set in db
		SaveGroupConfig(sGroupname, sToggleValue, sProductname);
	});	
	
	//Make sure that all page are hidden except for the actual group item configuration
	$(".pageContainer").hide();
	$("#pageConfigureGroup").show();
}







