export function buildWavePath(width: number, amplitude: number, samples = 220) {
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const phase = (i / samples) * Math.PI * 2;
    const envelope = 0.35 + 0.65 * Math.pow(Math.sin(phase * 2) * 0.5 + 0.5, 2);
    const y =
      (Math.sin(phase * 9) * 0.55 + Math.sin(phase * 23 + 1.3) * 0.3 + Math.sin(phase * 41 + 0.4) * 0.15) *
      envelope *
      amplitude;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join("");
}
