// Custom Element for Skeleton Loader
class SkeletonLoader extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute("type") || "text";
    const lines = parseInt(this.getAttribute("lines") || "1", 10);

    if (type === "text") {
      let html = '<div class="skeleton-text-container">';
      for (let i = 0; i < lines; i++) {
        // Natural look: last line slightly shorter
        const width = (lines > 1 && i === lines - 1) ? "65%" : `${85 + Math.floor(Math.random() * 15)}%`;
        html += `<div class="skeleton-text-line" style="width: ${width}"></div>`;
      }
      html += '</div>';
      this.innerHTML = html;
    } else {
      this.innerHTML = '<div class="skeleton-shimmer-overlay"></div>';
    }
  }
}
customElements.define("skeleton-loader", SkeletonLoader);

// Global Skeleton Loader Control Logic
document.addEventListener("DOMContentLoaded", () => {
  // Find all images within containers that require skeletons
  const images = document.querySelectorAll(
    ".image-frame img, .menu-page-wrapper img, .gallery-item img"
  );
  images.forEach((img) => {
    const wrapper = img.closest(".image-frame, .menu-page-wrapper, .gallery-item");
    if (!wrapper) return;

    if (!img.complete) {
      wrapper.classList.add("image-loading");
      img.addEventListener("load", () => {
        wrapper.classList.remove("image-loading");
      });
      img.addEventListener("error", () => {
        wrapper.classList.remove("image-loading");
      });
    } else {
      wrapper.classList.remove("image-loading");
    }
  });

  // Map loading control
  const mapIframe = document.querySelector(".map-container iframe");
  if (mapIframe) {
    const mapWrapper = mapIframe.closest(".map-container");
    if (mapWrapper) {
      mapWrapper.classList.add("map-loading");
      mapIframe.addEventListener("load", () => {
        mapWrapper.classList.remove("map-loading");
      });
    }
  }

  // Simulated content loading for text, buttons, and cards
  const skeletonWrappers = document.querySelectorAll(".skeleton-wrapper");
  skeletonWrappers.forEach((wrapper) => {
    wrapper.classList.add("loading");
  });

  // Turn off dynamic text/card/button skeletons after 1.5s
  setTimeout(() => {
    skeletonWrappers.forEach((wrapper) => {
      wrapper.classList.remove("loading");
    });
  }, 1500);
});

// Custom Cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

// Only enable custom cursor if on a non-touch device
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add a slight delay to the outline for smooth trailing effect
    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" },
    );
  });

  // Add hover effects for interactive elements
  const interactives = document.querySelectorAll(
    "a, button, .menu-page-img, .gallery-item, .lightbox-close, .lightbox-prev, .lightbox-next",
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.style.width = "60px";
      cursorOutline.style.height = "60px";
      cursorOutline.style.backgroundColor = "rgba(217, 108, 47, 0.1)";
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.style.width = "40px";
      cursorOutline.style.height = "40px";
      cursorOutline.style.backgroundColor = "transparent";
    });
  });
}

// Sticky Header
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Scroll Reveal Animation using Intersection Observer
const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right, .reveal-text",
);

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("active");
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealElements.forEach((el) => {
  revealOnScroll.observe(el);
});

// Trigger reveal immediately for hero elements
setTimeout(() => {
  document.querySelectorAll(".hero .reveal-text").forEach((el) => {
    el.classList.add("active");
  });
}, 100);
// Lightbox Logic
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const menuImages = Array.from(document.querySelectorAll(".menu-page-img"));
const viewFullMenuBtn = document.getElementById("view-full-menu-btn");

let currentImageIndex = 0;

const updateLightboxImage = () => {
  lightboxImg.style.opacity = "0";
  setTimeout(() => {
    lightboxImg.src = menuImages[currentImageIndex].src;
    lightboxImg.style.opacity = "1";
  }, 200);
};

const openLightbox = (index) => {
  currentImageIndex = index;
  lightboxImg.src = menuImages[currentImageIndex].src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling
};

menuImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    openLightbox(index);
  });
});

if (viewFullMenuBtn) {
  viewFullMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openLightbox(0);
  });
}

const closeLightbox = () => {
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto"; // Re-enable scrolling
};

const showNextImage = (e) => {
  if (e) e.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % menuImages.length;
  updateLightboxImage();
};

const showPrevImage = (e) => {
  if (e) e.stopPropagation();
  currentImageIndex =
    (currentImageIndex - 1 + menuImages.length) % menuImages.length;
  updateLightboxImage();
};

lightboxClose.addEventListener("click", closeLightbox);
lightboxNext.addEventListener("click", showNextImage);
lightboxPrev.addEventListener("click", showPrevImage);

lightbox.addEventListener("click", (e) => {
  if (
    e.target !== lightboxImg &&
    e.target !== lightboxNext &&
    e.target !== lightboxPrev &&
    !lightboxNext.contains(e.target) &&
    !lightboxPrev.contains(e.target)
  ) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNextImage();
  if (e.key === "ArrowLeft") showPrevImage();
});

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lightbox.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true },
);

const handleSwipe = () => {
  if (touchEndX < touchStartX - 50) showNextImage();
  if (touchEndX > touchStartX + 50) showPrevImage();
};

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = document.getElementById("header").offsetHeight;
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight + 10,
        behavior: "smooth",
      });
    }
  });
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector(".mobile-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobile-menu-close");

const openMobileMenu = () => {
  mobileMenu.classList.add("active");
  document.body.style.overflow = "hidden";
  mobileToggle.querySelector("i").className = "ri-close-line";
};

const closeMobileMenu = () => {
  mobileMenu.classList.remove("active");
  document.body.style.overflow = "";
  mobileToggle.querySelector("i").className = "ri-menu-line";
};

mobileToggle.addEventListener("click", () => {
  if (mobileMenu.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileMenuClose.addEventListener("click", closeMobileMenu);

// Close menu when a mobile nav link is clicked
document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Mobile order button opens the order modal after closing the menu
const mobileOrderBtn = document.querySelector(".mobile-order-btn");
if (mobileOrderBtn) {
  mobileOrderBtn.addEventListener("click", () => {
    closeMobileMenu();
    document.getElementById("order-modal").classList.add("active");
  });
}

// Reservation Form Handling
const resForm = document.getElementById("reservation-form");
const resSuccess = document.getElementById("res-success");

if (resForm) {
  resForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show success message
    resSuccess.style.display = "flex";

    // Reset form
    resForm.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
      resSuccess.style.display = "none";
    }, 5000);
  });
}

// ----------------------------------------
// Hero Scroll Animation (Cinematic Image Sequence)
// ----------------------------------------
const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const context = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency

  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  setCanvasSize();

  const frameCount = 240;

  // Generate image paths
  const currentFrame = (index) =>
    `assets/pizza hero/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

  const images = [];
  let imageIndex = 0;

  // Add loading skeleton state to the sequence container
  const heroSeqContainer = document.querySelector(".hero-sequence-container");
  if (heroSeqContainer) {
    heroSeqContainer.classList.add("hero-loading");
  }

  // Load first image immediately
  const firstImg = new Image();
  firstImg.src = currentFrame(1);
  images.push(firstImg);

  // Function to draw image imitating background-size: contain, zoomed out, bottom middle
  const drawCenteredImage = (img) => {
    if (!img || !img.complete) return;
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    // Fullscreen cover (object-fit: cover equivalent)
    const scaleFactor = 1.0;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
    }

    // Center positioning
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = (canvas.height - drawHeight) / 2;

    // Fill background with dark color
    context.fillStyle = "#2E1F26";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  canvas.style.transition = 'opacity 0.4s ease-in-out';
  firstImg.onload = () => {
    drawCenteredImage(firstImg);
    if (heroSeqContainer) {
      heroSeqContainer.classList.remove("hero-loading");
    }
  };

  // Preload remaining images asynchronously
  for (let i = 2; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  window.addEventListener("resize", () => {
    setCanvasSize();
    if (images[imageIndex] && images[imageIndex].complete) {
      drawCenteredImage(images[imageIndex]);
    }
  });

  const heroSection = document.querySelector(".hero");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!heroSection) return;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollDistance = heroSection.clientHeight - window.innerHeight;
        let scrollProgress = window.scrollY / scrollDistance;

        // Clamp progress
        if (scrollProgress < 0) scrollProgress = 0;
        if (scrollProgress > 1) scrollProgress = 1;

        // Calculate current frame
        const frameIndex = Math.floor(scrollProgress * (frameCount - 1));

        if (imageIndex !== frameIndex) {
          imageIndex = frameIndex;
          if (images[imageIndex]) {
            drawCenteredImage(images[imageIndex]);
          }
        }

        // Parallax depth / scale effect
        const scaleValue = 1.05 + scrollProgress * 0.15; // Zooms in smoothly
        canvas.style.transform = `scale(${scaleValue})`;

        // Optional: Slightly fade out content as user scrolls down
        const heroContent = document.querySelector(".hero-content");
        if (heroContent) {
          const contentOpacity = 1 - scrollProgress * 2.5;
          heroContent.style.opacity = Math.max(0, contentOpacity);
          heroContent.style.transform = `translateY(-${scrollProgress * 300}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

// Order Modal - close on overlay click or Escape
const orderModal = document.getElementById("order-modal");
if (orderModal) {
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) {
      orderModal.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orderModal.classList.contains("active")) {
      orderModal.classList.remove("active");
    }
  });
}
