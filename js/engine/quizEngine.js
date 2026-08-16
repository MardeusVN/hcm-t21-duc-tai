/**
 * HCM-T21 "Đức hay Tài" — Quiz Engine
 * Manages 10-question academic quiz progression, answer evaluation, scoring tally, and performance review
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../data/quiz.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    const quizData = require('../data/quiz.js');
    module.exports = factory(quizData);
  } else {
    root.HCM = root.HCM || {};
    root.HCM.Engine = root.HCM.Engine || {};
    root.HCM.Engine.QuizEngine = factory(root.HCM.Data);
  }
}(typeof self !== 'undefined' ? self : this, function (quizData) {
  'use strict';

  class QuizEngine {
    constructor(customQuestions) {
      this.questions = (customQuestions && customQuestions.QUIZ_QUESTIONS) ||
                       (quizData && quizData.QUIZ_QUESTIONS) || [];
      this.reset();
    }

    /**
     * Resets quiz state to beginning
     */
    reset() {
      this.state = {
        index: 0,
        score: 0,
        answered: false,
        userAnswers: [],
        wrong: [],
      };
    }

    /**
     * Initializes a new quiz session
     */
    initQuiz() {
      this.reset();
    }

    /**
     * Total number of quiz questions
     * @returns {number}
     */
    getTotalQuestions() {
      return this.questions.length;
    }

    /**
     * Current question index (0-based)
     * @returns {number}
     */
    getCurrentIndex() {
      return this.state.index;
    }

    /**
     * Current question object
     * @returns {object | null}
     */
    getCurrentQuestion() {
      return this.questions[this.state.index] || null;
    }

    /**
     * Checks if current question has already been answered
     * @returns {boolean}
     */
    isAnswered() {
      return this.state.answered;
    }

    /**
     * Evaluates a user answer submission
     * @param {number} selectedOptionIndex - 0..3
     * @returns {object} Evaluation outcome
     */
    submitAnswer(selectedOptionIndex) {
      if (this.state.answered) {
        throw new Error('Current quiz question already answered.');
      }

      const q = this.getCurrentQuestion();
      if (!q) {
        throw new Error('Invalid quiz question index: ' + this.state.index);
      }

      this.state.answered = true;
      const isCorrect = selectedOptionIndex === q.correct;

      if (isCorrect) {
        this.state.score += 1;
      } else {
        this.state.wrong.push({
          questionId: q.id || (this.state.index + 1),
          question: q.question,
          options: q.options,
          correctIndex: q.correct,
          correctText: q.options[q.correct],
          userSelectedIndex: selectedOptionIndex,
          userSelectedText: q.options[selectedOptionIndex] || '',
          explanation: q.explanation,
          citation: q.citation || '',
        });
      }

      this.state.userAnswers.push({
        questionIndex: this.state.index,
        selectedOptionIndex,
        isCorrect,
      });

      const isLastQuestion = this.state.index === this.questions.length - 1;

      return {
        isCorrect,
        correctIndex: q.correct,
        selectedIndex: selectedOptionIndex,
        explanation: q.explanation,
        citation: q.citation || '',
        isLastQuestion,
        currentScore: this.state.score,
        totalQuestions: this.questions.length,
      };
    }

    /**
     * Advances to next quiz question
     * @returns {boolean} true if moved to next question, false if finished
     */
    advanceQuestion() {
      if (this.state.index < this.questions.length - 1) {
        this.state.index += 1;
        this.state.answered = false;
        return true;
      }
      return false;
    }

    /**
     * Gets a summary report of quiz performance
     * @returns {object}
     */
    getSummary() {
      const total = this.questions.length;
      const score = this.state.score;
      const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
      const passed = percentage >= 50;

      return {
        score,
        total,
        percentage,
        passed,
        wrongCount: this.state.wrong.length,
        wrongQuestions: [...this.state.wrong],
        userAnswers: [...this.state.userAnswers],
      };
    }
  }

  const defaultInstance = new QuizEngine();

  return {
    QuizEngine,
    defaultInstance,
  };
}));
