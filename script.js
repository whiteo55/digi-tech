document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.accessibilitybutton');

  // On page load, check if the accessible theme was previously saved in localStorage
  if (localStorage.getItem('accessibleTheme') === 'enabled') {
    // If enabled, add the 'accessible-theme' class to the body
    document.body.classList.add('accessible-theme');
  }

  // Add a click event listener to the accessibility button
  btn.addEventListener('click', () => {
    // Toggle the 'accessible-theme' class on the body element
    document.body.classList.toggle('accessible-theme');

    // If the accessible theme is now enabled, save the preference in localStorage
    if (document.body.classList.contains('accessible-theme')) {
      localStorage.setItem('accessibleTheme', 'enabled');
    } else {
      // Otherwise, remove the preference from localStorage
      localStorage.removeItem('accessibleTheme');
    }
  });
});
