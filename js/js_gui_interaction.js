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
		var iCountdefault = returnData.round.defaultDuration;
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
			startRoundCountDown(iCountdown, sGroupname);
			$("#divCountDown").show();			
			$("#divStartRound").hide();
		}	else {
			$("#divCountDown").hide();
			$("#divStartRound").show();
			
		}
		
		// Set rounded timer
		if (iCountdown > 1){
			var iWidth = $(window).width();
			$("#countdown").countdown360({
		    	radius      : (iWidth/2)-(10*iWidth/100),
				strokeWidth : 360, 
		        seconds     : iCountdown,
				strokeWidth : 3,
				strokeStyle: "#b4740e",
				fontColor   : '#b4740e',
				fillStyle: "#ffe792",
				autostart   : false,
				onComplete  : function () { 
			    	console.log('Rouder Counter is over !') .stop()   
			    }
			}).start()
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

		$("#lstUsers").html('');
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
		if ((returnData.round != undefined)) {
			$("#divRoundOpen").show();
		} else {
			$("#divRoundOpen").hide();
		}
		
		// Create orderlist
		console.log('>>> done !');
}
function SetOrderAmbushes(returnData, sUsername) {
	// system
	var sGroupname 		= returnData.groupName;
	var aAmbushes 		= returnData.ambushes;
	var aUsers 			= returnData.users;
	var bUserIsArray 	= Array.isArray(aUsers);
	var bAmbushIsArray 	= Array.isArray(aAmbushes);
	var sHtml 			= ''
	// debug
	console.dir(returnData);
	// gui
	$("#ambushes").html('');
	console.log('start...');
	if (bUserIsArray == true) {		
		var iUserArrayLength = aUsers.length;
		for (var iUsr = 0; iUsr < iUserArrayLength; iUsr++) {
			var sSubjectName	= aUsers[iUsr].username
			var sPoints 		= aUsers[iUsr].pointBalance
			var sActivity		= aUsers[iUsr].lastActivity
			if (sSubjectName != sUsername) {
				sHtml = sHtml +'<div class="useritem">'
				sHtml = sHtml +'<div ambushsubject="'+ sSubjectName +'" class="userlabel">'+ sSubjectName +' ('+ sPoints +' booons)</div>'
				sHtml = sHtml + '<div class="ambushperuser">'
				if (bAmbushIsArray == true) {
					var iAmbushArrayLength = aAmbushes.length;
					for (var iAmb = 0; iAmb < iAmbushArrayLength; iAmb++) {
						var sAmbushName = aAmbushes[iAmb].name
						sHtml = sHtml +'<img id="" width="30px" class="AmbushIcon" ambushsubject="'+ sSubjectName +'" ambushname="'+ sAmbushName +'" src="img/'+ sAmbushName +'2.png" /> '
					}
				}
				sHtml = sHtml +'</div>'
				sHtml = sHtml +'</div>'
			}
		}			
		
	}	
	$("#ambushes").html(sHtml);
	$(".ambushperuser").hide();
	$(".userlabel").click(function(){
		var sAmbushlabel   = $(this).text();
		var sAmbushSubject = $(this).attr('ambushsubject')
		$("#dbgSelectedAmbushSubject").val(sAmbushSubject);
		$("#dbgSelectedAmbush").val('');
		$(".ambushperuser").slideUp(500);
		$(this).next('div').slideDown(1000);
		var sParent = $(this).parent('div').find('img').each(function(){
			console.log($(this).attr('ambushname'));
			sResetAmbushlabel = $(this).attr('ambushname');
			$(this).attr("src","img/"+sResetAmbushlabel+"2.png");
		});
	});
	$(".AmbushIcon").click(function(){
		var sAmbushlabel 	= $(this).attr('ambushname');
		var sSubjectname 	= $(this).attr('sSubjectname');
		$("#dbgSelectedAmbush").val(sAmbushlabel);
		console.log('pulling '+ sAmbushlabel +' on '+ sSubjectname);
		// reset the ambushes
		
		var sParent = $(this).parent('div').find('img').each(function(){
			console.log($(this).attr('ambushname'));
			sResetAmbushlabel = $(this).attr('ambushname');
			$(this).attr("src","img/"+sResetAmbushlabel+"2.png");
		});
		
		
		
		
		$(this).attr("src","img/"+sAmbushlabel+"1.png");
		
	});
	
	
	
	

	$(".pageContainer").hide();
	$("#pageOrderAmbush").show();	

}

function SetOrderProducts(returnData) {
	// system
	var sGroupname 		= returnData.groupName;
	var aProducts 		= returnData.products;
	var bIsArray 		= Array.isArray(aProducts);
	var sHtml 			= ''
	
	// debug
	console.log('Showing list of products to order');
	console.log('Products is array? '+ bIsArray +'');

	// gui	
//	$("#productoptions").hide();
	$("#products").html('');
	if (bIsArray == true) {			

		var iArrayLength = aProducts.length;
		for (var iPrd = 0; iPrd < iArrayLength; iPrd++) {
			var sProductname	= aProducts[iPrd].name
			var sStatus 		= aProducts[iPrd].status
			var sSugar			= aProducts[iPrd].sugar
			var sSweetner		= aProducts[iPrd].sweetner
			var sMilk			= aProducts[iPrd].milk

			console.log('setting up: '+ sProductname)
			if (sStatus == true) {
				console.log('setting up for true: '+ sProductname)
				sHtml = sHtml +'<div class="productitem">'
				sHtml = sHtml +'<div class="productlabel">'+ sProductname +'</div>'
				if (sSugar != 0 || sSweetner != 0 || sMilk != 0 ) {
					sHtml = sHtml + '<div id="productoptions'+ sProductname +'" class="productoptions" style="display:none;">'
					if (sSugar > 0) {
						var sOptionname = 'sugar';
						sHtml = sHtml + '<div id="productoption'+ sOptionname +'">'
						for (var iCnt = 1; iCnt < 4; iCnt++) {
							sHtml = sHtml + '<img width="30px" src="img/'+ sOptionname +'2.png" productname="'+ sProductname +'" optionname="'+ sOptionname +'" optionvalue="'+ iCnt  +'"  id="'+ sProductname + sOptionname + iCnt  +'" class="OptionIcon" /> '
						}
						sHtml = sHtml + '</div>'
					};	
					if (sSweetner > 0) {
						var sOptionname = 'sweetner';
						sHtml = sHtml + '<div id="productoption'+ sOptionname +'">'
						for (var iCnt = 1; iCnt < 4; iCnt++) {
							sHtml = sHtml + '<img width="30px" src="img/'+ sOptionname +'2.png" productname="'+ sProductname +'" optionname="'+ sOptionname +'" optionvalue="'+ iCnt  +'"  id="'+ sProductname + sOptionname + iCnt  +'" class="OptionIcon" /> '
						}
						sHtml = sHtml + '</div>'
					};	
					if (sMilk > 0) {
						var sOptionname = 'milk';
						sHtml = sHtml + '<div id="productoption'+ sOptionname +'">'
						for (var iCnt = 1; iCnt < 4; iCnt++) {
							sHtml = sHtml + '<img width="30px" src="img/'+ sOptionname +'2.png" productname="'+ sProductname +'" optionname="'+ sOptionname +'" optionvalue="'+ iCnt  +'"  id="'+ sProductname + sOptionname + iCnt  +'" class="OptionIcon" /> '
						}
						sHtml = sHtml + '</div>'
					};	
					sHtml = sHtml + '</div>'
				}
				sHtml = sHtml + '</div>'
				sHtml = sHtml + '</div>'
				
			}
				
		}			

	}
	$("#products").html(sHtml);
	

	$(".productlabel").click(function(){
		var sProductlabel = $(this).text();
		$("#dbgSelectedProduct").val(sProductlabel);
		$("#dbgSelectedProductOptionsugar").val('0');
		$("#dbgSelectedProductOptionsweetner").val('0');
		$("#dbgSelectedProductOptionmilk").val('0');
		$(".productoptions").slideUp(500);
		$(this).next('div').slideDown(1000);
	});
	
	$(".OptionIcon").click(function(){
		var sClickedOption 	= $(this).attr('optionname');
		var sClickedValue 	= $(this).attr('optionvalue');
		var sProductname	= $(this).attr('productname');	
		var idName 			= sProductname + sClickedOption ;
		console.log('Ordering a '+sProductname+ ' with '+ sClickedValue +' '+sClickedOption);

		// Check if the user clicks on the current value !
		if (sClickedValue ==  $("#dbgSelectedProductOption"+sClickedOption).val()){
			$("#"+ idName +'1').attr("src","img/"+sClickedOption+"2.png");
			$("#"+ idName +'2').attr("src","img/"+sClickedOption+"2.png");
			$("#"+ idName +'3').attr("src","img/"+sClickedOption+"2.png");
			$("#dbgSelectedProductOption"+sClickedOption).val('0');
		} else {
			if (sClickedValue >= 1){
				$("#"+ idName +'1').attr("src","img/"+sClickedOption+"1.png");
				$("#dbgSelectedProductOption"+sClickedOption).val('1');
			} else {
				$("#"+ idName +'1').attr("src","img/"+sClickedOption+"2.png");
			}
			if (sClickedValue >= 2){
				$("#"+ idName +'2').attr("src","img/"+sClickedOption+"1.png");
				$("#dbgSelectedProductOption"+sClickedOption).val('2');
			} else {
				$("#"+ idName +'2').attr("src","img/"+sClickedOption+"2.png");
			}
			if (sClickedValue >= 3){
				$("#"+ idName +'3').attr("src","img/"+sClickedOption+"1.png");
				$("#dbgSelectedProductOption"+sClickedOption).val('3');
			} else {
				$("#"+ idName +'3').attr("src","img/"+sClickedOption+"2.png");
			}
		}
		
	});
	$("#btnSubmitOrder").click(function(){
		var sUsername 	= $("#dbgUsername").val();
		var sProduct 	= $("#dbgSelectedProduct").val();
		var sSugar 		= $("#dbgSelectedProductOptionsugar").val();
		var sSweetner 	= $("#dbgSelectedProductOptionsweetner").val();
		var sMilk		 = $("#dbgSelectedProductOptionmilk").val();
		SaveOrder(sGroupname, sUsername, sProduct, sSugar, sSweetner, sMilk);
	});
	$(".pageContainer").hide();
	$("#pageOrderProduct").show();	
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







