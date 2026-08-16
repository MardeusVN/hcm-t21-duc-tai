/**
 * HCM-T21 "Đức hay Tài" — Root Script & Backward Compatibility Adapter
 * Bridges legacy global variables and functions to modular architecture (HCM namespace)
 */

(function (root) {
  'use strict';

  // If HCM modular system is loaded, wire legacy references
  if (typeof root !== 'undefined' && root.HCM) {
    const Data = root.HCM.Data || {};
    const Engine = root.HCM.Engine || {};
    const UI = root.HCM.UI || {};

    // Expose legacy global constants
    if (Data.SITE_TITLE) root.SITE_TITLE = Data.SITE_TITLE;
    if (Data.VOTE_QUESTION_INTRO) root.VOTE_QUESTION_INTRO = Data.VOTE_QUESTION_INTRO;
    if (Data.LAYER_NAMES) root.LAYER_NAMES = Data.LAYER_NAMES;
    if (Data.OPENING_THEORY) root.OPENING_THEORY = Data.OPENING_THEORY;
    if (Data.LAYER_THEORY) root.LAYER_THEORY = Data.LAYER_THEORY;
    if (Data.SCENARIOS) root.SCENARIOS = Data.SCENARIOS;
    if (Data.QUADRANTS) root.QUADRANTS = Data.QUADRANTS;
    if (Data.THEORY_SUMMARY) root.THEORY_SUMMARY = Data.THEORY_SUMMARY;
    if (Data.THEORY_PRINCIPLES) root.THEORY_PRINCIPLES = Data.THEORY_PRINCIPLES;
    if (Data.AI_DECLARATION) root.AI_DECLARATION = Data.AI_DECLARATION;
    if (Data.PRODUCT_SCOPE_NOTE) root.PRODUCT_SCOPE_NOTE = Data.PRODUCT_SCOPE_NOTE;
    if (Data.EXTERNAL_SOURCES) root.EXTERNAL_SOURCES = Data.EXTERNAL_SOURCES;
    if (Data.QUIZ_QUESTIONS) root.QUIZ_QUESTIONS = Data.QUIZ_QUESTIONS;

    if (Engine.ChartMath) {
      root.THRESHOLD_DUC = Engine.ChartMath.THRESHOLD_DUC;
      root.THRESHOLD_TAI = Engine.ChartMath.THRESHOLD_TAI;
      root.classify = Engine.ChartMath.evaluateQuadrantKey;
    }

    if (Engine.GameState && Engine.GameState.defaultInstance) {
      root.state = Engine.GameState.defaultInstance.state;
    }

    if (Engine.QuizEngine && Engine.QuizEngine.defaultInstance) {
      root.quizState = Engine.QuizEngine.defaultInstance.state;
    }
  }

  // Node.js module export support
  if (typeof module !== 'undefined' && module.exports) {
    try {
      const scenarios = require('./js/data/scenarios.js');
      const quiz = require('./js/data/quiz.js');
      const theory = require('./js/data/theory.js');
      const chartMath = require('./js/engine/chartMath.js');
      const gameState = require('./js/engine/gameState.js');
      const quizEngine = require('./js/engine/quizEngine.js');
      module.exports = {
        scenarios,
        quiz,
        theory,
        chartMath,
        gameState,
        quizEngine,
      };
    } catch (e) {
      // Ignored if relative paths differ in runtime
    }
  }
}(typeof self !== 'undefined' ? self : this));
