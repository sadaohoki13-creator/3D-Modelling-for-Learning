import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import './styles/showcase.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { gsap } from 'gsap';
import {
  createIcons,
  ArrowUpRight,
  MoveUpRight,
  Rotate3d,
  Scan,
  Maximize,
  Mouse,
  Ghost,
  Info,
  Power,
  AudioLines,
  SlidersHorizontal,
  Volume2,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide';
import { createCar } from './scene/vehicle.js';
createIcons({
  icons: {
    ArrowUpRight,
    MoveUpRight,
    Rotate3d,
    Scan,
    Maximize,
    Mouse,
    Ghost,
    Info,
    Power,
    AudioLines,
    SlidersHorizontal,
    Volume2,
    X,
    Sparkles,
    ArrowRight,
  },
});
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
let toastTimer;
function toast(msg) {
  $('#toast').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
}
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = {
  era: 'heritage',
  environment: 'studio',
  ghost: false,
  hotspots: true,
  engine: false,
  throttle: false,
  muted: false,
  rpm: 0,
  silent: false,
};
const container = $('#scene');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.transmissionResolutionScale = 0.5;
container.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label', '3D Taarzan coupe, drag to rotate');
const gl = renderer.getContext();
const debugRenderer = gl.getExtension('WEBGL_debug_renderer_info');
const gpuName = debugRenderer ? gl.getParameter(debugRenderer.UNMASKED_RENDERER_WEBGL) : '';
const lowPower = /swiftshader|llvmpipe|software/i.test(gpuName) || innerWidth < 721;
if (lowPower) {
  renderer.setPixelRatio(1);
  renderer.transmissionResolutionScale = 0.25;
}
const scene = new THREE.Scene();
scene.background = new THREE.Color('#202427');
scene.fog = new THREE.FogExp2('#202427', 0.042);
const camera = new THREE.PerspectiveCamera(
  33,
  container.clientWidth / container.clientHeight,
  0.1,
  100,
);
camera.position.set(-5.8, 2.7, 6.4);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.77, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.02;
controls.minPolarAngle = 0.07;
controls.minDistance = 5.3;
controls.maxDistance = 14;
controls.enablePan = false;
controls.autoRotateSpeed = 0.55;
RectAreaLightUniformsLib.init();
const envScene = new THREE.Scene();
envScene.background = new THREE.Color('#171c25');
for (const [pos, size, power] of [
  [[0, 5, 1], [7, 1.3], 5],
  [[1, 4, -4], [6, 1.2], 4],
  [[-5, 2, 1], [3, 3], 1.5],
  [[2, 2, 5], [5, 2], 1.1],
]) {
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(...size),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffffff').multiplyScalar(power),
      side: THREE.DoubleSide,
    }),
  );
  panel.position.set(...pos);
  panel.lookAt(0, 0.5, 0);
  envScene.add(panel);
}
const pmrem = new THREE.PMREMGenerator(renderer);
const envMap = pmrem.fromScene(envScene, 0.025);
scene.environment = envMap.texture;
scene.environmentIntensity = 1.1;
envScene.traverse((o) => {
  o.geometry?.dispose();
  o.material?.dispose();
});
pmrem.dispose();
const ambient = new THREE.HemisphereLight('#d6e4ff', '#4a4148', 1.15);
scene.add(ambient);
const key = new THREE.DirectionalLight('#fff3e8', 2.5);
key.position.set(-3.5, 7, 4);
key.castShadow = true;
key.shadow.mapSize.set(lowPower ? 512 : 2048, lowPower ? 512 : 2048);
key.shadow.camera.left = -5;
key.shadow.camera.right = 5;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.normalBias = 0.025;
key.shadow.bias = -0.0003;
key.shadow.radius = 4;
scene.add(key);
const rim = new THREE.DirectionalLight('#a3b9ff', 2.4);
rim.position.set(3, 3, -4);
scene.add(rim);
const front = new THREE.DirectionalLight('#e6d4f1', 1.2);
front.position.set(-6, 2, -1);
scene.add(front);
const areaLights = [];
for (const z of [-3, 3]) {
  const a = new THREE.RectAreaLight('#ffffff', 5, 7, 1.4);
  a.position.set(0, 5, z);
  a.lookAt(0, 0, 0);
  scene.add(a);
  areaLights.push(a);
}
const floorMat = new THREE.MeshPhysicalMaterial({
  specularIntensity: 0.08,
  color: '#0b0e11',
  envMapIntensity: 0.12,
  metalness: 0.2,
  roughness: 0.3,
  transparent: true,
  opacity: 0.96,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.025;
floor.receiveShadow = true;
scene.add(floor);
const reflection = new Reflector(new THREE.PlaneGeometry(70, 70), {
  clipBias: 0.003,
  textureWidth: 768,
  textureHeight: 512,
  color: 0x73777c,
});
reflection.rotation.x = -Math.PI / 2;
reflection.position.y = -0.03;
scene.add(reflection);
reflection.visible = !lowPower;
// Soft contact layer grounds the model, supplementing the dynamic shadow.
const shadowCanvas = document.createElement('canvas');
shadowCanvas.width = 256;
shadowCanvas.height = 128;
const sc = shadowCanvas.getContext('2d');
sc.scale(1, 0.5);
const grad = sc.createRadialGradient(128, 128, 12, 128, 128, 128);
grad.addColorStop(0, 'rgba(0,0,0,.75)');
grad.addColorStop(0.55, 'rgba(0,0,0,.42)');
grad.addColorStop(1, 'rgba(0,0,0,0)');
sc.fillStyle = grad;
sc.fillRect(0, 0, 256, 256);
const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(6.4, 3.4),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(shadowCanvas),
    transparent: true,
    depthWrite: false,
  }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -0.009;
scene.add(shadow);
const ring = new THREE.Mesh(
  new THREE.RingGeometry(3.7, 3.707, 160),
  new THREE.MeshBasicMaterial({
    color: '#8b9c9e',
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = -0.008;
scene.add(ring);
const architecture = new THREE.Group();
architecture.visible = false;
scene.add(architecture);
const stone = new THREE.MeshStandardMaterial({ color: '#bcb8ad', roughness: 0.75 });
for (const x of [-9, -6, 6, 9]) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 1.2), stone);
  p.position.set(x, 4, -7);
  p.castShadow = true;
  p.receiveShadow = true;
  architecture.add(p);
}
const backWall = new THREE.Mesh(new THREE.BoxGeometry(35, 14, 0.2), stone);
backWall.position.set(0, 7, -10);
architecture.add(backWall);
const model = createCar();
scene.add(model.car);
if (lowPower) {
  model.glass.transmission = 0;
  model.glass.opacity = 0.87;
  model.glass.color.set('#1a2936');
}
const rainCount = 650,
  rainPositions = new Float32Array(rainCount * 6);
for (let i = 0; i < rainCount; i++) {
  const x = (Math.random() - 0.5) * 20,
    y = Math.random() * 10,
    z = (Math.random() - 0.5) * 20;
  rainPositions.set([x, y, z, x - 0.045, y + 0.28, z], i * 6);
}
const rainGeo = new THREE.BufferGeometry();
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
const rain = new THREE.LineSegments(
  rainGeo,
  new THREE.LineBasicMaterial({
    color: '#b6cddd',
    transparent: true,
    opacity: 0.21,
    depthWrite: false,
  }),
);
rain.visible = false;
scene.add(rain);
const hotspotData = [
  {
    name: 'The unmistakable nose',
    short: 'SCULPTED HOOD',
    position: new THREE.Vector3(-1.87, 1.06, 0.3),
    copy: 'A low, sculpted hood flows into angular projector headlamps and the deep, divided front grille. Reconstructed from the original front-quarter photographs, this is the unmistakable face of the 2004 screen icon.',
  },
  {
    name: 'Form follows attitude',
    short: 'SIGNATURE SIDE PODS',
    position: new THREE.Vector3(0.65, 0.84, 1.13),
    copy: 'The deep side intake and twin satin-silver guide struts are among Taarzan’s most recognizable details. They break up the violet bodywork and draw the eye toward the mid-engine-inspired rear proportions.',
  },
  {
    name: 'A bridge between eras',
    short: 'REAR ENGINE DECK',
    position: new THREE.Vector3(1.96, 1.35, 0.15),
    copy: 'A body-colored bridge spoiler frames the rear engine canopy. The heritage design keeps this integrated silhouette; the imagined 2026 evolution replaces it with an active carbon-fiber aerofoil.',
  },
  {
    name: 'A cockpit, not a cage',
    short: 'BUBBLE CANOPY',
    position: new THREE.Vector3(-0.18, 1.7, -0.1),
    copy: 'The closed, cab-forward cabin has a sweeping windshield and a teardrop rear glass section. In the film, a spirit takes the wheel. Switch on Ghost mode to bring that cinematic idea into the showroom.',
  },
];
const hotspotMeshes = [];
hotspotData.forEach((h, i) => {
  const b = document.createElement('button');
  b.className = 'hotspot';
  b.textContent = '+';
  b.dataset.label = h.short;
  b.setAttribute('aria-label', 'Explore ' + h.short.toLowerCase());
  b.onclick = () => openHotspot(i);
  $('#hotspot-labels').appendChild(b);
  h.element = b;
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 8, 6),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  m.position.copy(h.position);
  model.car.add(m);
  hotspotMeshes.push(m);
});
function openHotspot(i) {
  const h = hotspotData[i];
  $('#detail-number').textContent = `0${i + 1} / DESIGN DNA`;
  $('#detail-title').textContent = h.name;
  $('#detail-copy').textContent = h.copy;
  $('#hotspot-dialog').showModal();
}
const raycaster = new THREE.Raycaster();
let down = new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown', (e) => down.set(e.clientX, e.clientY));
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!state.hotspots || down.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) return;
  const r = renderer.domElement.getBoundingClientRect();
  raycaster.setFromCamera(
    new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    ),
    camera,
  );
  const hits = raycaster.intersectObjects(hotspotMeshes);
  if (hits.length) openHotspot(hotspotMeshes.indexOf(hits[0].object));
});
const cameraPositions = [
  [-5.8, 2.7, 6.4],
  [0.1, 1.95, 8.7],
  [6.6, 2.8, 6.7],
  [-0.3, 8.9, 0.25],
];
let cameraTween = null;
function goCamera(index) {
  controls.autoRotate = false;
  setPressed($('#rotate'), false);
  $$('.camera').forEach((b, i) => b.classList.toggle('active', i === index));
  cameraTween?.kill();
  gsap.killTweensOf(controls.target);
  const p = cameraPositions[index],
    scale = innerWidth < 721 ? 1.55 : 1;
  cameraTween = gsap.to(camera.position, {
    x: p[0] * scale,
    y: p[1] * scale,
    z: p[2] * scale,
    duration: reduceMotion ? 0 : 1.6,
    ease: 'power3.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => (cameraTween = null),
  });
  gsap.to(controls.target, {
    x: 0,
    y: index === 3 ? 0.45 : 0.77,
    z: 0,
    duration: reduceMotion ? 0 : 1.6,
    ease: 'power3.inOut',
  });
}
$$('.camera').forEach((b) => (b.onclick = () => goCamera(+b.dataset.camera)));
controls.addEventListener('start', () => {
  cameraTween?.kill();
  cameraTween = null;
  $$('.camera').forEach((b) => b.classList.remove('active'));
});
function setPressed(el, on) {
  el.classList.toggle('active', on);
  el.setAttribute('aria-pressed', String(on));
}
$('#rotate').onclick = () => {
  controls.autoRotate = !controls.autoRotate;
  setPressed($('#rotate'), controls.autoRotate);
};
$('#hotspots').onclick = () => {
  state.hotspots = !state.hotspots;
  setPressed($('#hotspots'), state.hotspots);
};
$('#fullscreen').onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast('Fullscreen isn’t available in this preview. Open the showroom in a new tab.');
  }
};
function applyEnvironment() {
  const e = state.environment,
    g = state.ghost;
  document.body.classList.toggle('light-mode', e === 'light' && !g);
  architecture.visible = e === 'light' && !g;
  renderer.shadowMap.needsUpdate = true;
  const col = g ? '#111923' : e === 'light' ? '#c8c6bf' : e === 'rain' ? '#131d2b' : '#202427';
  gsap.to(scene.background, { ...new THREE.Color(col), duration: 0.8, overwrite: true });
  scene.fog.color.set(col);
  floorMat.color.set(
    g ? '#1c2631' : e === 'light' ? '#a3a39d' : e === 'rain' ? '#101b27' : '#0b0e11',
  );
  floorMat.roughness = e === 'rain' ? 0.1 : 0.3;
  floorMat.opacity = e === 'rain' ? 0.84 : 0.96;
  rain.visible = e === 'rain' || g;
  gsap.to(key, { intensity: g ? 0.55 : e === 'light' ? 3 : 2.5, duration: 1 });
  gsap.to(ambient, { intensity: g ? 0.55 : e === 'light' ? 2 : 1.15, duration: 1 });
  gsap.to(rim, { intensity: g ? 2.6 : e === 'rain' ? 2.8 : 2.4, duration: 1 });
  gsap.to(front, { intensity: g ? 0.2 : 1.2, duration: 1 });
  scene.environmentIntensity = g ? 0.55 : e === 'light' ? 1.3 : 1.1;
  areaLights.forEach((a) => gsap.to(a, { intensity: g ? 2 : 5, duration: 1 }));
  model.lamps.emissiveIntensity = g ? 14 : state.era === 'vision' ? 3 : 0.55;
  model.lamplights.forEach((l) => gsap.to(l, { intensity: g ? 32 : 0, duration: 1 }));
}
$$('.environment').forEach(
  (b) =>
    (b.onclick = () => {
      state.environment = b.dataset.env;
      $$('.environment').forEach((x) => x.classList.toggle('active', x === b));
      applyEnvironment();
    }),
);
$('#ghost').onclick = () => {
  state.ghost = !state.ghost;
  setPressed($('#ghost'), state.ghost);
  applyEnvironment();
  toast(
    state.ghost
      ? 'Ghost mode engaged. The spirit is at the wheel.'
      : 'The spirit rests. Studio lighting restored.',
  );
};
function setEra(era) {
  renderer.shadowMap.needsUpdate = true;
  state.era = era;
  const v = era === 'vision';
  model.setVision(v);
  $$('[data-era]').forEach((b) => b.classList.toggle('active', b.dataset.era === era));
  $('#era-eyebrow').textContent = v
    ? 'THE FUTURE HAS A FAMILIAR SOUL.'
    : 'AN INDIAN ICON. AN UNDYING SPIRIT.';
  $('#headline').innerHTML = v
    ? 'Same spirit.<br><em>New instinct.</em>'
    : 'A legend.<br><em>Reawakened.</em>';
  $('#intro-copy').textContent = v
    ? 'An electric future. An unmistakable legacy.'
    : 'Not just a car. A feeling that never left.';
  $('.edition-label').textContent = v ? 'THE VISION COLLECTION' : 'THE HERITAGE COLLECTION';
  $('#edition-year').innerHTML = v ? '2026<span> / VISION</span>' : '2004<span> / 2026</span>';
  $('#edition-caption').textContent = v
    ? 'FICTIONAL HYBRID · FUTURE DESIGN STUDY'
    : 'DC DESIGN · REIMAGINED IN 3D';
  $('#vehicle-label').textContent = v ? '2026 · VISION REBORN' : '2004 · THE ORIGINAL';
  $('#vehicle-title').textContent = v ? 'Taarzan Hybrid' : 'DC Taarzan';
  $('#engine-label').innerHTML = v
    ? 'TURBO HYBRID <span class="bullet">/</span> TORQUE-VECTORING AWD'
    : '2.0L TURBO INLINE-4 <span class="bullet">/</span> REAR-WHEEL DRIVE';
  $('#power').innerHTML = v ? '960<span>BHP*</span>' : '400<span>BHP</span>';
  $('#torque').innerHTML = v ? '2.15<span>SEC*</span>' : '500<span>Nm</span>';
  $('#torque-label').textContent = v ? '0–100 KM/H TARGET' : 'PEAK TORQUE';
  if (!v && state.silent) {
    state.silent = false;
    $('#ignition span').textContent = 'Start ignition';
  }
  applyEnvironment();
  goCamera(0);
}
$$('[data-era]').forEach((b) => (b.onclick = () => setEra(b.dataset.era)));
// The supplied original recording, not a synthesized engine. User gesture required.
const engine = new Audio();
engine.src = engine.canPlayType('audio/ogg; codecs="vorbis"')
  ? '/audio/engine-compatible.ogg'
  : '/audio/engine-source.m4a';
engine.loop = true;
engine.preload = 'auto';
engine.preservesPitch = false;
engine.volume = 0.2;
let audioContext = null,
  engineGain = null;
async function startEngine() {
  if (state.engine) return true;
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(engine);
      engineGain = audioContext.createGain();
      engineGain.gain.value = 1;
      source.connect(engineGain);
      engineGain.connect(audioContext.destination);
    }
    await audioContext.resume();
    await engine.play();
    state.engine = true;
    state.silent = false;
    $('#ignition').classList.add('running');
    $('#ignition span').textContent = 'Stop ignition';
    $('#engine-dot').style.background = 'var(--lime)';
    return true;
  } catch (err) {
    toast('Audio could not start. Click Start ignition to retry.');
    console.warn('Engine playback:', err);
    return false;
  }
}
function stopEngine() {
  state.engine = false;
  state.throttle = false;
  engine.pause();
  $('#rev').classList.remove('pressed');
  $('#ignition').classList.remove('running');
  $('#ignition span').textContent = 'Start ignition';
  $('#engine-dot').style.background = '';
}
$('#ignition').onclick = () => {
  if (state.engine) stopEngine();
  else startEngine();
};
let throttleToken = 0;
async function throttleOn() {
  const token = ++throttleToken;
  if (state.silent) {
    toast('Silent stalking is active. Start ignition to wake the engine.');
    return;
  }
  state.throttle = true;
  $('#rev').classList.add('pressed');
  if (!state.engine) {
    await startEngine();
    if (token !== throttleToken || !state.engine) {
      state.throttle = false;
      $('#rev').classList.remove('pressed');
    }
  }
}
function throttleOff() {
  throttleToken++;
  state.throttle = false;
  $('#rev').classList.remove('pressed');
}
$('#rev').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  $('#rev').setPointerCapture(e.pointerId);
  throttleOn();
});
$('#rev').addEventListener('pointerup', throttleOff);
$('#rev').addEventListener('pointercancel', throttleOff);
$('#rev').addEventListener('lostpointercapture', throttleOff);
window.addEventListener('blur', throttleOff);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    throttleOff();
    if (state.engine) stopEngine();
  }
});
window.addEventListener('keydown', (e) => {
  if (
    e.code === 'Space' &&
    !e.repeat &&
    !document.querySelector('dialog[open]') &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) &&
    !e.target.isContentEditable
  ) {
    e.preventDefault();
    throttleOn();
  }
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    throttleOff();
  }
});
$('#mute').onclick = () => {
  state.muted = !state.muted;
  engine.muted = state.muted;
  $('#mute').textContent = state.muted ? 'SOUND OFF' : 'SOUND ON';
  $('#mute').setAttribute('aria-label', state.muted ? 'Unmute engine sound' : 'Mute engine sound');
};
const bars = [];
for (let i = 0; i < 36; i++) {
  const b = document.createElement('i');
  if (i > 29) b.className = 'red';
  $('#tach-bars').appendChild(b);
  bars.push(b);
}
$$('dialog .close').forEach((b) => (b.onclick = () => b.closest('dialog').close()));
$$('dialog').forEach((d) => {
  d.addEventListener('click', (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        d.close();
    }
  });
  d.addEventListener('close', () => {
    const v = d.querySelector('video');
    v?.pause();
  });
});
$('#specs-open').onclick = () => {
  throttleOff();
  $('#specs-dialog').showModal();
};
$('#story-open').onclick = () => {
  throttleOff();
  $('#story-dialog').showModal();
};
$('#silent').onclick = () => {
  stopEngine();
  setEra('vision');
  state.silent = true;
  $('#specs-dialog').close();
  $('#ignition span').textContent = 'Wake combustion';
  toast('Silent stalking engaged. Pure electric. No engine sound.');
};
$('.brand').onclick = (e) => {
  e.preventDefault();
  setEra('heritage');
};
let mobileCamera = false;
function resize() {
  const w = container.clientWidth,
    h = container.clientHeight;
  const mobile = w < 721;
  if (mobile !== mobileCamera) {
    camera.position
      .sub(controls.target)
      .multiplyScalar(mobile ? 1.55 : 1 / 1.55)
      .add(controls.target);
    mobileCamera = mobile;
  }
  controls.maxDistance = mobile ? 19 : 14;
  camera.aspect = w / h;
  camera.setViewOffset(w, h, w * (w < 721 ? 0 : 0.065), -h * (w < 721 ? 0.03 : 0.025), w, h);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', resize);
resize();
const clock = new THREE.Clock();
let first = true;
let uiTick = 0;
const projected = new THREE.Vector3(),
  world = new THREE.Vector3();
let lastRender = 0;
function animate(now = 0) {
  requestAnimationFrame(animate);
  if (now - lastRender < 32 || window.__pauseRender) return;
  lastRender = now;
  const dt = Math.min(clock.getDelta(), 0.5),
    t = clock.elapsedTime;
  const target = state.engine ? (state.throttle ? 8200 : 900) : 0;
  state.rpm = THREE.MathUtils.damp(state.rpm, target, state.throttle ? 1.7 : 2.5, dt);
  const rev = Math.max(0, (state.rpm - 900) / 7300);
  if (state.engine) {
    engine.playbackRate = 0.8 + rev * 1.6;
    engine.volume = THREE.MathUtils.clamp(0.22 + rev * 0.68, 0, 1);
  }
  if (!reduceMotion) {
    model.car.position.y = state.engine ? Math.sin(t * 48) * (0.0006 + rev * 0.003) : 0;
    model.car.rotation.x = state.engine ? Math.sin(t * 39) * rev * 0.0008 : 0;
    model.steering.rotation.z = state.ghost ? Math.sin(t * 0.8) * 0.55 : 0;
    model.activeWing.rotation.z = state.era === 'vision' ? rev * 0.22 : 0;
  }
  controls.update();
  if (!reduceMotion && rev > 0.05) {
    camera.position.y += Math.sin(t * 51) * rev * 0.00065;
  }
  if (rain.visible && !reduceMotion) {
    const a = rainGeo.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      const k = i * 6;
      a[k + 1] -= dt * 8;
      a[k + 4] -= dt * 8;
      if (a[k + 1] < 0) {
        a[k + 1] = 10;
        a[k + 4] = 10.28;
      }
    }
    rainGeo.attributes.position.needsUpdate = true;
  }
  model.car.updateMatrixWorld();
  camera.updateMatrixWorld();
  hotspotData.forEach((h, i) => {
    world.copy(h.position).applyMatrix4(model.car.matrixWorld);
    projected.copy(world).project(camera);
    const behind = projected.z > 1 || projected.z < -1;
    const sideHidden = i === 1 && camera.position.z < 0;
    h.element.classList.toggle('hidden', !state.hotspots || behind || sideHidden);
    h.element.style.left = `${(projected.x * 0.5 + 0.5) * container.clientWidth}px`;
    h.element.style.top = `${(-projected.y * 0.5 + 0.5) * container.clientHeight}px`;
  });
  uiTick += dt;
  if (uiTick > 0.065) {
    uiTick = 0;
    $('#rpm').textContent = Math.round(state.rpm / 10) * 10;
    $('#engine-status').textContent = state.silent
      ? 'SILENT STALKING'
      : !state.engine
        ? 'ENGINE OFF'
        : state.throttle
          ? 'THROTTLE OPEN'
          : 'ENGINE IDLING';
    bars.forEach((b, i) => b.classList.toggle('on', i < (state.rpm / 8200) * 36));
  }
  renderer.render(scene, camera);
  renderer.shadowMap.autoUpdate = false;
  if (first) {
    first = false;
    $('#loading').style.opacity = 0;
    setTimeout(() => $('#loading').remove(), 750);
    window.__showroomReady = true;
  }
}
animate();
// Expose read-only diagnostics for smoke tests, not application controls.
window.__showroomDiagnostics = () => ({
  ready: !first,
  era: state.era,
  environment: state.environment,
  ghost: state.ghost,
  engine: state.engine,
  rpm: Math.round(state.rpm),
  audioReady: engine.readyState,
  audioSource: engine.currentSrc,
  triangles: renderer.info.render.triangles,
  drawCalls: renderer.info.render.calls,
  lowPower,
  gpuName,
  cameraTransition: !!cameraTween,
});
