/* ════════════════════════════════════════════
   SIRPELZBUILDS — script.js
   Author: Oluwapelumi Solomon
   
   Features:
   1. Live Clock
   2. Typing Animation
   3. Scroll Fade-In
   4. Skill Bar Animation
   5. Active Nav Link on Scroll
   6. Navbar Shrink on Scroll
   7. Hamburger Mobile Menu
   8. Back to Top Button
   ════════════════════════════════════════════ */


/* ──────────────────────────────────────────
   1. LIVE CLOCK
   Updates the time display in the navbar
   every second using setInterval.
   
   CONCEPTS USED: function, Date object,
   setInterval, getElementById, textContent
   ────────────────────────────────────────── */
function updateTime() {
  const now = new Date();  // creates a Date object with current date/time

  // toLocaleTimeString formats it nicely: "09:45 AM"
  document.getElementById("time").textContent = now.toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit'
  });
}

setInterval(updateTime, 1000); // runs updateTime every 1000 milliseconds (1 second)
updateTime();                   // also run immediately so there's no 1s delay on load


/* ──────────────────────────────────────────
   2. TYPING ANIMATION
   Cycles through an array of role strings,
   typing each character one by one, pausing,
   then deleting them before moving to the next.
   
   CONCEPTS USED: Array, String (.substring),
   Number variables, Boolean, setTimeout,
   modulo operator (%), getElementById
   ────────────────────────────────────────── */

// Array = a list of strings (your roles/titles)
const roles = [
  "Frontend Developer",
  "Shopify Specialist",
  "Dropshipping Expert",
  "UI Enthusiast"
];

let roleIndex  = 0;     // Number: which role in the array we are on
let charIndex  = 0;     // Number: which character within that role we are on
let isDeleting = false; // Boolean: are we currently deleting or typing?

const typedEl = document.getElementById("typed"); // the <span> where text appears

function type() {
  // Get the current role string using roleIndex
  const current = roles[roleIndex]; // String

  if (isDeleting) {
    // Remove one character from the right
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character from the left
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  // --- Decide what happens next ---

  if (!isDeleting && charIndex === current.length) {
    // We just finished typing the full string
    // Wait 1.5s then start deleting
    isDeleting = true;
    setTimeout(type, 1500);
    return; // stop here — setTimeout will call type() again
  }

  if (isDeleting && charIndex === 0) {
    // We just finished deleting — move to the next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    // The % (modulo) operator loops back to 0 when we pass the last role
    // e.g. (3 + 1) % 4 = 0 — back to the start of the array
  }

  // Set typing speed: delete faster, type slower (feels more natural)
  const speed = isDeleting ? 55 : 100; // milliseconds
  setTimeout(type, speed);
}

type(); // kick off the typing animation


/* ──────────────────────────────────────────
   3. SCROLL FADE-IN ANIMATION
   Watches every .fade-in element on the page.
   When the element enters the viewport,
   we add the .show class — CSS handles the rest.
   
   CONCEPTS USED: querySelectorAll, forEach,
   IntersectionObserver, classList.add
   ────────────────────────────────────────── */

// Select all elements with the class "fade-in"
const faders = document.querySelectorAll('.fade-in');

// IntersectionObserver watches elements and fires a callback
// when they enter or exit the viewport.
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {         // if the element is now visible
      entry.target.classList.add('show'); // add .show → triggers CSS transition
    }
  });
}, {
  threshold: 0.12 // fire when 12% of the element is visible
});

// Attach the observer to every fade-in element
faders.forEach(el => fadeObserver.observe(el));


/* ──────────────────────────────────────────
   4. SKILL BAR ANIMATION
   When the #skills section scrolls into view,
   we read each bar's data-width value and
   animate it from 0% to that width.
   
   CONCEPTS USED: IntersectionObserver,
   querySelectorAll, forEach, getAttribute,
   style.width, disconnect()
   ────────────────────────────────────────── */

const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Select all the bar fill divs
      const bars = document.querySelectorAll('.skill-bar-fill');

      bars.forEach(bar => {
        // data-width is a custom HTML attribute we read with getAttribute
        const targetWidth = bar.getAttribute('data-width'); // e.g. "90"
        bar.style.width = targetWidth + '%';                // animate to "90%"
      });

      skillObserver.disconnect(); // only run this animation once
    }
  });
}, { threshold: 0.3 }); // trigger when 30% of the skills section is visible

skillObserver.observe(skillsSection);


/* ──────────────────────────────────────────
   5. ACTIVE NAV LINK ON SCROLL
   Watches each section. When a section enters
   the viewport, the matching nav link turns gold.
   
   CONCEPTS USED: querySelectorAll, forEach,
   IntersectionObserver, classList,
   querySelector, template literals (backticks)
   ────────────────────────────────────────── */

// All sections that have an id (we use the id to match nav href)
const sections = document.querySelectorAll('section[id]');
// All nav links (both desktop and mobile)
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove .active from all links first
      navLinks.forEach(link => link.classList.remove('active'));

      // Find the nav link whose href matches the section id
      // Template literal: `#${entry.target.id}` builds the string e.g. "#about"
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 }); // section must be 40% visible to count as "active"

sections.forEach(sec => navObserver.observe(sec));


/* ──────────────────────────────────────────
   6. NAVBAR SHRINK ON SCROLL
   Adds a .scrolled class to the navbar
   when the user scrolls past 50px,
   which shrinks it slightly via CSS.
   
   CONCEPTS USED: addEventListener, window.scrollY,
   classList.add / .remove
   ────────────────────────────────────────── */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');    // CSS shrinks padding when .scrolled
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ──────────────────────────────────────────
   7. HAMBURGER MOBILE MENU
   Toggles the mobile nav menu open/closed
   when the hamburger button is clicked.
   Also closes the menu when a nav link is clicked.
   
   CONCEPTS USED: addEventListener, classList.toggle,
   querySelector, forEach, conditional (if/else)
   ────────────────────────────────────────── */

const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');

hamburger.addEventListener('click', () => {
  // toggle switches the class on/off each click
  const isOpen = mobileMenu.classList.contains('mobile-menu-open');

  if (isOpen) {
    // Close the menu
    mobileMenu.classList.remove('mobile-menu-open');
    mobileMenu.classList.add('mobile-menu-closed');
    hamburgerIcon.classList.remove('fa-times');
    hamburgerIcon.classList.add('fa-bars');
  } else {
    // Open the menu
    mobileMenu.classList.remove('mobile-menu-closed');
    mobileMenu.classList.add('mobile-menu-open');
    hamburgerIcon.classList.remove('fa-bars');
    hamburgerIcon.classList.add('fa-times'); // shows ✕ icon when open
  }
});

// Close mobile menu when any mobile nav link is clicked
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('mobile-menu-open');
    mobileMenu.classList.add('mobile-menu-closed');
    hamburgerIcon.classList.remove('fa-times');
    hamburgerIcon.classList.add('fa-bars');
  });
});

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.classList.toggle('light-theme', isLight);
  if (themeIcon) {
    themeIcon.classList.toggle('fa-sun', isLight);
    themeIcon.classList.toggle('fa-moon', !isLight);
  }
  themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}

const savedTheme = localStorage.getItem('theme');
const defaultTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(defaultTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});


/* ──────────────────────────────────────────
   8. BACK TO TOP BUTTON
   Shows a floating button when scrolled
   down more than 300px. Clicking it scrolls
   smoothly back to the top.
   
   CONCEPTS USED: addEventListener, window.scrollY,
   style.display, window.scrollTo
   ────────────────────────────────────────── */

const backToTopBtn = document.getElementById('backToTop');

// Show/hide the button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'flex'; // show the button
  } else {
    backToTopBtn.style.display = 'none'; // hide it near the top
  }
});

// Scroll to top when clicked
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // smooth scroll instead of instant jump
  });
});