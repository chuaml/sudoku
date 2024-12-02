const clear = (e) => {
  if (e.isTrusted === false) return;
  if (e.keyCode < 48 || e.keyCode > 57) return;
  if (e.ctrlKey || e.altKey) return;
  e.target.value = e.key;
};
document.querySelectorAll(".cell > .value").forEach((x) => {
  // x.value = 'parseInt(Math.random() * 10);'
  x.addEventListener("keydown", clear);
});

// register service worker for PWA
