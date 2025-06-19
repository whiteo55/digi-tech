document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.accessibilitybutton');

  // On page load, check if theme was saved
  if (localStorage.getItem('accessibleTheme') === 'enabled') {
    document.body.classList.add('accessible-theme');
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('accessible-theme');

    // Save or remove preference in localStorage
    if (document.body.classList.contains('accessible-theme')) {
      localStorage.setItem('accessibleTheme', 'enabled');
    } else {
      localStorage.removeItem('accessibleTheme');
    }
  });
});
