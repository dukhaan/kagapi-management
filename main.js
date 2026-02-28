/* =====================================================
   KaGaPi Management — Main JS
   GSAP ScrollTrigger, Lenis Smooth Scroll, Chart.js
   ===================================================== */

import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  Chart,
  BarController,
  DoughnutController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Register Chart.js components
Chart.register(
  BarController,
  DoughnutController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ===================== LENIS SMOOTH SCROLL =====================
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ===================== SCROLL PROGRESS BAR =====================
const progressBar = document.getElementById('scroll-progress');

function updateProgressBar() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Show/hide navbar after hero
ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom top+=80',
  onEnter: () => {
    navbar.classList.add('visible', 'scrolled');
  },
  onLeaveBack: () => {
    navbar.classList.remove('visible', 'scrolled');
  },
});

// Active section tracking
const sections = document.querySelectorAll('.section, .hero-section');
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveNav(section.id),
    onEnterBack: () => setActiveNav(section.id),
  });
});

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

// Smooth scroll on nav click
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: -60, duration: 1.2 });
    }
    // Close mobile menu
    navLinksContainer.classList.remove('open');
  });
});

// Mobile toggle
navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

// Logo scroll to top
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  lenis.scrollTo(0, { duration: 1.5 });
});

// ===================== GSAP ANIMATIONS =====================

// Reveal Up
gsap.utils.toArray('.reveal-up').forEach((el) => {
  gsap.fromTo(
    el,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Reveal Left
gsap.utils.toArray('.reveal-left').forEach((el, i) => {
  gsap.fromTo(
    el,
    { x: -80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.85,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Reveal Right
gsap.utils.toArray('.reveal-right').forEach((el, i) => {
  gsap.fromTo(
    el,
    { x: 80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.85,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Hero parallax
gsap.to('.hero-bg-img', {
  y: 200,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  },
});

gsap.to('.hero-content', {
  y: 100,
  opacity: 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  },
});

// Scroll indicator fade
gsap.to('.scroll-indicator', {
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '30% top',
    scrub: true,
  },
});

// ===================== COUNTER ANIMATION =====================
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

statNumbers.forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val);
          },
        }
      );
    },
  });
});

// ===================== GLASSMORPHISM CARD STAGGER =====================
// Stagger card entrance per grid/container
const cardGrids = document.querySelectorAll(
  '.overview-grid, .team-grid, .tech-stack-grid, .takeover-benefits'
);
cardGrids.forEach((grid) => {
  const cards = grid.querySelectorAll('.glass-card');
  gsap.fromTo(
    cards,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Flow steps stagger
const flowContainer = document.querySelector('.takeover-flow');
if (flowContainer) {
  const flowItems = flowContainer.querySelectorAll('.flow-step, .flow-arrow');
  gsap.fromTo(
    flowItems,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: flowContainer,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

// Timeline line draw animation
const timelineLine = document.querySelector('.timeline::before');
const timelineEl = document.querySelector('.timeline');
if (timelineEl) {
  gsap.fromTo(
    timelineEl,
    { '--timeline-progress': '0%' },
    {
      '--timeline-progress': '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineEl,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
      },
    }
  );
}

// ===================== CLEANUP =====================
// Lenis destroy on page unload
window.addEventListener('beforeunload', () => {
  lenis.destroy();
});
