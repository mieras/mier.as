// @ts-nocheck
// core version + navigation modules:
import Swiper from "swiper";
import { Navigation } from "swiper/modules";

// import Swiper and modules styles
import "swiper/css";

import { numberWithZero } from "./utils";

document.addEventListener('astro:page-load', function() {
  const carousels = document.querySelectorAll(".carouselblock-gallery");

  carousels.forEach(function (comp) {
    // Query elementen BINNEN deze specifieke carousel container
    const elBackgroundCarousel = comp.querySelector(".carousel-background");
    const elNextButton = comp.querySelector(".swiper-button-next");
    const elPrevButton = comp.querySelector(".swiper-button-prev");
    const elCurrentIndicator = comp.querySelector(".swiper-number-current");
    const elTotalIndicator = comp.querySelector(".swiper-number-total");

    if (elBackgroundCarousel && elNextButton && elPrevButton) {
      const slideCount = elBackgroundCarousel.querySelectorAll('.swiper-slide').length;
      
      // Eenvoudige Swiper configuratie
      const swiperConfig = {
        spaceBetween: 32, // Default gap tussen carousel items (in pixels)
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        loop: slideCount > 0,
        loopAddBlankSlides: true,
        speed: 400,
        allowTouchMove: true,
        navigation: {
          nextEl: elNextButton,
          prevEl: elPrevButton,
        },
        modules: [Navigation],
        breakpoints: {
          320: { slidesPerView: 'auto', slidesPerGroup: 1 },
          768: { slidesPerView: 'auto', slidesPerGroup: 1 },
          1024: { slidesPerView: 'auto', slidesPerGroup: 1 },
        },
      };

      const swiper = new Swiper(elBackgroundCarousel, swiperConfig);
      
      // Update functie voor resize en init timing (belangrijk voor full width)
      const updateSwiper = () => {
        if (swiper) {
          swiper.update();
          swiper.updateSlides();
          swiper.updateSlidesClasses();
        }
      };
      
      // Wacht op layout completion (belangrijk voor full width containers)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateSwiper();
        });
      });
      
      // Update bij resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateSwiper, 150);
      });

      // Set indicators
      if (elCurrentIndicator && elTotalIndicator) {
        const updateIndicators = () => {
          const current = swiper.realIndex !== undefined ? swiper.realIndex + 1 : swiper.activeIndex + 1;
          const total = slideCount;
          elCurrentIndicator.textContent = numberWithZero(current);
          elTotalIndicator.textContent = numberWithZero(total);
        };
        
        // Initial update
        setTimeout(updateIndicators, 100);
        
        // Update bij slide change
        swiper.on("slideChange", () => {
          updateIndicators();
        });
        
        // Update bij resize
        swiper.on("resize", () => {
          updateIndicators();
        });
      }
    }
  });
}, { once: false });
