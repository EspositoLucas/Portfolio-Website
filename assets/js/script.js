"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");
const itemsPerPage = 6;
let currentPage = 1;

function setupPagination() {
    const paginationContainer = document.querySelector('.pagination-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const paginationNumbers = document.querySelector('.pagination-numbers');

    function updatePagination(items) {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        
        // Mostrar paginación si hay más de 6 items
        paginationContainer.style.display = items.length <= itemsPerPage ? 'none' : 'flex';

        // Actualizar números de página
        paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                showPage(items);
                updatePaginationButtons(items);
            });
            paginationNumbers.appendChild(pageNumber);
        }
    }

    function showPage(items) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        items.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function updatePaginationButtons(items) {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        document.querySelectorAll('.pagination-number').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
        });
    }

    const filterFunc = function (selectedValue) {
        currentPage = 1;
        let filteredItems = [];

        if (selectedValue === "all") {
            filteredItems = Array.from(filterItems);
            filterItems.forEach(item => item.classList.add("active"));
        } else {
            filterItems.forEach(item => {
                if (selectedValue === item.dataset.category) {
                    item.classList.add("active");
                    filteredItems.push(item);
                } else {
                    item.classList.remove("active");
                }
            });
        }

        showPage(filteredItems);
        updatePagination(filteredItems);
        updatePaginationButtons(filteredItems);
    };

    // Event listeners para navegación
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const currentCategory = document.querySelector('[data-filter-btn].active').innerText.toLowerCase();
            const filteredItems = currentCategory === "all" 
                ? Array.from(filterItems)
                : Array.from(filterItems).filter(item => item.dataset.category === currentCategory);
            showPage(filteredItems);
            updatePaginationButtons(filteredItems);
        }
    });

    nextButton.addEventListener('click', () => {
        const currentCategory = document.querySelector('[data-filter-btn].active').innerText.toLowerCase();
        const filteredItems = currentCategory === "all" 
            ? Array.from(filterItems)
            : Array.from(filterItems).filter(item => item.dataset.category === currentCategory);
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            showPage(filteredItems);
            updatePaginationButtons(filteredItems);
        }
    });

    // Event listeners para botones de filtro
    for (let i = 0; i < filterBtn.length; i++) {
        filterBtn[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText;
            filterFunc(selectedValue);

            lastClickedBtn.classList.remove("active");
            this.classList.add("active");
            lastClickedBtn = this;
        });
    }

    // Inicialización con "all"
    filterFunc("all");
}

// let para el último botón clickeado
let lastClickedBtn = filterBtn[0];

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Inicializar la paginación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', setupPagination);