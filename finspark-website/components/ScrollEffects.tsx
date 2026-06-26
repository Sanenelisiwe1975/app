"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const backToTop = document.getElementById("backToTop");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const sections = document.querySelectorAll<HTMLElement>("main section[id], .hero[id]");

    if (!header || !hamburger || !mobileMenu || !backToTop) return;

    function onScroll() {
      const scrolled = window.scrollY > 40;
      header!.classList.toggle("scrolled", scrolled);
      backToTop!.classList.toggle("show", window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function closeMobileMenu() {
      hamburger!.classList.remove("active");
      mobileMenu!.classList.remove("open");
      hamburger!.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function onHamburgerClick() {
      const isOpen = mobileMenu!.classList.toggle("open");
      hamburger!.classList.toggle("active", isOpen);
      hamburger!.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    hamburger.addEventListener("click", onHamburgerClick);

    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

    function onBackToTopClick() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    backToTop.addEventListener("click", onBackToTopClick);

    let spyObserver: IntersectionObserver | undefined;
    let revealObserver: IntersectionObserver | undefined;
    let counterObserver: IntersectionObserver | undefined;

    if ("IntersectionObserver" in window) {
      spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
              });
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((sec) => spyObserver!.observe(sec));

      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll(".reveal").forEach((el) => revealObserver!.observe(el));

      counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.count || "0", 10) || 0;
            const suffix = el.dataset.suffix || "";
            const duration = 1400;
            let start: number | null = null;

            function tick(ts: number) {
              if (start === null) start = ts;
              const progress = Math.min((ts - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = target + suffix;
              }
            }
            requestAnimationFrame(tick);
            obs.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll(".stat-num").forEach((el) => counterObserver!.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      document.querySelectorAll<HTMLElement>(".stat-num").forEach((el) => {
        el.textContent = (el.dataset.count || "0") + (el.dataset.suffix || "");
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      hamburger.removeEventListener("click", onHamburgerClick);
      mobileLinks.forEach((link) => link.removeEventListener("click", closeMobileMenu));
      backToTop.removeEventListener("click", onBackToTopClick);
      spyObserver?.disconnect();
      revealObserver?.disconnect();
      counterObserver?.disconnect();
    };
  }, []);

  return null;
}
