// @ts-nocheck
// Centrale Swiper utility met preset configuraties
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, FreeMode } from 'swiper/modules';

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Store Swiper instances globally to allow destruction
const swiperInstances = new WeakMap();

/**
 * Destroy een bestaande Swiper instance als deze bestaat
 * @param {HTMLElement} element - Swiper container element
 */
export function destroySwiper(element) {
  if (!element) return;

  const existingInstance = swiperInstances.get(element);
  if (existingInstance && existingInstance.destroy) {
    try {
      existingInstance.destroy(true, true);
    } catch (e) {
      // Ignore errors during destruction
    }
    swiperInstances.delete(element);
  }
}

/**
 * Initialiseer een Swiper instance met gegeven configuratie
 * @param {HTMLElement|string} element - Swiper container element of selector
 * @param {Object} config - Swiper configuratie object
 * @param {boolean} destroyExisting - Destroy bestaande instance eerst (default: true)
 * @returns {Swiper} Swiper instance
 */
export function initSwiper(element, config = {}, destroyExisting = true) {
  const swiperElement =
    typeof element === 'string' ? document.querySelector(element) : element;

  if (!swiperElement) {
    console.warn('Swiper element not found:', element);
    return null;
  }

  // Destroy bestaande instance eerst
  if (destroyExisting) {
    destroySwiper(swiperElement);
  }

  // Merge default modules met config modules
  const defaultModules = [Autoplay, Navigation, Pagination, FreeMode];
  const modules = config.modules || defaultModules;

  // Maak Swiper instance
  const swiper = new Swiper(swiperElement, {
    ...config,
    modules,
  });

  // Store instance
  swiperInstances.set(swiperElement, swiper);

  // Forceer linear timing function voor smooth autoplay (zoals CodePen)
  const wrapper = swiperElement.querySelector('.swiper-wrapper');
  if (wrapper && config.speed && config.autoplay?.delay === 0) {
    wrapper.style.transitionTimingFunction = 'linear';
  }

  return swiper;
}

/**
 * Preset configuratie voor music ticker carousels (LatestRecords, RecentlyPlayed)
 * Gebaseerd op CodePen configuratie
 */
export const musicTickerPreset = {
  slidesPerView: 2,
  spaceBetween: 0,
  loop: true,
  freeMode: {
    enabled: true,
    momentum: false,
  },
  allowTouchMove: true,
  speed: 5000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1512: {
      slidesPerView: 3,
    },
  },
  freeModeMomentum: false,
  on: {
    touchStart(swiper) {
      swiper.autoplay.stop();
    },
    touchEnd(swiper) {
      swiper.autoplay.start();
    },
  },
};

/**
 * Preset configuratie voor mixtapes carousel
 * Gebruikt dezelfde ticker configuratie als andere music carousels
 */
export const mixtapesPreset = {
  slidesPerView: 2,
  spaceBetween: 0,
  loop: true,
  freeMode: {
    enabled: true,
    momentum: false,
  },
  allowTouchMove: true,
  speed: 5000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1512: {
      slidesPerView: 3,
    },
  },
  freeModeMomentum: false,
  on: {
    touchStart(swiper) {
      swiper.autoplay.stop();
    },
    touchEnd(swiper) {
      swiper.autoplay.start();
    },
  },
};
