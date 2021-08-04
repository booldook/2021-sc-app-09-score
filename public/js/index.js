/************** global init ***************/
console.log(firebase);
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();

console.log(auth, db, googleAuth);


/************** function init ***************/


/************** event callback ***************/
function onAuthChanged(user) {
	console.log(user);
}

function onLogin() {
	auth.signInWithPopup(googleAuth);
}

/************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
$('.bt-login').click(onLogin);