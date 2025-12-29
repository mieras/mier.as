// Work Controller: Handles tab switching, hover preview, click active state, and soft routing

interface WorkControllerOptions {
  workSection: HTMLElement;
  defaultImages: {
    design: string;
    photo: string;
  };
  initialProjectSlug?: string | null;
  initialPhotographySlug?: string | null;
}

export class WorkController {
  private workSection: HTMLElement;
  private tabButtons: NodeListOf<HTMLElement>;
  private rows: NodeListOf<HTMLElement>;
  private previewBox: HTMLElement | null;
  private previewImg: HTMLImageElement | null;
  private cursorPreview: HTMLElement | null;
  private cursorImage: HTMLImageElement | null;
  private cursorVideo: HTMLVideoElement | null = null;
  private workPanel: HTMLElement | null;
  private activeTab: string = 'design';
  private activeProjectSlug: string | null = null;
  private activePhotoId: string | null = null;
  private defaultImages: { design: string; photo: string };
  private canHover: boolean;
  private initialProjectSlug: string | null;
  private initialPhotographySlug: string | null;
  private hoverTimeouts = new Map<HTMLElement, number>();
  private isInitializing: boolean = true;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  constructor(options: WorkControllerOptions) {
    this.workSection = options.workSection;
    this.defaultImages = options.defaultImages;
    this.initialProjectSlug = options.initialProjectSlug || null;
    this.initialPhotographySlug = options.initialPhotographySlug || null;
    this.canHover = window.matchMedia('(hover: hover)').matches;

    this.tabButtons = this.workSection.querySelectorAll(
      '.tab-group-tabs .tab-button',
    );
    // Query all rows from all tab contents (including hidden ones)
    this.rows = this.workSection.querySelectorAll('.work-row');
    this.previewBox = this.workSection.querySelector('[data-preview]');
    this.previewImg = this.workSection.querySelector('.work__preview-img');
    this.cursorPreview = this.workSection.querySelector('[data-work-cursor]');
    this.cursorImage = this.workSection.querySelector('.work__cursor-image');
    this.workPanel = this.workSection.querySelector('.work__right');

    this.init();
  }

  private init() {
    // Listen to tab-change event from TabGroup component
    // This event is dispatched by TabGroup.astro when a tab is clicked
    // Listen on both workSection and tab-group to catch the event
    const tabGroup = this.workSection.querySelector('.tab-group');
    const handleTabChange = ((e: CustomEvent) => {
      const tabId = e.detail?.tabId;
      if (tabId) {
        this.setTab(tabId);
      }
    }) as EventListener;

    this.workSection.addEventListener('tab-change', handleTabChange);
    if (tabGroup) {
      tabGroup.addEventListener('tab-change', handleTabChange);
    }

    // Fallback: direct tab button handlers (in case TabGroup event doesn't fire)
    this.tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId) {
          this.setTab(tabId);
        }
      });
    });

    // Row hover and click handlers
    this.rows.forEach((row) => {
      // Hover preview (desktop only) with delay
      row.addEventListener('mouseenter', () => {
        if (!this.canHover) return;
        if (row.hasAttribute('hidden')) return;
        this.scheduleCursorPreview(row);
      });

      row.addEventListener('mouseleave', () => {
        if (!this.canHover) return;
        if (row.hasAttribute('hidden')) return;

        this.clearCursorPreview(row);
      });

      // Click = active + preview + routing
      const handleRowActivate = (e: Event) => {
        e.preventDefault();
        if (row.hasAttribute('hidden')) return;

        const projectSlug = row.getAttribute('data-work-slug');
        const photoSlug = row.getAttribute('data-photo-slug');

        if (projectSlug) {
          this.openProject(projectSlug, row);
        } else if (photoSlug) {
          this.openPhotography(photoSlug, row);
        } else {
          // Fallback: just set active
          this.setActiveRow(row);
          const previewVideo = row.getAttribute('data-preview-video');
          const previewUrl = row.getAttribute('data-preview');
          if (previewVideo) {
            this.swapPreviewVideo(previewVideo);
          } else if (previewUrl) {
            this.swapPreview(previewUrl);
          }
        }

        this.hideCursorPreview();
      };

      row.addEventListener('click', handleRowActivate);

      // Keyboard navigation: Enter and Space
      row.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowActivate(e);
        }
      });

      row.addEventListener('focus', () => {
        if (row.hasAttribute('hidden')) return;
        this.scheduleCursorPreview(row);
      });

      row.addEventListener('blur', () => {
        this.clearCursorPreview(row);
      });
    });

    // Handle popstate (back/forward navigation)
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e.state);
    });

    if (this.canHover && this.cursorPreview) {
      this.mouseMoveHandler = (e: MouseEvent) => {
        if (!this.cursorPreview) return;
        this.cursorPreview.style.left = `${e.clientX}px`;
        this.cursorPreview.style.top = `${e.clientY}px`;
      };
      window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    // Initialize with default tab first
    this.setTab('design');

    // Mark initialization as complete after a short delay
    // This prevents auto-opening first item during init
    setTimeout(() => {
      this.isInitializing = false;
    }, 500);

    // Check for initial project or photography slug from SSR first
    if (this.initialProjectSlug) {
      if (import.meta.env.DEV) {
        console.log(
          '🎯 Opening initial project from SSR:',
          this.initialProjectSlug,
        );
      }
      // Wait a bit for DOM to be ready
      setTimeout(() => {
        this.openProjectBySlug(this.initialProjectSlug!, 'project');
      }, 300);
    } else if (this.initialPhotographySlug) {
      if (import.meta.env.DEV) {
        console.log(
          '🎯 Opening initial photography from SSR:',
          this.initialPhotographySlug,
        );
      }
      // Wait a bit for DOM to be ready
      setTimeout(() => {
        this.openProjectBySlug(this.initialPhotographySlug!, 'photography');
      }, 300);
    } else {
      // Check for deep link in URL (fallback for client-side navigation)
      this.handleDeepLink();
      // Also check after a short delay to ensure DOM is fully ready
      setTimeout(() => {
        this.handleDeepLink();
        // Don't auto-open first item on plain homepage visits
        // This prevents redirect loops when openFirstItem() changes URL to /work/[slug]
        // which then triggers handleDeepLink() to redirect back to /
        // Only handleDeepLink() should open projects when there's an actual deep link
      }, 100);
    }
  }

  private hasActiveItem(): boolean {
    return !!this.activeProjectSlug || !!this.activePhotoId;
  }

  private openFirstItem() {
    // Find first visible row in active tab
    const firstRow = Array.from(this.rows).find(
      (r) =>
        !r.hasAttribute('hidden') &&
        r.getAttribute('data-type') === this.activeTab,
    );

    if (!firstRow) return;

    const projectSlug = firstRow.getAttribute('data-work-slug');
    const photoSlug = firstRow.getAttribute('data-photo-slug');

    if (projectSlug) {
      if (import.meta.env.DEV) {
        console.log('🎯 Auto-opening first project:', projectSlug);
      }
      this.openProject(projectSlug, firstRow as HTMLElement);
    } else if (photoSlug) {
      if (import.meta.env.DEV) {
        console.log('🎯 Auto-opening first photography:', photoSlug);
      }
      this.openPhotography(photoSlug, firstRow as HTMLElement);
    }
  }

  private clearActiveRow() {
    this.rows.forEach((r) => r.classList.remove('is-active'));
  }

  private setActiveRow(row: HTMLElement) {
    this.clearActiveRow();
    row.classList.add('is-active');
    row.setAttribute('aria-current', 'page');
    // Scroll into view if needed (for keyboard navigation)
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  private swapPreview(src: string) {
    if (!this.previewImg || !this.previewBox) return;

    // Hide video if showing
    const existingVideo = this.previewBox.querySelector('video');
    if (existingVideo) {
      existingVideo.remove();
    }

    this.previewBox.classList.add('is-fading');
    window.setTimeout(() => {
      if (this.previewImg) {
        this.previewImg.src = src;
        this.previewImg.style.display = 'block';
      }
      this.previewBox?.classList.remove('is-fading');
    }, 120);
  }

  private swapPreviewVideo(videoUrl: string) {
    if (!this.previewBox) return;

    // Hide image if showing
    if (this.previewImg) {
      this.previewImg.style.display = 'none';
    }

    // Remove existing video if any
    const existingVideo = this.previewBox.querySelector('video');
    if (existingVideo) {
      existingVideo.remove();
    }

    this.previewBox.classList.add('is-fading');
    window.setTimeout(() => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.className = 'work__preview-video';
      video.style.cssText =
        'width: 100%; height: 100%; object-fit: cover; display: block;';

      this.previewBox?.appendChild(video);
      this.previewBox?.classList.remove('is-fading');
    }, 120);
  }

  private scheduleCursorPreview(row: HTMLElement) {
    const existingTimeout = this.hoverTimeouts.get(row);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      const previewUrl = row.getAttribute('data-preview');
      const previewVideo = row.getAttribute('data-preview-video');
      this.showCursorPreview(previewVideo, previewUrl);
      this.hoverTimeouts.delete(row);
    }, 200);

    this.hoverTimeouts.set(row, timeoutId);
  }

  private clearCursorPreview(row: HTMLElement) {
    const timeoutId = this.hoverTimeouts.get(row);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.hoverTimeouts.delete(row);
    }
    this.hideCursorPreview();
  }

  private showCursorPreview(
    previewVideo: string | null,
    previewUrl: string | null,
  ) {
    if (!this.canHover || !this.cursorPreview) return;
    if (!previewVideo && !previewUrl) {
      this.hideCursorPreview();
      return;
    }

    if (previewVideo) {
      this.setCursorVideo(previewVideo);
    } else if (previewUrl) {
      this.setCursorImage(previewUrl);
    }

    this.cursorPreview.classList.add('is-visible');
  }

  private hideCursorPreview() {
    if (!this.cursorPreview) return;
    this.cursorPreview.classList.remove('is-visible');
    if (this.cursorVideo) {
      this.cursorVideo.pause();
    }
  }

  private setCursorImage(src: string) {
    if (!this.cursorImage) return;
    this.cursorImage.src = src;
    this.cursorImage.style.display = 'block';
    if (this.cursorVideo) {
      this.cursorVideo.pause();
      this.cursorVideo.style.display = 'none';
    }
  }

  private setCursorVideo(src: string) {
    if (!this.cursorPreview) return;
    if (!this.cursorVideo) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.className = 'work__cursor-video';
      video.style.cssText =
        'width: 100%; height: 100%; object-fit: cover; display: block;';
      this.cursorVideo = video;
      this.cursorPreview.appendChild(video);
    }

    if (this.cursorVideo.src !== src) {
      this.cursorVideo.src = src;
    }

    this.cursorVideo.style.display = 'block';
    if (this.cursorImage) {
      this.cursorImage.style.display = 'none';
    }
    this.cursorVideo.play().catch(() => {});
  }

  private setTab(key: string) {
    if (import.meta.env.DEV) {
      console.log('🧭 WorkController setTab:', {
        key,
        previousTab: this.activeTab,
        activeProjectSlug: this.activeProjectSlug,
        activePhotoId: this.activePhotoId,
      });
    }
    this.activeTab = key;

    // Fallback: ensure tab buttons + content reflect active tab
    const tabButtons = Array.from(this.tabButtons);
    tabButtons.forEach((btn, index) => {
      const isActive = btn.getAttribute('data-tab') === key;
      btn.classList.toggle('tab-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        const tabsContainer = btn.closest('.tab-group-tabs') as HTMLElement;
        if (tabsContainer) {
          tabsContainer.style.setProperty(
            '--active-tab-index',
            index.toString(),
          );
        }
      }
    });

    const tabContents = this.workSection.querySelectorAll('.tab-content');
    tabContents.forEach((content) => {
      const contentTab = content.getAttribute('data-tab-content');
      content.classList.toggle('tab-content-active', contentTab === key);
    });

    // Ensure rows within the active tab are visible in case tab content
    // classes are not updating for any reason.
    this.rows.forEach((row) => {
      const show = row.getAttribute('data-type') === key;
      row.toggleAttribute('hidden', !show);
      row.style.display = show ? '' : 'none';
    });

    // IMPORTANT: no default active row
    this.clearActiveRow();

    // Reset to preview mode when switching tabs
    if (import.meta.env.DEV) {
      console.log('🧹 WorkController setTab: closing active project');
    }
    this.closeProject();

    // Reset preview to default for the active tab
    const defaultImage =
      key === 'design' ? this.defaultImages.design : this.defaultImages.photo;
    this.swapPreview(defaultImage);
    this.hideCursorPreview();

    // Auto-open first item in the new tab if nothing is active
    // But only if we're not still initializing (prevents redirect loops)
    if (!this.hasActiveItem() && !this.isInitializing) {
      setTimeout(() => {
        this.openFirstItem();
      }, 100);
    }
  }

  private async openProject(slug: string, row: HTMLElement) {
    if (import.meta.env.DEV) {
      console.log('📌 WorkController openProject:', slug);
    }
    this.activeProjectSlug = slug;
    this.activePhotoId = null;
    this.setActiveRow(row);

    // Update URL with pushState
    const newUrl = `/work/${slug}`;
    window.history.pushState({ slug, type: 'project' }, '', newUrl);

    // Fetch project data via API and switch panel to detail mode
    await this.loadProjectData(slug);
    this.switchPanelMode('detail', slug, 'project');
  }

  private async loadProjectData(slug: string) {
    try {
      if (import.meta.env.DEV) {
        console.log('📡 Fetching project data via API:', slug);
      }

      const response = await fetch(
        `/api/project.json?slug=${encodeURIComponent(slug)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.statusText}`);
      }

      const projectData = await response.json();

      // Dispatch event with project data for WorkPanel to consume
      const event = new CustomEvent('work-panel-project-loaded', {
        detail: { projectData, slug },
        bubbles: true,
      });
      this.workSection.dispatchEvent(event);

      if (import.meta.env.DEV) {
        console.log('✅ Project data loaded:', projectData.title);
      }
    } catch (error) {
      console.error('❌ Failed to load project data:', error);

      // Dispatch error event
      const errorEvent = new CustomEvent('work-panel-project-error', {
        detail: { error, slug },
        bubbles: true,
      });
      this.workSection.dispatchEvent(errorEvent);
    }
  }

  private async loadPhotographyData(slug: string) {
    try {
      if (import.meta.env.DEV) {
        console.log('📡 Fetching photography data via API:', slug);
      }

      const response = await fetch(
        `/api/photography/${encodeURIComponent(slug)}.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to load photography: ${response.statusText}`);
      }

      const photographyData = await response.json();

      // Dispatch event with photography data for WorkPanel to consume
      const event = new CustomEvent('work-panel-photography-loaded', {
        detail: { photographyData, slug },
        bubbles: true,
      });
      this.workSection.dispatchEvent(event);

      if (import.meta.env.DEV) {
        console.log(
          '✅ Photography data loaded:',
          photographyData.projectTitle,
        );
      }
    } catch (error) {
      console.error('❌ Failed to load photography data:', error);

      // Dispatch error event
      const errorEvent = new CustomEvent('work-panel-photography-error', {
        detail: { error, slug },
        bubbles: true,
      });
      this.workSection.dispatchEvent(errorEvent);
    }
  }

  private async openPhotography(slug: string, row: HTMLElement) {
    if (import.meta.env.DEV) {
      console.log('📌 WorkController openPhotography:', slug);
    }
    this.activePhotoId = slug;
    this.activeProjectSlug = null;
    this.setActiveRow(row);

    // Update URL with pushState
    const newUrl = `/photography/${slug}`;
    window.history.pushState({ slug, type: 'photography' }, '', newUrl);

    // Fetch photography data via API and switch panel to detail mode
    await this.loadPhotographyData(slug);
    this.switchPanelMode('detail', slug, 'photography');
  }

  private closeProject() {
    if (import.meta.env.DEV) {
      console.log('📤 WorkController closeProject: resetting to home');
    }
    const hadActiveProject = !!this.activeProjectSlug || !!this.activePhotoId;

    this.activeProjectSlug = null;
    this.activePhotoId = null;
    this.clearActiveRow();

    // Only update URL if we were actually in a detail state
    if (hadActiveProject && window.location.pathname !== '/') {
      window.history.pushState({ type: 'home' }, '', '/');
    }

    // Switch panel back to preview mode
    this.switchPanelMode('preview');
  }

  private switchPanelMode(
    mode: 'preview' | 'detail',
    slug?: string,
    type: 'project' | 'photography' = 'project',
  ) {
    if (!this.workPanel) return;

    // Update data attribute for mode switching
    this.workPanel.setAttribute('data-mode', mode);
    this.workPanel.setAttribute('data-work-type', type);
    if (slug) {
      this.workPanel.setAttribute('data-work-slug', slug);
    } else {
      this.workPanel.removeAttribute('data-work-slug');
    }

    // Dispatch custom event for panel mode change
    const event = new CustomEvent('work-panel-mode-change', {
      detail: { mode, slug, type },
      bubbles: true,
    });
    this.workSection.dispatchEvent(event);
  }

  private handleDeepLink() {
    const path = window.location.pathname;
    const workMatch = path.match(/^\/work\/([^/]+)$/);
    const photoMatch = path.match(/^\/photography\/([^/]+)$/);

    // Check if we're already on the homepage
    const isHomepage = path === '/' || path === '';

    // If we're on a work/photography detail page URL, navigate to home first
    if ((workMatch || photoMatch) && !isHomepage) {
      const slug = workMatch?.[1] || photoMatch?.[1];
      const projectType = workMatch ? 'project' : 'photography';

      if (slug) {
        // Navigate to home first, then open the project
        if (import.meta.env.DEV) {
          console.log(
            '🔗 Deep link detected on non-homepage, navigating to home first:',
            {
              path,
              slug,
              projectType,
            },
          );
        }

        // Store the slug to open after navigation
        sessionStorage.setItem('pendingProjectSlug', slug);
        sessionStorage.setItem('pendingProjectType', projectType);

        // Use Astro view transitions if available, otherwise regular navigation
        // Try to use Astro's view transition API
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            window.location.href = '/';
          });
        } else {
          window.location.href = '/';
        }
        return;
      }
    }

    // We're on homepage - check for pending project or direct match
    if (isHomepage) {
      // First check for pending project from sessionStorage (after navigation)
      const pendingSlug = sessionStorage.getItem('pendingProjectSlug');
      const pendingType = sessionStorage.getItem('pendingProjectType');

      if (pendingSlug && pendingType) {
        sessionStorage.removeItem('pendingProjectSlug');
        sessionStorage.removeItem('pendingProjectType');

        if (import.meta.env.DEV) {
          console.log('🎯 Opening pending project after navigation to home:', {
            slug: pendingSlug,
            type: pendingType,
          });
        }

        // Wait a bit for DOM to be ready and rows to be available
        setTimeout(() => {
          this.openProjectBySlug(
            pendingSlug,
            pendingType as 'project' | 'photography',
          );
        }, 300);
        return;
      }

      // Also check if URL still has work/photography in it (shouldn't happen, but just in case)
      if (workMatch || photoMatch) {
        const slug = workMatch?.[1] || photoMatch?.[1];
        const projectType = workMatch ? 'project' : 'photography';
        if (slug) {
          if (import.meta.env.DEV) {
            console.log('🎯 Opening project from URL on homepage:', {
              slug,
              type: projectType,
            });
          }
          setTimeout(() => {
            this.openProjectBySlug(slug, projectType);
          }, 300);
        }
      }
    }
  }

  private async openProjectBySlug(
    slug: string,
    type: 'project' | 'photography',
  ) {
    if (type === 'project') {
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-work-slug') === slug,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
          // Wait a bit for tab switch to complete
          setTimeout(async () => {
            await this.openProject(slug, row as HTMLElement);
          }, 100);
        } else {
          await this.openProject(slug, row as HTMLElement);
        }
      } else if (import.meta.env.DEV) {
        console.warn('⚠️ Work row not found for slug:', slug, {
          availableRows: Array.from(this.rows).map((r) => ({
            slug: r.getAttribute('data-work-slug'),
            type: r.getAttribute('data-type'),
          })),
        });
      }
    } else {
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-photo-slug') === slug,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
          setTimeout(async () => {
            await this.openPhotography(slug, row as HTMLElement);
          }, 100);
        } else {
          await this.openPhotography(slug, row as HTMLElement);
        }
      } else if (import.meta.env.DEV) {
        console.warn('⚠️ Photography row not found for slug:', slug);
      }
    }
  }

  private async handlePopState(state: any) {
    const path = window.location.pathname;

    if (path.startsWith('/work/')) {
      const slug = path.split('/work/')[1];
      if (slug) {
        // Restore work view from URL
        const row = Array.from(this.rows).find(
          (r) => r.getAttribute('data-work-slug') === slug,
        );
        if (row) {
          const rowType = row.getAttribute('data-type');
          if (rowType && rowType !== this.activeTab) {
            this.setTab(rowType);
            // Wait for tab switch
            setTimeout(async () => {
              await this.openProject(slug, row as HTMLElement);
            }, 100);
          } else {
            await this.openProject(slug, row as HTMLElement);
          }
        } else {
          // Row not found, try to load project anyway (might be a direct URL)
          await this.loadProjectData(slug);
          this.switchPanelMode('detail', slug, 'project');
        }
      }
    } else if (state && state.slug && state.type === 'photography') {
      // Restore photography view
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-photo-slug') === state.slug,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
        }
        await this.openPhotography(state.slug, row as HTMLElement);
      }
    } else {
      // Return to preview/default
      this.closeProject();
    }
  }

  public destroy() {
    // Cleanup event listeners
    this.hoverTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.hoverTimeouts.clear();

    // Remove event listeners from rows
    this.rows.forEach((row) => {
      const newRow = row.cloneNode(true);
      row.parentNode?.replaceChild(newRow, row);
    });

    // Cleanup tab button listeners
    this.tabButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);
    });

    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }
}

// Initialize on DOM ready
export function initWorkController() {
  const workSection = document.querySelector('#work') as HTMLElement;
  if (!workSection) return;

  // Get default images from data attributes or fallback
  const defaultDesignImage =
    workSection.getAttribute('data-default-design-image') || '';
  const defaultPhotoImage =
    workSection.getAttribute('data-default-photo-image') || '';

  // Get initial work slug from SSR
  const initialProjectSlug =
    workSection.getAttribute('data-initial-work-slug') || null;
  const initialPhotographySlug =
    workSection.getAttribute('data-initial-photography-slug') || null;

  return new WorkController({
    workSection,
    defaultImages: {
      design: defaultDesignImage,
      photo: defaultPhotoImage,
    },
    initialProjectSlug,
    initialPhotographySlug,
  });
}
