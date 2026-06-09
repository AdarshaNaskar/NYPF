// gallery.js - Lightbox and Gallery Logic
(function() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const menuImages = Array.from(document.querySelectorAll(".menu-page-img, .gallery-item img"));
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
    // Add cursor pointer if not already
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (viewFullMenuBtn) {
    viewFullMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(0); // Opens the first menu image
    });
  }

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
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
})();
