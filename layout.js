(() => {
    const page = document.body.dataset.page || '';
    const links = [
        { id: 'home', href: 'index.html', text: 'Home' },
        { id: 'classic', href: 'classic.html', text: 'Classic Sudoku' },
        { id: 'jigsaw', href: 'jigsaw.html', text: 'Jigsaw Sudoku' },
        { id: 'guide', href: 'guide.html', text: 'How to play' }
    ];
    const nav = links.map(link =>
        `<a href="${link.href}"${page === link.id ? ' aria-current="page"' : ''}>${link.text}</a>`
    ).join('');
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');

    if (header) {
        header.innerHTML = `
            <header class="site-header">
                <div class="header-inner page-width">
                    <a class="brand" href="index.html" aria-label="Sudoku Studio home"><span class="brand-mark">S</span><span>quiet<span class="brand-light">grid</span></span></a>
                    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span class="sr-only">Toggle navigation</span><span></span><span></span></button>
                    <nav class="site-nav" id="site-navigation" aria-label="Main navigation">${nav}<a class="nav-cta" href="classic.html">Play now <span aria-hidden="true">↗</span></a></nav>
                </div>
            </header>`;
        const toggle = header.querySelector('.menu-toggle');
        const navigation = header.querySelector('.site-nav');
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            navigation.classList.toggle('is-open', !expanded);
        });
    }

    if (footer) {
        footer.innerHTML = `
            <footer class="site-footer">
                <div class="footer-inner page-width">
                    <a class="brand footer-brand" href="index.html"><span class="brand-mark">S</span><span>quiet<span class="brand-light">grid</span></span></a>
                    <p>A little logic. A lot of calm.</p>
                    <nav aria-label="Footer navigation"><a href="classic.html">Classic</a><a href="jigsaw.html">Jigsaw</a><a href="guide.html">How to play</a></nav>
                    <span class="footer-copyright">Made for a quieter kind of break.</span>
                </div>
            </footer>`;
    }
})();
