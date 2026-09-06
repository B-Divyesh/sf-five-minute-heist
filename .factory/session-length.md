# Session-length measurement

The intended session is 4–6 minutes. This is a player-paced planning measure, not a forced game timer.

Run `npm test -- --grep @claim:session-length` from a clean setup. The check starts on a reset sample board. It allows five 48-second planning intervals and a final 30-second route review. Then it enters the real winning route and waits for the actual end screen. It records elapsed wall-clock time from the ready board to that screen. It accepts only 240,000–360,000 ms.

The planning intervals represent time spent reading the loops, board, and five-move preview before each choice. The game does not block, delay, or force that time. A player may finish sooner or spend longer. The measured run checks a planning session, not a loading or animation duration.
