# Backend (벤치마크 테스트 서버)

가상 로봇의 좌표와 상태를 WebSocket으로 전송합니다. 실제 로봇 대신 부하를 만드는 용도입니다.

## 실행

```bash
npm install
npm start          # ws://localhost:8080
```

## 로봇 대수 변경

`server.js` 상단의 상수를 수정하고 서버를 재시작합니다.

```js
const ROBOT_COUNT = 50;   // 50 -> 100 -> 300 -> 500 순서로 변경하며 측정
const INTERVAL_MS = 10;   // 전송 주기 (초당 100회)
```

## 전송 데이터 형식

```json
[{ "id": 1, "x": 412.3, "y": 230.1, "status": "NORMAL" }, ...]
```
