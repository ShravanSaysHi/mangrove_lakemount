/* =============================================
   MANGROVE LAKEMOUNT KAYAK - script.js
============================================= */

'use strict';

// ============================================================
// 1. AOS INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  initNavbar();
  initMobileMenu();
  initSectionHighlight();
  initCounterAnimation();
  initReviews();
  loadContactDetails();
  initContactForm();
  setFooterYear();

  // Re-render Lucide icons after dynamic content is loaded
  setTimeout(() => lucide.createIcons(), 100);
});


// ============================================================
// 2. NAVBAR - scroll behaviour
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
}


// ============================================================
// 3. MOBILE HAMBURGER MENU
// ============================================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('mobile-overlay');

  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}


// ============================================================
// 4. ACTIVE NAV LINK - highlight current section
// ============================================================
function initSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.dataset.section === entry.target.id
            );
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}


// ============================================================
// 5. COUNTER ANIMATION (stats bar)
// ============================================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  let hasRun = false;

  function animateCounters() {
    if (hasRun) return;
    hasRun = true;
    counters.forEach(el => {
      const target   = parseInt(el.dataset.count, 10);
      const duration = 1800; // ms
      const stepTime = 16;   // ~60fps
      const steps    = Math.ceil(duration / stepTime);
      let   current  = 0;

      const timer = setInterval(() => {
        current++;
        const progress = current / steps;
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target).toLocaleString();
        if (current >= steps) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        }
      }, stepTime);
    });
  }

  // Trigger when stats bar is visible
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  const observer = new IntersectionObserver(
    entries => { if (entries[0].isIntersecting) animateCounters(); },
    { threshold: 0.4 }
  );
  observer.observe(statsBar);
}


// ============================================================
// 6. CUSTOMER REVIEWS
// ============================================================
function initReviews() {
  const reviews = [
    {
      name: 'Aarav Nair',
      tour: 'Mangrove Expedition',
      rating: 5,
      date: 'February 2026',
      text: 'The guide explained the ecosystem really well and kept the pace perfect for beginners. We saw birds, crabs, and even a ray near the shallow area.'
    },
    {
      name: 'Priya Deshmukh',
      tour: 'Sunrise Paddle Tour',
      rating: 5,
      date: 'January 2026',
      text: 'Very peaceful and organized. Safety briefing was clear, gear was clean, and the sunrise view over the water was honestly worth waking up early for.'
    },
    {
      name: 'Rohan Kulkarni',
      tour: 'Kayak Rental',
      rating: 4,
      date: 'March 2026',
      text: 'Rental handover was quick and staff helped us choose a suitable route based on tide and wind. Good value, and the kayaks were in solid condition.'
    },
    {
      name: 'Sneha Iyer',
      tour: 'Sunset Paddle',
      rating: 5,
      date: 'December 2025',
      text: 'Loved the evening atmosphere and calm water. Our guide took some great photos for us and gave helpful paddling tips throughout the trip.'
    },
    {
      name: 'Karthik Reddy',
      tour: 'Traditional Country Boat Ride',
      rating: 5,
      date: 'February 2026',
      text: 'Very calm and scenic ride with great local storytelling from the boatman. It was a comfortable option for our parents while we still enjoyed the mangrove views.'
    },
    {
      name: 'Meera Joshi',
      tour: "Beginner's Kayak Lesson",
      rating: 4,
      date: 'March 2026',
      text: 'I was nervous before starting, but the instructors were patient and practical. By the end I was confidently turning and paddling on my own.'
    }
  ];

  const grid = document.getElementById('reviews-grid');
  const avgEl = document.getElementById('reviews-average');
  const countEl = document.getElementById('reviews-count');
  if (!grid) return;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = reviews.length ? (total / reviews.length).toFixed(1) : '0.0';
  if (avgEl) avgEl.textContent = average;
  if (countEl) countEl.textContent = reviews.length.toString();

  grid.innerHTML = reviews.map((review, index) => `
    <article class="review-card" data-aos="fade-up" data-aos-delay="${index * 70}">
      <div class="review-header">
        <div>
          <h3 class="reviewer-name">${escapeHtml(review.name)}</h3>
          <p class="review-tour">${escapeHtml(review.tour)}</p>
        </div>
        <div class="review-stars" aria-label="${review.rating} out of 5 stars">${buildStars(review.rating)}</div>
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
      <span class="review-date">${escapeHtml(review.date)}</span>
    </article>
  `).join('');
}

// ============================================================
// 7. LOAD CONTACT DETAILS from contact.txt
// ============================================================
function loadContactDetails() {
  fetch('contact.txt')
    .then(res => {
      if (!res.ok) throw new Error('contact.txt not found');
      return res.text();
    })
    .then(text => {
      const data = parseContactFile(text);
      renderContactSection(data);
      renderFooterContact(data);
      updateWhatsAppLinks(data);
      lucide.createIcons(); // re-render icons after DOM update
    })
    .catch(err => {
      console.warn('Could not load contact.txt:', err.message);
      // Fallback: show static placeholder
      const el = document.getElementById('contact-details');
      if (el) {
        el.innerHTML = `
          <p style="color:var(--text-light);font-size:.9rem;">
            Contact details unavailable. Please open the site via a local server.
          </p>`;
      }
    });
}

/**
 * Parses "key: value" pairs from contact.txt
 * Returns a plain object, e.g. { phone, email, address, hours, instagram, twitter }
 */
function parseContactFile(text) {
  const result = {};
  const lines  = text.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key   = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) result[key] = value;
  }
  return result;
}

/**
 * Renders the contact details block inside #contact-details
 */
function renderContactSection(data) {
  const container = document.getElementById('contact-details');
  if (!container) return;
  const phoneForLinks = extractPrimaryPhone(data.phone);

  const iconMap = {
    phone:   'phone',
    email:   'mail',
    address: 'map-pin',
    hours:   'clock',
  };

  const labelMap = {
    phone:   'Phone',
    email:   'Email',
    address: 'Address',
    hours:   'Opening Hours',
  };

  const fieldOrder = ['phone', 'email', 'address', 'hours'];
  let html = '';

  for (const field of fieldOrder) {
    if (!data[field]) continue;
    const icon  = iconMap[field];
    const label = labelMap[field];
    let   value = data[field];

    // Make phone & email clickable
    if (field === 'phone') {
      const tel = phoneForLinks ? phoneForLinks.replace(/[^\d+]/g, '') : '';
      value = `<a href="tel:${tel}">${escapeHtml(value)}</a>`;
    } else if (field === 'email') {
      value = `<a href="mailto:${escapeHtml(value)}">${escapeHtml(value)}</a>`;
    } else {
      value = escapeHtml(value);
    }

    html += `
      <div class="contact-detail-item">
        <div class="contact-detail-icon">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="contact-detail-info">
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
      </div>`;
  }

  container.innerHTML = html;

  // Social links
  const socialContainer = document.getElementById('contact-social');
  const socialLinks     = document.getElementById('social-links');
  const socials = [];
  if (data.instagram) socials.push({ url: data.instagram, label: 'Instagram' });
  if (data.twitter)   socials.push({ url: data.twitter,   icon: 'twitter', label: 'TW' });

  if (socials.length && socialLinks) {
    socialLinks.innerHTML = socials.map(s => `
      <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" class="social-link" aria-label="${s.label}">
        ${s.icon
          ? `<i data-lucide="${s.icon}"></i>`
          : '<img src="images/instagram-icon.svg" alt="Instagram" class="social-link-img" />'}
      </a>`).join('');
    if (socialContainer) socialContainer.classList.remove('is-hidden');
  }
}

/**
 * Renders contact details in the footer column
 */
function renderFooterContact(data) {
  const list = document.getElementById('footer-contact-list');
  if (!list) return;
  const phoneForLinks = extractPrimaryPhone(data.phone);

  const footerItems = [];

  if (data.phone) {
    const tel = phoneForLinks ? phoneForLinks.replace(/[^\d+]/g, '') : '';
    footerItems.push(`
      <li>
        <i data-lucide="phone"></i>
        <a href="tel:${tel}">${escapeHtml(data.phone)}</a>
      </li>`);
  }
  if (data.email) {
    footerItems.push(`
      <li>
        <i data-lucide="mail"></i>
        <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
      </li>`);
  }
  if (data.address) {
    footerItems.push(`
      <li>
        <i data-lucide="map-pin"></i>
        <span>${escapeHtml(data.address)}</span>
      </li>`);
  }
  if (data.hours) {
    footerItems.push(`
      <li>
        <i data-lucide="clock"></i>
        <span>${escapeHtml(data.hours)}</span>
      </li>`);
  }

  list.innerHTML = footerItems.join('') || '<li>See website for details.</li>';

  // Footer social icons
  const footerSocial = document.getElementById('footer-social');
  if (footerSocial) {
    const socials = [];
    if (data.instagram) socials.push({ url: data.instagram, label: 'Instagram' });

    footerSocial.innerHTML = socials.map(s => `
      <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" class="social-link" aria-label="${s.label}">
        <img src="images/instagram-icon.svg" alt="Instagram" class="social-link-img" />
      </a>`).join('');
  }
}


// ============================================================
// 8. CONTACT FORM - basic client-side handling
// ============================================================
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Simple validation
    const name  = form['name'].value.trim();
    const email = form['email'].value.trim();
    if (!name || !email) {
      shakeField(!name ? form['name'] : form['email']);
      return;
    }

    const service = form['service'].value.trim();
    const date = form['date'].value.trim();
    const message = form['message'].value.trim();

    // Construct WhatsApp message
    let waText = `Hi, I'm ${name} (${email}).`;
    if (service) waText += `\nI am interested in: ${service}.`;
    if (date) waText += `\nPreferred date: ${date}.`;
    if (message) waText += `\n\nMessage:\n${message}`;

    const waUrl = buildWhatsAppUrl(waText);
    if (waUrl) {
      const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!popup) {
        window.location.href = waUrl;
      }
    } else {
      alert("WhatsApp contact number is not available at the moment.");
      return;
    }

    // Show success message to user
    submit.style.display = 'none';
    if (success) success.classList.remove('is-hidden');
    form.reset();
  });
}

function shakeField(el) {
  el.style.borderColor = '#e53935';
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 400, easing: 'ease-out' }
  );
  el.focus();
  setTimeout(() => (el.style.borderColor = ''), 1200);
}


// ============================================================
// 9. FOOTER YEAR
// ============================================================
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


// ============================================================
// 10. SMOOTH SCROLL POLYFILL (for older browsers)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    try {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } catch (err) {}
  });
});

/**
 * Updates "Book Now" and "Rent Now" buttons to redirect to WhatsApp directly
 */
function updateWhatsAppLinks(data) {
  const whatsappNumber = data.whatsapp || data.phone;
  if (!whatsappNumber) return;
  const cleanPhone = extractPrimaryPhone(whatsappNumber).replace(/[^\d]/g, '');
  if (!cleanPhone) return;

  window.__whatsappNumber = cleanPhone;

  const defaultMessage = "Hi, I would like to book a tour with Mangrove Lakemount Kayak!";
  
  const navCtaBtn = document.querySelector('.nav-cta-btn');
  if (navCtaBtn) {
    navCtaBtn.href = buildWhatsAppUrl(defaultMessage);
    navCtaBtn.target = '_blank';
    navCtaBtn.rel = 'noopener noreferrer';
  }

  const serviceBtns = document.querySelectorAll('.service-btn');
  serviceBtns.forEach(btn => {
    let message = defaultMessage;
    const card = btn.closest('.service-card');
    if (card) {
      const title = card.querySelector('h3');
      if (title && title.textContent) {
        message = `Hi, I would like to book the "${title.textContent}" with Mangrove Lakemount Kayak!`;
      }
    }
    btn.href = buildWhatsAppUrl(message);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });
}


// ============================================================
// UTILITY
// ============================================================
function buildStars(rating) {
  return '&#9733;'.repeat(rating) + '&#9734;'.repeat(5 - rating);
}

function resolveWhatsAppNumber() {
  if (window.__whatsappNumber) return window.__whatsappNumber;
  const navHref = document.querySelector('.nav-cta-btn')?.getAttribute('href') || '';
  const match = navHref.match(/wa\.me\/(\d+)/i);
  if (match && match[1]) {
    window.__whatsappNumber = match[1];
    return match[1];
  }
  return '';
}

function buildWhatsAppUrl(messageText) {
  const number = resolveWhatsAppNumber();
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(messageText || '')}`;
}

function extractPrimaryPhone(phoneValue) {
  if (!phoneValue) return '';
  return String(phoneValue).split(',')[0].trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

