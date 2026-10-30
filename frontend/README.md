# Frontend (벤치마크 클라이언트)

React + Vite 세 가지 렌더링 방식을 화면 상단 버튼으로 선택하고, 오른쪽 아래 패널에서 10초 측정을 실행합니다.
로봇 대수는 `../backend/server.js`의 `ROBOT_COUNT`로 설정합니다.

## 실행

측정은 production 빌드로 수행합니다 (개발 모드는 React 개발용 검사와 StrictMode 때문에 방식 A가 실제보다 느리게 측정됨).

```bash
npm install
npm run build && npm run preview   # http://localhost:4173  (측정용)
```

코드 확인 디버깅만 할 때는 개발 서버를 사용합니다.

```bash
npm run dev                        # http://localhost:5173  (측정에는 사용하지 않음)
```

백엔드(`../backend`)가 먼저 실행되어 있어야 합니다. 코드를 수정한 뒤에는 `npm run build`를 다시 실행해야 preview에 반영됩니다.

## 구조

| 파일 | 역할 |
|---|---|
| `src/viewers/MethodA_ReactDom.jsx` | 방식 A: React state + DOM `<div>` (Baseline) |
| `src/viewers/MethodB_Canvas.jsx` | 방식 B: Canvas 2D + Web Worker |
| `src/viewers/MethodC_WebGL.jsx` | 방식 C: WebGL(Three.js) + Web Worker |
| `src/worker.js` | WebSocket 수신·JSON 파싱을 담당하는 Worker (B, C 공용) |
| `src/FpsMeter.jsx` | FPS / Heap / Long Task / DOM 측정 패널, CSV 복사 |
| `src/stats.js` | 뷰어가 수신한 로봇 수를 측정 패널에 전달하는 공용 카운터 |
| `src/config.js` | 서버 주소, 측정 시간 |
