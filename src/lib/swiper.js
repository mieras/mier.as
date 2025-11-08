  // @ts-nocheck
  // core version + navigation, pagination modules:
  import Swiper from "swiper";
  import { Autoplay, Navigation, Controller, EffectFade} from "swiper/modules";
  
  // import Swiper and modules styles
  import "swiper/css";
  import "swiper/css/effect-fade";

  import {numberWithZero, getCount} from "../lib/utils";
  

  document.addEventListener( 'astro:page-load', function() {

    const carousels = document.querySelectorAll(".carousel-gallery");

    carousels.forEach(function (comp, index){ 
      
      const elBackgroundCarousel = comp.querySelector(".carousel-background");
      const elForegroundCarousel = comp.querySelector(".carousel-foreground");
      const elNextButton = comp.querySelector(".swiper-button-next");
      const elPrevButton = comp.querySelector(".swiper-button-prev");
      const elCurrentIndicator = comp.querySelector(".swiper-number-current");
      const elTotalIndicator = comp.querySelector(".swiper-number-total");

      if (elBackgroundCarousel && elForegroundCarousel && elNextButton && elPrevButton) {

        // Background carousel - master met autoplay
        const backgroundSwiper = new Swiper( elBackgroundCarousel, {
          autoplay: {
            delay: 5000,
            disableOnInteraction: false, // Blijf autoplay doen na interactie
          },
          slidesPerView: 1,
          slidesPerGroup: 1,
          loop: true,
          speed: 400,
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          allowTouchMove: false,
          navigation: {
            nextEl: elNextButton,
            prevEl: elPrevButton,
          },
          modules: [EffectFade, Navigation, Autoplay, Controller],
        });

        // Foreground carousel - volgt de background, GEEN autoplay
        const foregroundSwiper = new Swiper(elForegroundCarousel, {
          // GEEN autoplay - volgt background via controller
          navigation: false,
          slidesPerView: 1,
          slidesPerGroup: 1,
          speed: 600,
          loop: true,
          slideToClickedSlide: true,
          modules: [Navigation, Controller], // Geen Autoplay module
        });
        
        // Koppel carousels - alleen background controleert foreground
        backgroundSwiper.controller.control = foregroundSwiper;
        // NIET andersom om feedback loop te voorkomen
        
        // Set initial indicator - gebruik realIndex voor loop compatibility
        const updateIndicators = () => {
          const realIndex = backgroundSwiper.realIndex !== undefined ? backgroundSwiper.realIndex : backgroundSwiper.activeIndex;
          // Voor loop mode: aantal echte slides (zonder duplicates)
          const slideCount = backgroundSwiper.params.loop ? 
            (backgroundSwiper.slides.length - (backgroundSwiper.loopedSlides || 0) * 2) : 
            backgroundSwiper.slides.length;
          
          let numCurrentSlide = realIndex + 1;
          let currentSlide = numberWithZero(numCurrentSlide);

          let numTotalSlides = slideCount > 0 ? slideCount : backgroundSwiper.slides.length;
          let totalSlides = numberWithZero(numTotalSlides);

          if (elCurrentIndicator) elCurrentIndicator.textContent = currentSlide;
          if (elTotalIndicator) elTotalIndicator.textContent = totalSlides;
        };
        
        // Initial update
        setTimeout(() => {
          updateIndicators();
        }, 100);

        // Update bij slide change - gebruik realIndex
        backgroundSwiper.on("slideChange", function (e) {
          updateIndicators();
        });
        
    }

    });
},{ once: false });


