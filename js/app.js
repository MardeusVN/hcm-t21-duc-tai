/**
 * HCM-T21 "Đức hay Tài" — Application Entry Point & Event Wiring
 * Orchestrates Data Stores, Game State Engine, Quiz Engine, and UI Controllers
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      './data/scenarios.js',
      './data/quiz.js',
      './data/theory.js',
      './engine/chartMath.js',
      './engine/gameState.js',
      './engine/quizEngine.js',
      './ui/modalController.js',
      './ui/chartRenderer.js',
      './ui/quizRenderer.js',
      './ui/screenController.js'
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    const scenariosData = require('./data/scenarios.js');
    const quizData = require('./data/quiz.js');
    const theoryData = require('./data/theory.js');
    const chartMath = require('./engine/chartMath.js');
    const gameStateModule = require('./engine/gameState.js');
    const quizEngineModule = require('./engine/quizEngine.js');
    const modalControllerModule = require('./ui/modalController.js');
    const chartRendererModule = require('./ui/chartRenderer.js');
    const quizRendererModule = require('./ui/quizRenderer.js');
    const screenControllerModule = require('./ui/screenController.js');
    module.exports = factory(
      scenariosData,
      quizData,
      theoryData,
      chartMath,
      gameStateModule,
      quizEngineModule,
      modalControllerModule,
      chartRendererModule,
      quizRendererModule,
      screenControllerModule
    );
  } else {
    root.HCM = root.HCM || {};
    root.HCM.App = factory(
      root.HCM.Data,
      root.HCM.Data,
      root.HCM.Data,
      root.HCM.Engine.ChartMath,
      root.HCM.Engine.GameState,
      root.HCM.Engine.QuizEngine,
      root.HCM.UI.ModalController,
      root.HCM.UI.ChartRenderer,
      root.HCM.UI.QuizRenderer,
      root.HCM.UI.ScreenController
    );
  }
}(typeof self !== 'undefined' ? self : this, function (
  scenariosData,
  quizData,
  theoryData,
  chartMath,
  gameStateModule,
  quizEngineModule,
  modalControllerModule,
  chartRendererModule,
  quizRendererModule,
  screenControllerModule
) {
  'use strict';

  class Application {
    constructor() {
      this.data = {
        scenarios: scenariosData ? scenariosData.SCENARIOS : [],
        layerNames: scenariosData ? scenariosData.LAYER_NAMES : {},
        quizQuestions: quizData ? quizData.QUIZ_QUESTIONS : [],
        theory: theoryData || {},
      };

      this.gameState = (gameStateModule && gameStateModule.defaultInstance)
        ? gameStateModule.defaultInstance
        : (gameStateModule && gameStateModule.GameStateEngine ? new gameStateModule.GameStateEngine() : null);

      this.quizEngine = (quizEngineModule && quizEngineModule.defaultInstance)
        ? quizEngineModule.defaultInstance
        : (quizEngineModule && quizEngineModule.QuizEngine ? new quizEngineModule.QuizEngine() : null);

      this.modalCtrl = (modalControllerModule && modalControllerModule.defaultInstance)
        ? modalControllerModule.defaultInstance
        : (modalControllerModule && modalControllerModule.ModalController ? new modalControllerModule.ModalController() : null);

      this.chartRenderer = (chartRendererModule && chartRendererModule.defaultInstance)
        ? chartRendererModule.defaultInstance
        : (chartRendererModule && chartRendererModule.ChartRenderer ? new chartRendererModule.ChartRenderer() : null);

      this.quizRenderer = (quizRendererModule && quizRendererModule.defaultInstance)
        ? quizRendererModule.defaultInstance
        : (quizRendererModule && quizRendererModule.QuizRenderer ? new quizRendererModule.QuizRenderer() : null);

      this.screenCtrl = (screenControllerModule && screenControllerModule.defaultInstance)
        ? screenControllerModule.defaultInstance
        : (screenControllerModule && screenControllerModule.ScreenController ? new screenControllerModule.ScreenController() : null);

      this.initialized = false;
    }

    /**
     * Initializes all modules and wires event handlers
     */
    init() {
      if (this.initialized) return;

      // 1. Initialize modal controller
      if (this.modalCtrl) {
        this.modalCtrl.init();
      }

      // 2. Setup Screen 0
      if (this.screenCtrl) {
        this.screenCtrl.initScreen0({
          onVoteSelect: (vote) => {
            if (this.gameState) {
              this.gameState.setInitialVote(vote);
            }
          },
          onStart: () => {
            this.startScenarioLoop();
          },
        });
      }

      // 3. Setup global theory modal triggers (.theory-trigger & .theory-quick-btn)
      const theoryTriggers = document.querySelectorAll('.theory-trigger, .theory-quick-btn');
      theoryTriggers.forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.theoryKey || 'duc';
          const openingTheory = (this.data.theory && this.data.theory.OPENING_THEORY) || {};
          const points = openingTheory[key] || openingTheory['duc'];
          if (points && this.modalCtrl) {
            this.modalCtrl.open(points, btn);
          }
        });
      });

      // 4. Setup layer label theory trigger on Screen 1
      const layerLabel = document.getElementById('layer-label');
      if (layerLabel) {
        layerLabel.addEventListener('click', () => {
          if (!this.gameState || !this.modalCtrl) return;
          const scenario = this.gameState.getCurrentScenario();
          if (!scenario) return;

          const layerTheory = (this.data.theory && this.data.theory.LAYER_THEORY) || {};
          const points = layerTheory[scenario.layer];
          if (points) {
            this.modalCtrl.open(points, layerLabel);
          }
        });
      }

      // 5. Setup Next Scenario button
      const nextScenarioBtn = document.getElementById('btn-next-scenario');
      if (nextScenarioBtn) {
        nextScenarioBtn.addEventListener('click', () => {
          if (!this.gameState) return;

          const hasMore = this.gameState.advanceScenario();
          if (hasMore) {
            this.renderCurrentScenario();
          } else {
            this.showResults();
          }
        });
      }

      // 6. Setup Screen 2 navigation buttons
      const viewRefBtn = document.getElementById('btn-view-reference');
      if (viewRefBtn) {
        viewRefBtn.addEventListener('click', () => {
          if (this.screenCtrl) {
            this.screenCtrl.renderReference();
            this.screenCtrl.showScreen('screen-3');
          }
        });
      }

      const viewQuizBtn = document.getElementById('btn-view-quiz');
      if (viewQuizBtn) {
        viewQuizBtn.addEventListener('click', () => {
          this.startQuiz();
        });
      }

      const replayBtn = document.getElementById('btn-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.replayGame();
        });
      }

      // 7. Setup Screen 3 back button
      const backFromRefBtn = document.getElementById('btn-back-from-reference');
      if (backFromRefBtn) {
        backFromRefBtn.addEventListener('click', () => {
          if (this.screenCtrl) {
            this.screenCtrl.showScreen('screen-2');
          }
        });
      }

      // 8. Setup Footer AI link
      const footerAiLink = document.getElementById('footer-ai-link');
      if (footerAiLink) {
        footerAiLink.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.screenCtrl) {
            this.screenCtrl.renderReference();
            this.screenCtrl.showScreen('screen-3');
          }
        });
      }

      // 9. Setup Quiz Next button
      const nextQuizBtn = document.getElementById('btn-next-quiz');
      if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
          if (!this.quizEngine) return;

          const hasMore = this.quizEngine.advanceQuestion();
          if (hasMore) {
            this.renderCurrentQuizQuestion();
          } else {
            this.showQuizSummary();
          }
        });
      }

      // 10. Setup Quiz Screen 6 buttons
      const retryQuizBtn = document.getElementById('btn-retry-quiz');
      if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', () => {
          this.startQuiz();
        });
      }

      const backFromQuizBtn = document.getElementById('btn-back-from-quiz');
      if (backFromQuizBtn) {
        backFromQuizBtn.addEventListener('click', () => {
          if (this.screenCtrl) {
            this.screenCtrl.showScreen('screen-2');
          }
        });
      }

      this.initialized = true;
    }

    /**
     * Starts the scenario loop (Screen 1)
     */
    startScenarioLoop() {
      if (!this.gameState || !this.screenCtrl) return;
      this.renderCurrentScenario();
      this.screenCtrl.showScreen('screen-1');
    }

    /**
     * Renders current scenario and hooks up choice click
     */
    renderCurrentScenario() {
      if (!this.gameState || !this.screenCtrl) return;
      const scenario = this.gameState.getCurrentScenario();
      const index = this.gameState.getCurrentScenarioIndex();
      const total = this.gameState.getTotalScenarios();

      if (!scenario) return;

      this.screenCtrl.renderScenario(scenario, index, total, (choiceIdx, buttonEl) => {
        try {
          const result = this.gameState.selectOption(choiceIdx);
          this.screenCtrl.showChoiceFeedback(result, buttonEl);
        } catch (err) {
          console.error(err);
        }
      });
    }

    /**
     * Shows results on Screen 2
     */
    showResults() {
      if (!this.gameState || !this.screenCtrl) return;
      const quadrantResult = this.gameState.getQuadrantResult();
      const scores = this.gameState.getScores();
      const initialVote = this.gameState.getInitialVote();

      if (this.chartRenderer) {
        this.chartRenderer.render(scores.totalDuc, scores.totalTai, quadrantResult, initialVote);
      }

      this.screenCtrl.showScreen('screen-2');
    }

    /**
     * Resets state and returns to Screen 0
     */
    replayGame() {
      if (this.gameState) {
        this.gameState.reset();
      }

      const voteButtons = document.querySelectorAll('.vote-btn');
      voteButtons.forEach((b) => b.classList.remove('selected'));

      const startBtn = document.getElementById('btn-start');
      if (startBtn) {
        startBtn.disabled = true;
      }

      if (this.screenCtrl) {
        this.screenCtrl.showScreen('screen-0');
      }
    }

    /**
     * Starts the academic quiz session
     */
    startQuiz() {
      if (!this.quizEngine || !this.screenCtrl) return;
      this.quizEngine.initQuiz();
      this.renderCurrentQuizQuestion();
      this.screenCtrl.showScreen('screen-5');
    }

    /**
     * Renders the current quiz question
     */
    renderCurrentQuizQuestion() {
      if (!this.quizEngine || !this.quizRenderer) return;
      const q = this.quizEngine.getCurrentQuestion();
      const index = this.quizEngine.getCurrentIndex();
      const total = this.quizEngine.getTotalQuestions();

      if (!q) return;

      this.quizRenderer.renderQuestion(q, index, total, (optionIdx) => {
        try {
          const evalResult = this.quizEngine.submitAnswer(optionIdx);
          this.quizRenderer.showAnswerFeedback(evalResult);
        } catch (err) {
          console.error(err);
        }
      });
    }

    /**
     * Shows quiz summary results on Screen 6
     */
    showQuizSummary() {
      if (!this.quizEngine || !this.quizRenderer || !this.screenCtrl) return;
      const summary = this.quizEngine.getSummary();
      this.quizRenderer.renderSummary(summary);
      this.screenCtrl.showScreen('screen-6');
    }
  }

  const app = new Application();

  // Auto-boot when in browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
      app.init();
    }
  }

  return app;
}));
