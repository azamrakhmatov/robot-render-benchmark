// 방식 B: Canvas 2D + Web Worker
// - WebSocket 수신과 JSON.parse는 Worker에서 처리 (메인 스레드 부담 감소)
// - 최신 배열은 ref에만 저장 → React 리렌더링 없음
// - requestAnimationFrame 루프에서 <canvas> 하나에 원을 직접 그림 (DOM 요소 0개)
import { useEffect, useRef } from 'react';
import { WS_URL } from '../config';
import { stats } from '../stats';

export const MethodB_Canvas = () => {
  const canvasRef = useRef(null);
  const robotsRef = useRef([]); // 최신 로봇 배열 (state 아님)

  useEffect(() => {
    const worker = new Worker(new URL('../worker.js', import.meta.url), { type: 'module' });
    worker.postMessage({ type: 'CONNECT', url: WS_URL });

    worker.onmessage = (e) => {
      if (e.data.type === 'ROBOT_UPDATES') {
        robotsRef.current = e.data.payload;
        stats.received = e.data.payload.length; // 측정 패널에 수신 대수 전달
      }
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기

      robotsRef.current.forEach((robot) => {
        ctx.beginPath();
        ctx.arc(robot.x, robot.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = robot.status === 'ERROR' ? '#FF0000' : '#00FF00';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      worker.terminate();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};
