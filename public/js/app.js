(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const mobileToggles = $$('[data-mobile-menu-toggle]');
  const setExpanded = (button, expanded) => {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  mobileToggles.forEach((toggle) => {
    const targetId = toggle.dataset.menuTarget;
    const mobileMenu = targetId ? document.getElementById(targetId) : null;
    if (!mobileMenu) return;

    toggle.addEventListener('click', () => {
      const isHidden = mobileMenu.hasAttribute('hidden');

      mobileToggles.forEach((otherToggle) => {
        const otherTargetId = otherToggle.dataset.menuTarget;
        const otherMenu = otherTargetId ? document.getElementById(otherTargetId) : null;
        if (!otherMenu || otherMenu === mobileMenu) return;
        otherMenu.setAttribute('hidden', '');
        setExpanded(otherToggle, false);
      });

      if (isHidden) {
        mobileMenu.removeAttribute('hidden');
        setExpanded(toggle, true);
      } else {
        mobileMenu.setAttribute('hidden', '');
        setExpanded(toggle, false);
      }
    });
  });

  const profileMenus = $$('[data-profile-menu]');
  profileMenus.forEach((menu) => {
    const trigger = $('[data-profile-menu-toggle]', menu);
    const panel = $('[data-profile-menu-panel]', menu);
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isHidden = panel.hasAttribute('hidden');

      profileMenus.forEach((otherMenu) => {
        const otherPanel = $('[data-profile-menu-panel]', otherMenu);
        const otherTrigger = $('[data-profile-menu-toggle]', otherMenu);
        if (otherPanel && otherPanel !== panel) {
          otherPanel.setAttribute('hidden', '');
          if (otherTrigger) setExpanded(otherTrigger, false);
        }
      });

      if (isHidden) {
        panel.removeAttribute('hidden');
        setExpanded(trigger, true);
      } else {
        panel.setAttribute('hidden', '');
        setExpanded(trigger, false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    profileMenus.forEach((menu) => {
      const panel = $('[data-profile-menu-panel]', menu);
      const trigger = $('[data-profile-menu-toggle]', menu);
      if (!panel) return;
      if (!menu.contains(event.target)) {
        panel.setAttribute('hidden', '');
        if (trigger) setExpanded(trigger, false);
      }
    });
  });

  // Expose tiny helpers for other modules (no framework).
  window.GiftNest = window.GiftNest || {};
  window.GiftNest.dom = { $, $$ };
})();

