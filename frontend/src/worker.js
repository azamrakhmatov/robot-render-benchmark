// Web Worker: WebSocket 수신과 JSON.parse를 메인 스레드 밖에서 처리
// 메인 스레드에는 16.6ms(60fps)마다 최신 배열만 전달함
let socket = null;
let pendingData = [];
let lastFlushTime = 0;
const FLUSH_INTERVAL = 16.6;

self.onmessage = (e) => {
  if (e.data.type === 'CONNECT') {
    socket = new WebSocket(e.data.url);

    socket.onmessage = (event) => {
      pendingData = JSON.parse(event.data); // 파싱은 Worker에서

      const now = performance.now();
      if (now - lastFlushTime >= FLUSH_INTERVAL) {
        self.postMessage({ type: 'ROBOT_UPDATES', payload: pendingData });
        lastFlushTime = now;
      }
    };
  }
};
