(() => {
  const NAV_ID = "main-nav-bar";
  const HERO_ID = "hero";
  const NAV_OFFSET_PX = 64;

  const nav = document.getElementById(NAV_ID);
  const hero = document.getElementById(HERO_ID);

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }
  if (!nav) return;

  if (!hero) {
    nav.classList.add("is-solid");
    return;
  }

  let solid = false;
  const setSolid = (v) => {
    if (solid === v) return;
    solid = v;
    nav.classList.toggle("is-solid", v);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        setSolid(!entry.isIntersecting);
      },
      {
        threshold: 0.01,

        rootMargin: `-${NAV_OFFSET_PX}px 0px 0px 0px`,
      }
    );
    io.observe(hero);

    window.addEventListener("load", () => {
      const rect = hero.getBoundingClientRect();
      setSolid(rect.bottom <= NAV_OFFSET_PX);
    });
    return;
  }

  let ticking = false;
  const onScrollFallback = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      setSolid(rect.bottom <= NAV_OFFSET_PX);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScrollFallback, { passive: true });
  window.addEventListener("resize", onScrollFallback);
  window.addEventListener("load", onScrollFallback);
  onScrollFallback();
})();
