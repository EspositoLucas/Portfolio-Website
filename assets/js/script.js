"use strict";

/**
 * Portfolio Website - Main JavaScript
 * 
 * This file handles:
 * - Sidebar toggle functionality
 * - Portfolio filtering and pagination
 * - Page navigation
 * - Content modal functionality (for future use)
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Toggles the 'active' class on an element
 * @param {HTMLElement} element - The element to toggle
 */
const toggleActiveClass = (element) => {
  element?.classList.toggle("active");
};

/**
 * Gets the current active filter category
 * @returns {string} The active filter category
 */
const getActiveFilterCategory = () => {
  const activeFilterBtn = document.querySelector("[data-filter-btn].active");
  return activeFilterBtn?.innerText.toLowerCase() || "all";
};

/**
 * Gets filtered items based on category
 * @param {string} category - The category to filter by
 * @param {NodeList} allItems - All filterable items
 * @returns {Array} Filtered items array
 */
const getFilteredItems = (category, allItems) => {
  if (category === "all") {
    return Array.from(allItems);
  }
  return Array.from(allItems).filter(
    (item) => item.dataset.category === category
  );
};

// ============================================
// SIDEBAR MODULE
// ============================================

/**
 * Initializes sidebar toggle functionality
 */
const initSidebar = () => {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", () => {
      toggleActiveClass(sidebar);
    });
  }
};

// ============================================
// CONTENT MODAL MODULE
// ============================================

/**
 * Initializes content modal functionality
 * (Kept for potential future use)
 */
const initContentModal = () => {
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");
  const contentItems = document.querySelectorAll("[data-content-item]");

  if (!modalContainer || !overlay) return;

  const toggleModal = () => {
    toggleActiveClass(modalContainer);
    toggleActiveClass(overlay);
  };

  // Add click event to all content items
  contentItems.forEach((item) => {
    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-content-avatar]");
      const title = this.querySelector("[data-content-title]");
      const text = this.querySelector("[data-content-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
      }
      if (modalTitle && title) {
        modalTitle.innerHTML = title.innerHTML;
      }
      if (modalText && text) {
        modalText.innerHTML = text.innerHTML;
      }
      toggleModal();
    });
  });

  // Close modal events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", toggleModal);
  }
  overlay.addEventListener("click", toggleModal);
};

// ============================================
// FILTER & SELECT MODULE
// ============================================

/**
 * Initializes custom select dropdown functionality
 */
const initSelect = () => {
  const select = document.querySelector("[data-select]");

  if (!select) return;

  select.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleActiveClass(select);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target) && select.classList.contains("active")) {
      select.classList.remove("active");
    }
  });
};

// ============================================
// PAGINATION MODULE
// ============================================

/**
 * Pagination Manager Class
 * Handles pagination logic for portfolio items
 */
class PaginationManager {
  constructor(itemsPerPage = 6) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.paginationContainer = document.querySelector(".pagination-container");
    this.prevButton = document.getElementById("prev-button");
    this.nextButton = document.getElementById("next-button");
    this.paginationNumbers = document.querySelector(".pagination-numbers");
  }

  /**
   * Updates pagination UI based on items
   * @param {Array} items - Items to paginate
   */
  updatePagination(items) {
    if (!this.paginationContainer || !this.paginationNumbers) return;

    const totalPages = Math.ceil(items.length / this.itemsPerPage);

    // Hide pagination if items fit in one page
    this.paginationContainer.style.display =
      items.length <= this.itemsPerPage ? "none" : "flex";

    // Clear and rebuild page numbers
    this.paginationNumbers.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.className = `pagination-number ${
        i === this.currentPage ? "active" : ""
      }`;
      pageNumber.textContent = i;
      pageNumber.addEventListener("click", () => {
        this.currentPage = i;
        this.showPage(items);
        this.updatePaginationButtons(items);
      });
      this.paginationNumbers.appendChild(pageNumber);
    }
  }

  /**
   * Shows items for current page
   * @param {Array} items - Items to display
   */
  showPage(items) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    items.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  /**
   * Updates pagination button states
   * @param {Array} items - Items array
   */
  updatePaginationButtons(items) {
    const totalPages = Math.ceil(items.length / this.itemsPerPage);
    
    if (this.prevButton) {
      this.prevButton.disabled = this.currentPage === 1;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentPage === totalPages;
    }

    document.querySelectorAll(".pagination-number").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseInt(btn.textContent) === this.currentPage
      );
    });
  }

  /**
   * Resets to first page
   */
  reset() {
    this.currentPage = 1;
  }

  /**
   * Navigates to previous page
   * @param {Array} items - Items array
   */
  goToPreviousPage(items) {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.showPage(items);
      this.updatePaginationButtons(items);
    }
  }

  /**
   * Navigates to next page
   * @param {Array} items - Items array
   */
  goToNextPage(items) {
    const totalPages = Math.ceil(items.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.showPage(items);
      this.updatePaginationButtons(items);
    }
  }
}

// ============================================
// FILTER MODULE
// ============================================

/**
 * Filter Manager Class
 * Handles filtering logic for portfolio items
 */
class FilterManager {
  constructor(paginationManager) {
    this.filterItems = document.querySelectorAll("[data-filter-item]");
    this.filterButtons = document.querySelectorAll("[data-filter-btn]");
    this.selectValue = document.querySelector("[data-selecct-value]");
    this.paginationManager = paginationManager;
    this.lastClickedBtn = this.filterButtons[0];
  }

  /**
   * Filters items by category
   * @param {string} selectedValue - Category to filter by
   */
  filter(selectedValue) {
    this.paginationManager.reset();

    let filteredItems = [];

    if (selectedValue === "all") {
      filteredItems = Array.from(this.filterItems);
      this.filterItems.forEach((item) => item.classList.add("active"));
    } else {
      this.filterItems.forEach((item) => {
        if (selectedValue === item.dataset.category) {
          item.classList.add("active");
          filteredItems.push(item);
        } else {
          item.classList.remove("active");
        }
      });
    }

    this.paginationManager.showPage(filteredItems);
    this.paginationManager.updatePagination(filteredItems);
    this.paginationManager.updatePaginationButtons(filteredItems);
  }

  /**
   * Initializes filter functionality
   */
  init() {
    // Filter button events
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedValue = btn.innerText.toLowerCase();
        if (this.selectValue) {
          this.selectValue.innerText = btn.innerText;
        }
        this.filter(selectedValue);

        // Update active state
        if (this.lastClickedBtn) {
          this.lastClickedBtn.classList.remove("active");
        }
        btn.classList.add("active");
        this.lastClickedBtn = btn;
      });
    });

    // Select dropdown events
    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    selectItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item.innerText.toLowerCase();
        if (this.selectValue) {
          this.selectValue.innerText = item.innerText;
        }
        // Close dropdown
        if (select) {
          select.classList.remove("active");
        }
        this.filter(selectedValue);

        // Update active state on filter buttons
        this.filterButtons.forEach((filterBtn) => {
          if (filterBtn.innerText.toLowerCase() === selectedValue) {
            if (this.lastClickedBtn) {
              this.lastClickedBtn.classList.remove("active");
            }
            filterBtn.classList.add("active");
            this.lastClickedBtn = filterBtn;
          }
        });
      });
    });

    // Initialize with "all" filter
    this.filter("all");
  }
}

// ============================================
// RESUME TABS MODULE
// ============================================

/**
 * Initializes resume tabs functionality
 */
const initResumeTabs = () => {
  const resumeTabButtons = document.querySelectorAll("[data-resume-tab]");
  const resumePanels = document.querySelectorAll("[data-resume-panel]");

  if (!resumeTabButtons.length || !resumePanels.length) return;

  resumeTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetPanel = button.dataset.resumeTab;

      // Remove active class from all buttons and panels
      resumeTabButtons.forEach((btn) => btn.classList.remove("active"));
      resumePanels.forEach((panel) => panel.classList.remove("active"));

      // Add active class to clicked button and corresponding panel
      button.classList.add("active");
      const targetPanelElement = document.querySelector(
        `[data-resume-panel="${targetPanel}"]`
      );
      if (targetPanelElement) {
        targetPanelElement.classList.add("active");
      }

      // Scroll to top of resume section smoothly
      const resumeArticle = document.querySelector(".resume");
      if (resumeArticle) {
        const resumeHeader = resumeArticle.querySelector("header");
        if (resumeHeader) {
          const headerOffset = 80;
          const elementPosition = resumeHeader.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
};

// ============================================
// NAVIGATION MODULE
// ============================================

/**
 * Initializes page navigation functionality
 */
const initNavigation = () => {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase();

      pages.forEach((page) => {
        if (targetPage === page.dataset.page) {
          page.classList.add("active");
          // Find corresponding nav link and activate it
          navigationLinks.forEach((navLink) => {
            if (navLink.innerHTML.toLowerCase() === targetPage) {
              navLink.classList.add("active");
            } else {
              navLink.classList.remove("active");
            }
          });
          window.scrollTo(0, 0);
        } else {
          page.classList.remove("active");
        }
      });
    });
  });
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initializes all modules when DOM is ready
 */
const init = () => {
  initSidebar();
  initContentModal();
  initSelect();
  initNavigation();
  initResumeTabs();

  // Initialize filter and pagination
  const paginationManager = new PaginationManager(6);
  const filterManager = new FilterManager(paginationManager);
  filterManager.init();

  // Setup pagination navigation buttons
  if (paginationManager.prevButton && paginationManager.nextButton) {
    paginationManager.prevButton.addEventListener("click", () => {
      const category = getActiveFilterCategory();
      const filteredItems = getFilteredItems(category, filterManager.filterItems);
      paginationManager.goToPreviousPage(filteredItems);
    });

    paginationManager.nextButton.addEventListener("click", () => {
      const category = getActiveFilterCategory();
      const filteredItems = getFilteredItems(category, filterManager.filterItems);
      paginationManager.goToNextPage(filteredItems);
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
