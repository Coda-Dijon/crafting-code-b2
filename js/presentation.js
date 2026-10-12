// Mode présentation : découpe le chapitre courant en slides (h1 à h4)
// et masque l'interface de mdBook. Touche P ou bouton de la barre de menu.
(() => {
    const ACTIVE_KEY = 'mdbook-presentation';
    const START_KEY = 'mdbook-presentation-start';
    const MIN_SCALE = 0.75;

    const html = document.documentElement;
    const main = document.querySelector('#mdbook-content main');
    if (!main) return;

    let slides = [];
    let current = 0;
    let hud = null;

    const storage = {
        get: (key) => { try { return sessionStorage.getItem(key); } catch { return null; } },
        set: (key, value) => { try { sessionStorage.setItem(key, value); } catch { /* ignore */ } },
        remove: (key) => { try { sessionStorage.removeItem(key); } catch { /* ignore */ } },
    };

    const isActive = () => html.classList.contains('presentation');

    // Une image = l'image seule, ou le lien qui ne contient qu'elle
    function imageUnits(element) {
        if (element.tagName !== 'P') return [];
        return Array.from(element.querySelectorAll('img')).map((img) => {
            const link = img.closest('a');
            return link && element.contains(link) && link.children.length === 1 ? link : img;
        });
    }

    // Le texte d'un paragraphe d'images (« Waterfall process : ») n'est montré qu'avec la première image
    function captionsOf(element) {
        if (!element.dataset.presentationCaptions) {
            for (const node of Array.from(element.childNodes)) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    const caption = document.createElement('span');
                    caption.className = 'presentation-caption';
                    node.replaceWith(caption);
                    caption.appendChild(node);
                }
            }
            element.dataset.presentationCaptions = 'true';
        }
        return Array.from(element.querySelectorAll(':scope > .presentation-caption'));
    }

    function buildSlides() {
        slides = [];
        const titles = [];
        const currentPath = () => titles.filter(Boolean).slice(-2).join(' › ');
        const newSlide = (context, anchor = '') => {
            slides.push({ items: [], context, anchor });
            return slides[slides.length - 1];
        };
        const isHeadingOnly = (slide) => slide && slide.items.length === 1
            && /^H[1-4]$/.test(slide.items[0].element.tagName);
        let afterImage = false;

        for (const element of Array.from(main.children)) {
            const heading = /^H([1-4])$/.exec(element.tagName);
            const images = imageUnits(element);

            if (heading) {
                const level = Number(heading[1]);
                titles.length = level - 1;
                const slide = newSlide(currentPath(), element.id);
                titles[level - 1] = element.textContent.trim();
                slide.items.push({ element });
                afterImage = false;
            } else if (images.length > 0) {
                // Chaque image a sa slide ; la première reste avec le titre qui la précède
                images.forEach((image, index) => {
                    const last = slides[slides.length - 1];
                    const slide = index === 0 && isHeadingOnly(last) ? last : newSlide(currentPath());
                    slide.items.push({ element, image, captions: index === 0 ? captionsOf(element) : [] });
                    slide.hasImage = true;
                });
                afterImage = true;
            } else {
                if (slides.length === 0 || afterImage) newSlide(currentPath());
                slides[slides.length - 1].items.push({ element });
                afterImage = false;
            }
        }

        for (const element of Array.from(main.children)) {
            imageUnits(element).forEach((unit) => unit.classList.add('presentation-image'));
        }
    }

    function buildHud() {
        hud = document.createElement('div');
        hud.className = 'presentation-hud';
        hud.innerHTML = `
            <div class="presentation-progress"><div class="presentation-progress-bar"></div></div>
            <div class="presentation-context"></div>
            <div class="presentation-counter"></div>`;
        document.body.appendChild(hud);
    }

    function fitToScreen() {
        let scale = 1;
        main.style.setProperty('--presentation-scale', scale);
        while (main.scrollHeight > main.clientHeight && scale > MIN_SCALE) {
            scale = Math.round((scale - 0.05) * 100) / 100;
            main.style.setProperty('--presentation-scale', scale);
        }
    }

    function show(index) {
        current = Math.max(0, Math.min(index, slides.length - 1));
        const slide = slides[current];
        const visible = slide.items.map((item) => item.element);
        const focusedImages = slide.items.map((item) => item.image).filter(Boolean);
        for (const element of Array.from(main.children)) {
            element.classList.toggle('presentation-hidden', !visible.includes(element));
        }
        for (const unit of Array.from(main.querySelectorAll('.presentation-image'))) {
            unit.classList.toggle('presentation-hidden', !focusedImages.includes(unit));
        }
        const captions = slide.items.flatMap((item) => item.captions || []);
        for (const caption of Array.from(main.querySelectorAll('.presentation-caption'))) {
            caption.classList.toggle('presentation-hidden', !captions.includes(caption));
        }
        const onlyTitle = slide.items.length === 1 && /^H[1-4]$/.test(slide.items[0].element.tagName);
        main.classList.toggle('presentation-title-slide', onlyTitle);
        main.classList.toggle('presentation-image-slide', Boolean(slide.hasImage));
        main.scrollTop = 0;

        hud.querySelector('.presentation-context').textContent = slide.context;
        hud.querySelector('.presentation-counter').textContent = `${current + 1} / ${slides.length}`;
        hud.querySelector('.presentation-progress-bar').style.width = `${((current + 1) / slides.length) * 100}%`;
        if (slide.anchor) {
            history.replaceState(null, '', `#${slide.anchor}`);
        }
        fitToScreen();
        // Le navigateur peut encore défiler vers l'ancre de l'URL après coup
        requestAnimationFrame(() => { main.scrollTop = 0; });
    }

    function slideIndexForHash() {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (!id) return 0;
        const target = document.getElementById(id);
        const index = slides.findIndex((slide) => slide.items.some(({ element }) => element === target || element.contains(target)));
        return index < 0 ? 0 : index;
    }

    function enter(start) {
        buildSlides();
        if (slides.length === 0) return;
        if (!hud) buildHud();
        html.classList.add('presentation');
        history.scrollRestoration = 'manual';
        storage.set(ACTIVE_KEY, '1');
        if (start === 'last') show(slides.length - 1);
        else if (start === 'first') show(0);
        else show(slideIndexForHash());
    }

    function exit() {
        const anchor = slides[current] && slides[current].items[0].element;
        html.classList.remove('presentation');
        main.classList.remove('presentation-title-slide', 'presentation-image-slide');
        main.style.removeProperty('--presentation-scale');
        for (const element of Array.from(main.querySelectorAll('.presentation-hidden'))) {
            element.classList.remove('presentation-hidden');
        }
        storage.remove(ACTIVE_KEY);
        history.scrollRestoration = 'auto';
        if (anchor) anchor.scrollIntoView();
    }

    function goToChapter(rel, start) {
        const link = document.querySelector(`.nav-chapters[rel~="${rel}"], .mobile-nav-chapters[rel~="${rel}"]`);
        if (!link) return;
        storage.set(START_KEY, start);
        window.location.href = link.href;
    }

    function next() {
        if (current < slides.length - 1) show(current + 1);
        else goToChapter('next', 'first');
    }

    function previous() {
        if (current > 0) show(current - 1);
        else goToChapter('prev', 'last');
    }

    function toggle() {
        if (isActive()) exit();
        else enter();
    }

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;

        if (event.key === 'p' || event.key === 'P') {
            toggle();
        } else if (!isActive()) {
            return;
        } else if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key)) {
            next();
        } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) {
            previous();
        } else if (event.key === 'Home') {
            show(0);
        } else if (event.key === 'End') {
            show(slides.length - 1);
        } else if (event.key === 'Escape') {
            exit();
        } else {
            return;
        }
        // Empêche mdBook de changer de chapitre avec les flèches
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);

    // Ouvrir ou fermer une correction change la hauteur de la slide
    main.addEventListener('toggle', () => { if (isActive()) fitToScreen(); }, true);
    window.addEventListener('resize', () => { if (isActive()) fitToScreen(); });

    const button = document.getElementById('presentation-toggle');
    if (button) button.addEventListener('click', toggle);

    // Reprise automatique après un changement de chapitre en mode présentation,
    // une fois les diagrammes Mermaid dessinés (ils se dessinent mal s'ils sont masqués)
    if (storage.get(ACTIVE_KEY) === '1') {
        const start = storage.get(START_KEY);
        storage.remove(START_KEY);
        const diagrams = () => Array.from(main.querySelectorAll('pre.mermaid'));
        const ready = () => diagrams().every((d) => d.getAttribute('data-processed') === 'true');
        let attempts = 0;
        const waitThenEnter = () => {
            if (ready() || attempts++ > 30) enter(start);
            else setTimeout(waitThenEnter, 100);
        };
        window.addEventListener('load', waitThenEnter);
    }
})();
