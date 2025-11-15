document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // FOOTER YEAR
  // ================================================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ================================================================
  // MOBILE NAVIGATION
  // ================================================================
  const menuIcon = document.querySelector('.menu-icon');
  const nav = document.querySelector('.nav');

  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuIcon.classList.toggle('active');
    });
  }


  // ================================================================
  // MAIN SLIDESHOW (Handles ALL .photo-slideshow blocks)
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
      
      const gap = slides.length > 1 ? slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().right : 0;
      
      const visibleSlides = window.innerWidth > 992 ? 2 : 1;

      function moveTo(i) {
        const max = slides.length - visibleSlides;
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

    // --- SET BACKGROUND IMAGES FOR EACH PANEL ---
    // CRITICAL FIX: Dynamically set background images based on data attributes
    forHerPanels.forEach(panel => {
      const start = parseInt(panel.getAttribute('data-start'));
      const end = parseInt(panel.getAttribute('data-end'));
      
      if (!isNaN(start) && !isNaN(end)) {
        // Pick a random image from the range
        const randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
        // Use correct case-sensitive path
        panel.style.backgroundImage = `url('image/ForHer/${randomNum}.jpg')`;
      }
    });

    // --- AUDIO SETUP ---
    const audio = new Audio("image/ForHer/song.mp3");
    const audioControl = document.getElementById('audio-control');
    
    // Add error handling for missing audio file
    audio.addEventListener('error', (e) => {
      console.warn('Audio file not found or failed to load');
      if (audioControl) {
        audioControl.style.display = 'none'; // Hide button if audio fails
      }
    });
    
    audio.loop = true;
    audio.volume = 0.5;
    let isAudioPlaying = false;

    if (audioControl) {
      audioControl.addEventListener('click', () => {
        if (isAudioPlaying) {
          audio.pause();
          isAudioPlaying = false;
          audioControl.innerHTML = '<i class="fas fa-volume-off"></i>';
        } else {
          audio.play().catch(err => {
            console.warn('Could not play audio:', err);
          });
          isAudioPlaying = true;
          audioControl.innerHTML = '<i class="fas fa-volume-high"></i>';
        }
      });
    }

    // --- OBSERVER: Fade in each panel when visible ---
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
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
        if (panel.classList.contains("active") && isAudioPlaying) {
          spawnHeart(panel);
        }
      });
    }, 850);


    // --- PARALLAX SCROLL ---
    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;
      forHerPanels.forEach(panel => {
        const panelTop = panel.offsetTop;
        const panelHeight = panel.offsetHeight;

        if (scrollPosition + window.innerHeight > panelTop && scrollPosition < panelTop + panelHeight) {
          const offset = (scrollPosition - panelTop) * 0.12; 
          panel.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        }
      });
    });

  }

});
