// 벤치마크 앱: 렌더링 방식(A/B/C) 선택
// 로봇 대수는 backend/server.js의 ROBOT_COUNT 상수로 설정하고 서버를 재시작함 (50 -> 100 -> 300 -> 500)
import { useState } from 'react';
import { MethodA_ReactDom } from './viewers/MethodA_ReactDom';
import { MethodB_Canvas } from './viewers/MethodB_Canvas';
import { MethodC_WebGL } from './viewers/MethodC_WebGL';
import { FpsMeter } from './FpsMeter';

const METHODS = [
  { key: 'A', label: 'A. React DOM (Baseline)', color: '#FF4444', Component: MethodA_ReactDom },
  { key: 'B', label: 'B. Canvas 2D + Worker',   color: '#00FF00', Component: MethodB_Canvas },
  { key: 'C', label: 'C. WebGL + Worker',       color: '#00E5FF', Component: MethodC_WebGL },
];

const btn = (active, color) => ({
  padding: '6px 10px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold',
  backgroundColor: active ? color : '#333', color: active ? '#000' : '#fff',
});

export default function App() {
  const [mode, setMode] = useState('B'); // 초기 모드
  const Active = METHODS.find((m) => m.key === mode).Component;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#111' }}>
      <div style={{ position: 'absolute', top: 10, left: 16, zIndex: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
        <b>방식:</b>
        {METHODS.map((m) => (
          <button key={m.key} onClick={() => setMode(m.key)} style={btn(mode === m.key, m.color)}>{m.label}</button>
        ))}
      </div>

      {/* 방식이 바뀌면 뷰어와 측정 패널을 새로 마운트. 형제 요소의 key는 서로 달라야 함 */}
      <Active key={`viewer-${mode}`} />
      <FpsMeter key={`meter-${mode}`} mode={mode} />
    </div>
  );
}
