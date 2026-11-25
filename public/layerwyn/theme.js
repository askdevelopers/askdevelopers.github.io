// Applies the visitor's saved theme before the first paint, so a light-theme visitor never sees a dark flash.
// External file (not inline) because the CSP is script-src 'self'. Dark is the default; only "light" is stored.
try {
  if (localStorage.getItem('ms-theme') === 'light') document.documentElement.dataset.theme = 'light';
} catch (e) {
  /* storage blocked: stay dark */
}
