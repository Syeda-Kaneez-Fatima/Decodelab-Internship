// =====================================================
// DATA (in a real app this might come from an API)
// =====================================================
const galleryData = [
    { id: 1, title: "Forest", category: "nature", src: "https://picsum.photos/id/104/900/700", thumbnail: "https://picsum.photos/id/104/400/300" },
    { id: 2, title: "City Light", category: "urban", src: "https://picsum.photos/id/1/900/700", thumbnail: "https://picsum.photos/id/1/400/300" },
    { id: 3, title: "Silhouette Dream", category: "portrait", src: "https://picsum.photos/id/26/900/700", thumbnail: "https://picsum.photos/id/26/400/300" },
    { id: 4, title: "Watercolor Waves", category: "abstract", src: "https://picsum.photos/id/15/900/700", thumbnail: "https://picsum.photos/id/15/400/300" },
    { id: 5, title: "Alpine Lake", category: "nature", src: "https://picsum.photos/id/29/900/700", thumbnail: "https://picsum.photos/id/29/400/300" },
    { id: 6, title: "Neon Tokyo", category: "urban", src: "https://picsum.photos/id/96/900/700", thumbnail: "https://picsum.photos/id/96/400/300" },
    { id: 7, title: "Elegant Gaze", category: "portrait", src: "https://picsum.photos/id/64/900/700", thumbnail: "https://picsum.photos/id/64/400/300" },
    { id: 8, title: "Geometric Flow", category: "abstract", src: "https://picsum.photos/id/20/900/700", thumbnail: "https://picsum.photos/id/20/400/300" },
    { id: 9, title: "Sunset Savannah", category: "nature", src: "https://picsum.photos/id/39/900/700", thumbnail: "https://picsum.photos/id/39/400/300" },
    { id: 10, title: "Skyscraper Glow", category: "urban", src: "https://picsum.photos/id/3/900/700", thumbnail: "https://picsum.photos/id/3/400/300" },
    { id: 11, title: "Studio Portrait", category: "portrait", src: "https://picsum.photos/id/27/900/700", thumbnail: "https://picsum.photos/id/27/400/300" },
    { id: 12, title: "Psychedelic Swirl", category: "abstract", src: "https://picsum.photos/id/175/900/700", thumbnail: "https://picsum.photos/id/175/400/300" }
];

// =====================================================
// STATE (Phase 2: State Management — const for fixed
// references, let for values that mutate)
// =====================================================
let currentFilter = "all";
let currentSearch = "";
let currentGalleryItems = [...galleryData];
let lightboxActive = false;
let currentLightboxIndex = 0;
let lastFocusedElement = null;

// =====================================================
// DOM REFERENCES (const — these never get reassigned)
// =====================================================
const galleryGrid = document.querySelector(".js-gallery-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const lightboxModal = document.querySelector(".js-lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const lightboxCaptionEl = document.getElementById("lightboxCaption");
const imageCounter = document.getElementById("imageCounter");
const closeLightboxBtn = document.querySelector(".js-close-lightbox");
const prevLightBtn = document.querySelector(".js-prev-light");
const nextLightBtn = document.querySelector(".js-next-light");
const backToTopBtn = document.querySelector(".js-back-to-top");
const navToggleBtn = document.querySelector(".js-nav-toggle");
const primaryControls = document.querySelector(".js-primary-controls");
const yearSpan = document.querySelector(".js-year");

// =====================================================
// HELPERS
// =====================================================

/**
 * Returns galleryData filtered by the current category + search term.
 * Pure function: depends only on its inputs, no side effects.
 */
function getFilteredItems() {
    let filtered = galleryData;

    if (currentFilter !== "all") {
        filtered = filtered.filter(item => item.category === currentFilter);
    }

    if (currentSearch.trim() !== "") {
        const term = currentSearch.toLowerCase();
        filtered = filtered.filter(item => item.title.toLowerCase().includes(term));
    }

    return filtered;
}

/**
 * Builds a single gallery card as real DOM nodes.
 * Uses createElement + textContent (never innerHTML) so user-influenced
 * strings (e.g. future API data) can never be interpreted as markup —
 * this is the XSS-safe pattern required for DOM mutation.
 */
function buildGalleryCard(item, index) {
    const card = document.createElement("div");
    card.className = "gallery-item";
    card.dataset.id = String(item.id);
    card.dataset.category = item.category;
    card.dataset.index = String(index);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const categoryDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    card.setAttribute("aria-label", `View ${item.title}, category ${categoryDisplay}`);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrapper";

    const img = document.createElement("img");
    img.className = "gallery-img";
    img.src = item.thumbnail || item.src;
    img.alt = `${item.title} — ${categoryDisplay} photograph`;
    img.loading = "lazy";
    // Explicit width/height reserve layout space before the image loads,
    // preventing Cumulative Layout Shift (CLS).
    img.width = 400;
    img.height = 300;

    const overlay = document.createElement("div");
    overlay.className = "img-overlay";
    overlay.textContent = categoryDisplay;

    imgWrapper.append(img, overlay);

    const info = document.createElement("div");
    info.className = "image-info";

    const titleEl = document.createElement("div");
    titleEl.className = "image-title";
    titleEl.textContent = item.title; // textContent — safe from injection

    const catEl = document.createElement("span");
    catEl.className = "image-cat";
    catEl.textContent = categoryDisplay;

    info.append(titleEl, catEl);
    card.append(imgWrapper, info);

    return card;
}

/**
 * Clears and re-renders the gallery grid from currentGalleryItems.
 */
function renderGallery() {
    const filteredItems = getFilteredItems();
    currentGalleryItems = filteredItems;

    // Clear previous content safely
    galleryGrid.replaceChildren();

    if (filteredItems.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "no-items-message";
        emptyState.textContent = `🔍 No results found for "${currentSearch}"`;
        galleryGrid.appendChild(emptyState);
        galleryGrid.setAttribute("aria-busy", "false");
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredItems.forEach((item, idx) => {
        fragment.appendChild(buildGalleryCard(item, idx));
    });
    galleryGrid.appendChild(fragment);
    galleryGrid.setAttribute("aria-busy", "false");

    attachCardListeners();
    observeRevealAnimations();
}

/**
 * Wires click + keyboard (Enter/Space) listeners onto each card.
 * Cards are role="button" + tabindex="0" so keyboard users can
 * reach and activate them just like native buttons.
 */
function attachCardListeners() {
    document.querySelectorAll(".gallery-item").forEach(card => {
        const idx = parseInt(card.dataset.index, 10);

        card.addEventListener("click", () => {
            if (!isNaN(idx)) openLightbox(idx);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!isNaN(idx)) openLightbox(idx);
            }
        });
    });
}

/**
 * IntersectionObserver-driven scroll reveal. Uses the `is-revealed`
 * state class (is- prefix reserved for visual state per project
 * naming conventions).
 */
function observeRevealAnimations() {
    const revealItems = document.querySelectorAll(".gallery-item");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealItems.forEach(item => observer.observe(item));
}

// =====================================================
// LIGHTBOX (Phase 1–3 IPO loop: click → state update → DOM mutation)
// =====================================================

function getFocusableLightboxElements() {
    return [closeLightboxBtn, prevLightBtn, nextLightBtn];
}

function openLightbox(index) {
    if (!currentGalleryItems.length) return;

    lastFocusedElement = document.activeElement;
    currentLightboxIndex = Math.min(Math.max(index, 0), currentGalleryItems.length - 1);
    updateLightbox();

    lightboxModal.classList.add("is-active");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxActive = true;

    closeLightboxBtn.focus();
}

function updateLightbox() {
    const item = currentGalleryItems[currentLightboxIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = `${item.title} — full size image`;

    const categoryDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    lightboxCaptionEl.textContent = `${item.title} • ${categoryDisplay}`;
    imageCounter.textContent = `${currentLightboxIndex + 1} / ${currentGalleryItems.length}`;
}

function closeLightbox() {
    lightboxModal.classList.remove("is-active");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxActive = false;

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

function nextImage() {
    if (!currentGalleryItems.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryItems.length;
    updateLightbox();
}

function prevImage() {
    if (!currentGalleryItems.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    updateLightbox();
}

/**
 * Basic focus trap: keeps Tab navigation looping within the
 * lightbox's interactive controls while it is open.
 */
function trapLightboxFocus(event) {
    if (!lightboxActive || event.key !== "Tab") return;

    const focusable = getFocusableLightboxElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

// =====================================================
// FILTER + SEARCH EVENT WIRING
// =====================================================

function applyFilters() {
    galleryGrid.setAttribute("aria-busy", "true");
    renderGallery();
    if (lightboxActive) closeLightbox();
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        if (filter === currentFilter) return;

        currentFilter = filter;
        filterButtons.forEach(b => {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        applyFilters();
    });
});

searchInput.addEventListener("input", (event) => {
    currentSearch = event.target.value;
    applyFilters();
});

// =====================================================
// LIGHTBOX EVENT WIRING
// =====================================================

closeLightboxBtn.addEventListener("click", closeLightbox);
prevLightBtn.addEventListener("click", prevImage);
nextLightBtn.addEventListener("click", nextImage);

lightboxModal.addEventListener("click", (event) => {
    if (event.target === lightboxModal) closeLightbox();
});

document.addEventListener("keydown", (event) => {
    if (!lightboxActive) return;

    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowLeft") prevImage();
    else if (event.key === "ArrowRight") nextImage();
    else trapLightboxFocus(event);
});

// =====================================================
// MOBILE NAV (hamburger / popover-style collapse)
// =====================================================

function toggleNav() {
    const isOpen = primaryControls.classList.toggle("is-open");
    navToggleBtn.classList.toggle("is-open", isOpen);
    navToggleBtn.setAttribute("aria-expanded", String(isOpen));
    navToggleBtn.setAttribute("aria-label", isOpen ? "Close search and filters" : "Open search and filters");
}

navToggleBtn.addEventListener("click", toggleNav);

// =====================================================
// BACK TO TOP
// =====================================================

window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("is-visible", window.scrollY > 300);
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// =====================================================
// FOOTER YEAR + INITIAL RENDER
// =====================================================

if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
}

renderGallery();