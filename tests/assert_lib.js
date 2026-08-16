/**
 * HCM-T21 "Đức hay Tài" — Zero-Dependency Test Framework & Assertion Library
 * Isomorphic: works identically in Node.js CLI and Browser environments
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM_TEST = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class TestRunner {
    constructor() {
      this.suites = [];
      this.currentSuite = null;
      this.totalAssertions = 0;
      this.passedAssertions = 0;
      this.failedAssertions = 0;
      this.startTime = 0;
      this.endTime = 0;
    }

    reset() {
      this.suites = [];
      this.currentSuite = null;
      this.totalAssertions = 0;
      this.passedAssertions = 0;
      this.failedAssertions = 0;
      this.startTime = 0;
      this.endTime = 0;
    }

    describe(name, fn) {
      const suite = {
        name,
        tests: [],
        passed: 0,
        failed: 0,
        duration: 0,
      };
      this.suites.push(suite);
      const prevSuite = this.currentSuite;
      this.currentSuite = suite;

      try {
        fn();
      } catch (err) {
        suite.tests.push({
          name: 'Suite Setup / Execution',
          passed: false,
          error: err.message || String(err),
          stack: err.stack,
          assertions: [],
        });
        suite.failed += 1;
      } finally {
        this.currentSuite = prevSuite;
      }
    }

    test(name, fn) {
      if (!this.currentSuite) {
        this.describe('Default Suite', () => this.test(name, fn));
        return;
      }

      const testCase = {
        name,
        passed: true,
        error: null,
        stack: null,
        duration: 0,
        assertions: [],
      };
      this.currentSuite.tests.push(testCase);

      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const prevActiveTest = this.activeTest;
      this.activeTest = testCase;

      try {
        fn();
      } catch (err) {
        testCase.passed = false;
        testCase.error = err.message || String(err);
        testCase.stack = err.stack;
      } finally {
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        testCase.duration = Math.round((endTime - startTime) * 100) / 100;
        this.activeTest = prevActiveTest;

        if (testCase.passed) {
          this.currentSuite.passed += 1;
        } else {
          this.currentSuite.failed += 1;
        }
      }
    }

    it(name, fn) {
      this.test(name, fn);
    }

    recordAssertion(passed, message, expected, actual) {
      this.totalAssertions += 1;
      if (passed) {
        this.passedAssertions += 1;
      } else {
        this.failedAssertions += 1;
      }

      const assertion = {
        passed,
        message,
        expected,
        actual,
      };

      if (this.activeTest) {
        this.activeTest.assertions.push(assertion);
        if (!passed) {
          this.activeTest.passed = false;
          if (!this.activeTest.error) {
            this.activeTest.error = message || `Assertion failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
          }
        }
      }

      if (!passed) {
        const err = new Error(message || `Assertion failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        // We do not throw immediately so other assertions can continue if structured as soft, or we throw on hard failure
      }
      return passed;
    }

    expect(actual) {
      const runner = this;

      function deepEqual(a, b) {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (typeof a !== 'object' || a === null || b === null) return false;
        if (Array.isArray(a) !== Array.isArray(b)) return false;

        if (Array.isArray(a)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        for (const k of keysA) {
          if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
          if (!deepEqual(a[k], b[k])) return false;
        }
        return true;
      }

      return {
        toBe(expected, msg) {
          const pass = actual === expected;
          const message = msg || `Expected ${JSON.stringify(actual)} === ${JSON.stringify(expected)}`;
          runner.recordAssertion(pass, message, expected, actual);
          if (!pass) throw new Error(message);
        },

        toEqual(expected, msg) {
          const pass = deepEqual(actual, expected);
          const message = msg || `Expected deep equality: ${JSON.stringify(actual)} === ${JSON.stringify(expected)}`;
          runner.recordAssertion(pass, message, expected, actual);
          if (!pass) throw new Error(message);
        },

        toBeTruthy(msg) {
          const pass = Boolean(actual);
          const message = msg || `Expected ${JSON.stringify(actual)} to be truthy`;
          runner.recordAssertion(pass, message, true, actual);
          if (!pass) throw new Error(message);
        },

        toBeFalsy(msg) {
          const pass = !Boolean(actual);
          const message = msg || `Expected ${JSON.stringify(actual)} to be falsy`;
          runner.recordAssertion(pass, message, false, actual);
          if (!pass) throw new Error(message);
        },

        toBeGreaterThan(expected, msg) {
          const pass = actual > expected;
          const message = msg || `Expected ${actual} > ${expected}`;
          runner.recordAssertion(pass, message, `> ${expected}`, actual);
          if (!pass) throw new Error(message);
        },

        toBeGreaterThanOrEqual(expected, msg) {
          const pass = actual >= expected;
          const message = msg || `Expected ${actual} >= ${expected}`;
          runner.recordAssertion(pass, message, `>= ${expected}`, actual);
          if (!pass) throw new Error(message);
        },

        toBeLessThan(expected, msg) {
          const pass = actual < expected;
          const message = msg || `Expected ${actual} < ${expected}`;
          runner.recordAssertion(pass, message, `< ${expected}`, actual);
          if (!pass) throw new Error(message);
        },

        toBeLessThanOrEqual(expected, msg) {
          const pass = actual <= expected;
          const message = msg || `Expected ${actual} <= ${expected}`;
          runner.recordAssertion(pass, message, `<= ${expected}`, actual);
          if (!pass) throw new Error(message);
        },

        toBeInRange(min, max, msg) {
          const pass = actual >= min && actual <= max;
          const message = msg || `Expected ${actual} to be in range [${min}..${max}]`;
          runner.recordAssertion(pass, message, `[${min}..${max}]`, actual);
          if (!pass) throw new Error(message);
        },

        toBeCloseTo(expected, precision = 2, msg) {
          const diff = Math.abs(actual - expected);
          const tolerance = Math.pow(10, -precision) / 2;
          const pass = diff < tolerance;
          const message = msg || `Expected ${actual} to be close to ${expected} (diff: ${diff} < ${tolerance})`;
          runner.recordAssertion(pass, message, expected, actual);
          if (!pass) throw new Error(message);
        },

        toContain(item, msg) {
          let pass = false;
          if (typeof actual === 'string' || Array.isArray(actual)) {
            pass = actual.indexOf(item) !== -1;
          } else if (actual && typeof actual === 'object') {
            pass = item in actual;
          }
          const message = msg || `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`;
          runner.recordAssertion(pass, message, `containing ${item}`, actual);
          if (!pass) throw new Error(message);
        },

        toHaveLength(expected, msg) {
          const actualLen = actual ? actual.length : undefined;
          const pass = actualLen === expected;
          const message = msg || `Expected length ${expected}, got ${actualLen}`;
          runner.recordAssertion(pass, message, expected, actualLen);
          if (!pass) throw new Error(message);
        },

        toThrow(expectedError, msg) {
          if (typeof actual !== 'function') {
            const message = 'expect().toThrow requires a function';
            runner.recordAssertion(false, message, 'function', typeof actual);
            throw new Error(message);
          }
          let threw = false;
          let thrownError = null;
          try {
            actual();
          } catch (err) {
            threw = true;
            thrownError = err;
          }

          let pass = threw;
          if (threw && expectedError) {
            if (typeof expectedError === 'string') {
              pass = thrownError.message.includes(expectedError);
            } else if (expectedError instanceof RegExp) {
              pass = expectedError.test(thrownError.message);
            }
          }

          const message = msg || (pass ? `Function threw as expected` : `Expected function to throw ${expectedError || 'an error'}`);
          runner.recordAssertion(pass, message, expectedError ? String(expectedError) : 'any error', thrownError ? thrownError.message : 'no throw');
          if (!pass) throw new Error(message);
        },
      };
    }

    getSummary() {
      let totalTests = 0;
      let totalPassed = 0;
      let totalFailed = 0;
      let totalDuration = 0;

      for (const s of this.suites) {
        totalTests += s.tests.length;
        totalPassed += s.passed;
        totalFailed += s.failed;
        for (const t of s.tests) {
          totalDuration += t.duration || 0;
        }
      }

      return {
        totalSuites: this.suites.length,
        totalTests,
        totalPassed,
        totalFailed,
        totalAssertions: this.totalAssertions,
        passedAssertions: this.passedAssertions,
        failedAssertions: this.failedAssertions,
        totalDuration: Math.round(totalDuration * 100) / 100,
        allPassed: totalFailed === 0 && totalTests > 0,
      };
    }
  }

  const defaultRunner = new TestRunner();

  return {
    TestRunner,
    defaultRunner,
    describe: (name, fn) => defaultRunner.describe(name, fn),
    test: (name, fn) => defaultRunner.test(name, fn),
    it: (name, fn) => defaultRunner.it(name, fn),
    expect: (actual) => defaultRunner.expect(actual),
    getSummary: () => defaultRunner.getSummary(),
  };
}));
