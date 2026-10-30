// 뷰어 -> 측정 패널로 전달하는 공용 카운터 (React state 아님 -> 리렌더링 없음)
// 각 뷰어가 서버에서 배열을 받을 때마다 received를 갱신하고, FpsMeter가 읽어서 표시함
export const stats = {
  received: 0, // 마지막으로 수신한 로봇 배열의 길이
};
