/**
 * Unit Tests for Chart Math & SVG Coordinate Transformation
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../js/engine/chartMath.js'));
  } else {
    root.HCMTests = root.HCMTests || {};
    root.HCMTests.ChartMath = factory(root.HCM.Engine.ChartMath);
  }
}(typeof self !== 'undefined' ? self : this, function (chartMath) {
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

    reporter('--- Running Unit Tests: Chart Math & Coordinate Mapping ---');

    // 1. Clamping tests
    assert(chartMath.clampCoordinate(20, -12, 12) === 12, 'Value > 12 clamped to 12');
    assert(chartMath.clampCoordinate(-20, -12, 12) === -12, 'Value < -12 clamped to -12');
    assert(chartMath.clampCoordinate(0, -12, 12) === 0, 'Value 0 remains 0');
    assert(chartMath.clampCoordinate(null, -12, 12) === 0, 'Null value defaults to 0');
    assert(chartMath.clampCoordinate(undefined, -12, 12) === 0, 'Undefined value defaults to 0');

    // 2. SVG Points calculation
    const pOrigin = chartMath.calculateSvgPoint(0, 0, 300, 300, 10);
    assert(pOrigin.cx === 150 && pOrigin.cy === 150, 'Origin point is at center (150, 150)');

    const pTopRight = chartMath.calculateSvgPoint(12, 12, 300, 300, 10);
    assert(pTopRight.cx === 270, 'Max positive Tai (12) maps to cx=270 (150 + 120)');
    assert(pTopRight.cy === 30, 'Max positive Duc (12) maps to cy=30 (150 - 120)');

    const pBottomLeft = chartMath.calculateSvgPoint(-12, -12, 300, 300, 10);
    assert(pBottomLeft.cx === 30, 'Min negative Tai (-12) maps to cx=30 (150 - 120)');
    assert(pBottomLeft.cy === 270, 'Min negative Duc (-12) maps to cy=270 (150 + 120)');

    // 3. Quadrant classification
    assert(chartMath.evaluateQuadrantKey(2, 2) === 'vua_hong_vua_chuyen', 'Point (2, 2) is "vua_hong_vua_chuyen"');
    assert(chartMath.evaluateQuadrantKey(2, 0) === 'dang_tin_bat_luc', 'Point (2, 0) is "dang_tin_bat_luc"');
    assert(chartMath.evaluateQuadrantKey(0, 0) === 'vo_hai_vo_dung', 'Point (0, 0) is "vo_hai_vo_dung"');
    assert(chartMath.evaluateQuadrantKey(0, 2) === 'nguy_hiem_nhat', 'Point (0, 2) is "nguy_hiem_nhat"');

    // Threshold boundary edge tests
    assert(chartMath.evaluateQuadrantKey(1, 1) === 'vo_hai_vo_dung', 'Point exactly on threshold (1, 1) is "vo_hai_vo_dung"');
    assert(chartMath.evaluateQuadrantKey(1.0001, 1.0001) === 'vua_hong_vua_chuyen', 'Point strictly > 1 is "vua_hong_vua_chuyen"');
    assert(chartMath.evaluateQuadrantKey(1.0001, 1.0) === 'dang_tin_bat_luc', 'Duc > 1, Tai <= 1 is "dang_tin_bat_luc"');
    assert(chartMath.evaluateQuadrantKey(1.0, 1.0001) === 'nguy_hiem_nhat', 'Duc <= 1, Tai > 1 is "nguy_hiem_nhat"');

    // 4. Quadrant bounds
    const bTopLeft = chartMath.getQuadrantBounds('dang_tin_bat_luc', 300, 300);
    assert(bTopLeft.x === 0 && bTopLeft.y === 0 && bTopLeft.width === 150 && bTopLeft.height === 150, 'Top-Left quad bounds');

    const bTopRight = chartMath.getQuadrantBounds('vua_hong_vua_chuyen', 300, 300);
    assert(bTopRight.x === 150 && bTopRight.y === 0 && bTopRight.width === 150 && bTopRight.height === 150, 'Top-Right quad bounds');

    reporter(`Unit Tests Completed: ${passed} passed, ${failed} failed.`);
    return { passed, failed, total: passed + failed };
  }

  if (typeof module === 'object' && module.exports) {
    runTests();
  }

  return { runTests };
}));
