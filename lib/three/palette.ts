import * as THREE from "three";

export const palette = {
  ink: new THREE.Color("#0e0e0d"),
  panel: new THREE.Color("#121211"),
  paper: new THREE.Color("#ecebe5"),
  grey: new THREE.Color("#8d8b85"),
  dim: new THREE.Color("#57554f"),
  signal: new THREE.Color("#ff5b14"),
};

export function damp(current: number, target: number, smoothing: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-smoothing * delta));
}

export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
