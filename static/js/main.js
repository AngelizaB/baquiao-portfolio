/**
 * Angeliza Baquiao — Personal Portfolio
 * Vanilla JavaScript interactions: navigation, form submission, toasts, and micro-effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');
  const toast = document.getElementById('toastNotification');
  const toastCloseBtn = document.getElementById('toastCloseBtn');

  /* -------------------------------------------------------------
   * 1. Header scroll effect
   * ------------------------------------------------------------- */
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------------
   * 2. Mobile drawer navigation
   * ------------------------------------------------------------- */
  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* -------------------------------------------------------------
   * 3. Active nav highlighting on scroll
   * ------------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  /* -------------------------------------------------------------
   * 4. Toast Notification Handling
   * ------------------------------------------------------------- */
  const showToast = (title, desc) => {
    if (!toast) return;
    if (title) {
      const titleEl = toast.querySelector('.toast-title');
      if (titleEl) titleEl.textContent = title;
    }
    if (desc) {
      const descEl = toast.querySelector('.toast-desc');
      if (descEl) descEl.textContent = desc;
    }
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  };

  if (toastCloseBtn && toast) {
    toastCloseBtn.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  // Auto-hide toast if rendered by Django form_submitted template
  if (toast && toast.classList.contains('show')) {
    setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  }

  /* -------------------------------------------------------------
   * 5. Contact Form AJAX Submission
   * ------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      // Validate inputs
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
        return; // Let browser HTML5 validation fire
      }

      e.preventDefault();

      // UI loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const btnArrow = submitBtn.querySelector('.btn-arrow');

      submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('hidden');
      if (btnArrow) btnArrow.classList.add('hidden');
      if (btnText) btnText.textContent = 'Sending...';

      if (formFeedback) {
        formFeedback.className = 'form-feedback hidden';
        formFeedback.textContent = '';
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.getAttribute('action') || window.location.href, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.ok) {
          const result = await response.json();
          contactForm.reset();
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ ' + (result.message || 'Your message has been received!');
          }
          showToast('Message Sent!', 'Thank you! Your message has been sent successfully.');
        } else {
          const errData = await response.json();
          let errText = 'Please check the entered values and try again.';
          if (errData.errors) {
            const firstKey = Object.keys(errData.errors)[0];
            if (firstKey && errData.errors[firstKey][0]?.message) {
              errText = `${firstKey}: ${errData.errors[firstKey][0].message}`;
            }
          }
          if (formFeedback) {
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = errText;
          }
        }
      } catch (err) {
        // Fallback: standard submission if fetch blocked or failed
        contactForm.submit();
      } finally {
        submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btnArrow) btnArrow.classList.remove('hidden');
        if (btnText) btnText.textContent = 'Send Message';
      }
    });
  }

  /* -------------------------------------------------------------
   * 6. Subtle 3D tilt effect on hero portrait
   * ------------------------------------------------------------- */
  const portraitStage = document.querySelector('.portrait-stage');
  if (portraitStage && window.innerWidth > 992) {
    portraitStage.addEventListener('mousemove', (e) => {
      const rect = portraitStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      portraitStage.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    portraitStage.addEventListener('mouseleave', () => {
      portraitStage.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      portraitStage.style.transition = 'transform 0.5s ease';
    });

    portraitStage.addEventListener('mouseenter', () => {
      portraitStage.style.transition = 'transform 0.1s ease';
    });
  }
});
