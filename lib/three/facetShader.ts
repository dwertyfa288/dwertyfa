export const facetVertex = /* glsl */ `
  varying vec3 vViewPosition;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const facetFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uLight;
  uniform float uGlow;
  uniform vec3 uGlowColor;
  varying vec3 vViewPosition;
  void main() {
    vec3 n = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
    vec3 lightDir = normalize(vec3(-0.4, 0.9, 0.6));
    float light = abs(dot(n, lightDir));
    vec3 color = mix(uBase, uLight, light * 0.55);
    color = mix(color, uGlowColor, uGlow * 0.35);
    gl_FragColor = vec4(color, 1.0);
  }
`;
