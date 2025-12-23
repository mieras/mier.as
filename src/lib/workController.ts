// Work Controller: Handles tab switching, hover preview, click active state, and soft routing

interface WorkControllerOptions {
  workSection: HTMLElement;
  defaultImages: {
    design: string;
    photo: string;
  };
  projects?: Array<{
    _id: string;
    slug?: string;
    [key: string]: any;
  }>;
  initialProjectSlug?: string | null;
}

export class WorkController {
  private workSection: HTMLElement;
  private tabButtons: NodeListOf<HTMLElement>;
  private rows: NodeListOf<HTMLElement>;
  private previewBox: HTMLElement | null;
  private previewImg: HTMLImageElement | null;
  private workPanel: HTMLElement | null;
  private activeTab: string = 'design';
  private activeProjectSlug: string | null = null;
  private activePhotoId: string | null = null;
  private defaultImages: { design: string; photo: string };
  private canHover: boolean;
  private projects: Array<{ _id: string; slug?: string; [key: string]: any }>;
  private initialProjectSlug: string | null;

  constructor(options: WorkControllerOptions) {
    this.workSection = options.workSection;
    this.defaultImages = options.defaultImages;
    this.projects = options.projects || [];
    this.initialProjectSlug = options.initialProjectSlug || null;
    this.canHover = window.matchMedia('(hover: hover)').matches;

    this.tabButtons = this.workSection.querySelectorAll(
      '.tab-group-tabs .tab-button',
    );
    this.rows = this.workSection.querySelectorAll('.work-row');
    this.previewBox = this.workSection.querySelector('[data-preview]');
    this.previewImg = this.workSection.querySelector('.work__preview-img');
    this.workPanel = this.workSection.querySelector('.work__right');

    this.init();
  }

  private init() {
    // Tab click handlers
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
      // Hover preview (desktop only)
      row.addEventListener('mouseenter', () => {
        if (!this.canHover) return;
        if (row.hasAttribute('hidden')) return;

        const previewUrl = row.getAttribute('data-preview');
        if (previewUrl) {
          this.swapPreview(previewUrl);
        }
      });

      row.addEventListener('mouseleave', () => {
        if (!this.canHover) return;
        if (row.hasAttribute('hidden')) return;

        // If nothing is clicked active, return to tab default
        const hasActive = Array.from(this.rows).some((r) =>
          r.classList.contains('is-active'),
        );
        if (!hasActive) {
          const defaultImage =
            this.activeTab === 'design'
              ? this.defaultImages.design
              : this.defaultImages.photo;
          this.swapPreview(defaultImage);
        }
      });

      // Click = active + preview + routing
      const handleRowActivate = (e: Event) => {
        e.preventDefault();
        if (row.hasAttribute('hidden')) return;

        const projectSlug = row.getAttribute('data-project-slug');
        const photoId = row.getAttribute('data-photo-id');

        if (projectSlug) {
          this.openProject(projectSlug, row);
        } else if (photoId) {
          this.openPhotography(photoId, row);
        } else {
          // Fallback: just set active
          this.setActiveRow(row);
          const previewUrl = row.getAttribute('data-preview');
          if (previewUrl) {
            this.swapPreview(previewUrl);
          }
        }
      };

      row.addEventListener('click', handleRowActivate);

      // Keyboard navigation: Enter and Space
      row.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowActivate(e);
        }
      });
    });

    // Handle popstate (back/forward navigation)
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e.state);
    });

    // Initialize with default tab first
    this.setTab('design');

    // Check for initial project slug from SSR first
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
    } else {
      // Check for deep link in URL (fallback for client-side navigation)
      this.handleDeepLink();
      // Also check after a short delay to ensure DOM is fully ready
      setTimeout(() => {
        this.handleDeepLink();
      }, 100);
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

    this.previewBox.classList.add('is-fading');
    window.setTimeout(() => {
      if (this.previewImg) {
        this.previewImg.src = src;
      }
      this.previewBox?.classList.remove('is-fading');
    }, 120);
  }

  private setTab(key: string) {
    this.activeTab = key;

    // Filter rows
    this.rows.forEach((r) => {
      const show = r.getAttribute('data-type') === key;
      r.toggleAttribute('hidden', !show);
      r.style.display = show ? '' : 'none';
    });

    // IMPORTANT: no default active row
    this.clearActiveRow();

    // Reset to preview mode when switching tabs
    this.closeProject();

    // Reset preview to default for the active tab
    const defaultImage =
      key === 'design' ? this.defaultImages.design : this.defaultImages.photo;
    this.swapPreview(defaultImage);
  }

  private async openProject(slug: string, row: HTMLElement) {
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

  private openPhotography(id: string, row: HTMLElement) {
    this.activePhotoId = id;
    this.activeProjectSlug = null;
    this.setActiveRow(row);

    // Update URL with pushState
    const newUrl = `/photography/${id}`;
    window.history.pushState({ id, type: 'photography' }, '', newUrl);

    // Switch panel to detail mode with photography type
    this.switchPanelMode('detail', id, 'photography');
  }

  private closeProject() {
    this.activeProjectSlug = null;
    this.activePhotoId = null;
    this.clearActiveRow();

    // Update URL to homepage
    window.history.pushState({ type: 'home' }, '', '/');

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
    this.workPanel.setAttribute('data-project-type', type);
    if (slug) {
      this.workPanel.setAttribute('data-project-slug', slug);
    } else {
      this.workPanel.removeAttribute('data-project-slug');
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
        (r) => r.getAttribute('data-project-slug') === slug,
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
      } else {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Project row not found for slug:', slug, {
            availableRows: Array.from(this.rows).map((r) => ({
              slug: r.getAttribute('data-project-slug'),
              type: r.getAttribute('data-type'),
            })),
          });
        }
      }
    } else {
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-photo-id') === slug,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
          setTimeout(() => {
            this.openPhotography(slug, row as HTMLElement);
          }, 100);
        } else {
          this.openPhotography(slug, row as HTMLElement);
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Photography row not found for id:', slug);
        }
      }
    }
  }

  private async handlePopState(state: any) {
    const path = window.location.pathname;

    if (path.startsWith('/work/')) {
      const slug = path.split('/work/')[1];
      if (slug) {
        // Restore project view from URL
        const row = Array.from(this.rows).find(
          (r) => r.getAttribute('data-project-slug') === slug,
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
    } else if (state && state.id && state.type === 'photography') {
      // Restore photography view
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-photo-id') === state.id,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
        }
        this.openPhotography(state.id, row as HTMLElement);
      }
    } else {
      // Return to preview/default
      this.closeProject();
    }
  }

  public destroy() {
    // Cleanup if needed
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

  // Get initial project slug from SSR
  const initialProjectSlug =
    workSection.getAttribute('data-initial-project-slug') || null;

  // Get projects data from data attribute (JSON string)
  const projectsData = workSection.getAttribute('data-projects');
  let projects: Array<{ _id: string; slug?: string; [key: string]: any }> = [];
  if (projectsData) {
    try {
      projects = JSON.parse(projectsData);
    } catch (e) {
      console.error('Failed to parse projects data:', e);
    }
  }

  return new WorkController({
    workSection,
    defaultImages: {
      design: defaultDesignImage,
      photo: defaultPhotoImage,
    },
    projects,
    initialProjectSlug,
  });
}
