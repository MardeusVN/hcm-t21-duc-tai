/**
 * HCM-T21 "Đức hay Tài" — Command-Line Test Runner (Node.js CLI)
 * Runs all unit and integration test suites, displays rich terminal output, and sets exit code
 */

const path = require('path');
const testHarness = require('./assert_lib.js');

// ANSI Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gold: '\x1b[38;2;201;134;10m',
  sapphire: '\x1b[38;2;29;78;216m',
};

console.log(`${colors.gold}${colors.bright}======================================================================${colors.reset}`);
console.log(`${colors.gold}${colors.bright}       HCM-T21 "ĐỨC HAY TÀI" — AUTOMATED TEST SUITE RUNNER           ${colors.reset}`);
console.log(`${colors.gold}${colors.bright}======================================================================${colors.reset}`);
console.log(`${colors.dim}Executing zero-dependency test suites for Game Engine, Chart Math & Quiz...${colors.reset}\n`);

const startTime = Date.now();

let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;
const results = [];

try {
  // Load and execute test suites
  const r1 = require('./unit_game_engine.test.js').runTests();
  const r2 = require('./unit_chart_math.test.js').runTests();
  const r3 = require('./unit_quiz_engine.test.js').runTests();
  results.push({ name: 'Game Engine & 729 Path Simulation', res: r1 });
  results.push({ name: 'Chart Math & Coordinate Mapping', res: r2 });
  results.push({ name: 'Quiz Engine & Answer Validation', res: r3 });

  results.forEach(r => {
    totalPassed += r.res.passed;
    totalFailed += r.res.failed;
    totalTests += r.res.total;
  });
} catch (err) {
  console.error(`${colors.red}FATAL ERROR during test loading:${colors.reset}`, err);
  process.exit(1);
}

const duration = Date.now() - startTime;

console.log(`\n${colors.gold}${colors.bright}----------------------------------------------------------------------${colors.reset}`);
console.log(`${colors.bright}TEST RUN SUMMARY:${colors.reset}`);
console.log(`  • Test Suites:    ${colors.bright}${results.length}${colors.reset}`);
console.log(`  • Total Tests:    ${colors.bright}${totalTests}${colors.reset} (${colors.green}${totalPassed} passed${colors.reset}, ${totalFailed > 0 ? colors.red : colors.dim}${totalFailed} failed${colors.reset})`);
console.log(`  • Total Duration: ${colors.bright}${duration}ms${colors.reset}`);
console.log(`${colors.gold}${colors.bright}----------------------------------------------------------------------${colors.reset}`);

if (totalFailed === 0 && totalTests > 0) {
  console.log(`${colors.green}${colors.bright}🎉 ALL TESTS PASSED! 100% Academic & Engine Logic Verified.${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}${colors.bright}❌ TEST SUITE FAILED! Please review the failures above.${colors.reset}\n`);
  process.exit(1);
}
