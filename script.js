/* ============================================================
   NỘI DUNG NHÓM ĐIỀN — chỉ sửa trong khối này, không cần đụng
   phần logic bên dưới.
   ============================================================ */

// SCREEN 0
const SITE_TITLE = "[TÊN ĐỀ TÀI — nhóm điền]";
const VOTE_QUESTION_INTRO = "[2–3 câu mô tả cách chơi — nhóm điền]";

// SCREEN 1 — 6 tình huống, đúng thứ tự & người phụ trách ở bảng mục 2 của spec.
// Nguyên tắc thang điểm đã chốt: mỗi lựa chọn tác động MẠNH 1 trục (+2/-2) và
// NHẸ/TRUNG TÍNH trục còn lại (-1/0/+1) để tạo đánh đổi thật giữa Đức và Tài.
const SCENARIOS = [
  {
    id: 1,
    layer: "sinh_vien",
    owner: "B",
    title: "[Tên tình huống 1 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 1 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.146" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.146" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.146" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 1]",
  },
  {
    id: 2,
    layer: "sinh_vien",
    owner: "B",
    title: "[Tên tình huống 2 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 2 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.147" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.157" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.147" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 2]",
  },
  {
    id: 3,
    layer: "nghe_nghiep",
    owner: "C",
    title: "[Tên tình huống 3 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 3 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.136-137" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.136-137" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.136-137" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 3]",
  },
  {
    id: 4,
    layer: "nghe_nghiep",
    owner: "C",
    title: "[Tên tình huống 4 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 4 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.135-136" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.135-136" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.135-136" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 4]",
  },
  {
    id: 5,
    layer: "quyen_luc",
    owner: "D",
    title: "[Tên tình huống 5 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 5 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.92" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.141" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.92" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 5]",
  },
  {
    id: 6,
    layer: "quyen_luc",
    owner: "D",
    title: "[Tên tình huống 6 — nhóm điền]",
    stimulus: "[Đoạn mô tả tình huống 6 — placeholder]",
    choices: [
      { text: "[Lựa chọn A]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả A]", source: "tr.141-142" },
      { text: "[Lựa chọn B]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả B]", source: "tr.141-142" },
      { text: "[Lựa chọn C]", deltaDuc: 0, deltaTai: 0, feedback: "[Hậu quả C]", source: "tr.141-142" },
    ],
    insight: "[Câu chốt liên hệ nguyên tắc — tình huống 6]",
  },
];

// SCREEN 2 — ngưỡng đã chốt = 0/0 (xem mục "Đã chốt" trong spec, mục SCREEN 2).
const THRESHOLD_DUC = 0;
const THRESHOLD_TAI = 0;

const QUADRANTS = {
  vua_hong_vua_chuyen: {
    name: "Vừa hồng vừa chuyên",
    desc: "[2–3 câu giải thích ý nghĩa góc này — placeholder]",
  },
  dang_tin_bat_luc: {
    name: "Đáng tin nhưng bất lực",
    desc: "[2–3 câu giải thích ý nghĩa góc này — placeholder]",
  },
  vo_hai_vo_dung: {
    name: "Vô hại vì vô dụng",
    desc: "[2–3 câu giải thích ý nghĩa góc này — placeholder]",
  },
  nguy_hiem_nhat: {
    name: "Nguy hiểm nhất",
    desc: "[2–3 câu giải thích ý nghĩa góc này — placeholder]",
  },
};

// SCREEN 3
const THEORY_SUMMARY = "[Tóm tắt tr.135–138: đức là gốc, tài là phương tiện — phụ trách: A]";
const THEORY_PRINCIPLES = "[Tóm tắt 3 nguyên tắc rèn đức, tr.144–148 — phụ trách: A]";
const AI_DECLARATION = "[Công cụ dùng, phần giữ, phần sửa/bỏ — nhóm điền]";
const EXTERNAL_SOURCES = [
  // { label: "[Tên nguồn]", note: "[Ghi chú ngắn]" },
];

// SCREEN 4 — Phương án lưu dữ liệu đã chọn: B (Google Form).
// Nhóm cập nhật TAY các số dưới đây sau khi tổng hợp Google Form, trước buổi thuyết trình.
const CLASS_STATS = {
  totalPlays: 0,
  votePercentDuc: 0,
  votePercentTai: 0,
  quadrantPercents: {
    vua_hong_vua_chuyen: 0,
    dang_tin_bat_luc: 0,
    vo_hai_vo_dung: 0,
    nguy_hiem_nhat: 0,
  },
};

/* ============================================================
   LOGIC — không cần sửa phần dưới đây để điền nội dung.
   ============================================================ */

const state = {
  initialVote: null,
  scenarioIndex: 0,
  totalDuc: 0,
  totalTai: 0,
  answeredCurrent: false,
};

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo(0, 0);
}

/* ---------- SCREEN 0 ---------- */
function initScreen0() {
  $("site-title").textContent = SITE_TITLE;
  document.querySelector(".intro-text").textContent = VOTE_QUESTION_INTRO;

  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.initialVote = btn.dataset.vote;
      $("btn-start").disabled = false;
    });
  });

  $("btn-start").addEventListener("click", () => {
    localStorage.setItem("hcm_t21_initialVote", state.initialVote);
    renderScenario();
    showScreen("screen-1");
  });
}

/* ---------- SCREEN 1 ---------- */
function renderScenario() {
  const scenario = SCENARIOS[state.scenarioIndex];
  state.answeredCurrent = false;

  $("progress-label").textContent = `Tình huống ${state.scenarioIndex + 1}/${SCENARIOS.length}`;
  $("progress-fill").style.width = `${((state.scenarioIndex + 1) / SCENARIOS.length) * 100}%`;
  $("stimulus-text").textContent = scenario.stimulus;

  const list = $("choices-list");
  list.innerHTML = "";
  scenario.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleChoice(idx, btn));
    list.appendChild(btn);
  });

  $("feedback-block").classList.add("hidden");
  $("insight-block").classList.add("hidden");
}

function handleChoice(idx, btnEl) {
  if (state.answeredCurrent) return;
  state.answeredCurrent = true;

  const scenario = SCENARIOS[state.scenarioIndex];
  const choice = scenario.choices[idx];

  document.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
  btnEl.classList.add("chosen");

  state.totalDuc += choice.deltaDuc;
  state.totalTai += choice.deltaTai;

  $("feedback-text").textContent = choice.feedback;
  $("delta-duc").textContent = `Đức: ${choice.deltaDuc >= 0 ? "+" : ""}${choice.deltaDuc}`;
  $("delta-tai").textContent = `Tài: ${choice.deltaTai >= 0 ? "+" : ""}${choice.deltaTai}`;
  $("feedback-source").textContent = choice.source ? `Nguồn: ${choice.source}` : "";
  $("feedback-block").classList.remove("hidden");

  $("insight-text").textContent = scenario.insight;
  $("btn-next-scenario").textContent =
    state.scenarioIndex === SCENARIOS.length - 1 ? "Xem kết quả" : "Tình huống tiếp theo";
  $("insight-block").classList.remove("hidden");
}

$("btn-next-scenario") && $("btn-next-scenario").addEventListener("click", () => {
  if (state.scenarioIndex === SCENARIOS.length - 1) {
    renderResult();
    showScreen("screen-2");
  } else {
    state.scenarioIndex += 1;
    renderScenario();
  }
});

/* ---------- SCREEN 2 ---------- */
function classify(totalDuc, totalTai) {
  if (totalDuc >= THRESHOLD_DUC && totalTai >= THRESHOLD_TAI) return "vua_hong_vua_chuyen";
  if (totalDuc >= THRESHOLD_DUC && totalTai < THRESHOLD_TAI) return "dang_tin_bat_luc";
  if (totalDuc < THRESHOLD_DUC && totalTai < THRESHOLD_TAI) return "vo_hai_vo_dung";
  return "nguy_hiem_nhat";
}

function renderResult() {
  const key = classify(state.totalDuc, state.totalTai);
  const quadrant = QUADRANTS[key];

  $("quadrant-name").textContent = quadrant.name;
  $("quadrant-desc").textContent = quadrant.desc;

  const initialVote = state.initialVote || localStorage.getItem("hcm_t21_initialVote");
  const voteLabel = initialVote === "tai" ? "Tài" : "Đức";
  $("vote-compare").textContent = `Đầu game bạn chọn: ${voteLabel}. Kết quả cuối: ${quadrant.name}.`;

  // Vẽ chấm kết quả trên biểu đồ SVG (viewBox 300x300, tâm 150,150).
  // Thang điểm mỗi trục tối đa ±12 (6 tình huống x ±2) → scale = 120/12 = 10px/điểm.
  const SCALE = 10;
  const clampedDuc = Math.max(-12, Math.min(12, state.totalDuc));
  const clampedTai = Math.max(-12, Math.min(12, state.totalTai));
  const cx = 150 + clampedTai * SCALE;
  const cy = 150 - clampedDuc * SCALE;
  $("result-dot").setAttribute("cx", cx);
  $("result-dot").setAttribute("cy", cy);
}

$("btn-view-reference") && $("btn-view-reference").addEventListener("click", () => {
  renderReference();
  showScreen("screen-3");
});

$("btn-replay") && $("btn-replay").addEventListener("click", () => {
  state.scenarioIndex = 0;
  state.totalDuc = 0;
  state.totalTai = 0;
  state.answeredCurrent = false;
  document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
  $("btn-start").disabled = true;
  showScreen("screen-0");
});

$("link-class-stats") && $("link-class-stats").addEventListener("click", (e) => {
  e.preventDefault();
  renderClassStats();
  showScreen("screen-4");
});

/* ---------- SCREEN 3 ---------- */
function renderReference() {
  $("theory-summary").textContent = THEORY_SUMMARY;
  $("theory-principles").textContent = THEORY_PRINCIPLES;
  $("ai-declaration").textContent = AI_DECLARATION;

  const citationList = $("scenario-citations");
  citationList.innerHTML = "";
  SCENARIOS.forEach((s) => {
    const li = document.createElement("li");
    const sources = s.choices.map((c) => c.source).filter(Boolean).join(", ");
    li.textContent = `${s.id}. ${s.title} — ${sources || "(chưa có trích dẫn)"}`;
    citationList.appendChild(li);
  });

  const sourceList = $("external-sources");
  sourceList.innerHTML = "";
  if (EXTERNAL_SOURCES.length === 0) {
    const li = document.createElement("li");
    li.textContent = "[Chưa có nguồn ngoài giáo trình — nhóm điền nếu có]";
    sourceList.appendChild(li);
  } else {
    EXTERNAL_SOURCES.forEach((src) => {
      const li = document.createElement("li");
      li.textContent = `${src.label} — ${src.note}`;
      sourceList.appendChild(li);
    });
  }
}

$("btn-back-from-reference") && $("btn-back-from-reference").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- SCREEN 4 ---------- */
function renderClassStats() {
  $("stat-total-plays").textContent = CLASS_STATS.totalPlays;
  $("stat-vote-duc").textContent = `${CLASS_STATS.votePercentDuc}%`;
  $("stat-vote-tai").textContent = `${CLASS_STATS.votePercentTai}%`;

  const list = $("stats-quadrants");
  list.innerHTML = "";
  Object.keys(QUADRANTS).forEach((key) => {
    const li = document.createElement("li");
    const pct = CLASS_STATS.quadrantPercents[key] ?? 0;
    li.innerHTML = `<span>${QUADRANTS[key].name}</span><span>${pct}%</span>`;
    list.appendChild(li);
  });
}

$("btn-back-from-stats") && $("btn-back-from-stats").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- Khởi động ---------- */
initScreen0();
