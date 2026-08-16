/**
 * HCM-T21 "Đức hay Tài" — Chart Math Engine
 * Mathematical transformations, SVG coordinate mapping, clamping, and quadrant boundary evaluation
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM = root.HCM || {};
    root.HCM.Engine = root.HCM.Engine || {};
    root.HCM.Engine.ChartMath = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Academic classification thresholds
  const THRESHOLD_DUC = 1;
  const THRESHOLD_TAI = 1;

  // Coordinate limits (theoretical maximum delta across 6 scenarios is [-12..12])
  const MIN_COORD = -12;
  const MAX_COORD = 12;
  const DEFAULT_SCALE = 10; // 10px per score point in 300x300 viewBox
  const DEFAULT_CENTER_X = 150;
  const DEFAULT_CENTER_Y = 150;
  const DEFAULT_VIEWBOX_SIZE = 300;

  /**
   * Clamps a value between min and max bounds
   * @param {number} value
   * @param {number} [min=-12]
   * @param {number} [max=12]
   * @returns {number}
   */
  function clampCoordinate(value, min = MIN_COORD, max = MAX_COORD) {
    const num = typeof value === 'number' && !isNaN(value) ? value : 0;
    return Math.max(min, Math.min(max, num));
  }

  /**
   * Calculates SVG center coordinates (cx, cy) from Duc and Tai scores
   * In standard SVG viewBox 300x300:
   * - Origin (0,0 score) is at (150, 150)
   * - Positive Tai moves RIGHT (+X)
   * - Positive Duc moves UP (-Y in SVG space)
   * @param {number} duc - Score on Morality axis
   * @param {number} tai - Score on Talent axis
   * @param {number} [viewBoxWidth=300]
   * @param {number} [viewBoxHeight=300]
   * @param {number} [scale=10]
   * @returns {{ cx: number, cy: number, clampedDuc: number, clampedTai: number }}
   */
  function calculateSvgPoint(duc, tai, viewBoxWidth = DEFAULT_VIEWBOX_SIZE, viewBoxHeight = DEFAULT_VIEWBOX_SIZE, scale = DEFAULT_SCALE) {
    const clampedDuc = clampCoordinate(duc);
    const clampedTai = clampCoordinate(tai);

    const centerX = viewBoxWidth / 2;
    const centerY = viewBoxHeight / 2;

    const cx = centerX + (clampedTai * scale);
    const cy = centerY - (clampedDuc * scale);

    return {
      cx,
      cy,
      clampedDuc,
      clampedTai,
    };
  }

  /**
   * Evaluates the quadrant key based on totalDuc and totalTai
   * Threshold rules:
   * - Duc > 1 && Tai > 1  => "vua_hong_vua_chuyen" (Top-Right / Quadrant I)
   * - Duc > 1 && Tai <= 1 => "dang_tin_bat_luc" (Top-Left / Quadrant II)
   * - Duc <= 1 && Tai <= 1 => "vo_hai_vo_dung" (Bottom-Left / Quadrant III)
   * - Duc <= 1 && Tai > 1  => "nguy_hiem_nhat" (Bottom-Right / Quadrant IV)
   * @param {number} totalDuc
   * @param {number} totalTai
   * @returns {"vua_hong_vua_chuyen" | "dang_tin_bat_luc" | "vo_hai_vo_dung" | "nguy_hiem_nhat"}
   */
  function evaluateQuadrantKey(totalDuc, totalTai) {
    const goodDuc = (typeof totalDuc === 'number' ? totalDuc : 0) > THRESHOLD_DUC;
    const goodTai = (typeof totalTai === 'number' ? totalTai : 0) > THRESHOLD_TAI;

    if (goodDuc && goodTai) return "vua_hong_vua_chuyen";
    if (goodDuc && !goodTai) return "dang_tin_bat_luc";
    if (!goodDuc && !goodTai) return "vo_hai_vo_dung";
    return "nguy_hiem_nhat";
  }

  /**
   * Returns geometric bounds for a given quadrant within the SVG coordinate space
   * @param {string} quadrantKey
   * @param {number} [viewBoxWidth=300]
   * @param {number} [viewBoxHeight=300]
   * @returns {{ x: number, y: number, width: number, height: number }}
   */
  function getQuadrantBounds(quadrantKey, viewBoxWidth = DEFAULT_VIEWBOX_SIZE, viewBoxHeight = DEFAULT_VIEWBOX_SIZE) {
    const halfW = viewBoxWidth / 2;
    const halfH = viewBoxHeight / 2;

    switch (quadrantKey) {
      case "dang_tin_bat_luc": // Top-Left
        return { x: 0, y: 0, width: halfW, height: halfH };
      case "vua_hong_vua_chuyen": // Top-Right
        return { x: halfW, y: 0, width: halfW, height: halfH };
      case "vo_hai_vo_dung": // Bottom-Left
        return { x: 0, y: halfH, width: halfW, height: halfH };
      case "nguy_hiem_nhat": // Bottom-Right
        return { x: halfW, y: halfH, width: halfW, height: halfH };
      default:
        return { x: 0, y: 0, width: viewBoxWidth, height: viewBoxHeight };
    }
  }

  /**
   * Returns metadata about thresholds
   */
  function getThresholds() {
    return {
      thresholdDuc: THRESHOLD_DUC,
      thresholdTai: THRESHOLD_TAI,
      minCoord: MIN_COORD,
      maxCoord: MAX_COORD,
      defaultScale: DEFAULT_SCALE,
    };
  }

  return {
    THRESHOLD_DUC,
    THRESHOLD_TAI,
    MIN_COORD,
    MAX_COORD,
    DEFAULT_SCALE,
    clampCoordinate,
    calculateSvgPoint,
    evaluateQuadrantKey,
    getQuadrantBounds,
    getThresholds,
  };
}));
