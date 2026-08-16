/**
 * HCM-T21 "Đức hay Tài" — Game State Engine
 * Manages game progression, cumulative delta scoring, choice selection, and quadrant classification
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../data/scenarios.js', '../data/theory.js', './chartMath.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    const scenariosData = require('../data/scenarios.js');
    const theoryData = require('../data/theory.js');
    const chartMath = require('./chartMath.js');
    module.exports = factory(scenariosData, theoryData, chartMath);
  } else {
    root.HCM = root.HCM || {};
    root.HCM.Engine = root.HCM.Engine || {};
    root.HCM.Engine.GameState = factory(root.HCM.Data, root.HCM.Data, root.HCM.Engine.ChartMath);
  }
}(typeof self !== 'undefined' ? self : this, function (scenariosData, theoryData, chartMath) {
  'use strict';

  const STORAGE_KEY = 'hcm_t21_initialVote';

  function safeGetStorage(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      // Storage access blocked or unavailable
    }
    return null;
  }

  function safeSetStorage(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      // Storage access blocked or unavailable
    }
  }

  class GameStateEngine {
    constructor(customScenarios, customQuadrants) {
      this.scenarios = (customScenarios && customScenarios.SCENARIOS) ||
                       (scenariosData && scenariosData.SCENARIOS) || [];
      this.quadrants = (customQuadrants && customQuadrants.QUADRANTS) ||
                       (theoryData && theoryData.QUADRANTS) || {};
      this.chartMath = chartMath || (typeof root !== 'undefined' && root.HCM && root.HCM.Engine && root.HCM.Engine.ChartMath);
      this.reset();
    }

    /**
     * Resets the game state back to initial values
     */
    reset() {
      this.state = {
        initialVote: null,
        scenarioIndex: 0,
        totalDuc: 0,
        totalTai: 0,
        answeredCurrent: false,
        history: [],
      };
    }

    /**
     * Initializes a new game session
     * @param {"duc" | "tai" | null} [initialVote=null]
     */
    initGame(initialVote = null) {
      this.reset();
      if (initialVote) {
        this.setInitialVote(initialVote);
      } else {
        const stored = safeGetStorage(STORAGE_KEY);
        if (stored) {
          this.state.initialVote = stored;
        }
      }
    }

    /**
     * Sets the user's initial vote ('duc' or 'tai') and persists it
     * @param {"duc" | "tai"} vote
     */
    setInitialVote(vote) {
      this.state.initialVote = vote;
      safeSetStorage(STORAGE_KEY, vote);
    }

    /**
     * Gets the initial vote
     * @returns {"duc" | "tai" | null}
     */
    getInitialVote() {
      if (this.state.initialVote) return this.state.initialVote;
      return safeGetStorage(STORAGE_KEY);
    }

    /**
     * Gets total scenario count
     * @returns {number}
     */
    getTotalScenarios() {
      return this.scenarios.length;
    }

    /**
     * Gets current scenario index (0..5)
     * @returns {number}
     */
    getCurrentScenarioIndex() {
      return this.state.scenarioIndex;
    }

    /**
     * Gets current scenario object
     * @returns {object | null}
     */
    getCurrentScenario() {
      return this.scenarios[this.state.scenarioIndex] || null;
    }

    /**
     * Checks if the current scenario has been answered
     * @returns {boolean}
     */
    isCurrentScenarioAnswered() {
      return this.state.answeredCurrent;
    }

    /**
     * Checks if the player has finished all scenarios
     * @returns {boolean}
     */
    isGameOver() {
      return this.state.scenarioIndex >= this.scenarios.length;
    }

    /**
     * Processes player choice selection for the current scenario
     * @param {number} choiceIndex - 0, 1, or 2
     * @returns {object} result of the selection
     */
    selectOption(choiceIndex) {
      if (this.state.answeredCurrent) {
        throw new Error('Current scenario already answered.');
      }

      const scenario = this.getCurrentScenario();
      if (!scenario) {
        throw new Error('Invalid scenario index: ' + this.state.scenarioIndex);
      }

      const choice = scenario.choices[choiceIndex];
      if (!choice) {
        throw new Error('Invalid choice index: ' + choiceIndex);
      }

      this.state.answeredCurrent = true;
      this.state.totalDuc += choice.deltaDuc;
      this.state.totalTai += choice.deltaTai;

      const record = {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        layer: scenario.layer,
        choiceIndex,
        choiceText: choice.text,
        deltaDuc: choice.deltaDuc,
        deltaTai: choice.deltaTai,
        totalDuc: this.state.totalDuc,
        totalTai: this.state.totalTai,
        feedback: choice.feedback,
        source: choice.source,
        insight: scenario.insight,
      };

      this.state.history.push(record);

      const isLastScenario = this.state.scenarioIndex === this.scenarios.length - 1;

      return {
        success: true,
        scenario,
        choice,
        deltaDuc: choice.deltaDuc,
        deltaTai: choice.deltaTai,
        totalDuc: this.state.totalDuc,
        totalTai: this.state.totalTai,
        feedback: choice.feedback,
        source: choice.source,
        insight: scenario.insight,
        isLastScenario,
      };
    }

    /**
     * Advances to the next scenario
     * @returns {boolean} true if moved to next, false if reached end
     */
    advanceScenario() {
      if (this.state.scenarioIndex < this.scenarios.length - 1) {
        this.state.scenarioIndex += 1;
        this.state.answeredCurrent = false;
        return true;
      }
      return false;
    }

    /**
     * Gets cumulative scores
     * @returns {{ totalDuc: number, totalTai: number }}
     */
    getScores() {
      return {
        totalDuc: this.state.totalDuc,
        totalTai: this.state.totalTai,
      };
    }

    /**
     * Calculates the quadrant classification and returns rich quadrant metadata
     * @returns {object}
     */
    getQuadrantResult() {
      const evaluateKey = (this.chartMath && this.chartMath.evaluateQuadrantKey)
        ? this.chartMath.evaluateQuadrantKey
        : (d, t) => {
            const gd = d > 1;
            const gt = t > 1;
            if (gd && gt) return 'vua_hong_vua_chuyen';
            if (gd && !gt) return 'dang_tin_bat_luc';
            if (!gd && !gt) return 'vo_hai_vo_dung';
            return 'nguy_hiem_nhat';
          };

      const key = evaluateKey(this.state.totalDuc, this.state.totalTai);
      const quadMeta = this.quadrants[key] || {
        key,
        name: key,
        title: key,
        desc: '',
        quote: '',
      };

      return {
        key,
        name: quadMeta.name,
        title: quadMeta.title || quadMeta.name,
        quote: quadMeta.quote || '',
        desc: quadMeta.desc,
        totalDuc: this.state.totalDuc,
        totalTai: this.state.totalTai,
      };
    }

    /**
     * Returns the full history of player decisions
     * @returns {Array<object>}
     */
    getHistory() {
      return [...this.state.history];
    }
  }

  // Singleton instance for convenience
  const defaultInstance = new GameStateEngine();

  return {
    GameStateEngine,
    defaultInstance,
  };
}));
