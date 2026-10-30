// 벤치마크용 WebSocket 서버
// 가상 로봇 ROBOT_COUNT대의 좌표를 INTERVAL_MS마다 JSON으로 전송함
// 로봇 대수를 바꾸려면 아래 상수를 수정하고 서버를 재시작: 50 → 100 → 300 → 500
const { WebSocketServer } = require('ws');

const ROBOT_COUNT = 500;   // 로봇 대수 (측정 조건: 50 / 100 / 300 / 500)
const INTERVAL_MS = 10;   // 전송 주기 10ms = 초당 100회
const PORT = 8080;

// 로봇 생성: 무작위 위치, 90% NORMAL / 10% ERROR
let robots = Array.from({ length: ROBOT_COUNT }, (_, i) => ({
  id: i + 1,
  x: Math.random() * 800 + 50, // 50~850
  y: Math.random() * 600 + 50, // 50~650
  status: Math.random() > 0.1 ? 'NORMAL' : 'ERROR',
}));

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket Server running on ws://localhost:${PORT} (robots: ${ROBOT_COUNT}, interval: ${INTERVAL_MS}ms)`);

wss.on('connection', (ws) => {
  console.log('🔗 Client connected');

  // INTERVAL_MS마다 모든 로봇을 조금씩 움직이고 전체 배열을 전송
  const timer = setInterval(() => {
    robots = robots.map((robot) => ({
      ...robot,
      x: Math.max(20, Math.min(1800, robot.x + (Math.random() - 0.5) * 6)),
      y: Math.max(20, Math.min(1000, robot.y + (Math.random() - 0.5) * 6)),
    }));

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(robots));
    }
  }, INTERVAL_MS);

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clearInterval(timer);
  });
});


