const GLYPHS = "#%&/<>_=+*01░▒";

export function scrambleTo(element: HTMLElement, text: string, duration = 900) {
  let frameId = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const revealed = Math.floor(progress * text.length);
    let output = text.slice(0, revealed);
    for (let i = revealed; i < text.length; i++) {
      output += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    element.textContent = output;
    if (progress < 1) frameId = requestAnimationFrame(tick);
  };
  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
    element.textContent = text;
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
