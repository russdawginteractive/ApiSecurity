function log() {
	document.getElementById('results').innerText = '';

	Array.prototype.forEach.call(arguments, function (msg) {
		if (msg instanceof Error) {
			msg = "Error: " + msg.message;
		}
		else if (typeof msg !== 'string') {
			msg = JSON.stringify(msg, null, 2);
		}
		document.getElementById('results').innerHTML += msg + '\r\n';
	});
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);
document.getElementById("weather").addEventListener("click", weather, false);

var config = {
	authority: "https://localhost:5001",
	client_id: "spa",
	redirect_uri: "http://localhost:5003/callback.html",
	response_type: "code",
	scope: "openid profile auth.web.api",
	post_logout_redirect_uri: "http://localhost:5003/index.html",
};

var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
	if (user) {
		log("User logged in", user.profile);
	}
	else {
		log("User not logged in");
	}
});

function login() {
	mgr.signinRedirect();
}

function api() {
	mgr.getUser().then(function (user) {
		if (user == null) {
			log(401, new Error("User not logged in!"));
			return;
		}

		var url = "https://localhost:44390/identity";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = function () {
			log(xhr.status, JSON.parse(xhr.responseText));
		}
		xhr.onerror = () => reject(xhr.statusText);
		xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
		xhr.send();
		
	});
}

function weather() {
	mgr.getUser().then(function (user) {
		if (user == null) {
			log(401, new Error("User not logged in! You must login to see the weather forecast!"));
			return;
		}
		var url = "https://localhost:44390/weatherforecast";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = function () {
			log(xhr.status, JSON.parse(xhr.responseText));
		}
		console.log(user);
		xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
		console.log(user.access_token);
		xhr.send();
	});
}

function logout() {
	mgr.signoutRedirect();
}