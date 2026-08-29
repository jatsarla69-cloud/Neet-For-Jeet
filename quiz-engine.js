/* ============================================================
   Shared Quiz Engine — NEET Notes + Quiz App
   One question at a time · countdown timer · skip · report card

   Usage:
     QuizEngine.run(containerEl, questions, {
       timePerQuestion: 60,           // seconds per question (default 60)
       onFinish: function(stats){}    // optional callback when quiz ends
     });

   Each question object:
     { text, options: [...], correct: <index of right option>, explain: '', tag: '' }

   Include this file with a plain <script src="quiz-engine.js"></script>
   before it's used. It injects its own styles (namespaced "qe-") and
   reads the app's existing CSS variables (--bg, --card, --border,
   --text, --muted, --accent, --correct, --wrong etc.) with sensible
   fallbacks, so it matches the app's dark theme automatically.
   ============================================================ */
(function (global) {

  function injectStyles() {
    if (document.getElementById('qe-styles')) return;
    var style = document.createElement('style');
    style.id = 'qe-styles';
    style.textContent = [
      '.qe-wrap{max-width:640px;margin:0 auto;font-family:inherit;}',
      '.qe-progress{font-size:12.5px;color:var(--muted,#9aa3b2);margin-bottom:6px;font-weight:600;}',
      '.qe-progress b{color:var(--accent,#4f8cff);}',
      '.qe-progress-track{height:5px;border-radius:4px;background:var(--border,#2a2f3a);overflow:hidden;margin-bottom:14px;}',
      '.qe-progress-fill{height:100%;background:var(--accent,#4f8cff);transition:width .25s ease;}',
      '.qe-timer-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;}',
      '.qe-timer-track{flex:1;height:8px;border-radius:6px;background:var(--border,#2a2f3a);overflow:hidden;}',
      '.qe-timer-fill{height:100%;width:100%;background:var(--accent,#4f8cff);transition:width 1s linear;}',
      '.qe-timer-fill.qe-timer-warn{background:var(--wrong,#ef5350);}',
      '.qe-timer-label{font-size:12.5px;color:var(--muted,#9aa3b2);min-width:34px;text-align:right;font-weight:700;}',
      '.qe-card{background:var(--card,#171a21);border:1px solid var(--border,#2a2f3a);border-radius:14px;padding:18px 16px;margin-bottom:14px;}',
      '.qe-tag{display:inline-block;font-size:11px;background:var(--tag,#3a2f6b);color:#c9c3ff;padding:3px 9px;border-radius:20px;margin-bottom:10px;}',
      '.qe-qtext{font-size:15.5px;line-height:1.6;margin-bottom:14px;white-space:pre-line;}',
      '.qe-options{display:flex;flex-direction:column;gap:8px;}',
      '.qe-option{text-align:left;background:#1e222c;border:1px solid var(--border,#2a2f3a);color:var(--text,#eef1f6);padding:11px 13px;border-radius:10px;font-size:14.5px;cursor:pointer;line-height:1.5;transition:border-color .15s,background .15s;}',
      '.qe-option:hover:not(:disabled){border-color:var(--accent,#4f8cff);}',
      '.qe-option:disabled{cursor:default;}',
      '.qe-option.qe-correct-pick{background:var(--correct-bg,#123524);border-color:var(--correct,#2fbf71);color:#c9f5da;}',
      '.qe-option.qe-wrong-pick{background:var(--wrong-bg,#3a1a1a);border-color:var(--wrong,#ef5350);color:#ffd6d4;}',
      '.qe-option.qe-reveal-correct{border-color:var(--correct,#2fbf71);box-shadow:inset 0 0 0 1px var(--correct,#2fbf71);}',
      '.qe-option.qe-dim{opacity:.55;}',
      '.qe-feedback{margin-top:12px;padding:12px 13px;border-radius:10px;font-size:14px;line-height:1.6;display:none;}',
      '.qe-feedback.show{display:block;animation:qeFadeIn .25s ease;}',
      '.qe-feedback.right{background:var(--correct-bg,#123524);border:1px solid var(--correct,#2fbf71);color:#d7f7e3;}',
      '.qe-feedback.wrong{background:var(--wrong-bg,#3a1a1a);border:1px solid var(--wrong,#ef5350);color:#ffe1df;}',
      '.qe-feedback.skip,.qe-feedback.timeout{background:#20242e;border:1px solid var(--border,#2a2f3a);color:var(--muted,#9aa3b2);}',
      '.qe-status{font-weight:700;margin-bottom:4px;display:block;}',
      '.qe-explain{color:var(--muted,#9aa3b2);margin-top:6px;}',
      '@keyframes qeFadeIn{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}',
      '.qe-controls{display:flex;justify-content:flex-end;gap:8px;}',
      '.qe-skip-btn{background:none;border:1px solid var(--border,#2a2f3a);color:var(--muted,#9aa3b2);font-size:13px;padding:8px 16px;border-radius:20px;cursor:pointer;font-weight:600;}',
      '.qe-skip-btn:hover{color:var(--text,#eef1f6);border-color:var(--wrong,#ef5350);}',
      '.qe-next-btn{background:var(--accent,#4f8cff);border:none;color:#fff;font-size:13.5px;padding:10px 18px;border-radius:20px;cursor:pointer;font-weight:700;}',
      '.qe-report{background:var(--card,#171a21);border:1px solid var(--border,#2a2f3a);border-radius:16px;padding:22px 18px;text-align:center;}',
      '.qe-report-title{font-size:19px;font-weight:800;margin-bottom:4px;}',
      '.qe-report-sub{font-size:12.5px;color:var(--muted,#9aa3b2);margin-bottom:18px;}',
      '.qe-report-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;}',
      '.qe-report-item{background:#1e222c;border:1px solid var(--border,#2a2f3a);border-radius:12px;padding:14px 8px;}',
      '.qe-report-item .qe-num{display:block;font-size:22px;font-weight:800;color:var(--accent,#4f8cff);margin-bottom:2px;}',
      '.qe-report-item.qe-correct .qe-num{color:var(--correct,#2fbf71);}',
      '.qe-report-item.qe-wrong .qe-num{color:var(--wrong,#ef5350);}',
      '.qe-report-item .qe-lbl{font-size:11.5px;color:var(--muted,#9aa3b2);}',
      '.qe-report-time{font-size:13px;color:var(--muted,#9aa3b2);margin-bottom:18px;line-height:1.7;}',
      '.qe-report-time b{color:var(--text,#eef1f6);}',
      '.qe-restart-btn{background:var(--accent,#4f8cff);border:none;color:#fff;font-size:14px;padding:11px 26px;border-radius:22px;cursor:pointer;font-weight:700;}'
    ].join('');
    document.head.appendChild(style);
  }

  function fmtDuration(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    if (m <= 0) return s + 's';
    return m + 'm ' + s + 's';
  }

  function run(container, questions, opts) {
    opts = opts || {};
    var timePerQ = opts.timePerQuestion || 60;
    var onFinish = opts.onFinish || function () {};
    injectStyles();

    if (!questions || questions.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:var(--muted,#9aa3b2);padding:30px 10px;font-size:13px;">Koi questions nahi mile.</div>';
      return;
    }

    var idx = 0;
    var timeLeft = timePerQ;
    var timerInterval = null;
    var qStartTs = null;
    var results = questions.map(function () { return { status: null, timeTaken: 0, chosen: null }; });

    function clearTimer() {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function elapsedSeconds() {
      return qStartTs ? Math.round((Date.now() - qStartTs) / 1000) : 0;
    }

    function updateTimerUI() {
      var fill = container.querySelector('.qe-timer-fill');
      var label = container.querySelector('.qe-timer-label');
      if (!fill || !label) return;
      var pct = Math.max(0, (timeLeft / timePerQ) * 100);
      fill.style.width = pct + '%';
      label.textContent = timeLeft + 's';
      fill.classList.toggle('qe-timer-warn', timeLeft <= 10);
    }

    function startTimer() {
      timeLeft = timePerQ;
      qStartTs = Date.now();
      updateTimerUI();
      clearTimer();
      timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
          clearTimer();
          handleTimeout();
        }
      }, 1000);
    }

    function renderQuestion() {
      var q = questions[idx];
      var progressPct = (idx / questions.length) * 100;
      container.innerHTML =
        '<div class="qe-wrap">' +
          '<div class="qe-progress">Question <b>' + (idx + 1) + '</b> / ' + questions.length + '</div>' +
          '<div class="qe-progress-track"><div class="qe-progress-fill" style="width:' + progressPct + '%"></div></div>' +
          '<div class="qe-timer-row"><div class="qe-timer-track"><div class="qe-timer-fill"></div></div><div class="qe-timer-label">' + timePerQ + 's</div></div>' +
          '<div class="qe-card">' +
            (q.tag ? '<div class="qe-tag">' + q.tag + '</div>' : '') +
            '<div class="qe-qtext"></div>' +
            '<div class="qe-options"></div>' +
            '<div class="qe-feedback"></div>' +
          '</div>' +
          '<div class="qe-controls"><button class="qe-skip-btn">⏭️ Skip</button></div>' +
        '</div>';

      container.querySelector('.qe-qtext').textContent = q.text;

      var optionsDiv = container.querySelector('.qe-options');
      q.options.forEach(function (optText, optIndex) {
        var btn = document.createElement('button');
        btn.className = 'qe-option';
        btn.textContent = optText;
        btn.onclick = function () { handleAnswer(optIndex); };
        optionsDiv.appendChild(btn);
      });

      container.querySelector('.qe-skip-btn').onclick = handleSkip;

      startTimer();
    }

    function lockOptions(selectedIdx, correctIdx) {
      var buttons = container.querySelectorAll('.qe-option');
      buttons.forEach(function (btn, i) {
        btn.disabled = true;
        if (selectedIdx !== null && i === selectedIdx && i === correctIdx) btn.classList.add('qe-correct-pick');
        else if (selectedIdx !== null && i === selectedIdx && i !== correctIdx) btn.classList.add('qe-wrong-pick');
        else if (i === correctIdx) btn.classList.add('qe-reveal-correct');
        else btn.classList.add('qe-dim');
      });
    }

    function showFeedback(html, cls) {
      var fb = container.querySelector('.qe-feedback');
      fb.className = 'qe-feedback show ' + cls;
      fb.innerHTML = html;
    }

    function showControls(autoDelayMs) {
      var controls = container.querySelector('.qe-controls');
      var isLast = idx === questions.length - 1;
      controls.innerHTML = '<button class="qe-next-btn">' + (isLast ? '🏁 Report Card Dekho' : 'Next Question →') + '</button>';
      controls.querySelector('.qe-next-btn').onclick = goNext;
      if (autoDelayMs) setTimeout(goNext, autoDelayMs);
    }

    function handleAnswer(optIndex) {
      clearTimer();
      var q = questions[idx];
      var isCorrect = optIndex === q.correct;
      results[idx] = { status: isCorrect ? 'correct' : 'wrong', timeTaken: elapsedSeconds(), chosen: optIndex };
      lockOptions(optIndex, q.correct);
      var html = '<span class="qe-status">' + (isCorrect ? '✅ सही जवाब!' : '❌ गलत जवाब') + '</span>';
      if (q.explain) html += '<div class="qe-explain">' + q.explain + '</div>';
      showFeedback(html, isCorrect ? 'right' : 'wrong');
      showControls();
    }

    function handleSkip() {
      clearTimer();
      var q = questions[idx];
      results[idx] = { status: 'skipped', timeTaken: elapsedSeconds(), chosen: null };
      lockOptions(null, q.correct);
      showFeedback('<span class="qe-status">⏭️ Skip kar diya</span>', 'skip');
      showControls(600);
    }

    function handleTimeout() {
      var q = questions[idx];
      results[idx] = { status: 'timeout', timeTaken: timePerQ, chosen: null };
      lockOptions(null, q.correct);
      showFeedback('<span class="qe-status">⏰ Time khatam!</span><div class="qe-explain">सही जवाब: <b>' + q.options[q.correct] + '</b></div>', 'timeout');
      showControls(1500);
    }

    function goNext() {
      idx++;
      if (idx >= questions.length) { showReport(); return; }
      renderQuestion();
    }

    function showReport() {
      var total = questions.length;
      var correct = results.filter(function (r) { return r.status === 'correct'; }).length;
      var wrong = results.filter(function (r) { return r.status === 'wrong'; }).length;
      var skipped = results.filter(function (r) { return r.status === 'skipped' || r.status === 'timeout'; }).length;
      var attempted = correct + wrong;
      var totalTime = results.reduce(function (s, r) { return s + r.timeTaken; }, 0);
      var avgTime = total > 0 ? Math.round(totalTime / total) : 0;
      var accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

      container.innerHTML =
        '<div class="qe-wrap">' +
          '<div class="qe-report">' +
            '<div class="qe-report-title">🏁 Report Card</div>' +
            '<div class="qe-report-sub">' + total + ' questions me se</div>' +
            '<div class="qe-report-grid">' +
              '<div class="qe-report-item qe-correct"><span class="qe-num">' + correct + '</span><span class="qe-lbl">Correct</span></div>' +
              '<div class="qe-report-item qe-wrong"><span class="qe-num">' + wrong + '</span><span class="qe-lbl">Wrong</span></div>' +
              '<div class="qe-report-item"><span class="qe-num">' + attempted + '</span><span class="qe-lbl">Attempted</span></div>' +
              '<div class="qe-report-item"><span class="qe-num">' + skipped + '</span><span class="qe-lbl">Skipped</span></div>' +
            '</div>' +
            '<div class="qe-report-time">⏱️ Total time: <b>' + fmtDuration(totalTime) + '</b> · Avg/question: <b>' + fmtDuration(avgTime) + '</b><br>🎯 Accuracy: <b>' + accuracy + '%</b> (attempted questions me se)</div>' +
            '<button class="qe-restart-btn">🔄 Dobara Try Karo</button>' +
          '</div>' +
        '</div>';

      container.querySelector('.qe-restart-btn').onclick = function () {
        idx = 0;
        results = questions.map(function () { return { status: null, timeTaken: 0, chosen: null }; });
        renderQuestion();
      };

      onFinish({ total: total, correct: correct, wrong: wrong, skipped: skipped, attempted: attempted, totalTime: totalTime, avgTime: avgTime, accuracy: accuracy, results: results });
    }

    renderQuestion();
  }

  global.QuizEngine = { run: run };

})(window);
