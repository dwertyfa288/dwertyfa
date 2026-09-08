"use client";
import { useEffect } from "react";
export default function PortfolioMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      const abort = new AbortController();
      const options = { passive: true, signal: abort.signal };
      let frame = 0;
      const items = [
        ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
      ];
      const process = document.querySelector<HTMLElement>(".process-track");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
      );
      items.forEach((item) => {
        if (
          reduced.matches ||
          item.getBoundingClientRect().top < window.innerHeight
        )
          item.classList.add("revealed");
        else observer.observe(item);
      });
      root.classList.toggle("motion-enabled", !reduced.matches);
      const update = () => {
        frame = 0;
        root.style.setProperty(
          "--reading-progress",
          String(
            window.scrollY /
              Math.max(1, root.scrollHeight - window.innerHeight),
          ),
        );
        root.style.setProperty(
          "--hero-lift",
          reduced.matches ? "0px" : `${window.scrollY * -0.12}px`,
        );
        if (process) {
          const bounds = process.getBoundingClientRect();
          process.style.setProperty(
            "--process-progress",
            String(
              Math.max(
                0,
                Math.min(
                  1,
                  (window.innerHeight * 0.9 - bounds.top) /
                    (window.innerHeight * 0.6),
                ),
              ),
            ),
          );
        }
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      window.addEventListener("scroll", schedule, options);
      window.addEventListener("resize", schedule, options);
      if (fine.matches && !reduced.matches) {
        document
          .querySelectorAll<HTMLElement>("[data-magnetic], [data-tilt]")
          .forEach((element) => {
            element.addEventListener(
              "pointermove",
              (event) => {
                const bounds = element.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                if (element.hasAttribute("data-magnetic")) {
                  element.style.setProperty("--magnet-x", `${x * 12}px`);
                  element.style.setProperty("--magnet-y", `${y * 10}px`);
                } else {
                  element.style.setProperty("--tilt-x", `${-y * 4}deg`);
                  element.style.setProperty("--tilt-y", `${x * 5}deg`);
                  element.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
                  element.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
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
      cleanup = () => {
        abort.abort();
        cancelAnimationFrame(frame);
        observer.disconnect();
        root.classList.remove("motion-enabled");
        document
          .querySelectorAll<HTMLElement>("[data-magnetic], [data-tilt]")
          .forEach((element) =>
            ["--magnet-x", "--magnet-y", "--tilt-x", "--tilt-y"].forEach(
              (property) => element.style.removeProperty(property),
            ),
          );
      };
    };
    setup();
    reduced.addEventListener("change", setup);
    fine.addEventListener("change", setup);
    return () => {
      cleanup();
      reduced.removeEventListener("change", setup);
      fine.removeEventListener("change", setup);
      root.style.removeProperty("--reading-progress");
      root.style.removeProperty("--hero-lift");
    };
  }, []);
  return null;
}
