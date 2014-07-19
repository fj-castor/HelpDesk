function doClick(e) {
	alert($.label.text);
}

var main = Alloy.createController('main');
//main.getView().open();

$.index.open();


var path = "";
var baseUrl = "http://vladm-prod.apigee.net/chat-key/";
var chatId = "";

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
				
			var timeout;
			function doSomething() {
				getTranscript();
				timeout = setTimeout(doSomething, 1000);
			}

			timeout = setTimeout(doSomething, 1000); 

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
	Ti.API.info("CLICKED");
	sendReply();
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
		//layout: 'horizontal',
	});

	row.add(msgView);
	row.add(circle);

	$.chatWin.add(row);

	$.chatWin.scrollToBottom();

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
		image: 'prof1.jpg',
		left : '10dp'
	});

	var row = Ti.UI.createView({
		width : "100%",
		height : '55dp',
		top : '3dp',
		bottom : '3dp',
		//layout: 'horizontal',
	});

	row.add(msgView);
	row.add(circle);

	$.chatWin.add(row);

	$.chatWin.scrollToBottom();
}

requestChat("John", "Phone Help");

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

