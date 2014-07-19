function doClick(e) {
	alert($.label.text);
}

var params = {
	index: $.index
};

var profPic = 'prof2.jpg';

var main = Alloy.createController('main', params);
main.getView().open();

function closeWindow() {
	$.index.close();
}

Ti.App.addEventListener('from', function(e){
	$.chatTitle.text = e.title;
	profPic = e.img;
});

$.backBtn.addEventListener('click', function(){
	clearTimeout(timeout);
	removeMessages($.chatWin);
	endChat();
	closeWindow();
});

//$.index.open();

var path = "";
var baseUrl = "http://vladm-prod.apigee.net/chat-key/";
var chatId = "";

var doSomething;
var timeout;

function requestChat(name, subject, json) {
	var url = baseUrl + "v2/chats";
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			var resp = JSON.parse(this.responseText);
			Ti.API.warn("Request chat" + resp);
			chatId = resp.id;
			path = resp.path;
			Ti.API.error("Chat is active!");
				
			
			if($.chatTitle.text == 'Telus') {
				showReply('How may I help you today?');
			}
			//else{
			
				doSomething = function() {
					getTranscript();
					timeout = setTimeout(doSomething, 1000);
				};

				timeout = setTimeout(doSomething, 1000);

		//	}
			
			
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("POST", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	client.send(JSON.stringify({
		"operationName" : "RequestChat",
		"nickname" : name,
		"subject" : subject
	}));
}

function sendTypingNotification(isTyping) {
	var url = baseUrl + "v2/chats" + "/" + chatId;
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			var resp = JSON.parse(this.responseText);
			Ti.API.warn("user typing action");
			//alert('success');
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
			//alert('error');
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("POST", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	if (isTyping) {
		client.send(JSON.stringify({
			"operationName" : "SendStartTypingNotification",
		}));
	} else {
		client.send(JSON.stringify({
			"operationName" : "SendStopTypingNotification",
		}));
	}
}

function sendMessage(message) {
	var url = baseUrl + "v2/chats"+"/"+chatId;
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			var resp = JSON.parse(this.responseText);
			Ti.API.warn("Message sent: " + resp.toString());
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
			//alert('error');
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("POST", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	client.send(JSON.stringify({
		"operationName" : "SendMessage",
		"text" : message
	}));
}


function removeMessages(view) {
	if (view && view.children != undefined) {
		// Save childrens
		var removeData = [];
		for ( i = view.children.length; i > 0; i--) {
			removeData.push(view.children[i - 1]);
		};

		// Remove childrens
		for ( i = 0; i < removeData.length; i++) {
			view.remove(removeData[i]);
		}
		removeData = null;
	};
}

function endChat() {
	var url = baseUrl + "v2/chats"+"/"+chatId;
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			var resp = JSON.parse(this.responseText);
			Ti.API.warn("Chat complete" + resp.toString());
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
			//alert('error');
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("POST", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	client.send(JSON.stringify({
		"operationName" : "Complete",
	}));
}

function getChat() {
	var url = baseUrl + "v2/chats"+"/"+chatId;
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			Ti.API.warn(this.responseText);
			var resp = JSON.parse(this.responseText);
			//Ti.API.warn("Chat complete" + resp);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
			//alert('error');
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("GET", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	client.send();
}

function getTranscript() {
	var url = baseUrl + "v2/chats"+"/"+chatId+"/messages";
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			Ti.API.warn(this.responseText);
			var resp = JSON.parse(this.responseText);
			
			var serverReply = responceCheck(resp);
			
			if (serverReply) {
				showReply(serverReply);
			}
				
			//Ti.API.warn("Chat complete" + resp);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error + this.status);
			//alert('error');
		},
		timeout : 5000 // in milliseconds
	});

	// Prepare the connection.
	client.open("GET", url);
	client.setRequestHeader('apikey', 'N18TFGbKpn0zaGLXDFZhPWpTcB2eyx44');
	client.setRequestHeader('Content-Type', 'application/json');
	// Send the request.
	client.send();
}

$.messageBox.focus();

$.submitBtn.addEventListener('click', function() {
	if($.messageBox.value != "") {
			sendReply();

	}
	Ti.API.info("CLICKED");
});

$.messageBox.addEventListener('return', function(e) {
	if($.messageBox.value != "") {
			sendReply();

	}
});

function sendReply() {
	var msgView = Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		text : $.messageBox.value,
		//backgroundColor: '#057387',
		color : "#000",
		right : '70dp',
		borderRadius : 5,
		font : {
			fontSize : 14,
			fontFamily:'Helvetica Neue'
		}
	});

	var circle = Ti.UI.createImageView({
		width : 43,
		height : 43,
		borderRadius : 21.5,
		backgroundColor : '#bbb',
		image: 'prof1.jpg',
		right : '10dp'
	});

	var row = Ti.UI.createView({
		width : "100%",
		height : '55dp',
		top : '5dp',
		bottom : '5dp',
		opacity: 0,
		//layout: 'horizontal',
	});

	row.add(msgView);
	row.add(circle);

	$.chatWin.add(row);
	
	row.animate({
		opacity: 100
	});

	$.chatWin.scrollToBottom();
	
	//setTimeout(showReply("How can I help you today?"), 1600);

	//showReply($.messageBox.value + " to you too!");
	sendMessage("$.messageBox.value");
	getChat();

	$.messageBox.value = "";
}

function showReply(message) {
	var msgView = Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		text : message,
		//backgroundColor: '#057387',
		color : "#000",
		left : '70dp',
		borderRadius : 5,
		font : {
			fontSize : 14,
			fontFamily:'Helvetica Neue'
		}
	});

	var circle = Ti.UI.createImageView({
		width : 43,
		height : 43,
		borderRadius : 21.5,
		backgroundColor : '#aaa',
		image: profPic,
		left : '10dp'
	});

	var row = Ti.UI.createView({
		width : "100%",
		height : '55dp',
		top : '3dp',
		bottom : '3dp',
		opacity: 0,
		//layout: 'horizontal',
	});

	row.add(msgView);
	row.add(circle);

	$.chatWin.add(row);
	
	row.animate({
		opacity: 100
	});

	$.chatWin.scrollToBottom();
}

$.index.addEventListener('open', function(){
	requestChat("John", "Phone Help");
});

function responceCheck (json) {
	var str = '';
	if (json.messages!='') {
		if (json.messages[json.messages.length-1].from.nickname == 'system' )
		{
			str = json.messages[json.messages.length-1].text;
		}
	}
	return (str!='') ? str : false;
}

//Chat start

//requestChat();

