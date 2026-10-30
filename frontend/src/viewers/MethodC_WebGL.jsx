// 방식 C WebGL (Three.js) + Web Worker
// - 데이터 수신 구조는 방식 B와 동일 (Worker + ref)
// - 로봇마다 Mesh를 한 번만 생성하고, 매 프레임 위치/색만 갱신 -> GPU가 그림
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WS_URL } from '../config';
import { stats } from '../stats';

export const MethodC_WebGL = () => {
  const containerRef = useRef(null); // Three.js <canvas>를 담는 <div>
  const robotsRef = useRef([]);      // 최신 로봇 배열
  const meshesRef = useRef({});      // 로봇 id -> Mesh

  useEffect(() => {
    const worker = new Worker(new URL('../worker.js', import.meta.url), { type: 'module' });
    worker.postMessage({ type: 'CONNECT', url: WS_URL });

    worker.onmessage = (e) => {
      if (e.data.type === 'ROBOT_UPDATES') {
        robotsRef.current = e.data.payload;
        stats.received = e.data.payload.length; // 측정 패널에 수신 대수 전달
      }
    };

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    // 2D용 직교 카메라. top=height, bottom=0 이어야 Y축이 뒤집히지 않음 (뒤집히면 back-face culling으로 안 보임)
    const camera = new THREE.OrthographicCamera(0, width, height, 0, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x111111);

    meshesRef.current = {}; // 리마운트 시 초기화
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.CircleGeometry(8, 16);                       // 모든 로봇이 공유
    const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let animationId;
    const render = () => {
      robotsRef.current.forEach((robot) => {
        let mesh = meshesRef.current[robot.id];
        if (!mesh) { // 처음 보는 로봇이면 한 번만 생성
          mesh = new THREE.Mesh(geometry, greenMaterial);
          scene.add(mesh);
          meshesRef.current[robot.id] = mesh;
        }
        mesh.position.set(robot.x, height - robot.y, 0); // Canvas(Y 아래) -> WebGL(Y 위) 좌표 변환
        mesh.material = robot.status === 'ERROR' ? redMaterial : greenMaterial;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      worker.terminate();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      Object.values(meshesRef.current).forEach((m) => scene.remove(m));
      meshesRef.current = {};
      geometry.dispose();
      greenMaterial.dispose();
      redMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
};
