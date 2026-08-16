/**
 * HCM-T21 "Đức hay Tài" — Quiz Renderer
 * Renders quiz questions, options, instant visual feedback badges, and final review summary
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM = root.HCM || {};
    root.HCM.UI = root.HCM.UI || {};
    root.HCM.UI.QuizRenderer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class QuizRenderer {
    constructor() {}

    /**
     * Renders an individual quiz question and its 4 options
     * @param {object} questionObj - { question, options, correct, explanation, citation }
     * @param {number} questionIndex - 0-based
     * @param {number} totalQuestions
     * @param {function(number, HTMLElement): void} onOptionSelect
     */
    renderQuestion(questionObj, questionIndex, totalQuestions, onOptionSelect) {
      const progressLabelEl = document.getElementById('quiz-progress-label');
      const progressFillEl = document.getElementById('quiz-progress-fill');
      const questionTextEl = document.getElementById('quiz-question-text');
      const optionsListEl = document.getElementById('quiz-options-list');
      const feedbackBlockEl = document.getElementById('quiz-feedback-block');

      if (progressLabelEl) {
        progressLabelEl.textContent = `Câu ${questionIndex + 1}/${totalQuestions}`;
      }

      if (progressFillEl) {
        progressFillEl.style.width = `${((questionIndex + 1) / totalQuestions) * 100}%`;
      }

      if (questionTextEl) {
        questionTextEl.textContent = questionObj.question;
      }

      if (feedbackBlockEl) {
        feedbackBlockEl.classList.add('hidden');
      }

      if (optionsListEl) {
        optionsListEl.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        questionObj.options.forEach((optText, optIdx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'choice-btn quiz-option';
          btn.setAttribute('data-option-index', String(optIdx));
          btn.setAttribute('data-choice-letter', letters[optIdx] || String(optIdx + 1));

          const textSpan = document.createElement('span');
          textSpan.textContent = optText;
          btn.appendChild(textSpan);

          btn.addEventListener('click', () => {
            if (typeof onOptionSelect === 'function') {
              onOptionSelect(optIdx, btn);
            }
          });

          optionsListEl.appendChild(btn);
        });
      }
    }

    /**
     * Shows immediate feedback after answering a question
     * @param {object} evalResult - { isCorrect, correctIndex, selectedIndex, explanation, isLastQuestion }
     */
    showAnswerFeedback(evalResult) {
      const optionsListEl = document.getElementById('quiz-options-list');
      const feedbackBlockEl = document.getElementById('quiz-feedback-block');
      const feedbackLabelEl = document.getElementById('quiz-feedback-label');
      const feedbackTextEl = document.getElementById('quiz-feedback-text');
      const nextBtnEl = document.getElementById('btn-next-quiz');

      if (optionsListEl) {
        const optionButtons = optionsListEl.querySelectorAll('.quiz-option');
        optionButtons.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === evalResult.correctIndex) {
            btn.classList.add('correct');
          } else if (idx === evalResult.selectedIndex) {
            btn.classList.add('incorrect');
          }
        });
      }

      if (feedbackLabelEl) {
        feedbackLabelEl.textContent = evalResult.isCorrect ? 'Chính xác' : 'Chưa đúng';
        feedbackLabelEl.classList.toggle('feedback-correct', evalResult.isCorrect);
        feedbackLabelEl.classList.toggle('feedback-incorrect', !evalResult.isCorrect);
      }

      if (feedbackTextEl) {
        feedbackTextEl.textContent = evalResult.explanation;
      }

      if (nextBtnEl) {
        nextBtnEl.textContent = evalResult.isLastQuestion ? 'Xem kết quả ôn tập' : 'Câu tiếp theo';
      }

      if (feedbackBlockEl) {
        feedbackBlockEl.classList.remove('hidden');
      }
    }

    /**
     * Renders the quiz summary screen
     * @param {object} summary - { score, total, percentage, passed, wrongQuestions }
     */
    renderSummary(summary) {
      const scoreTextEl = document.getElementById('quiz-score-text');
      const reviewListEl = document.getElementById('quiz-review-list');

      if (scoreTextEl) {
        scoreTextEl.textContent = `Bạn trả lời đúng ${summary.score}/${summary.total} câu.`;
      }

      if (reviewListEl) {
        reviewListEl.innerHTML = '';
        if (!summary.wrongQuestions || summary.wrongQuestions.length === 0) {
          const li = document.createElement('li');
          li.className = 'quiz-review-item perfect';
          li.textContent = 'Bạn trả lời đúng tất cả, không có câu nào cần xem lại.';
          reviewListEl.appendChild(li);
        } else {
          summary.wrongQuestions.forEach((wrongItem) => {
            const li = document.createElement('li');
            li.className = 'quiz-review-item';

            const questionHeading = document.createElement('strong');
            questionHeading.textContent = wrongItem.question;

            const answerNote = document.createElement('span');
            answerNote.className = 'quiz-correct-answer';
            answerNote.textContent = ` Đáp án đúng: “${wrongItem.correctText}”.`;

            li.appendChild(questionHeading);
            li.appendChild(answerNote);

            if (wrongItem.citation) {
              const cite = document.createElement('div');
              cite.className = 'source-cite';
              cite.textContent = `(${wrongItem.citation})`;
              li.appendChild(cite);
            }

            reviewListEl.appendChild(li);
          });
        }
      }
    }
  }

  const defaultInstance = new QuizRenderer();

  return {
    QuizRenderer,
    defaultInstance,
  };
}));
