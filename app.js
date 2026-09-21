"use strict";

(function () {
  const HUMAN = "X";
  const AI = "O";

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const STORAGE_KEY = "tictactoe-scoreboard-v1";

  // ---- State ----
  let board = Array(9).fill("");
  let current = HUMAN;
  let gameOver = false;
  let mode = "one"; // "one" | "two"
  let score = { one: { x: 0, o: 0, draw: 0 }, two: { x: 0, o: 0, draw: 0 } };

  // ---- Elements ----
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const newGameBtn = document.getElementById("new-game");
  const resetScoreBtn = document.getElementById("reset-score");
  const modeOneBtn = document.getElementById("mode-one");
  const modeTwoBtn = document.getElementById("mode-two");
  const scoreLabels = {
    you: document.getElementById("score-you-label"),
    them: document.getElementById("score-them-label"),
  };
  const scoreValues = {
    x: document.getElementById("score-you-value"),
    draw: document.getElementById("score-draw-value"),
    o: document.getElementById("score-them-value"),
  };

  // ---- Helpers ----
  function loadScore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.one && parsed.two) score = parsed;
      }
    } catch (err) {
      // Corrupt or unavailable storage: start fresh.
      score = { one: { x: 0, o: 0, draw: 0 }, two: { x: 0, o: 0, draw: 0 } };
    }
  }

  function saveScore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    } catch (err) {
      // Storage unavailable (private mode etc.): keep score in memory only.
    }
  }

  function findWinner(b) {
    for (const [a, c, d] of WIN_LINES) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { player: b[a], line: [a, c, d] };
      }
    }
    return b.every((v) => v) ? { player: "draw", line: [] } : null;
  }

  function minimax(b, player) {
    const result = findWinner(b);
    if (result) {
      if (result.player === AI) return { score: 1 };
      if (result.player === HUMAN) return { score: -1 };
      return { score: 0 };
    }

    let best = null;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = player;
      const evaluation = minimax(b, player === AI ? HUMAN : AI);
      b[i] = "";
      const score = evaluation.score;
      if (
        !best ||
        (player === AI && score > best.score) ||
        (player === HUMAN && score < best.score)
      ) {
        best = { score, index: i };
      }
    }
    return best;
  }

  // ---- Rendering ----
  function renderBoard() {
    boardEl.innerHTML = "";
    board.forEach((value, i) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell" + (value ? " " + value.toLowerCase() : "");
      cell.dataset.index = String(i);
      cell.textContent = value;
      cell.setAttribute("aria-label", "Cell " + (i + 1) + (value ? ": " + value : ": empty"));
      boardEl.appendChild(cell);
    });
  }

  function renderStatus(text) {
    statusEl.textContent = text;
  }

  function renderScore() {
    const s = score[mode];
    scoreValues.x.textContent = String(s.x);
    scoreValues.o.textContent = String(s.o);
    scoreValues.draw.textContent = String(s.draw);
    if (mode === "one") {
      scoreLabels.you.textContent = "You (X)";
      scoreLabels.them.textContent = "Computer (O)";
    } else {
      scoreLabels.you.textContent = "Player 1 (X)";
      scoreLabels.them.textContent = "Player 2 (O)";
    }
  }

  function highlightWin(line) {
    line.forEach((i) => {
      boardEl.children[i].classList.add("win");
    });
  }

  function lockBoard() {
    Array.from(boardEl.children).forEach((cell) =>
      cell.classList.add("disabled")
    );
  }

  // ---- Game flow ----
  function finishTurn(result) {
    gameOver = true;
    lockBoard();
    const s = score[mode];
    if (result.player === "draw") {
      s.draw += 1;
      renderStatus("It's a draw!");
    } else if (mode === "one") {
      if (result.player === HUMAN) {
        s.x += 1;
        renderStatus("You win!");
      } else {
        s.o += 1;
        renderStatus("Computer wins!");
      }
    } else {
      if (result.player === HUMAN) {
        s.x += 1;
        renderStatus("Player 1 wins!");
      } else {
        s.o += 1;
        renderStatus("Player 2 wins!");
      }
    }
    highlightWin(result.line);
    saveScore();
    renderScore();
  }

  function aiMove() {
    renderStatus("Computer is thinking…");
    const move = minimax(board.slice(), AI).index;
    board[move] = AI;
    renderBoard();
    const result = findWinner(board);
    if (result) {
      finishTurn(result);
    } else {
      current = HUMAN;
      renderStatus("Your turn (X)");
    }
  }

  function onCellClick(event) {
    const cell = event.target.closest(".cell");
    if (!cell || gameOver) return;
    const index = Number(cell.dataset.index);
    if (board[index]) return;

    const mark = mode === "one" ? HUMAN : current === HUMAN ? HUMAN : AI;
    board[index] = mark;
    renderBoard();

    const result = findWinner(board);
    if (result) {
      finishTurn(result);
      return;
    }

    if (mode === "one") {
      current = AI;
      setTimeout(aiMove, 250);
    } else {
      current = current === HUMAN ? AI : HUMAN;
      renderStatus(current === HUMAN ? "Player 1's turn (X)" : "Player 2's turn (O)");
    }
  }

  function newGame() {
    board = Array(9).fill("");
    current = HUMAN;
    gameOver = false;
    renderBoard();
    renderStatus(mode === "one" ? "Your turn (X)" : "Player 1's turn (X)");
  }

  function setMode(next) {
    mode = next;
    modeOneBtn.classList.toggle("active", mode === "one");
    modeTwoBtn.classList.toggle("active", mode === "two");
    renderScore();
    newGame();
  }

  function resetScore() {
    score[mode] = { x: 0, o: 0, draw: 0 };
    saveScore();
    renderScore();
  }

  // ---- Init ----
  loadScore();
  renderBoard();
  renderScore();
  renderStatus("Your turn (X)");

  boardEl.addEventListener("click", onCellClick);
  newGameBtn.addEventListener("click", newGame);
  resetScoreBtn.addEventListener("click", resetScore);
  modeOneBtn.addEventListener("click", function () {
    setMode("one");
  });
  modeTwoBtn.addEventListener("click", function () {
    setMode("two");
  });
})();
