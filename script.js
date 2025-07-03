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

  // Floating button drag logic
  const floatingBtn = document.getElementById('floating-access-btn');
  const menu = document.getElementById('theme-menu');
  let isDragging = false, offsetX = 0, offsetY = 0;

  floatingBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingBtn.getBoundingClientRect().left;
    offsetY = e.clientY - floatingBtn.getBoundingClientRect().top;
    floatingBtn.style.cursor = 'grabbing';
    document.body.classList.add('noselect'); // Prevent text selection
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    // Keep within viewport
    x = Math.max(0, Math.min(window.innerWidth - floatingBtn.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - floatingBtn.offsetHeight, y));
    floatingBtn.style.right = 'auto';
    floatingBtn.style.left = x + 'px';
    floatingBtn.style.top = y + 'px';
    floatingBtn.style.bottom = 'auto';
    menu.style.right = 'auto';
    menu.style.left = x + 'px';
    menu.style.top = (y - menu.offsetHeight - 10) + 'px';
    menu.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      floatingBtn.style.cursor = 'grab';
      document.body.classList.remove('noselect'); // Re-enable text selection
    }
  });

  // Toggle menu on click
  floatingBtn.addEventListener('click', () => {
    if (!menu.hidden) {
      menu.classList.remove('open');
      setTimeout(() => { menu.hidden = true; }, 180);
      return;
    }

    // Get button rect
    const btnRect = floatingBtn.getBoundingClientRect();

    // Show menu for measurement
    menu.style.display = 'flex';
    menu.style.visibility = 'hidden';
    menu.hidden = false;

    setTimeout(() => {
      const menuRect = menu.getBoundingClientRect();

      let left, top;

      // Prefer above
      left = btnRect.left;
      top = btnRect.top - menuRect.height - 10;
      if (top >= 10 && left + menuRect.width <= window.innerWidth - 10 && left >= 10) {
        // Enough space above
      } else {
        // Try below
        top = btnRect.bottom + 10;
        if (top + menuRect.height <= window.innerHeight - 10 && left + menuRect.width <= window.innerWidth - 10 && left >= 10) {
          // Enough space below
        } else {
          // Try right
          left = btnRect.right + 10;
          top = btnRect.top;
          if (left + menuRect.width <= window.innerWidth - 10 && top + menuRect.height <= window.innerHeight - 10 && top >= 10) {
            // Enough space right
          } else {
            // Try left (ACTUAL FLIP)
            left = btnRect.left - menuRect.width - 10;
            top = btnRect.top;
            // Clamp if needed
            if (left < 10) left = 10;
            if (top < 10) top = 10;
            if (top + menuRect.height > window.innerHeight - 10) {
              top = window.innerHeight - menuRect.height - 10;
            }
            // Make sure menu does NOT overlap the button
            // If not enough space for full menu left of button, move as far left as possible without overlap
            if (left + menuRect.width > btnRect.left - 10) {
              left = Math.max(10, btnRect.left - menuRect.width - 10);
            }
          }
        }
      }

      // Animate to final position
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.style.right = 'auto';
      menu.style.bottom = 'auto';
      menu.style.visibility = '';
      menu.classList.add('open');
    }, 10);
  });

  // Keyboard accessibility
  floatingBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      floatingBtn.click();
      e.preventDefault();
    }
  });

  // Theme switching with radio buttons
  const themeRadios = document.querySelectorAll('.theme-switch');
  themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.body.classList.remove(
        'accessible-theme',
        'theme-dark',
        'theme-high-contrast',
        'theme-solarized',
        'theme-forest'
      );
      switch (radio.value) {
        case 'accessible':
          document.body.classList.add('accessible-theme');
          break;
        case 'dark':
          document.body.classList.add('theme-dark');
          break;
        case 'high-contrast':
          document.body.classList.add('theme-high-contrast');
          break;
        case 'solarized':
          document.body.classList.add('theme-solarized');
          break;
        case 'forest':
          document.body.classList.add('theme-forest');
          break;
        default:
          // Default: remove all theme classes
          break;
      }
    });
  });

  // Accessibility options
  let currentFontSize = 100;
  const minFontSize = 80;
  const maxFontSize = 180;

  const setFontSize = (size) => {
    document.documentElement.style.fontSize = size + '%';
  };

  // Font size buttons
  const accessBtns = document.querySelectorAll('.access-btn');
  accessBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switch (btn.dataset.access) {
        case 'increase-font':
          if (currentFontSize < maxFontSize) currentFontSize += 10;
          setFontSize(currentFontSize);
          break;
        case 'decrease-font':
          if (currentFontSize > minFontSize) currentFontSize -= 10;
          setFontSize(currentFontSize);
          break;
        case 'reset-font':
          currentFontSize = 100;
          setFontSize(currentFontSize);
          break;
      }
    });
  });

  // Toggle switches
  const accessToggles = document.querySelectorAll('.access-toggle');
  accessToggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      switch (toggle.dataset.access) {
        case 'dyslexia-font':
          // Ensure the CSS class 'dyslexia-font' is defined in your stylesheet for this to have an effect
          document.body.classList.toggle('dyslexia-font', toggle.checked);
          break;
        case 'underline-links':
          document.body.classList.toggle('underline-links', toggle.checked);
          break;
        case 'line-spacing':
          document.body.classList.toggle('line-spacing', toggle.checked);
          break;
      }
    });
  });

  // Hide menu when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (!floatingBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
    }
  });
});
