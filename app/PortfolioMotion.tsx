"use client";

import { useEffect } from "react";

export default function PortfolioMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let teardown = () => {};

    function setup() {
      teardown();
      const controller = new AbortController();
      const options = { passive: true, signal: controller.signal };
      const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
      const navLinks =
        document.querySelectorAll<HTMLAnchorElement>(".site-nav a");
      const sections = document.querySelectorAll<HTMLElement>(
        "#work, #about, #contact",
      );
      const cursor = document.querySelector<HTMLElement>(".project-cursor");
      const reduced = motionPreference.matches;
      const pointerEnabled = finePointer.matches && !reduced;
      let frame = 0;
      let cursorX = -200;
      let cursorY = -200;
      let targetX = -200;
      let targetY = -200;
      let scrollDirty = true;

      const reveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              reveal.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -30px 0px" },
      );
      items.forEach((item) => {
        if (reduced || item.getBoundingClientRect().top < window.innerHeight)
          item.classList.add("is-visible");
        else reveal.observe(item);
      });
      root.classList.toggle("motion-ready", !reduced);

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
              if (link.hash === `#${entry.target.id}`)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-15% 0px -45% 0px", threshold: 0 },
      );
      sections.forEach((section) => sectionObserver.observe(section));

      const tick = () => {
        frame = 0;
        if (scrollDirty) {
          const range = Math.max(1, root.scrollHeight - window.innerHeight);
          root.style.setProperty(
            "--scroll-progress",
            String(Math.max(0, Math.min(1, window.scrollY / range))),
          );
          if (!reduced) {
            root.style.setProperty(
              "--hero-shift",
              `${Math.min(window.scrollY * 0.17, 150)}px`,
            );
            root.style.setProperty(
              "--hero-opacity",
              String(Math.max(0, 1 - window.scrollY / 1000)),
            );
          }
          if (window.scrollY < 250)
            navLinks.forEach((link) => link.removeAttribute("aria-current"));
          scrollDirty = false;
        }
        if (pointerEnabled && cursor) {
          cursorX += (targetX - cursorX) * 0.22;
          cursorY += (targetY - cursorY) * 0.22;
          cursor.style.setProperty("--cursor-x", `${cursorX}px`);
          cursor.style.setProperty("--cursor-y", `${cursorY}px`);
          if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > 0.4)
            frame = requestAnimationFrame(tick);
        }
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(tick);
      };
      const onScroll = () => {
        scrollDirty = true;
        cursor?.classList.remove("is-active");
        schedule();
      };
      window.addEventListener("scroll", onScroll, options);
      window.addEventListener("resize", onScroll, options);
      window.addEventListener("load", onScroll, options);

      if (pointerEnabled) {
        window.addEventListener(
          "pointermove",
          (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            root.style.setProperty("--pointer-x", `${targetX}px`);
            root.style.setProperty("--pointer-y", `${targetY}px`);
            const target =
              event.target instanceof Element ? event.target : null;
            cursor?.classList.toggle(
              "is-active",
              Boolean(target?.closest("[data-project]")),
            );
            schedule();
          },
          options,
        );
        document.addEventListener(
          "pointerleave",
          () => cursor?.classList.remove("is-active"),
          options,
        );
        window.addEventListener(
          "blur",
          () => cursor?.classList.remove("is-active"),
          options,
        );
        document
          .querySelectorAll<HTMLElement>("[data-magnetic], [data-project]")
          .forEach((element) => {
            element.addEventListener(
              "pointermove",
              (event) => {
                const bounds = element.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                if (element.hasAttribute("data-magnetic")) {
                  element.style.setProperty("--magnet-x", `${x * 14}px`);
                  element.style.setProperty("--magnet-y", `${y * 12}px`);
                } else {
                  element.style.setProperty("--tilt-x", `${-y * 2}deg`);
                  element.style.setProperty("--tilt-y", `${x * 2}deg`);
                }
              },
              options,
            );
            element.addEventListener(
              "pointerleave",
              () => {
                ["--magnet-x", "--magnet-y", "--tilt-x", "--tilt-y"].forEach(
                  (property) => element.style.removeProperty(property),
                );
              },
              options,
            );
          });
      }
      schedule();
      teardown = () => {
        controller.abort();
        cancelAnimationFrame(frame);
        reveal.disconnect();
        sectionObserver.disconnect();
        root.classList.remove("motion-ready");
        cursor?.classList.remove("is-active");
        document
          .querySelectorAll<HTMLElement>("[data-magnetic], [data-project]")
          .forEach((element) => {
            ["--magnet-x", "--magnet-y", "--tilt-x", "--tilt-y"].forEach(
              (property) => element.style.removeProperty(property),
            );
          });
      };
    }
    setup();
    motionPreference.addEventListener("change", setup);
    finePointer.addEventListener("change", setup);
    return () => {
      teardown();
      motionPreference.removeEventListener("change", setup);
      finePointer.removeEventListener("change", setup);
      [
        "--scroll-progress",
        "--hero-shift",
        "--hero-opacity",
        "--pointer-x",
        "--pointer-y",
      ].forEach((property) => root.style.removeProperty(property));
    };
  }, []);
  return null;
}
