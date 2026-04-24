# Unit Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Jest unit tests for the Express backend (`server.js`) and core frontend functions (`handleForm`, `animateCount`, `toggleFaq`) with zero changes to visible website behavior.

**Architecture:** Jest runs in two environments — `node` for backend tests using supertest, `jsdom` for frontend tests that load `script.js` after mocking all browser globals. Two minimal safe changes enable testability: `server.js` gets an `if (require.main === module)` guard + `module.exports = app`; `script.js` gets a 3-line export block at the bottom (no-op in browsers).

**Tech Stack:** Jest, jest-environment-jsdom, supertest, @babel/core, @babel/preset-env, babel-jest

---

## File Map

| File | Action | What it does |
|------|--------|--------------|
| `package.json` | Modify | Add devDependencies + `"test": "jest"` script |
| `jest.config.js` | Create | Two projects: node (backend) + jsdom (frontend) |
| `babel.config.js` | Create | Transpiles CommonJS for Jest |
| `server.js` | Modify | Wrap listen in `require.main` guard, export app |
| `script.js` | Modify | Add 3-line export block at bottom (browser no-op) |
| `__tests__/server.test.js` | Create | Backend unit tests |
| `__tests__/script.test.js` | Create | Frontend unit tests |

---

## Task 1: Install dependencies and create config files

**Files:**
- Modify: `package.json`
- Create: `jest.config.js`
- Create: `babel.config.js`

- [ ] **Step 1: Install Jest and related packages**

```bash
cd "C:/Users/LENOVO/Desktop/My Learnings/My Websites/S&C Website"
npm install --save-dev jest jest-environment-jsdom supertest babel-jest @babel/core @babel/preset-env
```

Expected: packages added to `node_modules/`, `package.json` devDependencies updated.

- [ ] **Step 2: Add test script to package.json**

Open `package.json` and change the `"scripts"` section from:
```json
"scripts": {
  "start": "node server.js"
}
```
To:
```json
"scripts": {
  "start": "node server.js",
  "test": "jest"
}
```

- [ ] **Step 3: Create jest.config.js**

Create `jest.config.js` at the project root with this exact content:

```js
module.exports = {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/server.test.js'],
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/script.test.js'],
    },
  ],
};
```

- [ ] **Step 4: Create babel.config.js**

Create `babel.config.js` at the project root with this exact content:

```js
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
```

- [ ] **Step 5: Verify Jest runs (no tests yet)**

```bash
npx jest --listTests
```

Expected: empty list (no test files yet) — no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json jest.config.js babel.config.js
git commit -m "chore: install Jest and configure test environments"
```

---

## Task 2: Make server.js testable (safe 2-line change)

**Files:**
- Modify: `server.js` (lines 48–51)

- [ ] **Step 1: Wrap app.listen in require.main guard and export app**

In `server.js`, replace the bottom section from:
```js
app.listen(PORT, () => {
  console.log(`\n🚀 S&C Lead Server running at http://localhost:${PORT}`);
  console.log(`📊 Google Sheets: ${GOOGLE_SCRIPT_URL}\n`);
});
```

To:
```js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 S&C Lead Server running at http://localhost:${PORT}`);
    console.log(`📊 Google Sheets: ${GOOGLE_SCRIPT_URL}\n`);
  });
}

module.exports = app;
```

- [ ] **Step 2: Verify server still starts normally**

```bash
node server.js
```

Expected output:
```
🚀 S&C Lead Server running at http://localhost:3000
📊 Google Sheets: https://script.google.com/...
```

Press `Ctrl+C` to stop.

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "chore: export express app for testing, guard listen with require.main check"
```

---

## Task 3: Add test exports to script.js (browser no-op)

**Files:**
- Modify: `script.js` (append 4 lines at end of file)

- [ ] **Step 1: Append export block to the end of script.js**

Add these lines at the very bottom of `script.js` (after line 1174):

```js
// Test exports — safely ignored in browser (module is undefined)
if (typeof module !== 'undefined') {
  module.exports = { handleForm, animateCount, toggleFaq };
}
```

- [ ] **Step 2: Verify the website still works**

Open `index.html` in a browser (or via `node server.js` then visit `http://localhost:3000`). Confirm the page loads, animations run, and the form is visible. The `typeof module !== 'undefined'` check is `false` in browsers so nothing changes.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "chore: add test exports to script.js (browser no-op)"
```

---

## Task 4: Write backend tests

**Files:**
- Create: `__tests__/server.test.js`

- [ ] **Step 1: Create the test file**

Create `__tests__/server.test.js` with this exact content:

```js
const request = require('supertest');

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

const app = require('../server');

describe('POST /submit – validation', () => {
  beforeEach(() => {
    fetch.mockReset();
    fetch.mockResolvedValue({ ok: true });
  });

  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/submit')
      .send({ email: 'test@example.com', phone: '9876543210' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Name, email and phone are required.');
  });

  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/submit')
      .send({ name: 'Test User', phone: '9876543210' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Name, email and phone are required.');
  });

  test('returns 400 when phone is missing', async () => {
    const res = await request(app)
      .post('/submit')
      .send({ name: 'Test User', email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Name, email and phone are required.');
  });
});

describe('POST /submit – happy path', () => {
  beforeEach(() => {
    fetch.mockReset();
    fetch.mockResolvedValue({ ok: true });
  });

  test('returns 200 with success:true for valid payload', async () => {
    const res = await request(app).post('/submit').send({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      businessName: 'My Biz',
      service: 'SEO',
      budget: '10k',
      goals: 'Grow traffic',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Lead saved to Google Sheets.');
  });

  test('calls fetch once with the Google Sheets URL', async () => {
    await request(app).post('/submit').send({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('name=Test+User');
    expect(calledUrl).toContain('email=test%40example.com');
    expect(calledUrl).toContain('phone=9876543210');
  });

  test('URL contains timestamp param', async () => {
    await request(app).post('/submit').send({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
    });

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toMatch(/timestamp=/);
  });
});

describe('POST /submit – error handling', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('returns 500 when fetch throws a network error', async () => {
    fetch.mockRejectedValue(new Error('Network failure'));

    const res = await request(app).post('/submit').send({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Server error. Please try again.');
  });
});
```

- [ ] **Step 2: Run backend tests to verify they pass**

```bash
npx jest __tests__/server.test.js --verbose
```

Expected output:
```
backend › POST /submit – validation › returns 400 when name is missing ✓
backend › POST /submit – validation › returns 400 when email is missing ✓
backend › POST /submit – validation › returns 400 when phone is missing ✓
backend › POST /submit – happy path › returns 200 with success:true for valid payload ✓
backend › POST /submit – happy path › calls fetch once with the Google Sheets URL ✓
backend › POST /submit – happy path › URL contains timestamp param ✓
backend › POST /submit – error handling › returns 500 when fetch throws a network error ✓

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

If any test fails, check that `server.js` has `module.exports = app` and the `node-fetch` mock is placed before `require('../server')`.

- [ ] **Step 3: Commit**

```bash
git add __tests__/server.test.js
git commit -m "test: add backend unit tests for /submit route"
```

---

## Task 5: Write frontend tests

**Files:**
- Create: `__tests__/script.test.js`

- [ ] **Step 1: Create the test file**

Create `__tests__/script.test.js` with this exact content:

```js
/**
 * @jest-environment jsdom
 */

// ── Mock all browser globals BEFORE requiring script.js ──
global.gsap = {
  registerPlugin: jest.fn(),
  ticker: { add: jest.fn(), lagSmoothing: jest.fn() },
  utils: { toArray: jest.fn().mockReturnValue([]) },
  fromTo: jest.fn().mockReturnValue({}),
  from: jest.fn().mockReturnValue({}),
  to: jest.fn().mockReturnValue({}),
};
global.ScrollTrigger = { update: jest.fn() };
global.ScrollToPlugin = {};
global.Lenis = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  raf: jest.fn(),
  scrollTo: jest.fn(),
}));
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
}));
global.alert = jest.fn();
global.fetch = jest.fn();

// ── Minimal DOM required by script.js top-level code ──
document.body.innerHTML = `
  <div id="scroll-progress"></div>
  <div id="cursor-dot"></div>
  <div id="cursor-glow"></div>
  <a id="logoLink" href="#"></a>
  <nav id="navbar"></nav>
  <div id="navLimelight"></div>
  <div class="nav-inner"></div>
  <input id="f-name" />
  <input id="f-business" />
  <input id="f-email" />
  <input id="f-phone" />
  <select id="f-service"><option value="">-</option></select>
  <select id="f-budget"><option value="">-</option></select>
  <textarea id="f-goals"></textarea>
`;

// ── Load script.js — top-level code runs here ──
const { handleForm, animateCount, toggleFaq } = require('../script');

// ─────────────────────────────────────────────────────────
// handleForm – validation
// ─────────────────────────────────────────────────────────
describe('handleForm – validation', () => {
  let btn;

  beforeEach(() => {
    jest.clearAllMocks();
    btn = document.createElement('button');
    document.body.appendChild(btn);
    document.getElementById('f-name').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-phone').value = '';
    document.getElementById('f-business').value = '';
    document.getElementById('f-goals').value = '';
  });

  afterEach(() => {
    btn.remove();
  });

  test('alerts and does not call fetch when name is empty', async () => {
    document.getElementById('f-email').value = 'test@example.com';
    document.getElementById('f-phone').value = '9876543210';

    await handleForm({ target: btn });

    expect(global.alert).toHaveBeenCalledWith(
      'Please fill in your Name, Email, and Phone number.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('alerts and does not call fetch when email is empty', async () => {
    document.getElementById('f-name').value = 'Test User';
    document.getElementById('f-phone').value = '9876543210';

    await handleForm({ target: btn });

    expect(global.alert).toHaveBeenCalledWith(
      'Please fill in your Name, Email, and Phone number.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('alerts and does not call fetch when phone is empty', async () => {
    document.getElementById('f-name').value = 'Test User';
    document.getElementById('f-email').value = 'test@example.com';

    await handleForm({ target: btn });

    expect(global.alert).toHaveBeenCalledWith(
      'Please fill in your Name, Email, and Phone number.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('calls fetch when all required fields are provided', async () => {
    global.fetch.mockResolvedValueOnce({});
    document.getElementById('f-name').value = 'Test User';
    document.getElementById('f-email').value = 'test@example.com';
    document.getElementById('f-phone').value = '9876543210';

    await handleForm({ target: btn });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).not.toHaveBeenCalled();
  });

  test('disables button and shows Sending... during submission', async () => {
    global.fetch.mockResolvedValueOnce({});
    document.getElementById('f-name').value = 'Test User';
    document.getElementById('f-email').value = 'test@example.com';
    document.getElementById('f-phone').value = '9876543210';

    // Capture button state during fetch
    let disabledDuringFetch = false;
    global.fetch.mockImplementationOnce(() => {
      disabledDuringFetch = btn.disabled;
      return Promise.resolve({});
    });

    await handleForm({ target: btn });

    expect(disabledDuringFetch).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// animateCount
// ─────────────────────────────────────────────────────────
describe('animateCount', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('reaches the target value after all intervals fire', () => {
    const el = document.createElement('span');
    animateCount(el, 100, '+');
    jest.runAllTimers();
    expect(parseInt(el.innerHTML)).toBe(100);
  });

  test('appends the suffix to the final value', () => {
    const el = document.createElement('span');
    animateCount(el, 5, '×');
    jest.runAllTimers();
    expect(el.innerHTML).toBe('5×');
  });

  test('works with a % suffix', () => {
    const el = document.createElement('span');
    animateCount(el, 98, '%');
    jest.runAllTimers();
    expect(el.innerHTML).toBe('98%');
  });

  test('never exceeds the target value', () => {
    const el = document.createElement('span');
    animateCount(el, 50, '');
    jest.runAllTimers();
    expect(parseInt(el.innerHTML)).toBeLessThanOrEqual(50);
  });
});

// ─────────────────────────────────────────────────────────
// toggleFaq
// ─────────────────────────────────────────────────────────
describe('toggleFaq', () => {
  function makeFaqItem(open = false) {
    const item = document.createElement('div');
    item.className = open ? 'faq-item open' : 'faq-item';
    const icon = document.createElement('span');
    icon.className = 'faq-icon';
    icon.textContent = open ? '−' : '+';
    item.appendChild(icon);
    document.body.appendChild(item);
    return item;
  }

  afterEach(() => {
    document.querySelectorAll('.faq-item').forEach(el => el.remove());
  });

  test('opens a closed faq item and sets icon to −', () => {
    const item = makeFaqItem(false);
    toggleFaq(item);
    expect(item.classList.contains('open')).toBe(true);
    expect(item.querySelector('.faq-icon').textContent).toBe('−');
  });

  test('closes an open faq item and sets icon to +', () => {
    const item = makeFaqItem(true);
    toggleFaq(item);
    expect(item.classList.contains('open')).toBe(false);
    expect(item.querySelector('.faq-icon').textContent).toBe('+');
  });

  test('closes the previously open item when opening a new one', () => {
    const item1 = makeFaqItem(true);
    const item2 = makeFaqItem(false);

    toggleFaq(item2); // opens item2, should close item1

    expect(item1.classList.contains('open')).toBe(false);
    expect(item1.querySelector('.faq-icon').textContent).toBe('+');
    expect(item2.classList.contains('open')).toBe(true);
    expect(item2.querySelector('.faq-icon').textContent).toBe('−');
  });

  test('toggling the already-open item closes it', () => {
    const item = makeFaqItem(true);
    toggleFaq(item);
    expect(item.classList.contains('open')).toBe(false);
  });
});
```

- [ ] **Step 2: Run frontend tests to verify they pass**

```bash
npx jest __tests__/script.test.js --verbose
```

Expected output:
```
frontend › handleForm – validation › alerts and does not call fetch when name is empty ✓
frontend › handleForm – validation › alerts and does not call fetch when email is empty ✓
frontend › handleForm – validation › alerts and does not call fetch when phone is empty ✓
frontend › handleForm – validation › calls fetch when all required fields are provided ✓
frontend › handleForm – validation › disables button and shows Sending... during submission ✓
frontend › animateCount › reaches the target value after all intervals fire ✓
frontend › animateCount › appends the suffix to the final value ✓
frontend › animateCount › works with a % suffix ✓
frontend › animateCount › never exceeds the target value ✓
frontend › toggleFaq › opens a closed faq item and sets icon to − ✓
frontend › toggleFaq › closes an open faq item and sets icon to + ✓
frontend › toggleFaq › closes the previously open item when opening a new one ✓
frontend › toggleFaq › toggling the already-open item closes it ✓

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

If you see errors about missing globals, ensure the mocks at the top of the file are in place before the `require('../script')` call.

- [ ] **Step 3: Commit**

```bash
git add __tests__/script.test.js
git commit -m "test: add frontend unit tests for handleForm, animateCount, toggleFaq"
```

---

## Task 6: Run the full test suite

**Files:** none

- [ ] **Step 1: Run all tests together**

```bash
npm test
```

Expected output:
```
Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        <5s
```

- [ ] **Step 2: Final commit if any loose files remain**

```bash
git status
```

If clean — nothing to do. If there are uncommitted changes, add and commit them.

---

## Self-Review Checklist

- [x] **Spec coverage:**
  - Backend validation (400 for missing name/email/phone) → Task 4
  - Backend happy path (fetch called, success response) → Task 4
  - Backend error handling (500 on fetch throw) → Task 4
  - Frontend handleForm validation → Task 5
  - Frontend animateCount → Task 5
  - Frontend toggleFaq → Task 5
  - No changes to index.html / style.css / photos → confirmed (Tasks 2–3 only touch server.js and script.js minimally)

- [x] **No placeholders** — all steps contain exact code and exact expected output

- [x] **Type consistency** — `handleForm`, `animateCount`, `toggleFaq` are the same names throughout Tasks 3, 5
