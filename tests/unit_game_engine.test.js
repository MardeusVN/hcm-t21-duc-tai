/**
 * Unit Tests for Game Engine & Scenario Simulation (729 Paths)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../js/data/scenarios.js'),
      require('../js/data/theory.js'),
      require('../js/engine/gameState.js'),
      require('../js/engine/chartMath.js')
    );
  } else {
    root.HCMTests = root.HCMTests || {};
    root.HCMTests.GameEngine = factory(
      root.HCM.Data,
      root.HCM.Data,
      root.HCM.Engine.GameState,
      root.HCM.Engine.ChartMath
    );
  }
}(typeof self !== 'undefined' ? self : this, function (scenariosData, theoryData, gameStateModule, chartMath) {
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

    reporter('--- Running Unit Tests: Game Engine & 729 Path Simulation ---');

    const GameStateEngine = gameStateModule.GameStateEngine || gameStateModule;
    const engine = new GameStateEngine(scenariosData, theoryData);

    // 1. Initial State
    engine.initGame('duc');
    assert(engine.getCurrentScenarioIndex() === 0, 'Initial scenario index is 0');
    assert(engine.getTotalScenarios() === 6, 'Total scenarios count is 6');
    assert(engine.getInitialVote() === 'duc', 'Initial vote is stored as "duc"');

    const scores0 = engine.getScores();
    assert(scores0.totalDuc === 0 && scores0.totalTai === 0, 'Initial scores are 0, 0');

    // 2. Step through one scenario
    const s1 = engine.getCurrentScenario();
    assert(s1 && s1.id === 1, 'First scenario ID is 1');
    assert(s1.choices.length === 3, 'Scenario 1 has 3 choices');

    const choiceRes = engine.selectOption(1); // Option B: Xin gia hạn (+2, +1)
    assert(choiceRes.deltaDuc === 2 && choiceRes.deltaTai === 1, 'Choice B delta is +2 Duc, +1 Tai');
    assert(engine.getScores().totalDuc === 2 && engine.getScores().totalTai === 1, 'Cumulative score updated to (2, 1)');
    assert(engine.isCurrentScenarioAnswered() === true, 'Current scenario is marked answered');

    const advanced = engine.advanceScenario();
    assert(advanced === true, 'Advanced to scenario 2');
    assert(engine.getCurrentScenarioIndex() === 1, 'Current index is now 1');
    assert(engine.isCurrentScenarioAnswered() === false, 'New scenario is unanswered');

    // 3. 729 Path Full Combinatorial Simulation
    let minDuc = Infinity;
    let maxDuc = -Infinity;
    let minTai = Infinity;
    let maxTai = -Infinity;

    const quadCount = {
      vua_hong_vua_chuyen: 0,
      dang_tin_bat_luc: 0,
      vo_hai_vo_dung: 0,
      nguy_hiem_nhat: 0,
    };

    function simulate(idx, state) {
      if (idx === 6) {
        if (state.totalDuc < minDuc) minDuc = state.totalDuc;
        if (state.totalDuc > maxDuc) maxDuc = state.totalDuc;
        if (state.totalTai < minTai) minTai = state.totalTai;
        if (state.totalTai > maxTai) maxTai = state.totalTai;

        const quad = chartMath.evaluateQuadrantKey(state.totalDuc, state.totalTai);
        quadCount[quad] = (quadCount[quad] || 0) + 1;
        return;
      }

      const sc = scenariosData.SCENARIOS[idx];
      for (let c = 0; c < 3; c++) {
        const choice = sc.choices[c];
        simulate(idx + 1, {
          totalDuc: state.totalDuc + choice.deltaDuc,
          totalTai: state.totalTai + choice.deltaTai,
        });
      }
    }

    simulate(0, { totalDuc: 0, totalTai: 0 });

    assert(minDuc === -11, 'Min Duc score across 729 paths is -11');
    assert(maxDuc === 12, 'Max Duc score across 729 paths is 12');
    assert(minTai === -7, 'Min Tai score across 729 paths is -7');
    assert(maxTai === 9, 'Max Tai score across 729 paths is 9');

    const totalPaths = quadCount.vua_hong_vua_chuyen + quadCount.dang_tin_bat_luc + quadCount.vo_hai_vo_dung + quadCount.nguy_hiem_nhat;
    assert(totalPaths === 729, 'Total simulated branches equals 729 (3^6)');
    assert(quadCount.vua_hong_vua_chuyen > 0, 'Quadrant "vua_hong_vua_chuyen" has reachable paths');
    assert(quadCount.dang_tin_bat_luc > 0, 'Quadrant "dang_tin_bat_luc" has reachable paths');
    assert(quadCount.vo_hai_vo_dung > 0, 'Quadrant "vo_hai_vo_dung" has reachable paths');
    assert(quadCount.nguy_hiem_nhat > 0, 'Quadrant "nguy_hiem_nhat" has reachable paths');

    reporter(`Unit Tests Completed: ${passed} passed, ${failed} failed.`);
    return { passed, failed, total: passed + failed };
  }

  if (typeof module === 'object' && module.exports) {
    runTests();
  }

  return { runTests };
}));
