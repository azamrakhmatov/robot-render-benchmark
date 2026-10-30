# Robot Render Benchmark

다중 로봇 실시간 관제 화면에서 렌더링 방식별 성능을 정량 비교하는 PoC입니다.
서버가 가상 로봇 N대의 좌표를 초당 100회 WebSocket으로 전송하고, 클라이언트가 세 가지 방식으로 그립니다.

| 방식 | 구현 | 특징 |
|---|---|---|
| A (Baseline) | React DOM | 메인 스레드 수신, setState마다 리렌더링, left/top reflow |
| B | Canvas 2D + Web Worker | Worker에서 파싱, ref + rAF, `<canvas>` 1개에 직접 그림 |
| C | WebGL(Three.js) + Web Worker | Worker에서 파싱, Mesh 재사용, GPU 렌더링 |

로봇 대수: **50 / 100 / 300 / 500**

## 폴더 구조

```
backend/    WebSocket 테스트 서버 (Node.js, ws)
frontend/   벤치마크 클라이언트 (React, Vite, Three.js)
docs/       측정 결과 표, DevTools 캡처
```

## 실행 방법

터미널 2개가 필요합니다.

```bash
# 1) 백엔드
cd backend
npm install
npm start                 # ws://localhost:8080

# 2) 프론트엔드
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## 측정 재현 절차

> **측정은 반드시 production 빌드로 진행합니다.** 개발 모드(`npm run dev`)는 React 개발용 빌드와 StrictMode(이중 마운트) 때문에
> 방식 A가 실제보다 느리게 측정되고, 서버 로그에 접속이 두 번씩 찍힙니다. 코드 확인·디버깅에만 dev 모드를 사용하세요.

```bash
cd frontend
npm run build
npm run preview           # http://localhost:4173
```

1. Chrome에서 `http://localhost:4173` 접속 (Heap 측정은 Chrome 전용 `performance.memory` 사용). 확장 프로그램 영향을 피하려면 시크릿 창 권장.
2. `backend/server.js`의 `ROBOT_COUNT`를 **50**으로 두고 서버 실행. 패널의 **수신 로봇**이 50인지 확인합니다.
3. 상단에서 **방식 A → B → C**를 차례로 선택하며 각각 오른쪽 아래 **"10초 측정 시작"** 클릭.
   방식 A에서는 **로봇 DOM**이 수신 로봇과 같아야 정상입니다. `⚠` 경고가 나오면 페이지를 새로고침하고 다시 측정합니다.
4. 10초 후 결과가 표시되면 **"결과 복사 (CSV)"** 로 복사해 `docs/results.md` 표에 붙입니다.
5. 서버를 중지하고 `ROBOT_COUNT`를 **100 → 300 → 500**으로 바꿔 재시작하며 2~4를 반복합니다 (총 3×4 = 12개 조합).
   각 조합은 2~3회 측정 후 중간값을 사용하는 것을 권장합니다.

측정 지표: 평균 FPS, 최저 FPS, p95 프레임 시간, 최악 프레임, 30FPS 미만 프레임 수, Long Task 수, JS Heap(시작/종료/최대), DOM 노드 수.

## Chrome DevTools 프로파일링

- **Performance 탭**: 측정 중 Record 10초 → Main 스레드 점유율, Long Task(빨간 표시), Frames 확인 → 캡처를 `docs/captures/`에 저장.
- **Memory 탭**: 각 조합에서 Heap snapshot 1회 → Total size, Detached DOM 확인.

측정 환경(브라우저 버전, OS, 화면 해상도, 다른 탭 종료 여부)을 보고서에 함께 기록합니다.

## 측정 조건 고정

- 서버 전송 주기 10ms(초당 100회), 로봇 이동 폭 ±3px 고정
- 브라우저 창 크기 동일, 측정 중 다른 탭·확장 프로그램 비활성화
- 각 조합 측정 전 페이지 새로고침 권장


