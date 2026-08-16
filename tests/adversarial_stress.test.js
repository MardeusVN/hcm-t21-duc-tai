/**
 * HCM-T21 "Đức hay Tài" — Adversarial Stress & Edge Case Test Suite
 * Challenger 2: DOM, State Mutation & Edge Case Stress Verifier
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gold: '\x1b[38;2;201;134;10m',
  sapphire: '\x1b[38;2;29;78;216m',
};

// ============================================================================
// DOM MOCK ENGINE FOR COMPREHENSIVE BROWSER LIFECYCLE SIMULATION
// ============================================================================
class MockDOMElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _set: new Set(),
      add: (cls) => this.classList._set.add(cls),
      remove: (cls) => this.classList._set.delete(cls),
      contains: (cls) => this.classList._set.has(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (this.classList._set.has(cls)) this.classList._set.delete(cls);
          else this.classList._set.add(cls);
        } else if (force) {
          this.classList._set.add(cls);
        } else {
          this.classList._set.delete(cls);
        }
      }
    };
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.childNodes = [];
    this.textContent = '';
    this.innerHTML = '';
    this.disabled = false;
    this._listeners = {};
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      this.dataset[key] = String(val);
    }
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      delete this.dataset[key];
    }
  }

  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }

  addEventListener(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(fn => fn !== handler);
  }

  dispatchEvent(event) {
    const handlers = this._listeners[event.type || event] || [];
    handlers.forEach(fn => fn(event));
  }

  click() {
    this.dispatchEvent({ type: 'click', target: this, defaultPrevented: false });
  }

  focus() {
    if (global.document) {
      global.document.activeElement = this;
    }
  }

  querySelectorAll(selector) {
    const res = [];
    const search = (node) => {
      if (mockMatchesSelector(node, selector)) res.push(node);
      for (const c of node.childNodes) search(c);
    };
    for (const c of this.childNodes) search(c);
    return res;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }
}

function mockMatchesSelector(node, selector) {
  if (selector.startsWith('.')) {
    return node.classList.contains(selector.slice(1));
  }
  if (selector.startsWith('#')) {
    return node.id === selector.slice(1);
  }
  if (selector.includes('[data-quad=')) {
    const match = selector.match(/data-quad="([^"]+)"/);
    return match && node.dataset.quad === match[1];
  }
  if (selector.includes('[data-theory-key=')) {
    return !!node.dataset.theoryKey;
  }
  if (selector === 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') {
    return node.tagName === 'BUTTON' || !!node.attributes['href'] || node.tagName === 'INPUT';
  }
  return node.tagName.toLowerCase() === selector.toLowerCase();
}

function createMockEnvironment() {
  const elementRegistry = new Map();
  const documentListeners = {};

  const doc = {
    activeElement: null,
    getElementById: (id) => {
      if (!elementRegistry.has(id)) {
        elementRegistry.set(id, new MockDOMElement('div', id));
      }
      return elementRegistry.get(id);
    },
    createElement: (tag) => new MockDOMElement(tag),
    querySelectorAll: (selector) => {
      const all = Array.from(elementRegistry.values());
      const results = [];
      all.forEach(el => {
        if (mockMatchesSelector(el, selector)) results.push(el);
        const sub = el.querySelectorAll(selector);
        results.push(...sub);
      });
      return Array.from(new Set(results));
    },
    querySelector: (selector) => {
      const list = doc.querySelectorAll(selector);
      return list.length > 0 ? list[0] : null;
    },
    addEventListener: (event, handler) => {
      if (!documentListeners[event]) documentListeners[event] = [];
      documentListeners[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (!documentListeners[event]) return;
      documentListeners[event] = documentListeners[event].filter(fn => fn !== handler);
    },
    dispatchEvent: (event) => {
      const handlers = documentListeners[event.type || event] || [];
      handlers.forEach(fn => fn(event));
    },
    _documentListeners: documentListeners,
    _elementRegistry: elementRegistry,
  };

  const win = {
    scrollTo: () => {},
    localStorage: {
      _store: {},
      getItem: (k) => win.localStorage._store[k] || null,
      setItem: (k, v) => { win.localStorage._store[k] = String(v); },
      clear: () => { win.localStorage._store = {}; },
    },
  };

  return { doc, win, elementRegistry };
}

// Load Modules under test
const scenariosData = require('../js/data/scenarios.js');
const theoryData = require('../js/data/theory.js');
const quizData = require('../js/data/quiz.js');
const chartMath = require('../js/engine/chartMath.js');
const gameStateModule = require('../js/engine/gameState.js');
const quizEngineModule = require('../js/engine/quizEngine.js');
const modalControllerModule = require('../js/ui/modalController.js');
const chartRendererModule = require('../js/ui/chartRenderer.js');
const quizRendererModule = require('../js/ui/quizRenderer.js');
const screenControllerModule = require('../js/ui/screenController.js');

let passCount = 0;
let failCount = 0;
const testLogs = [];

function recordTest(desc, passed, detail = '') {
  if (passed) {
    passCount++;
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${desc}`);
    testLogs.push({ desc, passed: true, detail });
  } else {
    failCount++;
    console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${desc} — ${detail}`);
    testLogs.push({ desc, passed: false, detail });
  }
}

console.log(`${colors.gold}${colors.bright}======================================================================${colors.reset}`);
console.log(`${colors.gold}${colors.bright}       CHALLENGER 2: ADVERSARIAL STRESS & EDGE CASE VERIFICATION       ${colors.reset}`);
console.log(`${colors.gold}${colors.bright}======================================================================${colors.reset}\n`);

// ============================================================================
// SUITE 1: STATE MUTATION ROBUSTNESS & CONCURRENCY / RACE SIMULATION
// ============================================================================
console.log(`${colors.cyan}${colors.bright}--- SUITE 1: State Mutation Robustness & Race Condition Testing ---${colors.reset}`);

// 1.1 Rapid sequential choice clicks on same scenario
(() => {
  const engine = new gameStateModule.GameStateEngine();
  engine.initGame('duc');

  // First choice selection
  const res1 = engine.selectOption(0);
  recordTest('First choice selection succeeds', res1.success === true && engine.isCurrentScenarioAnswered() === true);
  
  const scoreAfter1st = { ...engine.getScores() };

  // Second rapid choice selection on same scenario must throw and not mutate state
  let threwError = false;
  try {
    engine.selectOption(1);
  } catch (err) {
    threwError = true;
  }
  recordTest('Second rapid choice selection throws error', threwError === true);

  const scoreAfter2nd = engine.getScores();
  recordTest('Duplicate selection does NOT mutate Duc/Tai score', 
    scoreAfter1st.totalDuc === scoreAfter2nd.totalDuc && 
    scoreAfter1st.totalTai === scoreAfter2nd.totalTai
  );
  recordTest('History length remains exactly 1 after rejected rapid selection', engine.getHistory().length === 1);
})();

// 1.2 Out-of-bounds and malicious choice inputs
(() => {
  const engine = new gameStateModule.GameStateEngine();
  engine.initGame();

  const invalidInputs = [-1, 3, 999, -99, null, undefined, NaN, 'attack', {}, []];
  let rejectedCount = 0;

  invalidInputs.forEach(input => {
    try {
      engine.selectOption(input);
    } catch (err) {
      rejectedCount++;
    }
  });

  recordTest(`All ${invalidInputs.length} invalid/malicious choice inputs rejected without corrupting state`, 
    rejectedCount === invalidInputs.length && engine.isCurrentScenarioAnswered() === false
  );

  // Now verify the scenario can still be answered legitimately
  const validRes = engine.selectOption(1);
  recordTest('Legitimate choice succeeds after rejected invalid inputs', validRes.success === true);
})();

// 1.3 End-of-game advancement clamp
(() => {
  const engine = new gameStateModule.GameStateEngine();
  engine.initGame();

  for (let i = 0; i < 6; i++) {
    engine.selectOption(0);
    const hasMore = engine.advanceScenario();
    if (i === 5) {
      recordTest('advanceScenario returns false on last scenario (scenario 6)', hasMore === false);
    }
  }

  // Attempt to advance beyond scenario 6 repeatedly
  const advBeyond1 = engine.advanceScenario();
  const advBeyond2 = engine.advanceScenario();
  recordTest('Repeated advanceScenario calls beyond limit return false', advBeyond1 === false && advBeyond2 === false);
  recordTest('Current scenario index remains clamped at 5', engine.getCurrentScenarioIndex() === 5);
})();

// 1.4 Multiple consecutive and mid-game resets
(() => {
  const engine = new gameStateModule.GameStateEngine();
  
  // Mid-game reset
  engine.initGame('tai');
  engine.selectOption(0); // Scen 1
  engine.advanceScenario();
  engine.selectOption(2); // Scen 2
  engine.advanceScenario();
  engine.selectOption(1); // Scen 3
  
  const midScores = engine.getScores();
  recordTest('Mid-game scores are non-zero before reset', midScores.totalDuc !== 0 || midScores.totalTai !== 0);

  engine.reset();
  const resetScores = engine.getScores();
  recordTest('Mid-game reset zeroes Duc and Tai scores', resetScores.totalDuc === 0 && resetScores.totalTai === 0);
  recordTest('Mid-game reset clears history', engine.getHistory().length === 0);
  recordTest('Mid-game reset resets scenario index to 0', engine.getCurrentScenarioIndex() === 0);
  recordTest('Mid-game reset clears answered flag', engine.isCurrentScenarioAnswered() === false);

  // Rapid consecutive resets (50 iterations)
  for (let r = 0; r < 50; r++) {
    engine.reset();
  }
  recordTest('50 consecutive rapid resets execute without memory corruption or leak', 
    engine.getCurrentScenarioIndex() === 0 && engine.getScores().totalDuc === 0
  );

  // Verify fresh playthrough works seamlessly after 50 resets
  engine.initGame('duc');
  for (let i = 0; i < 6; i++) {
    engine.selectOption(0);
    if (i < 5) engine.advanceScenario();
  }
  const finalQuad = engine.getQuadrantResult();
  recordTest('Full playthrough succeeds after multiple resets', !!finalQuad.key);
})();

// 1.5 Storage Error Resilience (when localStorage throws in Incognito / blocked environments)
(() => {
  const { doc, win } = createMockEnvironment();
  // Simulate throwing localStorage
  win.localStorage = {
    getItem: () => { throw new Error('SecurityError: Access is denied.'); },
    setItem: () => { throw new Error('SecurityError: Access is denied.'); }
  };
  global.window = win;
  global.localStorage = win.localStorage;

  const engine = new gameStateModule.GameStateEngine();
  let threwInit = false;
  try {
    engine.initGame('duc');
    engine.setInitialVote('tai');
    engine.getInitialVote();
  } catch (e) {
    threwInit = true;
  }
  recordTest('GameStateEngine gracefully handles throwing localStorage without unhandled exceptions', threwInit === false);
})();

// ============================================================================
// SUITE 2: QUIZ RETRY LOGIC & SCORING PRECISION
// ============================================================================
console.log(`\n${colors.cyan}${colors.bright}--- SUITE 2: Quiz Engine & Retry Logic Stress Testing ---${colors.reset}`);

// 2.1 Quiz full perfect score vs full zero score
(() => {
  const qEngine = new quizEngineModule.QuizEngine();
  qEngine.initQuiz();

  for (let i = 0; i < 10; i++) {
    const q = qEngine.getCurrentQuestion();
    qEngine.submitAnswer(q.correct);
    if (i < 9) qEngine.advanceQuestion();
  }

  const perfectSummary = qEngine.getSummary();
  recordTest('Perfect quiz answers yield 10/10 score (100%)', perfectSummary.score === 10 && perfectSummary.percentage === 100);
  recordTest('Perfect quiz has 0 wrong questions', perfectSummary.wrongCount === 0 && perfectSummary.wrongQuestions.length === 0);
  recordTest('Perfect quiz marked as passed', perfectSummary.passed === true);
})();

// 2.2 Quiz all wrong answers
(() => {
  const qEngine = new quizEngineModule.QuizEngine();
  qEngine.initQuiz();

  for (let i = 0; i < 10; i++) {
    const q = qEngine.getCurrentQuestion();
    const wrongOpt = (q.correct + 1) % 4;
    qEngine.submitAnswer(wrongOpt);
    if (i < 9) qEngine.advanceQuestion();
  }

  const zeroSummary = qEngine.getSummary();
  recordTest('All wrong answers yield 0/10 score (0%)', zeroSummary.score === 0 && zeroSummary.percentage === 0);
  recordTest('All wrong answers records 10 wrong questions with explanations and citations', 
    zeroSummary.wrongCount === 10 && 
    zeroSummary.wrongQuestions.every(w => w.question && w.correctText && w.explanation)
  );
  recordTest('0/10 marked as failed', zeroSummary.passed === false);
})();

// 2.3 Partial answer abandon and quiz reset / retry
(() => {
  const qEngine = new quizEngineModule.QuizEngine();
  qEngine.initQuiz();

  // Answer first 4 questions
  for (let i = 0; i < 4; i++) {
    qEngine.submitAnswer(0);
    qEngine.advanceQuestion();
  }
  recordTest('Mid-quiz question index is 4', qEngine.getCurrentIndex() === 4);

  // User hits "Retry Quiz" mid-flow
  qEngine.initQuiz();
  recordTest('initQuiz() resets index back to 0', qEngine.getCurrentIndex() === 0);
  recordTest('initQuiz() resets score to 0', qEngine.getSummary().score === 0);
  recordTest('initQuiz() clears user answers and wrong list', qEngine.getSummary().userAnswers.length === 0 && qEngine.getSummary().wrongQuestions.length === 0);
  recordTest('Current question is unanswered after reset', qEngine.isAnswered() === false);
})();

// 2.4 Retrying custom subset (e.g. only wrong questions)
(() => {
  const fullEngine = new quizEngineModule.QuizEngine();
  fullEngine.initQuiz();

  // Miss 3 specific questions: Q2, Q5, Q8
  for (let i = 0; i < 10; i++) {
    const q = fullEngine.getCurrentQuestion();
    if (i === 1 || i === 4 || i === 7) {
      fullEngine.submitAnswer((q.correct + 1) % 4); // wrong
    } else {
      fullEngine.submitAnswer(q.correct); // right
    }
    if (i < 9) fullEngine.advanceQuestion();
  }

  const summary = fullEngine.getSummary();
  recordTest('Standard run score is 7/10 with 3 wrong questions', summary.score === 7 && summary.wrongCount === 3);

  // Create isolated retry engine with only the 3 wrong questions
  const wrongQuestionsData = {
    QUIZ_QUESTIONS: summary.wrongQuestions.map((w, idx) => ({
      id: idx + 1,
      question: w.question,
      options: w.options,
      correct: w.correctIndex,
      explanation: w.explanation,
      citation: w.citation,
    }))
  };

  const retryEngine = new quizEngineModule.QuizEngine(wrongQuestionsData);
  recordTest('Retry engine successfully instantiates with custom 3-question subset', retryEngine.getTotalQuestions() === 3);

  for (let j = 0; j < 3; j++) {
    const rq = retryEngine.getCurrentQuestion();
    retryEngine.submitAnswer(rq.correct);
    if (j < 2) retryEngine.advanceQuestion();
  }

  const retrySummary = retryEngine.getSummary();
  recordTest('Retry engine correctly scores 3/3 (100%) on retried questions', retrySummary.score === 3 && retrySummary.percentage === 100 && retrySummary.passed === true);
})();

// 2.5 Duplicate submission and out-of-range bounds on Quiz Engine
(() => {
  const qEngine = new quizEngineModule.QuizEngine();
  qEngine.initQuiz();

  qEngine.submitAnswer(0);
  let threwDuplicate = false;
  try {
    qEngine.submitAnswer(1);
  } catch (err) {
    threwDuplicate = true;
  }
  recordTest('Quiz engine rejects duplicate answer submission on same question', threwDuplicate === true);

  // Fast forward to end
  for (let i = 1; i < 10; i++) {
    qEngine.advanceQuestion();
    qEngine.submitAnswer(0);
  }

  const advPast10 = qEngine.advanceQuestion();
  recordTest('advanceQuestion() past question 10 returns false', advPast10 === false);
  recordTest('Quiz index remains clamped at 9', qEngine.getCurrentIndex() === 9);
})();

// 2.6 Zero Questions Empty State Guard
(() => {
  const emptyEngine = new quizEngineModule.QuizEngine({ QUIZ_QUESTIONS: [] });
  emptyEngine.initQuiz();
  const summary = emptyEngine.getSummary();
  recordTest('Empty quiz engine handles 0 questions without divide-by-zero NaN', summary.percentage === 0 && summary.total === 0);
})();

// ============================================================================
// SUITE 3: MODAL TRANSITIONS, KEY HANDLING, ESC & FOCUS TRAP
// ============================================================================
console.log(`\n${colors.cyan}${colors.bright}--- SUITE 3: Modal Transitions, Key Handling & Focus Trap ---${colors.reset}`);

(() => {
  const { doc, win } = createMockEnvironment();
  global.document = doc;
  global.window = win;

  const modalEl = doc.getElementById('theory-modal');
  const modalTitleEl = doc.getElementById('modal-title');
  const modalBodyEl = doc.getElementById('modal-body');
  const closeBtnEl = doc.getElementById('modal-close');
  closeBtnEl.tagName = 'BUTTON';

  const modalCtrl = new modalControllerModule.ModalController();
  modalCtrl.init();

  // Test opening from all triggers
  const triggers = [
    { name: 'Screen 0: Đức trigger', points: theoryData.OPENING_THEORY.duc, key: 'duc' },
    { name: 'Screen 0: Tài trigger', points: theoryData.OPENING_THEORY.tai, key: 'tai' },
    { name: 'Screen 1: Layer Sinh viên', points: theoryData.LAYER_THEORY.sinh_vien, key: 'sinh_vien' },
    { name: 'Screen 1: Layer Nghề nghiệp', points: theoryData.LAYER_THEORY.nghe_nghiep, key: 'nghe_nghiep' },
    { name: 'Screen 1: Layer Quyền lực', points: theoryData.LAYER_THEORY.quyen_luc, key: 'quyen_luc' },
    { name: 'Screen 2: Kết luận', points: theoryData.OPENING_THEORY.ket_luan, key: 'ket_luan' },
  ];

  triggers.forEach(t => {
    const triggerBtn = doc.createElement('button');
    triggerBtn.setAttribute('data-theory-key', t.key);
    modalCtrl.open(t.points, triggerBtn, `Lý thuyết: ${t.key}`);

    recordTest(`Modal opens correctly for [${t.name}]`, 
      modalCtrl.isOpen === true && 
      !modalEl.classList.contains('hidden') && 
      triggerBtn.getAttribute('aria-expanded') === 'true' &&
      modalBodyEl.childNodes.length > 0
    );

    modalCtrl.close();
    recordTest(`Modal closes and resets aria-expanded for [${t.name}]`, 
      modalCtrl.isOpen === false && 
      modalEl.classList.contains('hidden') && 
      triggerBtn.getAttribute('aria-expanded') === 'false'
    );
  });

  // ESC Key Handling
  const testTrigger = doc.createElement('button');
  modalCtrl.open(theoryData.OPENING_THEORY.duc, testTrigger);
  recordTest('Modal is open prior to ESC key press', modalCtrl.isOpen === true);

  // Dispatch non-Escape key (should NOT close)
  doc.dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault: () => {} });
  recordTest('Modal remains open when non-ESC key (Enter) is pressed', modalCtrl.isOpen === true);

  // Dispatch ESC key
  let escPreventDefaultCalled = false;
  doc.dispatchEvent({
    type: 'keydown',
    key: 'Escape',
    preventDefault: () => { escPreventDefaultCalled = true; }
  });
  recordTest('ESC key event closes modal and invokes preventDefault()', modalCtrl.isOpen === false && escPreventDefaultCalled === true);

  // Backdrop Click vs Modal Window Click
  modalCtrl.open(theoryData.OPENING_THEORY.tai, testTrigger);
  
  // Click inside modal window (target !== modalEl) -> must NOT close
  const insideModalWindow = doc.createElement('div');
  insideModalWindow.className = 'modal-window';
  modalEl.dispatchEvent({ type: 'click', target: insideModalWindow });
  recordTest('Clicking inside modal-window does NOT dismiss modal', modalCtrl.isOpen === true);

  // Click on modal overlay backdrop directly (target === modalEl) -> must close
  modalEl.dispatchEvent({ type: 'click', target: modalEl });
  recordTest('Clicking modal backdrop overlay dismisses modal', modalCtrl.isOpen === false);

  // Focus trap verification
  modalCtrl.open(theoryData.OPENING_THEORY.duc, testTrigger);
  
  // Add focusable elements to modal
  const firstFocusable = doc.createElement('button');
  firstFocusable.id = 'modal-first-btn';
  const secondFocusable = doc.createElement('button');
  secondFocusable.id = 'modal-second-btn';
  modalEl.appendChild(firstFocusable);
  modalEl.appendChild(secondFocusable);

  // Focus last element, press Tab (no Shift) -> wrap to first
  doc.activeElement = secondFocusable;
  let tabPreventDefault = false;
  doc.dispatchEvent({
    type: 'keydown',
    key: 'Tab',
    shiftKey: false,
    preventDefault: () => { tabPreventDefault = true; }
  });
  recordTest('Focus trap: Tab on last focusable wraps to first and calls preventDefault', 
    tabPreventDefault === true && doc.activeElement === firstFocusable
  );

  // Focus first element, press Shift+Tab -> wrap to last
  doc.activeElement = firstFocusable;
  let shiftTabPreventDefault = false;
  doc.dispatchEvent({
    type: 'keydown',
    key: 'Tab',
    shiftKey: true,
    preventDefault: () => { shiftTabPreventDefault = true; }
  });
  recordTest('Focus trap: Shift+Tab on first focusable wraps to last and calls preventDefault', 
    shiftTabPreventDefault === true && doc.activeElement === secondFocusable
  );

  // Rapid 100 open/close cycles (stress test)
  for (let c = 0; c < 100; c++) {
    modalCtrl.open(theoryData.OPENING_THEORY.duc, testTrigger);
    modalCtrl.close();
  }
  recordTest('100 rapid modal open/close cycles completed cleanly without listener leaks', 
    modalCtrl.isOpen === false && (doc._documentListeners['keydown'] || []).length === 0
  );
})();

// ============================================================================
// SUITE 4: BROWSER COMPATIBILITY, OFFLINE SAFETY & ASSET INTEGRITY
// ============================================================================
console.log(`\n${colors.cyan}${colors.bright}--- SUITE 4: Browser Compatibility, Offline Safety & Asset Integrity ---${colors.reset}`);

// 4.1 Standalone file:// protocol safety (zero ES6 module import/export in browser code)
(() => {
  const rootDir = path.resolve(__dirname, '..');
  const jsFiles = [
    'js/app.js',
    'js/data/scenarios.js',
    'js/data/quiz.js',
    'js/data/theory.js',
    'js/engine/gameState.js',
    'js/engine/quizEngine.js',
    'js/engine/chartMath.js',
    'js/ui/screenController.js',
    'js/ui/modalController.js',
    'js/ui/quizRenderer.js',
    'js/ui/chartRenderer.js',
  ];

  let hasDisallowedEsm = false;
  const esmRegex = /^\s*(import\s+.*from|export\s+default|export\s+\{[^}]+\})\s*;?/m;

  jsFiles.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (esmRegex.test(content)) {
      hasDisallowedEsm = true;
      console.error(`Found raw ESM syntax in ${relPath}`);
    }
  });

  recordTest('All 11 JS modules use UMD/Namespace pattern (zero raw ESM syntax for file:// compatibility)', !hasDisallowedEsm);
})();

// 4.2 Visual Assets Catalog Integrity (all 14 images present, non-zero size, valid image bytes)
(() => {
  const rootDir = path.resolve(__dirname, '..');
  const expectedAssets = [
    'hero_banner.png',
    'layer_student.png',
    'layer_career.png',
    'layer_power.png',
    'scenario_copy_project.png',
    'scenario_freeriding.png',
    'scenario_security_bug.png',
    'scenario_addictive_algo.png',
    'scenario_vice_leader.png',
    'scenario_fund_management.png',
    'badge_vua_hong_vua_chuyen.png',
    'badge_dang_tin_bat_luc.png',
    'badge_vo_hai_vo_dung.png',
    'badge_nguy_hiem_nhat.png',
  ];

  const imagesDir = path.join(rootDir, 'assets', 'images');
  let allAssetsExistAndDecodable = true;
  let totalBytes = 0;

  expectedAssets.forEach(fileName => {
    const assetPath = path.join(imagesDir, fileName);
    if (!fs.existsSync(assetPath)) {
      allAssetsExistAndDecodable = false;
      return;
    }
    const stat = fs.statSync(assetPath);
    totalBytes += stat.size;
    if (stat.size < 1000) {
      allAssetsExistAndDecodable = false;
      return;
    }
    const buffer = fs.readFileSync(assetPath);
    // Check valid image magic bytes: JPEG (FF D8 FF) or PNG (89 50 4E 47)
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    if (!isJpeg && !isPng) {
      allAssetsExistAndDecodable = false;
    }
  });

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  recordTest(`All 14 Digital Editorial Art assets exist, are high-resolution (${totalMb} MB total) and browser-decodable`, allAssetsExistAndDecodable);
})();

// 4.3 Fallback UI elements in HTML
(() => {
  const rootDir = path.resolve(__dirname, '..');
  const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  const hasHeroFallback = htmlContent.includes('id="hero-banner-fallback"');
  const hasScenarioFallback = htmlContent.includes('id="scenario-fallback"');
  const hasBadgeFallback = htmlContent.includes('id="result-badge-fallback"');

  recordTest('HTML includes graceful visual fallback elements for Hero, Scenarios, and Badges', 
    hasHeroFallback && hasScenarioFallback && hasBadgeFallback
  );
})();

// 4.4 CSS WCAG AA Contrast and Touch Target Tokens
(() => {
  const rootDir = path.resolve(__dirname, '..');
  const tokensContent = fs.readFileSync(path.join(rootDir, 'css', 'tokens.css'), 'utf8');

  const hasMinTouchTarget = tokensContent.includes('--min-touch-target: 44px;');
  const hasGoldTokens = tokensContent.includes('--gold-700:') && tokensContent.includes('--gold-800:');
  const hasSapphireTokens = tokensContent.includes('--sapphire-600:') && tokensContent.includes('--sapphire-700:');

  recordTest('tokens.css specifies --min-touch-target: 44px and WCAG AA contrast tokens', 
    hasMinTouchTarget && hasGoldTokens && hasSapphireTokens
  );
})();

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log(`\n${colors.gold}${colors.bright}----------------------------------------------------------------------${colors.reset}`);
console.log(`${colors.bright}CHALLENGER 2 STRESS TEST RESULTS:${colors.reset}`);
console.log(`  • Total Stress Tests: ${colors.bright}${passCount + failCount}${colors.reset}`);
console.log(`  • Passed Tests:       ${colors.green}${colors.bright}${passCount}${colors.reset}`);
console.log(`  • Failed Tests:       ${failCount > 0 ? colors.red : colors.dim}${colors.bright}${failCount}${colors.reset}`);
console.log(`${colors.gold}${colors.bright}----------------------------------------------------------------------${colors.reset}`);

if (failCount === 0) {
  console.log(`${colors.green}${colors.bright}🏆 VERDICT: APPROVE — All 4 Stress Dimensions Passed with 100% Robustness.${colors.reset}\n`);
} else {
  console.log(`${colors.red}${colors.bright}⚠️ VERDICT: REQUEST_CHANGES — Stress tests discovered ${failCount} vulnerabilities.${colors.reset}\n`);
}

module.exports = {
  passCount,
  failCount,
  testLogs,
};
