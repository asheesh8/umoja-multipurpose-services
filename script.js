const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("has-shadow", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const slides = [
  {
    image: "assets/owner-window-cleaning-enhanced.png",
    kicker: "High quality cleaning",
    title: "Services at an affordable price"
  },
  {
    image: "assets/listing-service-car-enhanced.webp",
    kicker: "Local cleaning team",
    title: "Recognizable service across Chittenden County"
  },
  {
    image: "assets/listing-team-member-enhanced.webp",
    kicker: "Your home and office neat and tidy",
    title: "A friendly team ready for the next job"
  },
  {
    image: "https://umojamultipurposecleaningservices.com/wp-content/uploads/2021/03/ialicante-mediterranean-homes-2d4laqalbda-unsplash-5.jpg",
    kicker: "At Umoja, it's all about you",
    title: "Complete peace of mind"
  },
  {
    image: "assets/listing-stair-cleaning-enhanced.webp",
    kicker: "Clean work worth celebrating",
    title: "One rewarding result after another"
  }
];

const slider = document.querySelector("[data-slider]");

if (slider) {
  const image = slider.querySelector("[data-slide-image]");
  const kicker = slider.querySelector("[data-slide-kicker]");
  const title = slider.querySelector("[data-slide-title]");
  const dots = slider.querySelector("[data-slide-dots]");
  const previous = slider.querySelector("[data-slide-prev]");
  const next = slider.querySelector("[data-slide-next]");
  let activeSlide = 0;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];
    if (image) image.src = slide.image;
    if (kicker) kicker.textContent = slide.kicker;
    if (title) title.textContent = slide.title;
    dots?.querySelectorAll(".slider-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeSlide);
      dot.setAttribute("aria-current", dotIndex === activeSlide ? "true" : "false");
    });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Show slide: ${slide.kicker}`);
    dot.addEventListener("click", () => showSlide(index));
    dots?.append(dot);
  });

  previous?.addEventListener("click", () => showSlide(activeSlide - 1));
  next?.addEventListener("click", () => showSlide(activeSlide + 1));
  showSlide(0);
}

const projectCopy = {
  all: {
    title: "All project types",
    copy: "Umoja highlights residential refreshes, commercial spaces, post-construction cleanup, move support, event venues, and green cleaning.",
    image: "assets/listing-service-car-enhanced.webp",
    alt: "Umoja branded cleaning service car"
  },
  apartments: {
    title: "Apartment and construction sites",
    copy: "Cleaning support for newly built, renovated, or high-turnover spaces that need dust, debris, surface, and finishing care.",
    image: "https://i0.wp.com/umojamultipurposecleaningservices.com/wp-content/uploads/2021/04/Post-Construction-Cleaning.jpg?fit=1024%2C500&ssl=1",
    alt: "Post-construction cleaning work area"
  },
  parking: {
    title: "Parkings and malls",
    copy: "Large shared spaces need visible cleanliness, traffic-ready maintenance, and practical cleanup before customers arrive.",
    image: "https://umojamultipurposecleaningservices.com/wp-content/uploads/2021/03/nastuh-abootalebi-rspmla5rita-unsplash-5.jpg",
    alt: "Large clean public interior space"
  },
  office: {
    title: "Office renovation",
    copy: "Commercial cleaning plans can cover lobbies, common areas, floors, restrooms, dusting, trash removal, and post-renovation refreshes.",
    image: "https://umojamultipurposecleaningservices.com/wp-content/uploads/2021/03/ialicante-mediterranean-homes-2d4laqalbda-unsplash-5.jpg",
    alt: "Freshly cleaned office or commercial interior"
  },
  moving: {
    title: "Moving in/out",
    copy: "Move-related cleaning helps a home, apartment, office, or commercial suite feel ready for the next chapter.",
    image: "https://umojamultipurposecleaningservices.com/wp-content/uploads/2021/03/naomi-hebert-mp0bgas_d1c-unsplash-5.jpg",
    alt: "Clean kitchen ready for move-in"
  },
  green: {
    title: "Green cleaning",
    copy: "Environmentally responsible cleaning choices support cleaner air, less pollutant load, and safer routines for homes and workplaces.",
    image: "assets/owner-window-cleaning-enhanced.png",
    alt: "Owner cleaning a window with bright natural light"
  }
};

const projectTabs = document.querySelector("[data-project-tabs]");
const projectPanel = document.querySelector("[data-project-panel]");

if (projectTabs && projectPanel) {
  const title = projectPanel.querySelector("[data-project-title]");
  const copy = projectPanel.querySelector("[data-project-copy]");
  const image = projectPanel.querySelector("[data-project-image]");

  projectTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-tab]");
    if (!button) return;
    const key = button.getAttribute("data-project-tab");
    const content = projectCopy[key] || projectCopy.all;

    projectTabs.querySelectorAll("[data-project-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });

    if (title) title.textContent = content.title;
    if (copy) copy.textContent = content.copy;
    if (image) {
      image.classList.add("is-changing");
      image.src = content.image;
      image.alt = content.alt;
      image.addEventListener(
        "load",
        () => {
          image.classList.remove("is-changing");
        },
        { once: true }
      );
    }
  });
}
