document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // FOOTER YEAR
  // ================================================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();



  // ================================================================
  // MAIN SLIDESHOWS (Handles ALL .photo-slideshow blocks)
  // ================================================================
  const slideshows = document.querySelectorAll('.photo-slideshow');

  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.photo-slide');
    const dots = slideshow.querySelectorAll('.photo-dot');

    if (slides.length === 0) return;

    let current = 0;
    let auto;

    function showSlide(n) {
      current = (n + slides.length) % slides.length;

      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function autoplay() {
      clearInterval(auto);
      if (slides.length > 1) {
        auto = setInterval(() => showSlide(current + 1), 5000);
      }
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-slide'));
        if (!isNaN(target)) {
          showSlide(target);
          autoplay();
        }
      });
    });

    showSlide(0);
    autoplay();
  });



  // ================================================================
  // CAROUSEL (index.html)
  // ================================================================
  const carouselTrack = document.querySelector('.carousel-track');

  if (carouselTrack) {
    const slides = Array.from(carouselTrack.children);
    const nextBtn = document.querySelector('.carousel-button.next');
    const prevBtn = document.querySelector('.carousel-button.prev');

    if (slides.length > 0) {
      let index = 0;
      let slideW = slides[0].getBoundingClientRect().width;
      const gap = 32;

      function moveTo(i) {
        const max = slides.length - 2;
        index = Math.max(0, Math.min(i, max));
        const offset = index * (slideW + gap);
        carouselTrack.style.transform = `translateX(-${offset}px)`;
      }

      nextBtn?.addEventListener('click', () => moveTo(index + 1));
      prevBtn?.addEventListener('click', () => moveTo(index - 1));

      window.addEventListener('resize', () => {
        slideW = slides[0].getBoundingClientRect().width;
        carouselTrack.style.transition = 'none';
        moveTo(index);
        setTimeout(() => {
          carouselTrack.style.transition = 'transform .5s ease-in-out';
        }, 50);
      });
    }
  }



  // ================================================================
  // FOR HER — Scroll Panels + Parallax + Hearts + Music
  // ================================================================
  const forHerPanels = document.querySelectorAll('.for-her-panel');

  if (forHerPanels.length > 0) {

    // --- AUDIO SETUP ---
    const audio = new Audio("image/ForHer/song.mp3");
    audio.loop = true;
    audio.volume = 0;
    let audioOn = false;

    function fadeAudio(target, speed = 0.03) {
      const interval = setInterval(() => {
        if (target === 1 && audio.volume < 1) audio.volume += speed;
        else if (target === 0 && audio.volume > 0) audio.volume -= speed;
        else clearInterval(interval);
      }, 80);
    }

    // --- OBSERVER: Fade in each panel when visible ---
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");

            // Fade in music
            if (!audioOn) {
              audio.play();
              audioOn = true;
            }
            fadeAudio(1);

          } else {
            fadeAudio(0);
          }
        });
      },
      { threshold: 0.5 }
    );

    forHerPanels.forEach(panel => observer.observe(panel));



    // --- FLOATING HEARTS ---
    function spawnHeart(panel) {
      const h = document.createElement("div");
      h.classList.add("heart-particle");
      h.textContent = "❤";
      h.style.left = `${Math.random() * 100}%`;
      h.style.bottom = "-30px";
      panel.appendChild(h);
      setTimeout(() => h.remove(), 6000);
    }

    setInterval(() => {
      forHerPanels.forEach(panel => {
        if (panel.classList.contains("active")) spawnHeart(panel);
      });
    }, 850);



    // --- PARALLAX SCROLL ---
    window.addEventListener("scroll", () => {
      forHerPanels.forEach(panel => {
        if (panel.classList.contains("active")) {
          const offset = window.pageYOffset * 0.12;
          panel.style.backgroundPositionY = `${50 + offset}px`;
        }
      });
    });

  }

}); // DOMContentLoaded ends
