/************** global init ***************/
// console.log(firebase);
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();


/************** function init ***************/


/************** event callback ***************/
function onAuthChanged() {

}

function onLogin() {
	auth.signInWithPopup(googleAuth);
}

/************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
$('.bt-login').click(onLogin);