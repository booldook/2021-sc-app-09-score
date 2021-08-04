/* 
false 판정: 0, null, undefined, '', false
true 판정: false판정 외 모든것
- 0을 제외한 모든 숫자
- ''(빈문자열)을 제외한 모든 문자
- 객체, 함수 ... 전부다
*/

/************** global init ***************/
console.log(firebase);
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;

/************** function init ***************/


/************** event callback ***************/
function onSubmit(f) {
	if(!user) alert('로그인 후 사용해 주세요.');
	else {
		var data = {
			username: f.username.value.trim(),
			comment: f.comment.value.trim(),
			createdAt: new Date().getTime(),
			uid: user.uid,
			email: user.email
		}
		if(data.username !== '' && data.comment !== '') {
			db.ref('root/test').push(data);
			f.reset();
		}
	}
	return false;
}

function onAuthChanged(v) { // auth상태가 변하면 알려줘
	user = v;
	if(user) {
		$('.bt-login').hide();
		$('.bt-logout').show();
		$('.photo-logo img').attr('src', user.photoURL);
		$('.photo-logo').show();
		$('.icon-logo').hide();
	}
	else {
		$('.bt-login').show();
		$('.bt-logout').hide();
		$('.photo-logo').hide();
		$('.icon-logo').show();
	}
}

function onLogin() {
	auth.signInWithPopup(googleAuth);
	// auth.signInWithRedirect(googleAuth);
}

function onLogout() {
	auth.signOut();
}

/************** event init ***************/
auth.onAuthStateChanged(onAuthChanged); // auth상태가 변하면 알려줘
$('.bt-login').click(onLogin);
$('.bt-logout').click(onLogout);