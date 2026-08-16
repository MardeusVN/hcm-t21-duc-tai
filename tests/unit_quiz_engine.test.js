/**
 * Unit Tests for Quiz Engine & Answer Validation
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../js/data/quiz.js'),
      require('../js/engine/quizEngine.js')
    );
  } else {
    root.HCMTests = root.HCMTests || {};
    root.HCMTests.QuizEngine = factory(
      root.HCM.Data,
      root.HCM.Engine.QuizEngine
    );
  }
}(typeof self !== 'undefined' ? self : this, function (quizData, quizEngineModule) {
  'use strict';

  function runTests(reporter = console.log) {
    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
      if (condition) {
        passed++;
        reporter(`[PASS] ${message}`);
      } else {
        failed++;
        reporter(`[FAIL] ${message}`);
        console.error(`Assertion failed: ${message}`);
      }
    }

    reporter('--- Running Unit Tests: Quiz Engine & Answer Validation ---');

    const QuizEngine = quizEngineModule.QuizEngine || quizEngineModule;
    const quiz = new QuizEngine(quizData);

    // 1. Initial State
    quiz.initQuiz();
    assert(quiz.getTotalQuestions() === 10, 'Quiz has 10 total questions');
    assert(quiz.getCurrentIndex() === 0, 'Current question index is 0');
    assert(quiz.isAnswered() === false, 'Question 1 is initially unanswered');

    // 2. Correct answer test on Q1
    const q1 = quiz.getCurrentQuestion();
    assert(q1.correct === 0, 'Q1 correct answer index is 0');

    const ans1 = quiz.submitAnswer(0);
    assert(ans1.isCorrect === true, 'Submitting option 0 on Q1 evaluates to true');
    assert(ans1.correctIndex === 0, 'Returned correctIndex is 0');
    assert(ans1.currentScore === 1, 'Current score is 1');
    assert(quiz.isAnswered() === true, 'Quiz question marked answered');

    // Cannot answer again
    let threw = false;
    try {
      quiz.submitAnswer(1);
    } catch (e) {
      threw = true;
    }
    assert(threw === true, 'Submitting duplicate answer throws error');

    // Advance
    const adv1 = quiz.advanceQuestion();
    assert(adv1 === true, 'Advanced to Q2');
    assert(quiz.getCurrentIndex() === 1, 'Index is 1');

    // 3. Incorrect answer test on Q2
    const q2 = quiz.getCurrentQuestion();
    assert(q2.correct === 1, 'Q2 correct answer index is 1');

    const ans2 = quiz.submitAnswer(0); // Choose option 0 (incorrect)
    assert(ans2.isCorrect === false, 'Submitting option 0 on Q2 evaluates to false');
    assert(ans2.currentScore === 1, 'Score remains 1');

    // Finish remaining questions (all correct)
    for (let i = 2; i < 10; i++) {
      quiz.advanceQuestion();
      const q = quiz.getCurrentQuestion();
      quiz.submitAnswer(q.correct);
    }

    const summary = quiz.getSummary();
    assert(summary.total === 10, 'Total is 10');
    assert(summary.score === 9, 'Score is 9/10');
    assert(summary.percentage === 90, 'Percentage is 90%');
    assert(summary.passed === true, 'Quiz passed');
    assert(summary.wrongQuestions.length === 1, 'Exactly 1 wrong question recorded');
    assert(summary.wrongQuestions[0].questionId === 2, 'Wrong question was Q2');

    reporter(`Unit Tests Completed: ${passed} passed, ${failed} failed.`);
    return { passed, failed, total: passed + failed };
  }

  if (typeof module === 'object' && module.exports) {
    runTests();
  }

  return { runTests };
}));
