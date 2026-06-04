const themes = ['github','hacker','retro','matrix'];
let currentTheme = 'github';
let currentLang  = 'en';

function cycleTheme() {
  currentTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  document.body.dataset.theme = currentTheme;
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  document.body.className = 'lang-' + currentLang;
  document.getElementById('lang-btn').textContent = currentLang === 'en' ? 'FR' : 'EN';
  document.documentElement.lang = currentLang;
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = 'copied!';
    setTimeout(() => btn.textContent = 'copy', 1800);
  });
}
