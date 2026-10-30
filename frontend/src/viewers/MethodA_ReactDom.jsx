// 방식 A (Baseline): 기본 React DOM
// - Worker 없이 메인 스레드에서 WebSocket 수신 + JSON.parse
// - 데이터가 올 때마다 setState → 로봇 N개 <div> 전체가 Virtual DOM diff 대상
// - left/top으로 위치 지정 → 브라우저 reflow 발생
import { useEffect, useState } from 'react';
import { WS_URL } from '../config';
import { stats } from '../stats';

export const MethodA_ReactDom = () => {
  const [robots, setRobots] = useState([]); // state → 바뀔 때마다 리렌더링

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      stats.received = data.length; // 측정 패널에 수신 대수 전달
      setRobots(data);              // 초당 100회 setState
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {robots.map((robot) => (
        <div
          key={robot.id}
          data-robot=""
          style={{
            position: 'absolute',
            left: `${robot.x}px`,
            top: `${robot.y}px`,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: robot.status === 'ERROR' ? '#FF0000' : '#00FF00',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
