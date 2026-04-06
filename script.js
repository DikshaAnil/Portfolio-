const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const progressBar = document.getElementById("scrollProgress");
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navContainer = document.getElementById("navLinks");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const typingTarget = document.getElementById("typingText");

const typingWords = [
    "responsive web interfaces",
    "interactive frontend experiences",
    "clean development workflows",
    "creative tech solutions"
];

let typingWordIndex = 0;
let typingCharIndex = 0;
let deleting = false;

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    if (scrollTop > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

function setActiveLink() {
    const currentPosition = window.scrollY + 180;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (currentPosition >= top && currentPosition < top + height) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add("active");
        }
    });
}

function runTypingEffect() {
    if (!typingTarget) return;

    const currentWord = typingWords[typingWordIndex];

    if (!deleting) {
        typingTarget.textContent = currentWord.slice(0, typingCharIndex + 1);
        typingCharIndex += 1;

        if (typingCharIndex === currentWord.length) {
            deleting = true;
            setTimeout(runTypingEffect, 1300);
            return;
        }
    } else {
        typingTarget.textContent = currentWord.slice(0, typingCharIndex - 1);
        typingCharIndex -= 1;

        if (typingCharIndex === 0) {
            deleting = false;
            typingWordIndex = (typingWordIndex + 1) % typingWords.length;
        }
    }

    setTimeout(runTypingEffect, deleting ? 40 : 80);
}

function animateCounters(entries, observer) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = current;
            }
        }, 35);

        observer.unobserve(counter);
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.16 }
);

const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.6 });

revealItems.forEach((item) => revealObserver.observe(item));
counters.forEach((counter) => counterObserver.observe(counter));

menuToggle?.addEventListener("click", () => {
    navContainer.classList.toggle("open");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navContainer.classList.remove("open");
    });
});

window.addEventListener("scroll", () => {
    updateScrollProgress();
    setActiveLink();
});

window.addEventListener("load", () => {
    updateScrollProgress();
    setActiveLink();
    runTypingEffect();
});
