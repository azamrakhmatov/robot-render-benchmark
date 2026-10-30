# 그래프 원본 데이터

보고서의 그래프는 아래 CSV 값으로 작성했다.

| 파일 | 보고서 | 내용 | 출처 |
|---|---|---|---|
| chart1-main-thread-work.csv | 그림 3 | 로봇 대수별 메인 스레드 작업량 (Scripting+Rendering+Painting, ms, 10초 녹화) | results.md 조건 3 |
| chart2-fps-cpu4x.csv | 그림 1 | 로봇 대수별 평균 FPS (CPU 4× slowdown, 500대는 3회 중간값) | results.md 조건 2 |
| chart3-cpu-usage-cpu4x.csv | 그림 2 | 로봇 대수별 메인 스레드 CPU 점유율 (CPU 4× slowdown) | results.md 조건 2 Performance monitor |

chart3의 값은 Performance monitor에서 읽은 관측 범위의 중간값이다 (예: A/500대 89~93% → 91).
