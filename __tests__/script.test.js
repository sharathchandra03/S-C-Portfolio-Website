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

  test('disables button during submission', async () => {
    document.getElementById('f-name').value = 'Test User';
    document.getElementById('f-email').value = 'test@example.com';
    document.getElementById('f-phone').value = '9876543210';

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

    toggleFaq(item2);

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
