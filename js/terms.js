
'use strict';

/* scroll + scroll-top */
const hdr = document.getElementById('header');
const stb = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 10);
    stb.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
stb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* mobile nav */
const burger = document.getElementById('hamburger');
const mnav = document.getElementById('mobile-nav');
function openMobileNav() { mnav.classList.add('open'); burger.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
function closeMobileNav() { mnav.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
burger.addEventListener('click', () => mnav.classList.contains('open') ? closeMobileNav() : openMobileNav());
document.addEventListener('click', e => { if (mnav.classList.contains('open') && !hdr.contains(e.target) && !mnav.contains(e.target)) closeMobileNav(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

/* mobile TOC accordion */
const tocToggle = document.getElementById('toc-toggle');
const tocPanel = document.getElementById('toc-panel');
tocToggle.addEventListener('click', () => {
    const open = tocPanel.classList.toggle('open');
    tocToggle.classList.toggle('open', open);
    tocToggle.setAttribute('aria-expanded', open);
});
function closeToc() {
    tocPanel.classList.remove('open');
    tocToggle.classList.remove('open');
    tocToggle.setAttribute('aria-expanded', 'false');
}

/* active TOC highlight on scroll */
const sections = document.querySelectorAll('.policy-section[id]');
const tocLinks = document.querySelectorAll('.toc-link');
sections.forEach(s =>
    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            tocLinks.forEach(l => l.classList.remove('active'));
            const a = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
            if (a) a.classList.add('active');
        });
    }, { rootMargin: '-20% 0px -70% 0px' }).observe(s)
);