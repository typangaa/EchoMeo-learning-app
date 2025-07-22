/**
 * Mobile Viewport Height Fix for iOS Safari and Chrome
 * 
 * These browsers change the viewport height when the address bar appears/disappears,
 * causing layout issues with bottom navigation. This utility calculates the actual
 * viewport height and sets it as a CSS custom property.
 */

export const initMobileViewportFix = () => {
  // Function to set the actual viewport height
  const setViewportHeight = () => {
    // Get the actual viewport height
    const vh = window.innerHeight * 0.01;
    
    // Set the custom property
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set initial value
  setViewportHeight();

  // Update on resize (address bar show/hide triggers resize)
  window.addEventListener('resize', setViewportHeight);
  
  // Also update on orientation change for mobile devices
  window.addEventListener('orientationchange', () => {
    // Small delay to ensure the viewport has updated after orientation change
    setTimeout(setViewportHeight, 100);
  });

  // For iOS Safari - update when page visibility changes (helps with some edge cases)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(setViewportHeight, 100);
    }
  });
};

// Cleanup function (useful for React strict mode and testing)
export const cleanupMobileViewportFix = () => {
  window.removeEventListener('resize', () => {});
  window.removeEventListener('orientationchange', () => {});
  document.removeEventListener('visibilitychange', () => {});
};