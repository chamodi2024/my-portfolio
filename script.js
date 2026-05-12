document.addEventListener('DOMContentLoaded', () => {
  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });

  // ===== CUSTOM CURSOR =====
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top = mouseY - 4 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    scrollTop.classList.toggle('visible', y > 400);

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 200) current = s.id;
    });
    navLinksAll.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let count = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) { count = target; clearInterval(timer); }
          el.textContent = count + '+';
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ===== PARTICLES =====
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    particlesContainer.appendChild(p);
  }

  // ===== TILT EFFECT ON CARDS =====
  document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert('Oops! There was a problem submitting your form.');
        }
      } catch (error) {
        alert('Oops! There was a problem submitting your form.');
      }
    });
  }

  // ===== TYPING EFFECT FOR HERO =====
  const roles = ['Web Developer', 'UI/UX Designer', 'MIS Undergraduate', 'Tech Enthusiast'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const subtitleEl = document.querySelector('.hero .subtitle');
  const originalText = subtitleEl.textContent;

  // Create a typing element in the hero badge area
  const typingEl = document.createElement('span');
  typingEl.className = 'gradient-text';
  typingEl.style.borderRight = '2px solid var(--accent)';
  typingEl.style.paddingRight = '4px';
  typingEl.style.animation = 'blink-caret .75s step-end infinite';

  // Add blink keyframes
  const style = document.createElement('style');
  style.textContent = '@keyframes blink-caret { from,to{border-color:transparent} 50%{border-color:var(--accent)} }';
  document.head.appendChild(style);

  // Insert typing after the name in h1
  const h1 = document.querySelector('.hero h1');
  const br = document.createElement('br');
  h1.appendChild(br);
  h1.appendChild(typingEl);

  function typeRole() {
    const current = roles[roleIndex];
    if (!isDeleting) {
      typingEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) { isDeleting = true; setTimeout(typeRole, 1500); return; }
    } else {
      typingEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
    }
    setTimeout(typeRole, isDeleting ? 40 : 80);
  }
  typeRole();
});
