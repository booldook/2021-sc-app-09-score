/* 
$().method().method().mothod()
"2021082414_76ea3b52-1394-4c04-9b3b-2084d1".substring(시작idx, idx앞에까지)
"2021082414_76ea3b52-1394-4c04-9b3b-2084d1".substring(7, 10) "414"
"2021082414_76ea3b52-1394-4c04-9b3b-2084d1".substr(시작idx, 갯수);
"2021082414_76ea3b52-1394-4c04-9b3b-2084d1".substr(7, 3);     "414"


$().next() 			// 바로 다음				nextSibling
$().prev()			// 바로 전					previousSibling
$().parent()		// 내 부모					parentNode
$().parents()		// 내 조상들				parentNode
$().siblings()	// 내 형제자매
$().children()	// 내 자식					childNodes
$().find()			// 내 자손					childNodes

firebase data처리
1. 실시간
db.on('child_added', onAdded);			// return 추가된 데이터
db.on('child_changed', onChanged);	// return 수정된 데이터
db.on('child_removed', onRemoved);	// return 삭제된 데이터
2. 이벤트에 의해서...
db.push().key												// 데이터 저장
db.set({})													// 데이터 수정
db.remove()													// 데이터 삭제
db.get()														// 데이터 가져오기
*/


/*************** global init **************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var firebaseDatabase = firebase.database();
var firebaseStorage = firebase.storage();
var db = firebaseDatabase.ref('root/board');
var ref = db.orderByChild('idx');
var storage = firebaseStorage.ref('root/board');
var user = null;
var allowType = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
var exts = ['../img/jpg.png', '../img/png.png', '../img/gif.png', '../img/video.png'];

/************** element init **************/
var btSave = document.querySelector('.write-wrapper .bt-save');				// 글작성 버튼
var btLogin = document.querySelector('.header-wrapper .bt-login');		// 로긴 버튼
var btLogout = document.querySelector('.header-wrapper .bt-logout');	// 로그아웃 버튼
var btWrite = document.querySelector('.list-wrapper .bt-write');			// 글작성 모달창 오픈버튼
var btWrite2 = document.querySelector('.view-wrapper .bt-write');			// 글작성 모달창 오픈버튼
var btUpdate = document.querySelector('.view-wrapper .bt-update');		// 글수정
var btDelete = document.querySelector('.view-wrapper .bt-delete');		// 글삭제
var btClose = document.querySelector('.write-wrapper .bt-close');			// 글작성 모달창 클로즈버튼
var btReset = document.querySelector('.write-wrapper .bt-reset');			// 글작성 모달창 리셋버튼
var writeWrapper = document.querySelector('.write-wrapper');					// 글작성 모달창
var writeForm = document.writeForm;																		// 글작성 form
var writeTitle = writeWrapper.querySelector('h2.title');
var oldFile = writeWrapper.querySelector('.oldfile');
var thumbFile = writeWrapper.querySelector('.thumb');
var deleteFile = writeWrapper.querySelector('.file-delete');
var loading = document.querySelector('.write-wrapper .loading-wrap');	// 파일 업로드 로딩바
var tbody = document.querySelector('.list-tbl tbody');
var recent = document.querySelector('.recent-wrapper .list-wp');
var listWrapper = document.querySelector('.list-wrapper');
var viewWrapper = document.querySelector('.view-wrapper');
var updateWrapper = document.querySelector('.update-wrapper');
var tr;

var observer; 		// IntersectionObserver의 Instance
var listCnt = 5; 	// 데이터를 한번에 불러올 갯수
var globalKey = null;

/************** user function *************/
function viewButton(chk) {
	if(chk && user && globalKey === user.uid) {
		btUpdate.style.display = 'block';
		btDelete.style.display = 'block';
	}
	else {
		btUpdate.style.display = 'none';
		btDelete.style.display = 'none';
	}
}

function viewShow(el) {
	switch(el) {
		case 'LIST':
			listWrapper.style.display = 'block';
			viewWrapper.style.display = 'none';
			globalKey = null;
			recent.innerHTML = '';
			recentInit(ref);
			listInit();
			break;
		case 'VIEW':
			listWrapper.style.display = 'none';
			viewWrapper.style.display = 'block';
			break;
	}
}

function goView(k) {
	// location.href = './view.html?key='+k;
	viewShow('VIEW');
	db
	.child(k)
	.get()
	.then(onGetView)
	.catch(onGetError);
}

function setNavi(prev, next) {
	if(prev) {
		var html = '<div onclick="goView(\''+prev.key+'\');">'+prev.title+'</div>';
		viewWrapper.querySelector('.prev-page .link').innerHTML = html;
	}
	else {
		viewWrapper.querySelector('.prev-page .link').innerHTML = '이전글이 없습니다.';
	}
	if(next) {
		var html = '<div onclick="goView(\''+next.key+'\');">'+next.title+'</div>';
		viewWrapper.querySelector('.next-page .link').innerHTML = html;
	}
	else {
		viewWrapper.querySelector('.next-page .link').innerHTML = '다음글이 없습니다.';
	}
}

function listInit() { // 처음, 데이터를 생성
	tbody.innerHTML = '';
	ref
		.limitToFirst(listCnt)
		.get()
		.then(onGetData)
		.catch(onGetError);
}

function recentInit(ref) { 
	ref
		.limitToFirst(1)
		.get()
		.then(onGetRecent)
		.catch(onGetError);
}

function setHTML(k, v) {
	var n = tbody.querySelectorAll('tr').length + 1;
	var html = '<tr data-idx="'+v.idx+'" data-key="'+k+'">';
	html += '<td>'+n+'</td>';
	html += '<td  onclick="goView(\''+k+'\');">';
	if(v.upfile) {
		html += '<img src="'+exts[allowType.indexOf(v.upfile.file.type)]+'" class="icon">';
	}
	html += v.title;
	html += '</td>';
	html += '<td>'+v.writer+'</td>';
	html += '<td>'+moment(v.createdAt).format('YYYY-MM-DD')+'</td>';
	html += '<td>'+(v.readcnt || 0)+'</td>';
	html += '</tr>';
	tbody.innerHTML += html;
	tr = tbody.querySelectorAll('tr');
	observer.observe(tr[tr.length - 1]);
	sortTr();
}

function sortTr() {
	var total = tbody.querySelectorAll('tr').length;
	tbody.querySelectorAll('tr').forEach(function(v, i) {
		v.querySelector('td').innerHTML = total - i;
	});
}


function removeFile(fname, key, cb) {
	storage.child(fname.substr(0, 10)).child(fname)
	.delete()
	.then(onRemoveDone)
	.catch(onRemoveError);
	function onRemoveDone() {
		db.child(key).update({ upfile: null });
		oldFile.style.display = 'none';
		if(cb) cb();
	}
	function onRemoveError(err) {
		console.log(err);
		alert('삭제에 실패하였습니다. 관리자에게 문의하세요.');
	}
}

/************** event callback ************/
function onUpdate(e) {
	db.child(this.dataset['key']).once('value', function(v) {
		if(user && v.val().user === user.uid) {
			onWrite(e, e.target.dataset['key']);
		}
		else {
			alert('권한이 없습니다.');
			viewShow('LIST');
		}
	}); 
	
}

function onDelete(e) {
	var key = this.dataset['key'];
	if(confirm('정말로 삭제하시겠습니까?')) {
		db.child(key).once('value', function(v) {
			if(user && v.val().user === user.uid) {
				if(v.val().upfile) removeFile(v.val().upfile.name, key, function() {
					db.child(key).remove();
					viewShow('LIST');
				});
			}
			else {
				alert('권한이 없습니다.');
				viewShow('LIST');
			}
		});
	}
}

function onGetView(r) {
	globalKey = r.val().user;
	viewButton(true);
	viewWrapper.querySelector('.title-wrap .content').innerHTML = r.val().title;
	viewWrapper.querySelector('.writer-wrap .content').innerHTML = r.val().writer;
	viewWrapper.querySelector('.datetime-wrap .content').innerHTML = moment(r.val().createdAt).format('YYYY-MM-DD HH:mm:ss');
	viewWrapper.querySelector('.readnum-wrap .content').innerHTML = r.val().readcnt || 0;
	viewWrapper.querySelector('.content-wrap').innerHTML = r.val().content || '';
	btUpdate.dataset['key'] = r.key;
	btDelete.dataset['key'] = r.key;
	if(r.val().upfile) {
		var html = '';
		if(allowType.indexOf(r.val().upfile.file.type) === 3) {
			html 	= '<div class="my-3 text-center">';
			html += '<video autoplay muted loop controls class="mw-100">';
			html += '<source src="'+r.val().upfile.path+'"></source>';
			html += '</video>';
			html += '</div>';
		}
		else {
			html 	= '<div class="my-3 text-center">';
			html += '<img src="'+r.val().upfile.path+'" class="mw-100">';
			html += '</div>';
		}
		viewWrapper.querySelector('.content-wrap').innerHTML += html;
	}
	// prev, next 만들기
	var prev = null;
	var next = null;
	ref.startAt(r.val().idx).limitToFirst(2).get().then(function(r2) {
		r2.forEach(function(v) {
			if(v.key && v.key != r.key) prev = { key: v.key, title: v.val().title };
		});
		setNavi(prev, next);
	}).catch(onGetError);
	ref.endAt(r.val().idx).limitToLast(2).get().then(function(r2) {
		r2.forEach(function(v) {
			if(v.key && v.key != r.key) next = { key: v.key, title: v.val().title };
		});
		setNavi(prev, next);
	}).catch(onGetError);

	// readcnt update
	db.child(r.key).update({
		readcnt: r.val().readcnt ? r.val().readcnt + 1 : 1
	})
}

function onObserver(el, observer) {
	el.forEach(function(v) {
		if(v.isIntersecting) {
			tr = tbody.querySelectorAll('tr');
			var last = Number(tr[tr.length - 1].dataset['idx']);
			ref.startAfter(last).limitToFirst(listCnt).get().then(onGetData).catch(onGetError);
			observer.unobserve(v.target);
		}
	});
}

function onGetData(r) {
	r.forEach(function(v, i) {
		setHTML(v.key, v.val());
	});
}


function onGetRecent(r) {
	if(r.numChildren() > 0) { // 데이터가 존재함
		r.forEach(function(v, i) {
			var isImg = v.val().upfile && v.val().upfile.file.type !== allowType[3];
			if(isImg) {
				var html  = '<li class="list" data-key="'+v.key+'" data-idx="'+v.val().idx+'" style="background-image: url(\''+v.val().upfile.path+'\');" onclick="goView(\''+v.key+'\');">';
				html += '<div class="ratio"></div>';
				html += '</li>';
				recent.innerHTML += html;
			}
			var li = recent.querySelectorAll('li');
			var cnt = li.length;
			var last = cnt - 1;
			if(last < 5) recentInit(ref.startAfter(v.val().idx));
		});
	}
}

function onGetError(err) {
	console.log(err)
}

function onAuthChanged(r) { // login, logout 상태가 변하면...
	user = r;
	if(user) {	// 로그인 되면 UI가 할일
		btLogin.style.display = 'none';
		btLogout.style.display = 'block';
		btWrite.style.display = 'inline-block';
		btWrite2.style.display = 'inline-block';
		viewButton(true);
	}
	else {	// 로그아웃 되면 UI가 할일
		btLogin.style.display = 'block';
		btLogout.style.display = 'none';
		btWrite.style.display = 'none';
		btWrite2.style.display = 'none';
		viewButton(false);
	}
}

function onLogin() {	// btLogin이 클릭되면
	auth.signInWithPopup(googleAuth);
}

function onLogout() {	// btLogout이 클릭되면
	auth.signOut();
}

function onWrite(e, key) { // 모달창이 오픈되면
	loading.style.display = 'none';
	$(writeWrapper).stop().fadeIn(300);
	writeForm.key.value = '';
	writeTitle.innerHTML = '게시글 작성';
	btSave.innerHTML = '글쓰기';
	oldFile.style.display = 'none';
	writeForm.title.focus();
	// update처리
	if(key) db.child(key).once('value', onGetUpdate);
	function onGetUpdate(r) {
		writeForm.key.value = key;
		writeForm.title.value = r.val().title;
		writeForm.writer.value = r.val().writer;
		writeForm.content.value = r.val().content;
		writeTitle.innerHTML = '게시글 수정';
		btSave.innerHTML = '수정하기';
		if(r.val().upfile) {
			oldFile.style.display = 'flex';
			var isImg = r.val().upfile && r.val().upfile.file.type !== allowType[3];
			deleteFile.dataset['key'] = r.key;
			oldFile.querySelector('.filename').innerHTML = r.val().upfile.file.name;
			if(isImg) {
				thumbFile.src = r.val().upfile.path;
				thumbFile.classList.remove('video');
			}
			else {
				thumbFile.src = '../img/video.png';
				thumbFile.classList.add('video');
			}
		}
	}
}

function onDeleteFile(e) {
	if(confirm('첨부파일을 삭제하시겠습니까?')) {
		var key = this.dataset['key'];
		db.child(key).once('value', function(r) {
			var filename = r.val().upfile.name;
			removeFile(filename, key);
		});
	}
}

function onClose() { // 모달창이 닫히면
	$(writeWrapper).stop().fadeOut(300);
	onWriteReset();
}

function onWriteReset(e) {
	writeForm.reset(); // button[type="reset"] 클릭
	writeForm.title.value = '';
	writeForm.title.classList.remove('active');
	writeForm.writer.value = '';
	writeForm.writer.classList.remove('active');
	writeForm.content.value = '';
	document.querySelectorAll('.required-comment').forEach(function(v, i) {
		v.classList.remove('active');
	});
}

function onWriteSubmit(e) { // btSave클릭시(글 저장시), validation 검증
	e.preventDefault();
	var title = writeForm.title;
	var writer = writeForm.writer;
	var upfile = writeForm.upfile;
	var content = writeForm.content;
	var key = writeForm.key.value;
	var upload;			// 파일 업로드 객체
	var data = {}; 	// 저장할 데이터 객체
	if(!user) {
		alert('로그인 후 이용하세요.');
		return false;
	}
	if(!requiredValid(title)) {
		title.focus();
		return false;
	}
	if(!requiredValid(writer)) {
		writer.focus();
		return false;
	}
	if(!upfileValid(upfile)) {
		return false;
	}

	// firebase save
	data.title = title.value;
	data.writer = writer.value;
	data.content = content.value;

	function a() {
		console.log('a 실행됨');
	}

	if(key) {	// 수정
		db.child(key).once('value', onGetData);
		function onGetData(r) {
			if(upfile.files.length) {
				if(r.val().upfile) removeFile(r.val().upfile.name, key, saveFile);
				else saveFile();
			}
			else saveAfter();
		}
	}
	else {	// 신규
		data.user = user.uid;
		data.createAt = new Date().getTime();
		data.readcnt = 0;
		db.limitToLast(1).get().then(getLastIdx).catch(onGetError);
		function getLastIdx(r) {
			if(r.numChildren() === 0) data.idx = 999999999;
			else r.forEach(function(v) { data.idx = Number(v.val().idx) - 1 });
			if(upfile.files.length) saveFile();
			else saveAfter();
		}
	}

	function saveFile() {
		var file = {
			name: upfile.files[0].name,
			size: upfile.files[0].size,
			type: upfile.files[0].type
		}
		var savename = genFile();
		var uploader = storage.child(savename.folder).child(savename.file).put(upfile.files[0]);
		uploader.on('state_changed', onUploading, onUploadError, onUploaded);
		data.upfile = { folder: 'root/board/'+savename.folder, name: savename.file, file: file };
	}

	function onUploading(snapshot) { // 파일이 업로드 되는 동안
		loading.style.display = 'flex';
		upload = snapshot;
	}
	
	function onUploaded() { // 파일 업로드 완료 후
		upload.ref.getDownloadURL().then(onSuccess).catch(onError);
	}
	
	function onUploadError(err) { // 파일 업로드 실패 시
		loading.style.display = 'none';
		if(err.code === 'storage/unauthorized') location.href = '../403.html';
		else {
			alert('파일 업로드에 실패하였습니다. 관리자에게 문의 후 다시 시도해 주세요.');
			console.log('error', err);
		}
	}

	function onSuccess(r) { // r: 실제 웹으로 접근 가능한 경로
		console.log(r);
		data.upfile.path = r;
		saveAfter();
	}

	function onError(err) {
		alert('파일 가져오기에 실패하였습니다. 다시 시도해 주세요.');
		console.log(err);
	}

	function saveAfter() {
		if(key) db.child(key).update(data);
		else db.push(data).key; // firebase저장
		onClose();
		viewShow('LIST');
	}
} // onWriteSubmit() 끝

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
	upfileValid(this);
}

function upfileValid(el) {
	var next = $(el).next()[0];
	if(el.files.length > 0 && allowType.indexOf(el.files[0].type) === -1) {
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

function onLoadingClick(e) { // 로딩바가 돌때 클릭 막기
	e.stopPropagation();
	e.preventDefault();
}

/*************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
btLogin.addEventListener('click', onLogin);
btLogout.addEventListener('click', onLogout);
btWrite.addEventListener('click', onWrite);
btWrite2.addEventListener('click', onWrite);
btUpdate.addEventListener('click', onUpdate);
btDelete.addEventListener('click', onDelete);
btClose.addEventListener('click', onClose);
btReset.addEventListener('click', onWriteReset);
deleteFile.addEventListener('click', onDeleteFile);
writeForm.addEventListener('submit', onWriteSubmit);
writeForm.title.addEventListener('blur', onRequiredValid);
writeForm.title.addEventListener('keyup', onRequiredValid);
writeForm.writer.addEventListener('blur', onRequiredValid);
writeForm.writer.addEventListener('keyup', onRequiredValid);
writeForm.upfile.addEventListener('change', onUpfileChange);
loading.addEventListener('click', onLoadingClick);


// db.on('child_added', onAdded);
// db.on('child_changed', onChanged);
// db.on('child_removed', onRemoved);


/*************** start init ***************/
observer = new IntersectionObserver(onObserver, {rootMargin: '-100px'});
listInit();
recent.innerHTML = '';
recentInit(ref);




/* var isImg = v.val().upfile && v.val().upfile.file.type !== allowType[3]; // upfile이 이미지인 경우
	if(isImg) setRecentHTML(v.key, v.val());
	else { // 이미지가 아님
		if(recent.querySelector('li')) {
			var li = recent.querySelectorAll('li');
			var idx = li[li.length - 1].dataset['idx'];
			recentInit(ref.startAfter(idx));
		}
		else {

			recentInit(ref);
		}
	}
	*/