// @ts-nocheck
// Centrale Swiper utility met preset configuraties
import Swiper from 'swiper';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';

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
  const defaultModules = [Navigation, Pagination, FreeMode];
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
 * Preset configuratie voor music carousels (LatestRecords, RecentlyPlayed)
 * Geen autoplay, geen loop, wel navigation arrows
 */
export const musicTickerPreset = {
  slidesPerView: 1.5,
  spaceBetween: 0,
  loop: false,
  freeMode: {
    enabled: true,
    momentum: false,
  },
  allowTouchMove: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 1.5,
    },
    768: {
      slidesPerView: 1.5,
    },
    1024: {
      slidesPerView: 2,
    },
    1512: {
      slidesPerView: 3,
    },
  },
};

/**
 * Preset configuratie voor mixtapes carousel
 * Gebruikt dezelfde configuratie als andere music carousels
 */
export const mixtapesPreset = {
  ...musicTickerPreset,
};
