// 측정 패널: FPS, 프레임 시간 분포, Long Task, JS Heap 메모리, DOM 노드 수, 수신 로봇 수
// 로봇 대수는 서버에서 받은 배열 길이(수신 로봇)로 자동 기록됨
// 측정 결과는 "결과 복사" 버튼으로 CSV 한 줄로 복사 → docs/results.md 표에 바로 붙일 수 있음
//
// 주의
// - Heap은 Chrome 전용 performance.memory 사용. 메인 스레드 heap만 측정되며 Worker heap은 포함되지 않음
//   (B/C 전체 메모리는 Chrome 작업 관리자(Shift+Esc)로 확인)
// - heapMin은 측정 중 GC 직후의 최저값 → 실제 사용 메모리에 가까운 하한선. heapMax − heapMin ≈ GC 압력
import { useEffect, useRef, useState } from 'react';
import { MEASURE_DURATION_MS } from './config';

const WARMUP_MS = 300; // 측정 시작 직후 300ms는 제외 (버튼 클릭·패널 리렌더링 프레임이 섞이지 않도록)
import { stats } from './stats';

const MB = 1024 * 1024;
const heapMB = () => (performance.memory ? performance.memory.usedJSHeapSize / MB : null); // Chrome 전용, 없으면 null
const domNodes = () => document.getElementsByTagName('*').length;                              // 페이지 전체 요소 수
const robotNodes = () => document.querySelectorAll('[data-robot]').length;                    // 로봇 <div> 수 (A만 >0)
const r1 = (v) => (v == null ? null : +v.toFixed(1));                                          // 소수 1자리, null 유지

export const FpsMeter = ({ mode }) => {
  const [live, setLive] = useState({ fps: 0, heap: null, dom: 0, robots: 0, received: 0 }); // 0.5초마다 갱신되는 실시간 값
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const runningRef = useRef(false);
  const dataRef = useRef({ frames: [], longTasks: 0, start: 0, heapStart: null, heapMin: null, heapMax: null });

  useEffect(() => {
    stats.received = 0; // 새 조합(방식/대수)로 바뀌면 수신 카운터 초기화
    let id;
    let last = performance.now();
    let acc = last;
    let countFrames = 0;

    // 10초 종료 시 결과 계산
    const finish = () => {
      const d = dataRef.current;
      const f = d.frames;
      const total = f.reduce((a, b) => a + b, 0);
      const sorted = [...f].sort((a, b) => a - b);
      const worst = sorted[sorted.length - 1];
      setResult({
        mode,
        robots: stats.received,                                      // 서버에서 받은 로봇 수 (= server.js의 ROBOT_COUNT)
        avgFps: r1((f.length * 1000) / total),                       // 평균 FPS
        minFps: r1(1000 / worst),                                    // 최저 FPS
        p95Ms: r1(sorted[Math.floor(sorted.length * 0.95)]),         // 95% 프레임이 이 시간 이하
        worstMs: r1(worst),                                          // 가장 느린 프레임
        slowFrames: f.filter((x) => x > 33.4).length,                // 30FPS 미만 프레임 수
        longTasks: d.longTasks,                                      // 50ms 이상 블로킹 횟수
        heapStartMB: r1(d.heapStart),
        heapMinMB: r1(d.heapMin),                                    // GC 직후 최저값 (실사용 메모리 하한)
        heapMaxMB: r1(d.heapMax),                                    // 최대값 (GC 전 누적)
        heapEndMB: r1(heapMB()),
        domNodes: domNodes(),                                        // 페이지 전체 요소 수
        robotNodes: robotNodes(),                                    // 로봇 DOM 요소 수 (A = 대수, B/C = 0)
      });
      runningRef.current = false;
      setRunning(false);
    };

    // 매 프레임 호출
    const tick = (now) => {
      const dt = now - last;
      last = now;
      countFrames++;

      if (runningRef.current) {
        const d = dataRef.current;
        const elapsed = now - d.start;
        if (elapsed >= WARMUP_MS) {           // 워밍업 이후 프레임만 기록
          d.frames.push(dt);
          const h = heapMB();
          if (h != null) {
            if (d.heapMin == null || h < d.heapMin) d.heapMin = h; // 최저 heap 추적
            if (d.heapMax == null || h > d.heapMax) d.heapMax = h; // 최대 heap 추적
          }
        }
        if (elapsed >= MEASURE_DURATION_MS + WARMUP_MS) finish();
      }
      // 측정 중에는 패널 실시간 갱신(setLive)을 멈춰 측정 자체가 프레임 시간에 영향을 주지 않게 함
      if (!runningRef.current && now - acc >= 500) {
        setLive({
          fps: Math.round((countFrames * 1000) / (now - acc)),
          heap: r1(heapMB()),
          dom: domNodes(),
          robots: robotNodes(),
          received: stats.received,
        });
        countFrames = 0;
        acc = now;
      }
      if (runningRef.current) { countFrames = 0; acc = now; } // 측정 중엔 live 구간을 계속 리셋
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    // Long Task 감지 (Chrome 계열만 지원)
    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        if (runningRef.current) dataRef.current.longTasks += list.getEntries().length;
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      /* 미지원 브라우저는 건너뜀 */
    }

    return () => {
      cancelAnimationFrame(id);
      if (observer) observer.disconnect();
    };
  }, [mode]);

  const start = () => {
    const h = heapMB();
    dataRef.current = { frames: [], longTasks: 0, start: performance.now(), heapStart: h, heapMin: h, heapMax: h };
    runningRef.current = true;
    setResult(null);
    setCopied(false);
    setRunning(true);
  };

  // CSV 한 줄 복사 (헤더는 docs/results.md 참고)
  const copy = () => {
    if (!result) return;
    const r = result;
    const line = [
      r.mode, r.robots, r.avgFps, r.minFps, r.p95Ms, r.worstMs, r.slowFrames, r.longTasks,
      r.heapStartMB ?? '', r.heapMinMB ?? '', r.heapMaxMB ?? '', r.heapEndMB ?? '', r.domNodes, r.robotNodes,
    ].join(',');
    navigator.clipboard.writeText(line).then(() => setCopied(true));
  };

  const fmt = (v, unit = '') => (v == null ? 'N/A' : `${v}${unit}`);
  // 방식 A에서 로봇 DOM 수가 수신 대수와 다르면 이전 뷰어가 남아 있다는 뜻 → 새로고침 후 재측정
  const warn = result && result.mode === 'A' && result.robotNodes !== result.robots;

  return (
    <div style={{
      position: 'fixed', right: 12, bottom: 12, zIndex: 20, width: 270,
      padding: 10, background: 'rgba(0,0,0,0.85)', color: '#fff',
      fontFamily: 'monospace', fontSize: 13, borderRadius: 6, lineHeight: 1.5,
    }}>
      <div>현재 FPS: <b>{live.fps}</b> / 수신 로봇: <b>{live.received}</b></div>
      <div>Heap: <b>{fmt(live.heap, ' MB')}</b></div>
      <div>DOM 전체: <b>{live.dom}</b> / 로봇 DOM: <b>{live.robots}</b></div>
      <button onClick={start} disabled={running} style={{ margin: '6px 0', padding: '4px 8px' }}>
        {running ? '측정 중 (10초, 패널 갱신 일시정지)...' : '10초 측정 시작'}
      </button>
      {result && (
        <div>
          <div><b>{result.mode} / {result.robots}대</b></div>
          {warn && <div style={{ color: '#FFAA00' }}>⚠ 로봇 DOM 수 ≠ 수신 대수. 새로고침 후 재측정 권장</div>}
          <div>평균 FPS: {result.avgFps}</div>
          <div>최저 FPS: {result.minFps}</div>
          <div>95% 프레임 ≤ {result.p95Ms} ms</div>
          <div>최악 프레임: {result.worstMs} ms</div>
          <div>느린 프레임 (&gt;33ms): {result.slowFrames}</div>
          <div>Long Task: {result.longTasks}</div>
          <div>Heap 최저/최대: {fmt(result.heapMinMB)} / {fmt(result.heapMaxMB)} MB</div>
          <div>Heap 시작/종료: {fmt(result.heapStartMB)} / {fmt(result.heapEndMB)} MB</div>
          <div>DOM 전체: {result.domNodes} / 로봇 DOM: {result.robotNodes}</div>
          <button onClick={copy} style={{ marginTop: 6, padding: '4px 8px' }}>
            {copied ? '복사됨 ✓' : '결과 복사 (CSV)'}
          </button>
        </div>
      )}
    </div>
  );
};
