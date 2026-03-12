const carouselTrack = document.getElementById('carouselTrack');
        const slides = Array.from(carouselTrack.querySelectorAll('.slide'));
        const pagination = document.getElementById('carouselPagination');
        const counter = document.getElementById('carouselCounter');
        const hint = document.getElementById('carouselHint');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const totalSlides = slides.length;
        let currentIndex = 0;

        function formatSlideNumber(value) {
            return String(value).padStart(2, '0');
        }

        function updateCarousel(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            counter.textContent = `${formatSlideNumber(currentIndex + 1)} / ${formatSlideNumber(totalSlides)}`;
            hint.textContent = slides[currentIndex].dataset.slideTitle || `Slide ${currentIndex + 1}`;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            Array.from(pagination.children).forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} sur ${totalSlides}`);

            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Aller Ã  la slide ${index + 1}`);
            dot.addEventListener('click', () => updateCarousel(index));
            pagination.appendChild(dot);
        });

        prevButton.addEventListener('click', () => updateCarousel(currentIndex - 1));
        nextButton.addEventListener('click', () => updateCarousel(currentIndex + 1));

        function shouldIgnoreGlobalClick(target) {
            return target.closest('button, a, input, textarea, select, label');
        }

        document.addEventListener('click', (event) => {
            if (event.button !== 0) {
                return;
            }

            if (shouldIgnoreGlobalClick(event.target)) {
                return;
            }

            updateCarousel(currentIndex + 1);
        });

        document.addEventListener('contextmenu', (event) => {
            if (shouldIgnoreGlobalClick(event.target)) {
                return;
            }

            event.preventDefault();
            updateCarousel(currentIndex - 1);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                updateCarousel(currentIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                updateCarousel(currentIndex + 1);
            }
        });

        updateCarousel(0);
