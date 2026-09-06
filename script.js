/* script.js */

// ========================================
// Restaurant data — easily editable
// ========================================
const restaurants = [
  {
    name: "كريبيانو",
    nameEn: "CREPIANO",
    phones: ["01283038100", "01070760003"],
    menuImages: [
      "images/krepeano-menu1.jpg",
      "images/krepeano-menu2.jpg"
    ]
  },
  {
    name: "BAZOOKA",
    nameEn: "BAZOOKA",
    phones: ["16455"],
    menuImages: [
      "images/bazooka-menu1.jpg",
      "images/bazooka-menu2.jpg",
      "images/bazooka-menu3.jpg"
    ]
  },
  {
    name: "SALTA3 BURGER",
    nameEn: "SALTA3 BURGER",
    phones: ["01007916001", "01156852717"],
    menuImages: [
      "images/salta3-menu1.jpg",
      "images/salta3-menu2.jpg"
    ]
  },
  {
    name: "بحري",
    nameEn: "BAHARY",
    phones: ["01027812572", "01222225976"],
    menuImages: [
      "images/bahary-menu1.jpg"
    ]
  }
];

// ========================================
// Helpers
// ========================================
function fallbackImage(restaurantName, idx) {
  // Picsum placeholder used only if local image is missing.
  const seed = encodeURIComponent(`${restaurantName}-menu-${idx}`);
  return `https://picsum.photos/seed/${seed}/700/900`;
}

function arabicNum(n) {
  return String(n).padStart(2, '0');
}

// ========================================
// Render restaurant cards
// ========================================
function renderRestaurants() {
  const list = document.getElementById('restaurantsList');
  if (!list) return;

  const html = restaurants.map((r, ri) => {
    const flipClass = ri % 2 === 1 ? ' flipped' : '';

    // Phone chips
    const phonesHTML = r.phones.map(p => `
      <a href="tel:${p}" class="phone-chip" aria-label="اتصل بـ ${r.name} على رقم ${p}">
        <span class="phone-icon"><i class="fas fa-phone"></i></span>
        <span class="phone-number" dir="ltr">${p}</span>
      </a>
    `).join('');

    // Menu gallery (1, 2, or 3 images)
    const count = r.menuImages.length;
    const galleryHTML = r.menuImages.map((src, mi) => `
      <button class="menu-card" data-restaurant="${ri}" data-image="${mi}" aria-label="عرض صورة المنيو ${mi + 1}">
        <span class="menu-card-tag">منيو ${mi + 1}</span>
        <img src="${src}" alt="منيو ${r.name} - صورة ${mi + 1}" loading="lazy"
             onerror="this.onerror=null;this.src='${fallbackImage(r.nameEn, mi)}';">
        <span class="menu-card-overlay">
          <span class="label">اضغط للتكبير</span>
          <span class="zoom"><i class="fas fa-expand"></i></span>
        </span>
      </button>
    `).join('');

    const callHref = `tel:${r.phones[0]}`;

    return `
      <article class="restaurant-chapter${flipClass}" data-index="${ri}">
        <div class="restaurant-grid">
          <div class="restaurant-info">
            <div class="restaurant-meta">
              <span class="restaurant-index">${arabicNum(ri + 1)} / 04</span>
              <span class="restaurant-badge"><i class="fas fa-utensils"></i> مطعم قريب</span>
            </div>
            <h3 class="restaurant-name">${r.name}</h3>
            <div class="phones">${phonesHTML}</div>
            <a href="${callHref}" class="call-btn">
              <i class="fas fa-phone"></i>
              <span>اتصل الآن</span>
            </a>
          </div>
          <div class="restaurant-menu">
            <span class="menu-label">صور المنيو · ${count}</span>
            <div class="menu-gallery count-${count}">
              ${galleryHTML}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  list.innerHTML = html;

  // Attach click handlers for menu cards
  list.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const rIdx = parseInt(card.dataset.restaurant, 10);
      const iIdx = parseInt(card.dataset.image, 10);
      openLightbox(rIdx, iIdx);
    });
  });

  // Observe chapters for reveal
  list.querySelectorAll('.restaurant-chapter').forEach(ch => {
    revealObserver.observe(ch);
  });
}

// ========================================
// Lightbox
// ========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxName = document.getElementById('lightboxName');
const lightboxCurrent = document.getElementById('lightboxCurrent');
const lightboxTotal = document.getElementById('lightboxTotal');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

let lbState = { restaurant: 0, image: 0 };

function openLightbox(restaurantIdx, imageIdx = 0) {
  lbState.restaurant = restaurantIdx;
  lbState.image = imageIdx;
  updateLightbox();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const r = restaurants[lbState.restaurant];
  const src = r.menuImages[lbState.image];
  lightboxImg.src = src;
  lightboxImg.alt = `منيو ${r.name} - صورة ${lbState.image + 1}`;
  lightboxImg.onerror = function() {
    this.onerror = null;
    this.src = fallbackImage(r.nameEn, lbState.image);
  };
  lightboxName.textContent = r.name;
  lightboxCurrent.textContent = lbState.image + 1;
  lightboxTotal.textContent = r.menuImages.length;

  // Hide nav buttons if only one image
  const single = r.menuImages.length <= 1;
  lightboxPrev.style.display = single ? 'none' : 'grid';
  lightboxNext.style.display = single ? 'none' : 'grid';
}

function nextImage() {
  const total = restaurants[lbState.restaurant].menuImages.length;
  lbState.image = (lbState.image + 1) % total;
  updateLightbox();
}
function prevImage() {
  const total = restaurants[lbState.restaurant].menuImages.length;
  lbState.image = (lbState.image - 1 + total) % total;
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  nextImage(); // RTL: left = next
  if (e.key === 'ArrowRight') prevImage(); // RTL: right = prev
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) < 50) return;
  if (diff > 0) prevImage(); else nextImage(); // RTL swipe logic
}, { passive: true });

// ========================================
// Reveal on scroll
// ========================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

function setupReveals() {
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

// ========================================
// Back to top
// ========================================
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const heroEl = document.getElementById('hero');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
}, { threshold: 0.05 });
heroObserver.observe(heroEl);

// ========================================
// Smooth anchor scroll (for older browsers)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ========================================
// Subtle parallax on hero floats (pointer)
// ========================================
const floats = document.querySelectorAll('.float');
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (isFinePointer && !reducedMotion) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  function raf() {
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;
    floats.forEach((f, i) => {
      const depth = (i % 3 + 1) * 6;
      f.style.translate = `${cx * depth}px ${cy * depth}px`;
    });
    requestAnimationFrame(raf);
  }
  raf();
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  renderRestaurants();
  setupReveals();
});