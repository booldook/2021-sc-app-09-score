/*************** global init **************/
var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var dbRoot = database.ref('root');
var stRoot = storage.ref().child('imgs');
var upfile;


/************** user function *************/
function genFile() {
	var folder = moment().format('YYYYMMDDHH');
	return {
		folder: folder,
		file: folder + '_' + uuidv4()
	}
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
		var uploader = stRoot.child(savename.folder).child(savename.file).put(file);
		uploader.on('state_changed', onUploading, onUploadError, onUploaded);
	}
}

function onUploading(snapshot) {
	console.log('uploading', snapshot.bytesTransferred);
	console.log('uploading', snapshot.totalBytes);
	console.log('======================');
	upfile = snapshot;
}

function onUploaded() {
	upfile.ref.getDownloadURL().then(onSuccess).catch(onError);
}

function onUploadError(err) {
	if(err.code === 'storage/unauthorized') location.href = '../403.html';
	else console.log('error', err);
}

function onSuccess(r) {
	console.log(r);
}

function onError(err) {
	console.log(err);
}

/*************** event init ***************/
auth.onAuthStateChanged(onAuthChanged);
$('.bt-login').click(onLogin);
$('.bt-logout').click(onLogout);
$('form[name="uploadForm"]').submit(onSubmit);

/*************** start init ***************/

