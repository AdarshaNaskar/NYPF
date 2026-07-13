// Custom Element for Skeleton Loader
class SkeletonLoader extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute("type") || "text";
    const lines = parseInt(this.getAttribute("lines") || "1", 10);

    if (type === "text") {
      let html = '<div class="skeleton-text-container">';
      for (let i = 0; i < lines; i++) {
        // Natural look: last line slightly shorter
        const width =
          lines > 1 && i === lines - 1
            ? "65%"
            : `${85 + Math.floor(Math.random() * 15)}%`;
        html += `<div class="skeleton-text-line" style="width: ${width}"></div>`;
      }
      html += "</div>";
      this.innerHTML = html;
    } else {
      this.innerHTML = '<div class="skeleton-shimmer-overlay"></div>';
    }
  }
}
customElements.define("skeleton-loader", SkeletonLoader);

// Global Skeleton Loader Control Logic
document.addEventListener("DOMContentLoaded", () => {
  // 1. Image Skeletons (Gallery, Menu Cards, etc.)
  const imageContainers = document.querySelectorAll(
    ".image-frame, .menu-page-wrapper, .gallery-item"
  );
  imageContainers.forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    if (!img) return;

    if (!img.complete || img.naturalWidth === 0) {
      wrapper.classList.add("image-loading");
      const removeSkeleton = () => wrapper.classList.remove("image-loading");
      img.addEventListener("load", removeSkeleton);
      img.addEventListener("error", removeSkeleton);
    }
  });

  // 2. Map loading control (Lazy Load via Intersection Observer)
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const iframe = contactSection.querySelector("iframe[data-src]");
    if (iframe) {
      const wrapper = iframe.closest(".map-container");
      // Display premium skeleton placeholder before loading
      if (wrapper) wrapper.classList.add("map-loading");
      
      const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            iframe.addEventListener("load", () => {
              if (wrapper) wrapper.classList.remove("map-loading");
            });
            
            iframe.src = iframe.getAttribute("data-src");
            iframe.removeAttribute("data-src");
            observer.disconnect();
          }
        });
      }, { rootMargin: "200px" });
      mapObserver.observe(contactSection);
    }
  }

  // 3. Text and UI Skeletons (Reviews, Headings)
  const skeletonWrappers = document.querySelectorAll(".skeleton-wrapper");
  skeletonWrappers.forEach((wrapper) => {
    // Only show skeleton if fonts are actually loading to prevent flashing
    if (document.fonts && document.fonts.status === "loading") {
      wrapper.classList.add("loading");
      document.fonts.ready.then(() => {
        wrapper.classList.remove("loading");
      });
    } else {
      wrapper.classList.remove("loading");
    }
  });
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
// Lazy Load Lightbox/Gallery Logic
const menuSection = document.getElementById("menu");
const gallerySection = document.getElementById("gallery");
let galleryScriptLoaded = false;

const loadGalleryScript = () => {
  if (galleryScriptLoaded) return;
  galleryScriptLoaded = true;
  const script = document.createElement("script");
  script.src = "gallery.js";
  script.defer = true;
  document.body.appendChild(script);
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadGalleryScript();
      observer.disconnect();
    }
  });
}, { rootMargin: "200px" });

if (menuSection) sectionObserver.observe(menuSection);
if (gallerySection) sectionObserver.observe(gallerySection);

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

const openMobileMenu = () => {
  mobileMenu.classList.add("active");
  document.body.style.overflow = "hidden";
  mobileToggle.classList.add("active");
};

const closeMobileMenu = () => {
  mobileMenu.classList.remove("active");
  document.body.style.overflow = "";
  mobileToggle.classList.remove("active");
};

mobileToggle.addEventListener("click", () => {
  if (mobileMenu.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

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
    `assets/pizza hero/ezgif-frame-${index.toString().padStart(3, "0")}.webp`;

  const images = [];
  let imageIndex = 0;

  const heroSeqContainer = document.querySelector(".hero-sequence-container");

  // Load first image immediately
  const firstImg = new Image();
  firstImg.src = currentFrame(1);
  images.push(firstImg);

  // Prevent flash by checking if image is already cached
  if (!firstImg.complete && heroSeqContainer) {
    heroSeqContainer.classList.add("hero-loading");
  }

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

  canvas.style.transition = "opacity 0.4s ease-in-out";
  
  const handleFirstImgLoad = () => {
    drawCenteredImage(firstImg);
    if (heroSeqContainer) {
      heroSeqContainer.classList.remove("hero-loading");
    }
  };

  if (firstImg.complete) {
    handleFirstImgLoad();
  } else {
    firstImg.addEventListener("load", handleFirstImgLoad);
    firstImg.addEventListener("error", handleFirstImgLoad);
  }

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
  const heroContent = document.querySelector(".hero-content");
  let ticking = false;
  let isHeroVisible = true;

  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    });
    observer.observe(heroSection);
  }

  const updateAnimation = () => {
    if (!heroSection || !isHeroVisible) {
      ticking = false;
      return;
    }

    const scrollDistance = heroSection.clientHeight - window.innerHeight;
    let scrollProgress = window.scrollY / scrollDistance;

    // Clamp progress
    if (scrollProgress < 0) scrollProgress = 0;
    if (scrollProgress > 1) scrollProgress = 1;

    // Calculate current frame
    const frameIndex = Math.floor(scrollProgress * (frameCount - 1));

    if (imageIndex !== frameIndex) {
      imageIndex = frameIndex;
      if (images[imageIndex] && images[imageIndex].complete) {
        drawCenteredImage(images[imageIndex]);
      }
    }

    // Parallax depth / scale effect
    const scaleValue = 1.05 + scrollProgress * 0.15; // Zooms in smoothly
    canvas.style.transform = `scale3d(${scaleValue}, ${scaleValue}, 1)`;

    // Optional: Slightly fade out content as user scrolls down
    if (heroContent) {
      const contentOpacity = 1 - scrollProgress * 2.5;
      heroContent.style.opacity = Math.max(0, contentOpacity);
      heroContent.style.transform = `translate3d(0, -${scrollProgress * 300}px, 0)`;
    }

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!heroSection) return;

    if (!ticking) {
      window.requestAnimationFrame(updateAnimation);
      ticking = true;
    }
  }, { passive: true });
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

// ----------------------------------------
// Reviews Mobile Swipe Support
// ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const reviewsTrack = document.querySelector(".reviews-track");
  if (!reviewsTrack) return;

  let startX = 0;
  let animStartTime = 0;
  let resumeTimer = null;
  let isSwiping = false;

  const getScrollAnimation = () => {
    // getAnimations() returns all animations applied to the element
    const animations = reviewsTrack.getAnimations();
    return animations.find((a) => a.animationName === "scrollMarquee");
  };

  const handleTouchStart = (e) => {
    // Only handle single touch
    if (e.touches.length !== 1) return;
    
    const anim = getScrollAnimation();
    if (!anim) return;

    isSwiping = true;
    startX = e.touches[0].clientX;
    // Current time could be unready, fallback to 0
    animStartTime = anim.currentTime || 0;

    // Pause auto-slide
    anim.pause();
    
    // Clear any pending resume
    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    const anim = getScrollAnimation();
    if (!anim) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    const marquee = document.querySelector(".reviews-marquee");
    if (!marquee) return;
    
    // Calculate total animation distance (width of one marquee set + gap)
    const gap = parseFloat(window.getComputedStyle(reviewsTrack).gap) || 32;
    const distance = marquee.offsetWidth + gap;

    // 35000ms is the duration from CSS (35s)
    const duration = 35000; 
    
    // Convert pixel delta to time delta.
    // Moving left (negative deltaX) means progressing forward in time.
    const deltaTime = -(deltaX / distance) * duration;

    // Calculate new time with wrapping
    let newTime = (animStartTime + deltaTime) % duration;
    if (newTime < 0) newTime += duration;

    // Apply hardware-accelerated transform via WAAPI currentTime
    anim.currentTime = newTime;
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;

    const anim = getScrollAnimation();
    if (!anim) return;

    // Resume auto-slide after ~1 second
    resumeTimer = setTimeout(() => {
      anim.play();
    }, 1000);
  };

  // Bind native touch events
  reviewsTrack.addEventListener("touchstart", handleTouchStart, { passive: true });
  reviewsTrack.addEventListener("touchmove", handleTouchMove, { passive: true });
  reviewsTrack.addEventListener("touchend", handleTouchEnd, { passive: true });
  reviewsTrack.addEventListener("touchcancel", handleTouchEnd, { passive: true });
});
