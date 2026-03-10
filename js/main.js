
'use strict';

/* scroll */
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
function openMobileNav() {
    mnav.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
    mnav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
burger.addEventListener('click', () =>
    mnav.classList.contains('open') ? closeMobileNav() : openMobileNav()
);
document.addEventListener('click', (e) => {
    if (mnav.classList.contains('open') &&
        !hdr.contains(e.target) && !mnav.contains(e.target)) closeMobileNav();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

/* form */
const cForm = document.getElementById('contact-form');
const sBut = document.getElementById('submit-btn');
const sRes = document.getElementById('form-result');
cForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nv = cForm.querySelector('#f-name').value.trim();
    const pv = cForm.querySelector('#f-phone').value.trim();
    if (!nv || !pv) { sRes.textContent = 'Please fill in your name and phone number.'; sRes.className = 'err'; return; }
    sBut.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    sBut.disabled = true; sRes.textContent = ''; sRes.className = '';
    try {
        const r = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(cForm))),
        });
        const d = await r.json();
        if (r.ok) {
            sRes.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! We\'ll be in touch soon.';
            sRes.className = 'ok'; cForm.reset();
        } else throw new Error(d.message);
    } catch {
        sRes.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please call us directly.';
        sRes.className = 'err';
    } finally {
        sBut.innerHTML = 'Send Message &nbsp;<i class="fas fa-paper-plane"></i>';
        sBut.disabled = false;
        setTimeout(() => { sRes.textContent = ''; sRes.className = ''; }, 7000);
    }
});

/* stat counter */
const animN = (el, end, sfx, dur = 1250) => {
    let t0 = null;
    const step = ts => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        el.textContent = Math.floor(p * end) + sfx;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = end + sfx;
    };
    requestAnimationFrame(step);
};
new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.querySelectorAll('.stat-number').forEach(el => {
            const sfx = el.textContent.replace(/[\d.]/g, '');
            animN(el, parseFloat(el.textContent), sfx);
        });
    });
}, { threshold: .35 }).observe(document.querySelector('.stats-strip'));


const pc = document.getElementById('particles');
if (pc) {
    const n = window.innerWidth < 640 ? 12 : 24;
    for (let i = 0; i < n; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random() * 3.5 + 2;
        p.style.cssText = [
            `width:${s}px`, `height:${s}px`,
            `left:${(Math.random() * 100).toFixed(1)}%`,
            `top:${(Math.random() * 100).toFixed(1)}%`,
            `animation-duration:${(Math.random() * 3 + 2).toFixed(1)}s`,
            `animation-delay:${(Math.random() * 4).toFixed(1)}s`,
            `opacity:${(Math.random() * .32 + .07).toFixed(2)}`,
            `background:${Math.random() > .55 ? 'rgba(245,166,35,.65)' : 'rgba(130,145,255,.4)'}`,
        ].join(';');
        pc.appendChild(p);
    }
}