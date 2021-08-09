/**
 * 기능정의
 * ! 1. 참여인원을 선택할 수 있는 입력창이 화면에 보인다.
 * ! 2. 참여인원 입력 후 확인버튼을 누르면 확인버튼이 시작버튼으로 바뀐다.
 * ! 3. 확인버튼 옆에 취소버튼이 생기고 버튼 클릭시 앞단계로 돌아갈 수 있다.
 * ! 4. 참여인원 입력 후 확인버튼을 누르면 선수가 참여인원만큼 생성된다.
 * ! 5. 생성된 참여인원 밑에 입력창이 생기고 이름을 입력할 수 있다.
 * ! 6. 시작버튼을 클릭하면 경주가 시작되고 랜덤하게 결과가 나온다.
 * ! 7. 마지막 주자가 결승선을 통과하면 모달창이 떠오르며 경주결과를 알려준다.
 * ! 8. 경주결과 확인 후 닫기 버튼을 누르면 초기화 상태로 돌아간다.
 */

 console.log( document.initForm.cnt.value ); //js
 console.log( document.querySelector('form[name="initForm"] input[name="cnt"]').value ); //js
 console.log( $('form[name="initForm"] input[name="cnt"]').val() ); //jquery
 console.log( $('#cnt').val() ); //jquery