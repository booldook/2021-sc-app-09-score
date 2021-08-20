/* 
$().next() 			// 바로 다음				nextSibling
$().prev()			// 바로 전					previousSibling
$().parent()		// 내 부모					parentNode
$().parents()		// 내 조상들				parentNode
$().siblings()	// 내 형제자매
$().children()	// 내 자식					childNodes
$().find()			// 내 자손					childNodes
*/


/*************** global init **************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var firebaseDatabase = firebase.database();
var firebaseStorage = firebase.storage();
var db = firebaseDatabase.ref('root/board');
var storage = firebaseStorage.ref('root/board');
var user = null;
var allowType = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

/************** element init **************/
var btSave = document.querySelector('.write-wrapper .bt-save');				// 글작성 버튼
var btLogin = document.querySelector('.header-wrapper .bt-login');		// 로긴 버튼
var btLogout = document.querySelector('.header-wrapper .bt-logout');	// 로그아웃 버튼
var btWrite = document.querySelector('.list-wrapper .bt-write');			// 글작성 모달창 오픈버튼
var btClose = document.querySelector('.write-wrapper .bt-close');			// 글작성 모달창 클로즈버튼
var btReset = document.querySelector('.write-wrapper .bt-reset');			// 글작성 모달창 리셋버튼
var writeWrapper = document.querySelector('.write-wrapper');					// 글작성 모달창
var writeForm = document.writeForm;																		// 글작성 form



/************** user function *************/


/************** event callback ************/
function onAuthChanged(r) { // login, logout 상태가 변하면...
	user = r;
	if(user) {	// 로그인 되면 UI가 할일
		btLogin.style.display = 'none';
		btLogout.style.display = 'block';
	}
	else {	// 로그아웃 되면 UI가 할일
		btLogin.style.display = 'block';
		btLogout.style.display = 'none';
	}
}

function onLogin() {	// btLogin이 클릭되면
	auth.signInWithPopup(googleAuth);
}

function onLogout() {	// btLogout이 클릭되면
	auth.signOut();
}

function onWrite() { // 모달창이 오픈되면
	$(writeWrapper).stop().fadeIn(300);
	writeForm.title.focus();
}

function onClose() { // 모달창이 닫히면
	$(writeWrapper).stop().fadeOut(300);
	onWriteReset();
}

function onWriteReset(e) {
	writeForm.title.value = '';
	writeForm.title.classList.remove('active');
	writeForm.writer.value = '';
	writeForm.writer.classList.remove('active');
	writeForm.content.value = '';
	document.querySelectorAll('.required-comment').forEach(function(v, i) {
		console.log(v);
		v.classList.remove('active');
	});
}

function onWriteSubmit(e) { // btSave클릭시(글 저장시), validation 검증
	e.preventDefault();
	var title = writeForm.title;
	var writer = writeForm.writer;
	var upfile = writeForm.upfile.files;
	var content = writeForm.content.value.trim();
	if(!requiredValid(title)) {
		title.focus();
		return false;
	}
	if(!requiredValid(writer)) {
		writer.focus();
		return false;
	}
}

function onRequiredValid(e) { // title, writer에서 blur, keyup되면
	// var el = this; // e.target;
	requiredValid(this);
}

function requiredValid(el) {
	var next = $(el).next()[0];
	if(el.value.trim() === '') {
		el.classList.add('active');
		next.classList.add('active');
		return false;
	}
	else {
		el.classList.remove('active');
		next.classList.remove('active');
		return true;
	}
}


function onUpfileChange(e) { // upfile에서 change되면
	var next = $(el).next()[0];
	if(this.files.length > 0 && allowType.indexOf(this.files[0].type) === -1) {
		this.classList.add('active');
		next.classList.add('active');
		return false; 
	}
	else {
		this.classList.remove('active');
		next.classList.remove('active');
		return true;
	}
}

/*************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
btLogin.addEventListener('click', onLogin);
btLogout.addEventListener('click', onLogout);
btWrite.addEventListener('click', onWrite);
btClose.addEventListener('click', onClose);
btReset.addEventListener('click', onWriteReset);
writeForm.addEventListener('submit', onWriteSubmit);
writeForm.title.addEventListener('blur', onRequiredValid);
writeForm.title.addEventListener('keyup', onRequiredValid);
writeForm.writer.addEventListener('blur', onRequiredValid);
writeForm.writer.addEventListener('keyup', onRequiredValid);
writeForm.upfile.addEventListener('change', onUpfileChange);




/*************** start init ***************/

