/* ============================================
   DSSQ — Data Science Society Quest
   JavaScript: Animations & Interactions
   ============================================ */

// ===== DYNAMIC FAVICON =====
(function () {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        const c = document.createElement('canvas');
        c.width = 32; c.height = 32;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0, 32, 32);
        const link = document.querySelector("link[rel='shortcut icon']") || document.createElement('link');
        link.rel = 'shortcut icon';
        link.href = c.toDataURL('image/png');
        document.head.appendChild(link);
    };
    img.src = 'images/society-logo.png';
})();

// ===== ANIMATED MESH BACKGROUND =====
const canvas = document.getElementById('meshCanvas');
const ctx = canvas.getContext('2d');
let nodes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 60; i++) { nodes.push(new Node()); }

function animateMesh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 180, 216, ${0.06 * (1 - dist / 160)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }

    nodes.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(animateMesh);
}

animateMesh();


// ===== TYPEWRITER EFFECT =====
const subtitles = [
    "Explore • Learn • Innovate",
    "Machine Learning & AI",
    "Data-Driven Innovation",
    "Community of Learners"
];

let subIndex = 0, charIdx = 0, deleting = false;
const subtitleEl = document.getElementById('heroSubtitle');

function typeSubtitle() {
    const current = subtitles[subIndex];

    if (deleting) {
        subtitleEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
    } else {
        subtitleEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = deleting ? 30 : 60;

    if (!deleting && charIdx === current.length) {
        speed = 2500;
        deleting = true;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        subIndex = (subIndex + 1) % subtitles.length;
        speed = 400;
    }

    setTimeout(typeSubtitle, speed);
}

typeSubtitle();


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});


// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.getAttribute('id');
        }
    });
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});


// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);


// ===== SCROLL REVEAL =====
const revealTargets = document.querySelectorAll(
    '.about-card, .stat-card, .activity-card, .team-card, .join-content'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});


// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});
