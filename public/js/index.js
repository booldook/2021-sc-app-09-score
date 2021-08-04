/************** global init ***************/
console.log(firebase);
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();
// console.log(auth, db, googleAuth);


/************** function init ***************/


/************** event callback ***************/
function onAuthChanged(user) { // auth상태가 변하면 알려줘
	console.log(user);
	if(user) {
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

/************** event init ***************/
auth.onAuthStateChanged(onAuthChanged); // auth상태가 변하면 알려줘
$('.bt-login').click(onLogin);
$('.bt-logout').click(onLogout);