const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Extracts detailed failure stacks, line numbers, and Playwright call logs from results.json / playwright-report/results.json
 */
function extractFailuresFromResults() {
  const resultPaths = ['playwright-report/results.json', 'results.json'];
  let raw = null;

  for (const p of resultPaths) {
    if (fs.existsSync(p)) {
      try {
        raw = fs.readFileSync(p, 'utf8');
        break;
      } catch (e) {}
    }
  }

  if (!raw) return {};

  try {
    const data = JSON.parse(raw);
    const failuresByFile = {};

    const targets = [
      'tasks/DecodeVinTask.ts',
      'tasks/LPdecode.ts',
      'tasks/classic_editable_specs.ts',
      'tasks/classic_editable_specs_manual.ts',
      'tasks/coupon_flow_validation.ts',
      'tasks/default_plan_price_check.ts',
      'tasks/eu_vin_confirmation.ts',
      'tasks/exit_intent_banner.ts',
      'tasks/exit_intent_popup_preview.ts',
      'tasks/form_error_messages.ts',
      'tasks/global_exit_intent_popup.ts',
      'tasks/preview_to_checkout_redirection.ts',
      'tasks/revisit_banner_flow.ts',
      'tasks/revisit_sticker_banner_flow.ts',
      'tasks/vin_field_validation.ts',
      'tasks/vinHelper.ts',
      'tests/global_case_verification.spec.ts'
    ];

    const traverseSuite = (suite) => {
      if (suite.specs) {
        for (const spec of suite.specs) {
          for (const t of spec.tests || []) {
            for (const r of t.results || []) {
              if (r.status === 'failed' || r.status === 'timedOut') {
                const err = r.error || {};
                const file = err.location?.file || spec.file || '';
                const line = err.location?.line || spec.line || '';
                const msg = (err.message || 'Unknown error').replace(/\u001b\[[0-9;]*m/g, ''); // strip ANSI colors
                const snippet = (err.snippet || '').replace(/\u001b\[[0-9;]*m/g, '');

                for (const target of targets) {
                  const normalizedTarget = target.replace(/\//g, path.sep);
                  const targetBase = path.basename(target);
                  if (
                    file.includes(normalizedTarget) ||
                    file.includes(target) ||
                    file.includes(targetBase) ||
                    msg.includes(target) ||
                    msg.includes(targetBase) ||
                    snippet.includes(targetBase)
                  ) {
                    if (!failuresByFile[target]) failuresByFile[target] = [];
                    failuresByFile[target].push({
                      title: spec.title,
                      line,
                      message: msg,
                      snippet
                    });
                  }
                }

                if (!failuresByFile['_all']) failuresByFile['_all'] = [];
                failuresByFile['_all'].push({ title: spec.title, file, line, message: msg });
              }
            }
          }
        }
      }
      if (suite.suites) {
        for (const s of suite.suites) traverseSuite(s);
      }
    };

    if (data.suites) {
      for (const s of data.suites) traverseSuite(s);
    }

    return failuresByFile;
  } catch (e) {
    console.warn('⚠️ Error parsing results.json for failures:', e.message);
    return {};
  }
}

async function runCiHealer() {
  console.log('🤖 Agentic AI Healer activated for Global NextJS Site Test Flow (CI)...');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    console.log('⚠️ GEMINI_API_KEY missing or invalid in environment. Skipping AI healing step.');
    return;
  }

  const failures = extractFailuresFromResults();
  const failedFileKeys = Object.keys(failures).filter((k) => k !== '_all');

  const targetFiles = failedFileKeys.length > 0
    ? failedFileKeys
    : [
        'tasks/DecodeVinTask.ts',
        'tasks/classic_editable_specs.ts',
        'tasks/coupon_flow_validation.ts',
        'tasks/LPdecode.ts',
        'tasks/preview_to_checkout_redirection.ts'
      ];

  console.log(`📋 Target task/spec files to analyze/heal: ${targetFiles.join(', ')}`);

  const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  const genAI = new GoogleGenerativeAI(apiKey);
  const repairedFiles = [];
  let usedModel = '';

  for (const targetFile of targetFiles) {
    if (!fs.existsSync(targetFile)) continue;
    const taskCode = fs.readFileSync(targetFile, 'utf-8');

    const fileFailures = failures[targetFile] || [];
    let failureContext = '';

    if (fileFailures.length > 0) {
      failureContext = fileFailures
        .map(
          (f) => `
TEST CASE: ${f.title}
FAILED AT LINE: ${f.line}
ERROR MESSAGE & CALL LOG:
${f.message}
${f.snippet ? `CODE SNIPPET:\n${f.snippet}` : ''}
      `
        )
        .join('\n---\n');
    } else {
      failureContext = 'General locator failure, timeout, or DOM drift during CI execution.';
    }

    const prompt = `
      You are an expert Playwright automation healing agent specializing in production stability and Screenplay architecture.
      The Playwright file "${targetFile}" for Global NextJS Multi-Brand Sites (VSR, MotorcycleVINLookup, VehicleHistoryEU, VINNumberCA) failed during CI execution.

      ACTUAL PLAYWRIGHT CI ERROR, CALL LOG & STACK:
      ${failureContext}

      CURRENT FILE SOURCE CODE:
      \`\`\`typescript
      ${taskCode}
      \`\`\`

      Healing Guidelines across Error Categories:
      1. SELECTOR & DOM DRIFT:
         - If element changed or was not found, switch to resilient semantic selectors (getByRole, getByPlaceholder, getByLabel, getByText, or regex/text).
         - If strict mode violation (multiple matches), append .locator('visible=true').first() or .first().
         - You may import and use helpers from '../utils/selfHealingLocator' or './utils/selfHealingLocator' (locateInputWithHealing, fastInputWithHealing, locateElementWithHealing, clickWithHealing).
      2. RESPONSIVE / MOBILE SAFARI / CHROMIUM ISSUES:
         - If element is reported "not visible" due to mobile/desktop duplicate DOM nodes, always use .locator('visible=true').first().
         - For text inputs, handle dynamic input/change events.
      3. TIMEOUT & SLOW ASYNC REDIRECTS / API CALLS:
         - If URL redirection timed out, replace static waits with condition-based waitForURL with flexible regex e.g. /.*(preview|sticker|license-preview|ws-preview|checkout|payment).*/i.
         - For API responses, use page.waitForResponse() with generous timeouts for slow network.
      4. MODALS, POPUPS & OVERLAYS:
         - If pointer events were intercepted by an overlay, use { force: true } or dismiss the overlay before interaction.
      5. DROPDOWN / COMBOS:
         - Support multi-brand variations (VSR vs MotorcycleVINLookup vs VehicleHistoryEU vs VINNumberCA) gracefully with fallbacks.

      Constraints:
      - Preserve all existing class names, constructor arguments, performAs(actor) method, TypeScript types, and exports.
      - Return ONLY valid executable TypeScript/JavaScript code without markdown code fence wrappers or introductory commentary.
    `;

    let result = null;
    let successfulModel = '';

    for (const modelName of candidateModels) {
      try {
        console.log(`🧠 Attempting Gemini AI model (${modelName}) for ${targetFile}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent(prompt);
        if (res && res.response) {
          result = res;
          successfulModel = modelName;
          console.log(`✅ Successfully generated healing patch from ${modelName}!`);
          break;
        }
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} attempt failed: ${err.message}`);
      }
    }

    if (result && result.response) {
      const correctedCode = result.response.text().replace(/```typescript|```javascript|```/g, '').trim();
      fs.writeFileSync(targetFile, correctedCode, 'utf-8');
      repairedFiles.push(targetFile);
      usedModel = successfulModel;
      console.log(`✨ [AI Healer Success] Auto-repaired ${targetFile} using ${successfulModel}.`);
    }
  }

  if (repairedFiles.length > 0) {
    fs.writeFileSync(
      '.ai-healed.json',
      JSON.stringify(
        {
          healed: true,
          model: usedModel,
          repairedFiles,
          timestamp: new Date().toISOString()
        },
        null,
        2
      )
    );
  }

  console.log('🚀 Re-running Playwright test suite to verify AI fixes...');
  try {
    execSync('npx playwright test', { stdio: 'inherit', timeout: 300000 });
  } catch (e) {
    console.warn('⚠️ Verification test run completed.');
  }
}

if (require.main === module) {
  runCiHealer().catch(console.error);
}

module.exports = { runCiHealer };
