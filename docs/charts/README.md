# 그래프 데이터 (Google Sheets용)

각 CSV를 열어 전체 복사 → Google Sheets에 붙여넣기 → 범위 선택 → 삽입 → 차트.
Docs에서는 삽입 → 차트 → Sheets에서 가져오기.

| 파일 | 차트 종류 | 축 | 출처 |
|---|---|---|---|
| chart1-main-thread-work.csv | 꺾은선형 (Line) | X: 로봇 대수, Y: 메인 스레드 작업량 (ms, 10초 기준) | results.md 조건 3 (Scripting+Rendering+Painting) |
| chart2-fps-cpu4x.csv | 세로 막대형 (Column, 그룹) | X: 로봇 대수, Y: 평균 FPS | results.md 조건 2 (CPU 4x, 500대는 3회 중간값) |
| chart3-cpu-usage-cpu4x.csv | 세로 막대형 (Column, 그룹) | X: 로봇 대수, Y: CPU 점유율 (%) | results.md 조건 2 Performance monitor. 관측 범위의 중간값 사용 (예: A/500 89~93% → 91) |

차트 제목 제안
1. 로봇 대수별 메인 스레드 작업량 (CPU 제한 없음, 10초 녹화)
2. 로봇 대수별 평균 FPS (CPU 4× slowdown)
3. 로봇 대수별 메인 스레드 CPU 점유율 (CPU 4× slowdown)

팁
- 차트 1은 Y축이 0에서 시작하도록 설정 (A의 증가 기울기가 잘 보임).
- 차트 2는 Y축 최대 120으로 고정하면 "상한에 붙어 있음"이 명확히 보임.
- 색상은 세 차트 모두 동일하게: A 빨강, B 초록, C 하늘색 (앱 버튼 색과 일치).
