const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 850) closeMenu();
});


/* Reveal sections only when motion is enabled and observers are supported. */
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.about > div, .section-head, .cards article, .metrics div, .screen-board, .step-grid article, .tech-section > *, .impact > div, .impact-list span, .cta > div');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -20px 0px'});
  targets.forEach(el => {
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
}


/* Anonymous feedback: Netlify Forms submission and browser-local duplicate guard.
   This is not a server-side uniqueness guarantee. */
const ratingForm = document.getElementById('rating-form');
const ratingMessage = document.getElementById('rating-message');
const ratingKey = 'siga-rated-v1';
if (ratingForm) {
  const showRated = () => {
    ratingForm.querySelectorAll('input,textarea,button').forEach(el => { el.disabled = true; });
    ratingMessage.textContent = 'Obrigado! Sua avaliação já foi registrada neste navegador. 💚';
  };
  try { if (localStorage.getItem(ratingKey) === 'yes') showRated(); } catch (_) {}
  ratingForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!ratingForm.reportValidity()) return;
    const button = ratingForm.querySelector('button[type="submit"]');
    button.disabled = true;
    ratingMessage.textContent = 'Enviando avaliação...';
    const data = new URLSearchParams(new FormData(ratingForm));
    try {
      const response = await fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data.toString() });
      if (!response.ok) throw new Error('Falha ao enviar');
      try { localStorage.setItem(ratingKey,'yes'); } catch (_) {}
      showRated();
    } catch (_) {
      button.disabled = false;
      ratingMessage.textContent = 'Não foi possível enviar. Confira se o site está publicado no Netlify com formulários habilitados e tente novamente.';
    }
  });
}
