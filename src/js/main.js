document.addEventListener('DOMContentLoaded', function () {

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    }

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Smooth Scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

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
        const animatedElements = document.querySelectorAll('.work-card, .section-header, .about-content');

        animatedElements.forEach((el) => {
            if (el.style.opacity !== '1') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
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
                        article.target = "_blank";
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
            observeElements();
        })
        .catch(error => console.error('Error loading works:', error));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'var(--bg)';
            navbar.style.padding = '1rem 0';
            navbar.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.padding = '2rem 0';
            navbar.style.borderBottom = 'none';
        }
    });
});