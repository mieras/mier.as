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

  constructor(options: WorkControllerOptions) {
    this.workSection = options.workSection;
    this.defaultImages = options.defaultImages;
    this.projects = options.projects || [];
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

    // Check for deep link on init
    this.handleDeepLink();

    // Initialize with default tab
    this.setTab('design');
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

  private openProject(slug: string, row: HTMLElement) {
    this.activeProjectSlug = slug;
    this.activePhotoId = null;
    this.setActiveRow(row);

    // Update URL with pushState
    const newUrl = `/work/${slug}`;
    window.history.pushState({ slug, type: 'project' }, '', newUrl);

    // Switch panel to detail mode with project type
    this.switchPanelMode('detail', slug, 'project');
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

    if (workMatch) {
      const slug = workMatch[1];
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-project-slug') === slug,
      );

      if (row) {
        // Make sure row is visible (correct tab)
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
        }

        // Open project
        this.openProject(slug, row as HTMLElement);
      }
    } else if (photoMatch) {
      const id = photoMatch[1];
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-photo-id') === id,
      );

      if (row) {
        // Make sure row is visible (correct tab)
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
        }

        // Open photography
        this.openPhotography(id, row as HTMLElement);
      }
    }
  }

  private handlePopState(state: any) {
    if (state && state.slug) {
      // Restore project view
      const row = Array.from(this.rows).find(
        (r) => r.getAttribute('data-project-slug') === state.slug,
      );
      if (row) {
        const rowType = row.getAttribute('data-type');
        if (rowType && rowType !== this.activeTab) {
          this.setTab(rowType);
        }
        this.openProject(state.slug, row as HTMLElement);
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
  });
}
