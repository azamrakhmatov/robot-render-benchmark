# 캡처 목록

| 파일 | 조건 | 내용 |
|---|---|---|
| monitor-A-500-4x.png | CPU 4x, 500대, 방식 A | Performance monitor: CPU 94%, Layouts/sec 56, Style recalcs 56. 10:43:40 지점이 다른 방식 → A 전환 순간 |
| monitor-B-500-4x.png | CPU 4x, 500대, 방식 B | Performance monitor: CPU 5~12%, Layouts 2(패널 갱신), heap 톱니(GC) 패턴 |
| monitor-C-500-4x.png | CPU 4x, 500대, 방식 C | Performance monitor: CPU 11%, Layouts 2, heap 톱니 패턴 |
| monitor-C-500-nothrottle.png | 제한 없음, 500대, 방식 C | 비교용: CPU 9.6%, DOM 58 |
| perf-A-50.png | 제한 없음, 50대, A | Performance 녹화: S 167 / R 100 / P 76, Layout shifts 트랙에 이벤트 다수 |
| perf-B-50.png | 제한 없음, 50대, B | Performance 녹화: S 27 / R 5 / P 8 |
| perf-C-50.png | 제한 없음, 50대, C | Performance 녹화: S 101 / R 13 / P 20 |
| perf-A-100.png | 제한 없음, 100대, A | Performance 녹화: S 205 / R 165 / P 206 |
| perf-B-100.png | 제한 없음, 100대, B | Performance 녹화: S 87 / R 14 / P 25 |
| perf-C-100.png | 제한 없음, 100대, C | Performance 녹화: S 121 / R 16 / P 22 |
| perf-A-300.png | 제한 없음, 300대, A | Performance 녹화: S 388 / R 379 / P 322, 0.5초 주기 GC |
| perf-B-300.png | 제한 없음, 300대, B | Performance 녹화: S 126 / R 14 / P 27, 3~5초 주기 큰 GC |
| perf-C-300.png | 제한 없음, 300대, C | Performance 녹화: S 235 / R 12 / P 20 |
| perf-A-500.png | 제한 없음, 500대, A | Performance 녹화: S 558 / R 642 / P 661, 메인 스레드 17% |
| perf-B-500.png | 제한 없음, 500대, B | Performance 녹화: S 167 / R 12 / P 27 |
| perf-C-500.png | 제한 없음, 500대, C | Performance 녹화: S 323 / R 14 / P 19 |
| mem-A-500.png | 제한 없음, 500대, A | Heap snapshot 8.1 MB, `<div>`×509 등 DOM 객체 |
| mem-B-500.png | 제한 없음, 500대, B | Heap snapshot 5.1 MB, DOM 객체 없음 |
| mem-C-500.png | 제한 없음, 500대, C | Heap snapshot 6.9 MB, Mesh×501 |
| taskmgr-{A,B,C}-500.png | 제한 없음, 500대 | Chrome 작업 관리자: 146 / 151 / 149 MB |
| vm-B-500.png | 제한 없음, 500대, B | Memory 탭 VM 목록: Main 22.8 MB + worker 3.6 MB |
| vm-C-500.png | 제한 없음, 500대, C | Memory 탭 VM 목록: Main 17.3 MB + worker 27.5 MB (GC 직전, ↑3.4 MB/s) |
| mem-{A,B,C}-300.png | 제한 없음, 300대 | Heap snapshot 7.0 / 5.1 / 6.6 MB |
| taskmgr-{A,B,C}-300.png | 제한 없음, 300대 | Chrome 작업 관리자: 137 / 136 / 138 MB |
| vm-{B,C}-300.png | 제한 없음, 300대 | VM 목록: worker 25.8 / 26.1 MB (GC 직전) |
| mem-{A,B,C}-100.png | 제한 없음, 100대 | Heap snapshot 6.0 / 5.1 / 6.3 MB |
| taskmgr-{A,B,C}-100.png | 제한 없음, 100대 | Chrome 작업 관리자: 126 / 135 / 133 MB |
| vm-{B,C}-100.png | 제한 없음, 100대 | VM 목록: worker 9.6 / 8.4 MB |
| mem-{A,B,C}-50.png | 제한 없음, 50대 | Heap snapshot 5.7 / 5.1 / 6.2 MB |
| taskmgr-{A,B,C}-50.png | 제한 없음, 50대 | Chrome 작업 관리자: 124 / 140 / 143 MB |
| vm-{B,C}-50.png | 제한 없음, 50대 | VM 목록: worker 5.7 / 5.1 MB |
