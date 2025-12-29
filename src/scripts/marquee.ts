import { gsap } from 'gsap';
// @ts-ignore - Case sensitivity issue with GSAP types
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MarqueeElement = HTMLElement & {
  __marqueeTimeline?: gsap.core.Timeline;
  __marqueeTrigger?: ScrollTrigger;
  __marqueeSpeedTween?: gsap.core.Timeline;
};

let lifecycleBound = false;
let resizeTimeout: number | null = null;

function horizontalLoop(
  items: gsap.DOMTarget,
  config?: {
    repeat?: number;
    paused?: boolean;
    speed?: number;
    snap?: number | false;
    paddingRight?: number;
  },
): gsap.core.Timeline {
  const itemsArray = gsap.utils.toArray(items) as HTMLElement[];
  const localConfig = config || {};
  const tl = gsap.timeline({
    repeat: localConfig.repeat,
    paused: localConfig.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });
  const length = itemsArray.length;
  const startX = itemsArray[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (localConfig.speed || 1) * 100;
  const snap =
    localConfig.snap === false
      ? (v: number) => v
      : gsap.utils.snap(localConfig.snap || 1);
  let totalWidth: number,
    curX: number,
    distanceToStart: number,
    distanceToLoop: number,
    item: HTMLElement,
    i: number;

  gsap.set(itemsArray, {
    xPercent: (index, el) => {
      const w = (widths[index] = parseFloat(
        gsap.getProperty(el, 'width', 'px') as string,
      ));
      xPercents[index] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px') as string) / w) * 100 +
          (gsap.getProperty(el, 'xPercent') as number),
      );
      return xPercents[index];
    },
  });
  gsap.set(itemsArray, { x: 0 });
  totalWidth =
    itemsArray[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    itemsArray[length - 1].offsetWidth *
      (gsap.getProperty(itemsArray[length - 1], 'scaleX') as number) +
    (parseFloat(String(localConfig.paddingRight)) || 0);

  for (i = 0; i < length; i++) {
    item = itemsArray[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart +
      widths[i] * (gsap.getProperty(item, 'scaleX') as number);
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add('label' + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index: number, vars?: gsap.TweenVars) {
    const nextVars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      nextVars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    nextVars.overwrite = true;
    return tl.tweenTo(time, nextVars);
  }

  (tl as any).next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
  (tl as any).previous = (vars?: gsap.TweenVars) =>
    toIndex(curIndex - 1, vars);
  (tl as any).current = () => curIndex;
  (tl as any).toIndex = (index: number, vars?: gsap.TweenVars) =>
    toIndex(index, vars);
  (tl as any).times = times;
  tl.progress(1, true).progress(0, true);
  return tl;
}

function getNumericAttr(el: HTMLElement, name: string, fallback: number): number {
  const value = parseFloat(el.getAttribute(name) || '');
  return Number.isFinite(value) ? value : fallback;
}

function cleanupMarquee(marquee: MarqueeElement) {
  if (marquee.__marqueeSpeedTween) {
    marquee.__marqueeSpeedTween.kill();
  }
  if (marquee.__marqueeTimeline) {
    marquee.__marqueeTimeline.kill();
  }
  if (marquee.__marqueeTrigger) {
    marquee.__marqueeTrigger.kill();
  }
  delete marquee.__marqueeSpeedTween;
  delete marquee.__marqueeTimeline;
  delete marquee.__marqueeTrigger;
  marquee.dataset.initialized = 'false';
}

export function initMarquees(): void {
  const marquees = document.querySelectorAll<MarqueeElement>('[data-marquee]');
  if (marquees.length === 0) return;

  marquees.forEach((marquee) => {
    if (marquee.dataset.initialized === 'true') return;
    if (marquee.__marqueeTimeline || marquee.__marqueeTrigger) {
      cleanupMarquee(marquee);
    }

    const rail = marquee.querySelector<HTMLElement>('[data-rail]');
    const items = rail?.querySelectorAll<HTMLElement>('.mq__item');
    if (!rail || !items || items.length === 0) return;

    const direction = marquee.getAttribute('data-direction') || 'left';
    const speed = Math.max(0.1, getNumericAttr(marquee, 'data-speed', 1));
    const start = marquee.getAttribute('data-start') || 'top bottom';
    const end = marquee.getAttribute('data-end') || 'bottom top';
    const baseDirection = direction === 'right' ? -1 : 1;

    const tl = horizontalLoop(items, {
      repeat: -1,
      speed,
    });
    tl.timeScale(baseDirection);

    marquee.__marqueeTimeline = tl;

    const trigger = ScrollTrigger.create({
      trigger: marquee,
      start,
      end,
      onUpdate: (self) => {
        if (marquee.__marqueeSpeedTween) {
          marquee.__marqueeSpeedTween.kill();
        }

        const velocity = Math.min(4, Math.abs(self.getVelocity()) / 1000);
        const boost = 1 + velocity;
        const directionScale = baseDirection * self.direction;

        marquee.__marqueeSpeedTween = gsap
          .timeline()
          .to(tl, {
            timeScale: boost * directionScale,
            duration: 0.2,
          })
          .to(
            tl,
            {
              timeScale: directionScale,
              duration: 1.2,
            },
            '+=0.3',
          );
      },
    });

    marquee.__marqueeTrigger = trigger;
    marquee.dataset.initialized = 'true';
  });
}

export function bindMarqueeLifecycle(): void {
  if (lifecycleBound) return;
  lifecycleBound = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquees);
  } else {
    initMarquees();
  }

  document.addEventListener('astro:page-load', initMarquees);
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });
}
