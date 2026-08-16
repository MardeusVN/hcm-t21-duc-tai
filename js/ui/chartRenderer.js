/**
 * HCM-T21 "Đức hay Tài" — Chart Renderer
 * Renders 2-axis interactive coordinate chart (SVG), plots animated result dot, highlights quadrant, and renders summary notes
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../engine/chartMath.js', '../data/theory.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    const chartMath = require('../engine/chartMath.js');
    const theoryData = require('../data/theory.js');
    module.exports = factory(chartMath, theoryData);
  } else {
    root.HCM = root.HCM || {};
    root.HCM.UI = root.HCM.UI || {};
    root.HCM.UI.ChartRenderer = factory(root.HCM.Engine.ChartMath, root.HCM.Data);
  }
}(typeof self !== 'undefined' ? self : this, function (chartMath, theoryData) {
  'use strict';

  class ChartRenderer {
    constructor(customMath, customData) {
      this.math = customMath || (typeof root !== 'undefined' && root.HCM && root.HCM.Engine && root.HCM.Engine.ChartMath) || chartMath;
      this.data = customData || (typeof root !== 'undefined' && root.HCM && root.HCM.Data) || theoryData;
    }

    /**
     * Renders the complete results screen and coordinate chart
     * @param {number} totalDuc
     * @param {number} totalTai
     * @param {object} quadrantResult - { key, name, desc, quote, badgeImage }
     * @param {string | null} initialVote - 'duc' | 'tai'
     */
    render(totalDuc, totalTai, quadrantResult, initialVote) {
      const quadNameEl = document.getElementById('quadrant-name');
      const quadDescEl = document.getElementById('quadrant-desc');
      const voteCompareEl = document.getElementById('vote-compare');
      const scopeNoteEl = document.getElementById('scope-note-result');
      const resultDotEl = document.getElementById('result-dot');
      const radarRingEl = document.getElementById('radar-ring');
      const badgeImgEl = document.getElementById('result-badge-img');
      const badgeFallbackEl = document.getElementById('result-badge-fallback');

      if (quadNameEl) {
        quadNameEl.textContent = quadrantResult.name || quadrantResult.title || '';
      }

      if (quadDescEl) {
        quadDescEl.textContent = quadrantResult.desc || '';
      }

      // Highlight active quadrant in SVG
      const allQuads = document.querySelectorAll('.quad-bg');
      allQuads.forEach((el) => el.classList.remove('quad-active'));

      const activeQuad = document.querySelector(`.quad-bg[data-quad="${quadrantResult.key}"]`);
      if (activeQuad) {
        activeQuad.classList.add('quad-active');
      }

      // Render comparative vote text
      if (voteCompareEl) {
        const voteLabel = initialVote === 'tai' ? 'Tài' : 'Đức';
        const resultName = quadrantResult.name || quadrantResult.title || '';
        voteCompareEl.textContent = `Đầu game bạn chọn: ${voteLabel}. Kết quả cuối: ${resultName}.`;
      }

      // Render scope note
      if (scopeNoteEl) {
        const note = (this.data && this.data.PRODUCT_SCOPE_NOTE) || '';
        scopeNoteEl.textContent = note;
      }

      // Position the SVG dot and radar pulsing ring
      if (resultDotEl && this.math && this.math.calculateSvgPoint) {
        const point = this.math.calculateSvgPoint(totalDuc, totalTai, 300, 300, 10);
        resultDotEl.setAttribute('cx', point.cx);
        resultDotEl.setAttribute('cy', point.cy);
        
        if (radarRingEl) {
          radarRingEl.setAttribute('cx', point.cx);
          radarRingEl.setAttribute('cy', point.cy);
        }

        // Add animated class if not present
        if (!resultDotEl.classList.contains('result-dot-animated')) {
          resultDotEl.classList.add('result-dot-animated');
        }

        // Set ARIA label for screen readers with exact coordinates
        resultDotEl.setAttribute('aria-label', `Điểm tọa độ của bạn: Tài = ${totalTai}, Đức = ${totalDuc} (${quadrantResult.name || ''})`);
      }

      // Load Quadrant Result Badge Graphic
      if (badgeImgEl) {
        badgeImgEl.classList.remove('loaded');
        badgeImgEl.style.display = 'block';

        if (badgeFallbackEl) badgeFallbackEl.style.display = 'none';

        const badgeSrc = quadrantResult.badgeImage || `assets/images/badge_${quadrantResult.key}.png`;
        badgeImgEl.src = badgeSrc;
        badgeImgEl.alt = `Huy hiệu ${quadrantResult.name || quadrantResult.title || 'Kết quả'}`;

        const handleBadgeLoad = () => {
          badgeImgEl.classList.add('loaded');
          if (badgeFallbackEl) badgeFallbackEl.style.display = 'none';
        };

        const handleBadgeError = () => {
          badgeImgEl.style.display = 'none';
          if (badgeFallbackEl) badgeFallbackEl.style.display = 'flex';
        };

        badgeImgEl.onload = handleBadgeLoad;
        badgeImgEl.onerror = handleBadgeError;

        if (badgeImgEl.complete && badgeImgEl.naturalWidth > 0) {
          handleBadgeLoad();
        }
      }
    }
  }

  const defaultInstance = new ChartRenderer();

  return {
    ChartRenderer,
    defaultInstance,
  };
}));
