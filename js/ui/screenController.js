/**
 * HCM-T21 "Đức hay Tài" — Screen Controller
 * Controls single-page screen transitions, progress indicators, initial voting, scenario views, and reference pages
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../data/theory.js', '../data/scenarios.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    const theoryData = require('../data/theory.js');
    const scenariosData = require('../data/scenarios.js');
    module.exports = factory(theoryData, scenariosData);
  } else {
    root.HCM = root.HCM || {};
    root.HCM.UI = root.HCM.UI || {};
    root.HCM.UI.ScreenController = factory(root.HCM.Data, root.HCM.Data);
  }
}(typeof self !== 'undefined' ? self : this, function (theoryData, scenariosData) {
  'use strict';

  class ScreenController {
    constructor(customTheory, customScenarios) {
      this.theory = customTheory || (typeof root !== 'undefined' && root.HCM && root.HCM.Data) || theoryData;
      this.scenariosData = customScenarios || (typeof root !== 'undefined' && root.HCM && root.HCM.Data) || scenariosData;
      this.activeScreenId = 'screen-0';
    }

    /**
     * Shows the specified screen by ID and hides all other screens
     * @param {string} screenId - e.g. 'screen-0', 'screen-1', 'screen-2', 'screen-3', 'screen-5', 'screen-6'
     */
    showScreen(screenId) {
      const allScreens = document.querySelectorAll('.screen');
      allScreens.forEach((el) => el.classList.add('hidden'));

      const targetScreen = document.getElementById(screenId);
      if (targetScreen) {
        targetScreen.classList.remove('hidden');
        this.activeScreenId = screenId;
      }

      // Update header stepper active indicator
      const stepMap = {
        'screen-0': '0',
        'screen-1': '1',
        'screen-2': '2',
        'screen-3': '2',
        'screen-5': '5',
        'screen-6': '5',
      };
      const activeStep = stepMap[screenId] || '0';
      const stepItems = document.querySelectorAll('.step-item');
      stepItems.forEach((item) => {
        if (item.dataset.step === activeStep) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      window.scrollTo(0, 0);
    }

    /**
     * Initializes Screen 0 content and elements
     * @param {object} callbacks - { onVoteSelect: function(vote), onStart: function() }
     */
    initScreen0(callbacks = {}) {
      const titleEl = document.getElementById('site-title');
      const introEl = document.querySelector('.intro-text');
      const startBtn = document.getElementById('btn-start');
      const voteButtons = document.querySelectorAll('.vote-btn');
      const heroImg = document.getElementById('hero-banner-img');
      const heroFallback = document.getElementById('hero-banner-fallback');

      if (titleEl && this.theory && this.theory.SITE_TITLE) {
        titleEl.textContent = this.theory.SITE_TITLE;
      }

      if (introEl && this.theory && this.theory.VOTE_QUESTION_INTRO) {
        introEl.textContent = this.theory.VOTE_QUESTION_INTRO;
      }

      // Hero banner image loading with graceful fallback
      if (heroImg) {
        const handleHeroLoad = () => {
          heroImg.classList.add('loaded');
          if (heroFallback) heroFallback.style.display = 'none';
        };
        const handleHeroError = () => {
          heroImg.style.display = 'none';
          if (heroFallback) heroFallback.style.display = 'flex';
        };

        if (heroImg.complete && heroImg.naturalWidth > 0) {
          handleHeroLoad();
        } else {
          heroImg.addEventListener('load', handleHeroLoad);
          heroImg.addEventListener('error', handleHeroError);
        }
      }

      voteButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          voteButtons.forEach((b) => {
            b.classList.remove('selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('selected');
          btn.setAttribute('aria-pressed', 'true');
          const vote = btn.dataset.vote;

          if (startBtn) {
            startBtn.disabled = false;
          }

          if (typeof callbacks.onVoteSelect === 'function') {
            callbacks.onVoteSelect(vote);
          }
        });
      });

      if (startBtn) {
        startBtn.addEventListener('click', () => {
          if (typeof callbacks.onStart === 'function') {
            callbacks.onStart();
          }
        });
      }
    }

    /**
     * Renders a scenario on Screen 1
     * @param {object} scenario - Scenario object
     * @param {number} scenarioIndex - 0-based
     * @param {number} totalScenarios
     * @param {function(number, HTMLElement): void} onOptionSelect
     */
    renderScenario(scenario, scenarioIndex, totalScenarios, onOptionSelect) {
      const layerLabelEl = document.getElementById('layer-label');
      const progressLabelEl = document.getElementById('progress-label');
      const progressFillEl = document.getElementById('progress-fill');
      const stimulusTextEl = document.getElementById('stimulus-text');
      const choicesListEl = document.getElementById('choices-list');
      const feedbackBlockEl = document.getElementById('feedback-block');
      const insightBlockEl = document.getElementById('insight-block');
      const scenarioImgEl = document.getElementById('scenario-img');
      const scenarioFallbackEl = document.getElementById('scenario-fallback');
      const scenarioFallbackIconEl = document.getElementById('scenario-fallback-icon');
      const scenarioFallbackTitleEl = document.getElementById('scenario-fallback-title');

      const layerNames = (this.scenariosData && this.scenariosData.LAYER_NAMES) || {
        sinh_vien: 'Tầng sinh viên',
        nghe_nghiep: 'Tầng nghề nghiệp',
        quyen_luc: 'Tầng quyền lực',
      };

      const layerIcons = {
        sinh_vien: '🎓',
        nghe_nghiep: '💼',
        quyen_luc: '🏛️',
      };

      if (layerLabelEl) {
        const icon = layerIcons[scenario.layer] || '🎓';
        const name = layerNames[scenario.layer] || scenario.layer || '';
        layerLabelEl.innerHTML = `<span>${icon}</span> <span>${name}</span>`;
      }

      if (progressLabelEl) {
        progressLabelEl.textContent = `Tình huống ${scenarioIndex + 1}/${totalScenarios}`;
      }

      if (progressFillEl) {
        progressFillEl.style.width = `${((scenarioIndex + 1) / totalScenarios) * 100}%`;
      }

      if (stimulusTextEl) {
        stimulusTextEl.textContent = scenario.stimulus;
      }

      // Render Scenario Image with fade-in and fallback
      if (scenarioImgEl) {
        scenarioImgEl.classList.remove('loaded');
        scenarioImgEl.style.display = 'block';

        if (scenarioFallbackEl) scenarioFallbackEl.style.display = 'none';
        if (scenarioFallbackIconEl) scenarioFallbackIconEl.textContent = layerIcons[scenario.layer] || '💡';
        if (scenarioFallbackTitleEl) scenarioFallbackTitleEl.textContent = scenario.title || 'Tình huống học thuật';

        const imageSrc = scenario.image || `assets/images/scenario_${scenario.id}.png`;
        scenarioImgEl.src = imageSrc;
        scenarioImgEl.alt = scenario.title || 'Minh họa tình huống';

        const handleScenarioImgLoad = () => {
          scenarioImgEl.classList.add('loaded');
          if (scenarioFallbackEl) scenarioFallbackEl.style.display = 'none';
        };

        const handleScenarioImgError = () => {
          scenarioImgEl.style.display = 'none';
          if (scenarioFallbackEl) scenarioFallbackEl.style.display = 'flex';
        };

        scenarioImgEl.onload = handleScenarioImgLoad;
        scenarioImgEl.onerror = handleScenarioImgError;

        if (scenarioImgEl.complete && scenarioImgEl.naturalWidth > 0) {
          handleScenarioImgLoad();
        }
      }

      if (choicesListEl) {
        choicesListEl.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        scenario.choices.forEach((choice, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'choice-btn';
          btn.setAttribute('data-choice-index', String(idx));
          btn.setAttribute('data-choice-letter', letters[idx] || String(idx + 1));
          
          const textSpan = document.createElement('span');
          textSpan.textContent = choice.text;
          btn.appendChild(textSpan);

          btn.addEventListener('click', () => {
            if (typeof onOptionSelect === 'function') {
              onOptionSelect(idx, btn);
            }
          });

          choicesListEl.appendChild(btn);
        });
      }

      if (feedbackBlockEl) feedbackBlockEl.classList.add('hidden');
      if (insightBlockEl) insightBlockEl.classList.add('hidden');
    }

    /**
     * Displays choice feedback on Screen 1
     * @param {object} choiceResult - { choice, deltaDuc, deltaTai, feedback, source, insight, isLastScenario }
     * @param {HTMLElement} chosenButtonEl
     */
    showChoiceFeedback(choiceResult, chosenButtonEl) {
      const choicesListEl = document.getElementById('choices-list');
      const feedbackBlockEl = document.getElementById('feedback-block');
      const feedbackTextEl = document.getElementById('feedback-text');
      const deltaDucEl = document.getElementById('delta-duc');
      const deltaTaiEl = document.getElementById('delta-tai');
      const feedbackSourceEl = document.getElementById('feedback-source');
      const insightBlockEl = document.getElementById('insight-block');
      const insightTextEl = document.getElementById('insight-text');
      const nextBtnEl = document.getElementById('btn-next-scenario');

      if (choicesListEl) {
        const buttons = choicesListEl.querySelectorAll('.choice-btn');
        buttons.forEach((btn) => (btn.disabled = true));
      }

      if (chosenButtonEl) {
        chosenButtonEl.classList.add('chosen');
      }

      if (feedbackTextEl) {
        feedbackTextEl.textContent = choiceResult.feedback || '';
      }

      if (deltaDucEl) {
        const sign = choiceResult.deltaDuc >= 0 ? '+' : '';
        deltaDucEl.textContent = `Đức: ${sign}${choiceResult.deltaDuc}`;
      }

      if (deltaTaiEl) {
        const sign = choiceResult.deltaTai >= 0 ? '+' : '';
        deltaTaiEl.textContent = `Tài: ${sign}${choiceResult.deltaTai}`;
      }

      if (feedbackSourceEl) {
        feedbackSourceEl.textContent = choiceResult.source ? `Nguồn: ${choiceResult.source}` : '';
      }

      if (insightTextEl) {
        insightTextEl.textContent = choiceResult.insight || '';
      }

      if (nextBtnEl) {
        nextBtnEl.textContent = choiceResult.isLastScenario ? 'Xem kết quả' : 'Tình huống tiếp theo';
      }

      if (feedbackBlockEl) feedbackBlockEl.classList.remove('hidden');
      if (insightBlockEl) insightBlockEl.classList.remove('hidden');
    }

    /**
     * Renders Reference / Academic page (Screen 3)
     */
    renderReference() {
      const theorySummaryEl = document.getElementById('theory-summary');
      const theoryPrinciplesEl = document.getElementById('theory-principles');
      const aiDeclarationEl = document.getElementById('ai-declaration');
      const scopeNoteTheoryEl = document.getElementById('scope-note-theory');
      const citationListEl = document.getElementById('scenario-citations');
      const externalSourcesEl = document.getElementById('external-sources');

      const theory = this.theory || {};
      const scenarios = (this.scenariosData && this.scenariosData.SCENARIOS) || [];
      const layerNames = (this.scenariosData && this.scenariosData.LAYER_NAMES) || {};

      if (theorySummaryEl && theory.THEORY_SUMMARY) {
        theorySummaryEl.textContent = theory.THEORY_SUMMARY;
      }

      if (theoryPrinciplesEl && theory.THEORY_PRINCIPLES) {
        theoryPrinciplesEl.textContent = theory.THEORY_PRINCIPLES;
      }

      if (aiDeclarationEl && theory.AI_DECLARATION) {
        aiDeclarationEl.textContent = theory.AI_DECLARATION;
      }

      if (scopeNoteTheoryEl && theory.PRODUCT_SCOPE_NOTE) {
        scopeNoteTheoryEl.textContent = theory.PRODUCT_SCOPE_NOTE;
      }

      if (citationListEl) {
        citationListEl.innerHTML = '';
        let lastLayer = null;

        scenarios.forEach((s) => {
          if (s.layer !== lastLayer) {
            const heading = document.createElement('li');
            heading.className = 'citation-layer-heading';
            heading.textContent = layerNames[s.layer] || s.layer;
            citationListEl.appendChild(heading);
            lastLayer = s.layer;
          }

          const li = document.createElement('li');
          const sources = s.choices
            .map((c) => c.source)
            .filter(Boolean)
            .join(', ');
          li.textContent = `${s.id}. ${s.title}: ${sources || '(chưa có trích dẫn)'}`;
          citationListEl.appendChild(li);
        });
      }

      if (externalSourcesEl) {
        externalSourcesEl.innerHTML = '';
        const extSources = theory.EXTERNAL_SOURCES || [];

        if (extSources.length === 0) {
          const li = document.createElement('li');
          li.textContent = '[Chưa có nguồn ngoài giáo trình, nhóm điền nếu có]';
          externalSourcesEl.appendChild(li);
        } else {
          extSources.forEach((src) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${src.label}:</strong> <span>${src.note}</span>`;
            externalSourcesEl.appendChild(li);
          });
        }
      }
    }
  }

  const defaultInstance = new ScreenController();

  return {
    ScreenController,
    defaultInstance,
  };
}));
