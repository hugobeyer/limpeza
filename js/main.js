// Arquivo principal - inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    if (typeof initChat === 'function') {
        initChat();
    }

    if (typeof initCalendar === 'function') {
        initCalendar();
    }

    if (typeof initServices === 'function') {
        initServices();
    }

    // Smooth scroll para links de navegação
    setupSmoothScroll();
});

// Configurar smooth scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
