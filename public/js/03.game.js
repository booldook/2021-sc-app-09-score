/**
 * 기능정의
 * ! 1. 참여인원을 선택할 수 있는 입력창이 화면에 보인다.
 * ! 2. 참여인원 입력 후 준비버튼을 누르면 준비버튼이 시작버튼으로 바뀐다.
 * ! 3. 시작버튼 옆에 취소버튼이 생기고 버튼 클릭시 앞단계로 돌아갈 수 있다.
 * ! 4. 참여인원 입력 후 확인버튼을 누르면 선수가 참여인원만큼 생성된다.
 * ! 5. 생성된 참여인원 밑에 입력창이 생기고 이름을 입력할 수 있다.
 * ! 6. 시작버튼을 클릭하면 경주가 시작되고 랜덤하게 결과가 나온다.
 * ! 7. 마지막 주자가 결승선을 통과하면 모달창이 떠오르며 경주결과를 알려준다.
 * ! 8. 경주결과 확인 후 닫기 버튼을 누르면 초기화 상태로 돌아간다.
 */

// database 저장
/*
{
	uid: '',
	ip: '',
	dt: 1693474929398,
	result: [
		{ name: '홍길동', speed: 1513 },
		{ name: '홍길순', speed: 1523 },
		{ name: '홍길만', speed: 1578 },
		{ name: '홍길룡', speed: 1629 }
	]
}
*/

console.log( document.initForm.cnt.value ); //js
console.log( document.querySelector('form[name="initForm"] input[name="cnt"]').value ); //js
console.log( $('form[name="initForm"] input[name="cnt"]').val() ); //jquery
console.log( $('#cnt').val() ); //jquery

/*************** global init **************/



/************** user function *************/
function addMember(selector, n) {
	for(var i=0, html; i<n; i++) {
		html  = '<div class="member-wp">';
		html += '<div class="imgs">';
		html += '<img src="../img/marathon.png" class="w100">';
		html += '</div>';
		html += '<input type="text" name="member" class="form-control">';
		html += '</div>';
		$(selector).append(html);
	}
}

function addList(selector, data) {
	for(var i=0, html; i<data.length; i++) {
		html  = '<tr>';
		html += '<td class="score">'+(i + 1)+'등</td>';
		html += '<td class="name">'+data[i].name+'</td>';
		html += '<td class="time">'+data[i].speed/1000+'초</td>';
		html += '</tr>';
		$(selector).append(html);
	}
}

function removeEl(selector, empty) {
	if(empty) $(selector).empty();
	else $(selector).remove(); 
}

function getTarget() {
	return ($('.stage-wrap').outerWidth() - $('.member-wp').outerWidth() - 10) + 'px';
}

/************** event callback ************/
function onInit() {
	$('.bt-init').hide();
	$('.bt-start').show();
	$('.bt-reset').show();
	$('#cnt').attr('readonly', true);
	addMember('.stage-wrap', $('#cnt').val());
}

function onStart() {
	var cnt = $('.member-wp').length, num = 0;
	var members = []; // 선수 정보
	var result = []; 	// 결과 sorting

	$('.bt-start').attr('disabled', true);
	$('.bt-reset').attr('disabled', true);
	$('.modal-wrapper .datetime').html(moment().format('YYYY년 M월 D일 HH시 mm분 ss초'));
	$('.member-wp').each(function(i) {
		members.push({
			name: $(this).find('input').val().trim() || (i+1) + '번',
			speed: random(1500, 200)
		});
	}); // members 데이터 넣기 완료
	// result = JSON.parse(JSON.stringify(members)); // Deepcopy
	result = _.cloneDeep(members); // Deepcopy
	result.sort(function(a, b) { return a.speed - b.speed });
	addList('.modal-wrapper .list-tbody', result); // table 생성 끝
	$('.member-wp').each(function(i) { // animation
		$(this).stop().animate({'left': getTarget()}, members[i].speed, function() {
			if(++num === cnt) $('.modal-wrapper').show();
		});
	});
}

function onReset() {
	$('.bt-init').attr('disabled', false).show();
	$('.bt-start').attr('disabled', false).hide();
	$('.bt-reset').attr('disabled', false).hide();
	$('#cnt').val(4).focus().attr('readonly', false);
	removeEl('.stage-wrap', true);
	removeEl('.modal-wrapper .list-tbody', true);
	removeEl('.modal-wrapper .datetime', true);
}

function onModalClose() {
	$('.modal-wrapper').hide();
	$('.main-wrapper .bt-reset').attr('disabled', false);
}

/*************** event init ***************/
$('.main-wrapper .bt-init').click(onInit);
$('.main-wrapper .bt-start').click(onStart);
$('.main-wrapper .bt-reset').click(onReset);

$('.modal-wrapper .bt-close').click(onModalClose);



/*************** start init ***************/

