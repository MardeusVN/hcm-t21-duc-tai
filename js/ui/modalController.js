/**
 * HCM-T21 "Đức hay Tài" — Modal Controller
 * Accessible modal dialog controller for theory points, pedagogical scripts, and citations
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM = root.HCM || {};
    root.HCM.UI = root.HCM.UI || {};
    root.HCM.UI.ModalController = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class ModalController {
    constructor() {
      this.modalEl = null;
      this.modalTitleEl = null;
      this.modalBodyEl = null;
      this.closeBtnEl = null;
      this.lastFocusedElement = null;
      this.activeTriggerEl = null;
      this.isOpen = false;
      this._boundKeyHandler = this._handleKeyDown.bind(this);
    }

    /**
     * Initializes modal DOM element references and sets up event listeners
     */
    init() {
      this.modalEl = document.getElementById('theory-modal');
      this.modalTitleEl = document.getElementById('modal-title');
      this.modalBodyEl = document.getElementById('modal-body');
      this.closeBtnEl = document.getElementById('modal-close');

      if (!this.modalEl) return;

      if (this.closeBtnEl) {
        this.closeBtnEl.addEventListener('click', () => this.close());
      }

      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });
    }

    /**
     * Opens the theory modal with an array of theory points
     * @param {Array<{ title: string, source: string, script: string }>} points
     * @param {HTMLElement} [triggerElement=null]
     * @param {string} [customTitle="Những lý thuyết cần nắm vững"]
     */
    open(points, triggerElement = null, customTitle = "Những lý thuyết cần nắm vững") {
      if (!this.modalEl || !this.modalBodyEl) return;

      this.lastFocusedElement = document.activeElement;
      this.activeTriggerEl = triggerElement;

      if (this.activeTriggerEl) {
        this.activeTriggerEl.setAttribute('aria-expanded', 'true');
      }

      if (this.modalTitleEl) {
        this.modalTitleEl.textContent = customTitle;
      }

      this.modalBodyEl.innerHTML = '';
      const list = Array.isArray(points) ? points : [];

      list.forEach((point, idx) => {
        const block = document.createElement('div');
        block.className = 'theory-point';

        const title = document.createElement('h4');
        title.className = 'theory-point-title';
        title.textContent = list.length > 1 ? `${idx + 1}. ${point.title} ` : `${point.title} `;

        if (point.source) {
          const source = document.createElement('span');
          source.className = 'theory-point-source';
          source.textContent = `(${point.source})`;
          title.appendChild(source);
        }

        const script = document.createElement('p');
        script.className = 'theory-point-script';
        script.textContent = point.script || '';

        block.appendChild(title);
        block.appendChild(script);
        this.modalBodyEl.appendChild(block);
      });

      this.modalEl.classList.remove('hidden');
      this.isOpen = true;

      document.addEventListener('keydown', this._boundKeyHandler);

      // Focus the close button for accessibility
      if (this.closeBtnEl) {
        this.closeBtnEl.focus();
      }
    }

    /**
     * Closes the modal and restores previous focus
     */
    close() {
      if (!this.modalEl || !this.isOpen) return;

      this.modalEl.classList.add('hidden');
      this.isOpen = false;

      document.removeEventListener('keydown', this._boundKeyHandler);

      if (this.activeTriggerEl) {
        this.activeTriggerEl.setAttribute('aria-expanded', 'false');
        this.activeTriggerEl = null;
      }

      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }

    /**
     * Internal keydown handler for Escape key and focus trap
     * @private
     */
    _handleKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.key === 'Tab' && this.modalEl && this.isOpen) {
        const focusables = this.modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
  }

  const defaultInstance = new ModalController();

  return {
    ModalController,
    defaultInstance,
  };
}));
