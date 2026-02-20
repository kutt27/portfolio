document.addEventListener('DOMContentLoaded', function () {

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☾';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        themeIcon.textContent = newTheme === 'dark' ? '☀' : '☾';
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = mobileBtn.querySelectorAll('span');
        if (isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.transform = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMenu);
    }

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Smooth Scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Offset for fixed navbar
                const navHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    function observeElements() {
        const animatedElements = document.querySelectorAll('.work-card');

        animatedElements.forEach((el, index) => {
            // Only set initial styles if not already animated
            if (el.style.opacity !== '1') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

                // Add delay for grid items
                if (el.classList.contains('work-card')) {
                    // Calculate column index for staggered effect based on its index among siblings
                    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
                    const delay = (siblingIndex % 3) * 0.1;
                    el.style.transitionDelay = `${delay}s`;
                }

                observer.observe(el);
            }
        });
    }

    // Load Works from JSON
    fetch('data/works.json')
        .then(response => response.json())
        .then(data => {
            for (const [category, works] of Object.entries(data)) {
                const container = document.getElementById(`${category}-grid`);
                if (container) {
                    works.forEach(work => {
                        const article = document.createElement('a');
                        article.className = 'work-card';
                        article.href = work.link;
                        article.target = "_blank"; // Open in new tab
                        article.rel = "noopener noreferrer";

                        const tagsHtml = work.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                        article.innerHTML = `
                            <div class="work-image">
                                <div class="work-image-content">
                                    <span class="work-image-category">${category}</span>
                                    <h4 class="work-image-title">${work.title}</h4>
                                </div>
                            </div>
                            <div class="work-card-inner">
                                <h3 class="work-title">${work.title}</h3>
                                <p class="work-description">${work.description}</p>
                                <div class="work-tags">
                                    ${tagsHtml}
                                </div>
                            </div>
                        `;
                        container.appendChild(article);
                    });
                }
            }
            // Initialize observer after content is loaded
            observeElements();
        })
        .catch(error => console.error('Error loading works:', error));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Parallax for Hero Blobs - Removed for modern typography style
});