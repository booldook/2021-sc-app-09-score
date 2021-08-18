/*************** global init **************/
var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var dbRoot = database.ref('root');
var stRoot = storage.ref().child('imgs');


/************** user function *************/
function genFile() {
	return new Date().getTime() + '_' + random(1000, 1000);
}

/************** event callback ************/
function onAuthChanged(r) {
	if(r) {
		$('.bt-login').hide();
		$('.bt-logout').show();
	}
	else {
		$('.bt-login').show();
		$('.bt-logout').hide();
	}
}

function onLogin() {
	auth.signInWithPopup(googleAuth);
}

function onLogout() {
	auth.signOut();
}

function onSubmit(e) {
	e.preventDefault();
	var el = document.querySelector('input[name="upfile"]');
	if(el.files.length) {
		var file = document.querySelector('input[name="upfile"]').files[0]; // input type="file"
		var savename = genFile();
		var uploader = stRoot.child(savename).put(file);
	}
}

/*************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
$('.bt-login').click(onLogin);
$('.bt-logout').click(onLogout);
$('form[name="uploadForm"]').submit(onSubmit);

/*************** start init ***************/

