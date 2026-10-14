import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function createCar() {
  const car = new THREE.Group();
  const paint = new THREE.MeshPhysicalMaterial({
    color: '#3E0A48',
    envMapIntensity: 0.85,
    metalness: 0.7,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    iridescence: 0.1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [100, 320],
    sheen: 0.15,
    sheenColor: new THREE.Color('#ad418c'),
    sheenRoughness: 0.3,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#657a87',
    metalness: 0.12,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.52,
    thickness: 0.16,
    transparent: true,
    opacity: 1,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: '#122029',
    side: THREE.DoubleSide,
    metalness: 0.6,
    roughness: 0.09,
    clearcoat: 1,
  });
  const carbonCanvas = document.createElement('canvas');
  carbonCanvas.width = carbonCanvas.height = 64;
  const cc = carbonCanvas.getContext('2d');
  cc.fillStyle = '#15191b';
  cc.fillRect(0, 0, 64, 64);
  for (let x = 0; x < 8; x++)
    for (let y = 0; y < 8; y++) {
      cc.fillStyle = (x + y) % 2 ? '#262b2e' : '#101517';
      cc.fillRect(x * 8, y * 8, 7, 7);
      cc.fillStyle = '#303537';
      cc.fillRect(x * 8, y * 8, 1, 6);
    }
  const carbonTex = new THREE.CanvasTexture(carbonCanvas);
  carbonTex.wrapS = carbonTex.wrapT = THREE.RepeatWrapping;
  carbonTex.repeat.set(5, 5);
  carbonTex.colorSpace = THREE.SRGBColorSpace;
  const carbon = new THREE.MeshPhysicalMaterial({
    color: '#45494a',
    map: carbonTex,
    metalness: 0.45,
    roughness: 0.38,
    clearcoat: 0.6,
  });
  const black = new THREE.MeshStandardMaterial({
    color: '#070a0c',
    roughness: 0.65,
    metalness: 0.1,
  });
  const silver = new THREE.MeshStandardMaterial({
    color: '#b6bdc3',
    metalness: 0.88,
    roughness: 0.23,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: '#111316',
    roughness: 0.86,
    metalness: 0.02,
  });
  const brake = new THREE.MeshStandardMaterial({
    color: '#676a69',
    metalness: 0.9,
    roughness: 0.45,
  });
  const lamps = new THREE.MeshStandardMaterial({
    color: '#d1f6ff',
    emissive: '#c3f2ff',
    emissiveIntensity: 0.55,
    metalness: 0.3,
    roughness: 0.12,
  });
  const tail = new THREE.MeshStandardMaterial({
    color: '#b11330',
    emissive: '#ff1238',
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });
  const vision = new THREE.Group();
  vision.visible = false;
  car.add(vision);
  const heritage = new THREE.Group();
  car.add(heritage);
  function mesh(g, m, pos, parent = car) {
    const o = new THREE.Mesh(g, m);
    if (pos) o.position.copy(V(...pos));
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  function box(size, pos, mat = paint, r = 0.03, parent = car) {
    return mesh(new RoundedBoxGeometry(...size, 1, r), mat, pos, parent);
  }
  function tube(points, r, mat = paint, parent = car) {
    return mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => V(...p))),
        Math.max(24, points.length * 10),
        r,
        8,
        false,
      ),
      mat,
      null,
      parent,
    );
  }
  function surface(n, m, fn, mat, parent = car) {
    const pos = [],
      uv = [],
      ix = [];
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= m; j++) {
        pos.push(...fn(i / n, j / m));
        uv.push(i / n, j / m);
      }
    for (let i = 0; i < n; i++)
      for (let j = 0; j < m; j++) {
        const a = i * (m + 1) + j,
          b = a + m + 1;
        ix.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(ix);
    g.computeVertexNormals();
    const o = mesh(g, mat, null, parent);
    o.material.side = THREE.DoubleSide;
    return o;
  }
  const curve = new THREE.CatmullRomCurve3([
    V(-2.42, 0.78, 0.71),
    V(-2.22, 0.99, 0.81),
    V(-1.6, 1.055, 0.96),
    V(-0.9, 0.96, 0.95),
    V(0, 0.96, 0.99),
    V(0.75, 1.06, 1.07),
    V(1.5, 1.1, 1.04),
    V(2.15, 1.015, 0.99),
    V(2.37, 0.88, 0.85),
  ]);
  const sample = [];
  for (let i = 0; i <= 220; i++) sample.push(curve.getPoint(i / 220));
  function section(x) {
    let i = 0;
    while (i < sample.length - 2 && sample[i + 1].x < x) i++;
    const a = sample[i],
      b = sample[i + 1];
    return a.clone().lerp(b, THREE.MathUtils.clamp((x - a.x) / (b.x - a.x), 0, 1));
  }
  const wheelX = [-1.5, 1.48],
    wy = 0.52,
    wr = 0.525;
  function arch(x) {
    let y = 0.32;
    for (const wx of wheelX) {
      const d = Math.abs(x - wx);
      if (d < 0.59) y = Math.max(y, wy + Math.sqrt(0.59 * 0.59 - d * d));
    }
    return y;
  }
  // Continuous sculpted upper shell, with true wheel-arch openings at the sides.
  surface(
    180,
    60,
    (u, v) => {
      const x = -2.42 + u * 4.79,
        p = section(x),
        q = v * 2 - 1,
        a = Math.abs(q);
      const shoulder = Math.max(p.z - 0.07, arch(x) + 0.035);
      const y = p.z + (shoulder - p.z) * Math.pow(a, 2.8) - 0.05 * Math.pow(a, 14);
      return [x, y, q * p.y];
    },
    paint,
  );
  for (const s of [-1, 1]) {
    surface(
      180,
      12,
      (u, v) => {
        const x = -2.42 + u * 4.79,
          p = section(x);
        const top = Math.max(p.z - 0.07, arch(x) + 0.035) - 0.05,
          bottom = arch(x);
        return [
          x,
          THREE.MathUtils.lerp(top, bottom, v),
          s * p.y * (1 - 0.045 * Math.sin((v * Math.PI) / 2)),
        ];
      },
      paint,
    );
    // Thin painted lip follows the tire opening without enclosing the wheel.
    for (const wx of wheelX) {
      const ps = [];
      for (let i = 0; i <= 45; i++) {
        const a = (Math.PI * i) / 45;
        const x = wx + Math.cos(a) * 0.589;
        ps.push([x, wy + Math.sin(a) * 0.589 + 0.005, s * section(x).y]);
      }
      tube(ps, 0.019, paint);
    }
    // Rocker panel, rising wedge-shaped intake recess and signature satin guide struts.
    box([1.69, 0.12, 0.13], [0, 0.3, s * 0.947], paint, 0.035);
    surface(
      24,
      14,
      (u, v) => {
        const x = 0.35 + u * 0.79;
        return [x, 0.39 + v * 0.59, s * (0.988 + 0.027 * Math.sin(u * Math.PI))];
      },
      black,
    );
    const pod = box([0.17, 0.66, 0.2], [0.93, 0.69, s * 1.012], paint, 0.05);
    pod.rotation.z = -0.28;
    for (const yy of [0.4, 0.97])
      tube(
        [
          [0.18, yy, s * 1.014],
          [0.34, yy + 0.008, s * 1.1],
          [0.72, yy + 0.014, s * 1.115],
          [1.05, yy + 0.025, s * 1.065],
        ],
        0.043,
        silver,
        heritage,
      );
    tube(
      [
        [0.25, 0.38, s * 1.03],
        [0.79, 0.44, s * 1.075],
        [1.07, 1.0, s * 1.08],
      ],
      0.034,
      carbon,
      vision,
    );
    // Door shut line and discreet handle.
    tube(
      [
        [-0.92, 0.95, s * 0.953],
        [-0.82, 0.64, s * 0.968],
        [-0.7, 0.38, s * 0.939],
        [0.15, 0.37, s * 0.96],
        [0.37, 0.52, s * 0.995],
        [0.5, 0.96, s * 0.991],
      ],
      0.006,
      black,
    );
    box([0.15, 0.025, 0.024], [0.18, 1.015, s * 0.969], silver, 0.01);
    // Aerodynamic mirrors with reflective glass faces.
    tube(
      [
        [-0.89, 1.05, s * 0.84],
        [-0.83, 1.15, s * 1.03],
      ],
      0.025,
      black,
    );
    const mirror = mesh(new THREE.SphereGeometry(1, 28, 16), paint, [-0.81, 1.17, s * 1.09]);
    mirror.scale.set(0.16, 0.076, 0.115);
    const mirrorGlass = mesh(new THREE.SphereGeometry(1, 20, 12), silver, [-0.72, 1.17, s * 1.09]);
    mirrorGlass.scale.set(0.025, 0.052, 0.087);
    // Carbon sill and vision canards.
    box([1.62, 0.055, 0.16], [0, 0.235, s * 0.96], carbon, 0.012);
    const canard = box([0.45, 0.033, 0.19], [-2.01, 0.39, s * 0.97], carbon, 0.008, vision);
    canard.rotation.z = -0.12;
  }
  // Closed teardrop canopy. Its perimeter seals against the painted beltline.
  function canopy(u, v, raise = 0) {
    const x = -1.27 + u * 2.78;
    const q = v * 2 - 1;
    const h = Math.pow(Math.sin(Math.PI * u), 0.79);
    const w = 0.67 + 0.1 * Math.sin(Math.PI * u) - 0.29 * Math.pow(u, 4);
    return [x, 1.005 + 0.625 * h * Math.pow(Math.max(0, 1 - q * q), 0.45) + raise, q * w];
  }
  surface(70, 44, (u, v) => canopy(u, v), glass);
  // Upholstered cabin ensures glass never reads as an open cockpit.
  box([1.52, 0.12, 1.23], [-0.08, 0.91, 0], black, 0.04);
  for (const s of [-1, 1]) {
    const seat = box([0.43, 0.58, 0.38], [0.32, 1.06, s * 0.35], black, 0.09);
    seat.rotation.z = -0.15;
    box([0.44, 0.12, 0.39], [0.05, 0.94, s * 0.35], black, 0.045);
    box([0.16, 0.19, 0.25], [0.45, 1.37, s * 0.35], black, 0.06);
  }
  box([0.32, 0.19, 1.16], [-0.83, 1.035, 0], black, 0.055);
  // Violet roof cap, swept A-pillars and B-pillars.
  surface(26, 28, (u, v) => canopy(0.34 + u * 0.24, 0.09 + v * 0.82, 0.013), paint);
  for (const s of [-1, 1]) {
    const edge = [];
    for (let i = 0; i <= 45; i++) edge.push(canopy(i / 45, s === 1 ? 1 : 0, 0.008));
    tube(edge, 0.025, paint);
    const a = [];
    for (let i = 0; i <= 25; i++)
      a.push(
        canopy(
          0.07 + (0.28 * i) / 25,
          s === 1 ? 0.94 - (0.18 * i) / 25 : 0.06 + (0.18 * i) / 25,
          0.016,
        ),
      );
    tube(a, 0.033, paint);
    const b = [];
    for (let i = 0; i <= 25; i++)
      b.push(
        canopy(
          0.6 + (0.09 * i) / 25,
          s === 1 ? 0.78 + (0.22 * i) / 25 : 0.22 - (0.22 * i) / 25,
          0.015,
        ),
      );
    tube(b, 0.038, paint);
    const rear = [];
    for (let i = 0; i <= 30; i++)
      rear.push(
        canopy(
          0.59 + (0.36 * i) / 30,
          s === 1 ? 0.86 + (0.12 * i) / 30 : 0.14 - (0.12 * i) / 30,
          0.015,
        ),
      );
    tube(rear, 0.038, paint);
  }
  const windBottom = [];
  for (let j = 0; j <= 32; j++) windBottom.push(canopy(0.035, j / 32, 0.01));
  tube(windBottom, 0.022, paint);
  const steering = new THREE.Group();
  steering.position.set(-0.67, 1.12, 0.36);
  steering.rotation.y = Math.PI / 2;
  steering.rotation.x = 0.25;
  car.add(steering);
  mesh(new THREE.TorusGeometry(0.14, 0.018, 10, 40), black, null, steering);
  for (let i = 0; i < 3; i++) {
    const spoke = box([0.018, 0.13, 0.018], [0, 0.06, 0], silver, 0.005, steering);
    spoke.rotation.z = (i * Math.PI * 2) / 3;
    spoke.position.set(
      -Math.sin((i * Math.PI * 2) / 3) * 0.065,
      Math.cos((i * Math.PI * 2) / 3) * 0.065,
      0,
    );
  }
  mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20), black, [0, 0, 0], steering).rotation.x =
    Math.PI / 2;
  // Hood creases travel from headlamp to A-pillar.
  for (const s of [-1, 1]) {
    tube(
      [
        [-2.24, 0.823, s * 0.62],
        [-1.98, 0.91, s * 0.58],
        [-1.6, 0.975, s * 0.53],
        [-1.25, 1.018, s * 0.49],
      ],
      0.006,
      black,
    );
  }
  // Sculpted front fascia, multiple deep black air channels and floating slats.
  box([0.15, 0.23, 1.76], [-2.31, 0.38, 0], paint, 0.065);
  box([0.12, 0.22, 0.93], [-2.4, 0.56, 0], black, 0.035);
  for (const s of [-1, 1]) {
    const vent = box([0.12, 0.26, 0.4], [-2.3, 0.53, s * 0.68], black, 0.045);
    vent.rotation.y = s * 0.11;
    for (let i = 0; i < 3; i++)
      box([0.13, 0.026, 0.38], [-2.375, 0.43 + i * 0.09, s * 0.68], carbon, 0.008);
    const blade = box([0.15, 0.41, 0.045], [-2.39, 0.51, s * 0.49], paint, 0.015);
    blade.rotation.x = s * -0.25;
  }
  box([0.1, 0.31, 0.045], [-2.47, 0.51, 0], paint, 0.008);
  for (let y of [0.45, 0.56, 0.66]) box([0.095, 0.021, 0.87], [-2.455, y, 0], carbon, 0.005);
  box([0.23, 0.042, 1.91], [-2.3, 0.257, 0], carbon, 0.015);
  // Swept triangular headlamp housings, with projectors in the original and matrix strips in the concept.
  for (const s of [-1, 1]) {
    const pts = [
      [-2.385, 0.746, s * 0.51],
      [-2.215, 0.88, s * 0.83],
      [-1.97, 0.956, s * 0.971],
      [-2.25, 0.747, s * 0.96],
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    mesh(g, darkGlass);
    tube([...pts, pts[0]], 0.009, silver);
    for (const z of [0.69, 0.84]) {
      const o = mesh(
        new THREE.CylinderGeometry(0.063, 0.063, 0.025, 24),
        silver,
        [-2.26, 0.801, s * z],
        heritage,
      );
      o.rotation.z = Math.PI / 2;
      const lens = mesh(
        new THREE.SphereGeometry(0.043, 20, 12),
        lamps,
        [-2.28, 0.811, s * z],
        heritage,
      );
      lens.scale.set(0.4, 1, 1);
    }
    tube(
      [
        [-2.4, 0.745, s * 0.55],
        [-2.31, 0.76, s * 0.77],
        [-2.23, 0.8, s * 0.95],
      ],
      0.012,
      lamps,
      vision,
    );
    const light = new THREE.SpotLight('#c3e7ff', 0, 9, 0.36, 0.7, 1.8);
    light.position.set(-2.27, 0.78, s * 0.78);
    light.target.position.set(-8, 0.05, s * 0.9);
    car.add(light, light.target);
    lamplights.push(light);
  }
  // Rear bridge: body-colored aerofoil with integral buttresses, never a tube cage.
  for (const s of [-1, 1]) {
    const support = box([0.3, 0.35, 0.15], [1.98, 1.085, s * 0.91], paint, 0.05, heritage);
    support.rotation.z = -0.2;
  }
  const bridge = mesh(new THREE.SphereGeometry(1, 56, 24), paint, [2.02, 1.26, 0], heritage);
  bridge.scale.set(0.33, 0.075, 1.01);
  for (const s of [-1, 1]) {
    box([0.1, 0.45, 0.055], [1.97, 1.22, s * 0.64], carbon, 0.01, vision);
    box([0.4, 0.17, 0.035], [2.05, 1.46, s * 1.15], carbon, 0.008, vision);
  }
  const activeWing = box([0.5, 0.055, 2.34], [2.02, 1.46, 0], carbon, 0.018, vision);
  // Engine-deck louvres and rear light signatures.
  for (let i = 0; i < 6; i++) box([0.035, 0.024, 1.12], [1.45 + i * 0.073, 1.056, 0], black, 0.006);
  box([0.12, 0.28, 1.75], [2.31, 0.55, 0], black, 0.045);
  for (const s of [-1, 1]) {
    box([0.13, 0.1, 0.55], [2.31, 0.9, s * 0.65], darkGlass, 0.025);
    for (let i = 0; i < 2; i++)
      box([0.14, 0.023, 0.48], [2.385, 0.885 + i * 0.05, s * 0.64], tail, 0.006);
    for (let i = 0; i < 3; i++)
      box([0.07, 0.021, 0.58], [2.38, 0.46 + i * 0.085, s * 0.55], carbon, 0.008);
    const e = box([0.25, 0.12, 0.3], [2.34, 0.27, s * 0.63], silver, 0.015);
    box([0.255, 0.078, 0.25], [2.36, 0.274, s * 0.63], black, 0.008);
  }
  box([0.28, 0.06, 1.77], [2.2, 0.255, 0], carbon, 0.01);
  for (let z = -0.78; z <= 0.8; z += 0.26) {
    box([0.45, 0.15, 0.025], [2.17, 0.265, z], carbon, 0.006, vision);
  }
  // Registration, typography and front badge.
  function label(text, w, h, bg, fg) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ct = c.getContext('2d');
    ct.fillStyle = bg;
    ct.fillRect(0, 0, 512, 128);
    ct.fillStyle = fg;
    ct.font = 'bold 62px Arial';
    ct.textAlign = 'center';
    ct.textBaseline = 'middle';
    ct.fillText(text, 256, 67);
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: tx });
  }
  const plate = mesh(
    new THREE.PlaneGeometry(0.53, 0.13),
    label('MH 01 M 37', 512, 128, '#e5e6da', '#151b1e'),
    [-2.49, 0.345, 0],
  );
  plate.rotation.y = -Math.PI / 2;
  const rearplate = mesh(
    new THREE.PlaneGeometry(0.53, 0.13),
    label('MH 01 M 37', 512, 128, '#e5e6da', '#151b1e'),
    [2.395, 0.69, 0],
  );
  rearplate.rotation.y = Math.PI / 2;
  const badge = mesh(
    new THREE.PlaneGeometry(0.12, 0.052),
    label('DC', 512, 128, '#9daeb6', '#17202d'),
    [-2.1, 0.881, 0],
  );
  badge.rotation.x = -Math.PI / 2;
  badge.rotation.z = -Math.PI / 2;
  // Four detailed wheels: rounded tires, milled multispoke rims, ventilated rotors and calipers.
  for (const x of wheelX)
    for (const s of [-1, 1]) {
      const wheel = new THREE.Group();
      wheel.position.set(x, wy, s * 1.015);
      car.add(wheel);
      const tire = mesh(new THREE.TorusGeometry(0.416, 0.111, 20, 72), rubber, null, wheel);
      tire.scale.z = 1.65;
      for (const offset of [-0.078, 0.078]) {
        const t = mesh(new THREE.TorusGeometry(0.49, 0.008, 6, 64), rubber, [0, 0, offset], wheel);
      }
      const barrel = mesh(
        new THREE.CylinderGeometry(0.358, 0.358, 0.25, 56, 1, true),
        silver,
        null,
        wheel,
      );
      barrel.rotation.x = Math.PI / 2;
      const rim = mesh(
        new THREE.TorusGeometry(0.351, 0.021, 10, 64),
        silver,
        [0, 0, s * 0.146],
        wheel,
      );
      const rotor = mesh(
        new THREE.CylinderGeometry(0.293, 0.293, 0.025, 56),
        brake,
        [0, 0, s * 0.08],
        wheel,
      );
      rotor.rotation.x = Math.PI / 2;
      const hub = mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.1, 24),
        silver,
        [0, 0, s * 0.16],
        wheel,
      );
      hub.rotation.x = Math.PI / 2;
      mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.106, 20),
        black,
        [0, 0, s * 0.165],
        wheel,
      ).rotation.x = Math.PI / 2;
      const caliper = box(
        [0.09, 0.22, 0.065],
        [-0.23, 0, s * 0.112],
        new THREE.MeshStandardMaterial({ color: '#c1ba80', metalness: 0.6, roughness: 0.38 }),
        0.023,
        wheel,
      );
      for (let k = 0; k < 12; k++) {
        const a = (k * Math.PI) / 6;
        const spoke = box(
          [0.033, 0.265, 0.039],
          [Math.sin(a) * 0.213, Math.cos(a) * 0.213, s * 0.157],
          silver,
          0.009,
          wheel,
        );
        spoke.rotation.z = -a + 0.12;
      }
      for (let k = 0; k < 5; k++) {
        const a = (k * Math.PI * 2) / 5;
        mesh(
          new THREE.SphereGeometry(0.009, 8, 6),
          black,
          [Math.cos(a) * 0.061, Math.sin(a) * 0.061, s * 0.217],
          wheel,
        );
      }
      for (let k = 0; k < 32; k++) {
        const a = (k * Math.PI) / 16;
        const h = mesh(
          new THREE.CircleGeometry(0.009, 6),
          black,
          [Math.sin(a) * 0.258, Math.cos(a) * 0.258, s * 0.096],
          wheel,
        );
        if (s < 0) h.rotation.y = Math.PI;
      }
      // Fine sidewall ridges and tire tread.
      for (let k = 0; k < 64; k++) {
        const a = (k * Math.PI) / 32;
        const tread = box(
          [0.016, 0.008, 0.21],
          [Math.sin(a) * 0.524, Math.cos(a) * 0.524, 0],
          rubber,
          0.001,
          wheel,
        );
        tread.rotation.z = -a;
      }
    }
  // Directional forged-carbon aero faces distinguish the hybrid's wider wheel package.
  for (const x of wheelX)
    for (const s of [-1, 1]) {
      const cover = new THREE.Group();
      cover.position.set(x, wy, s * 1.21);
      vision.add(cover);
      mesh(new THREE.TorusGeometry(0.337, 0.022, 8, 48), carbon, null, cover);
      for (let k = 0; k < 5; k++) {
        const a = (k * Math.PI * 2) / 5;
        const blade = box(
          [0.094, 0.265, 0.018],
          [Math.sin(a) * 0.2, Math.cos(a) * 0.2, 0],
          carbon,
          0.008,
          cover,
        );
        blade.rotation.z = -a + 0.28;
      }
    }
  // Batch static meshes by material to keep wheel detail affordable on mobile GPUs.
  function batch(group) {
    for (const child of [...group.children]) if (child.isGroup && child !== steering) batch(child);
    const batches = new Map();
    for (const child of [...group.children]) {
      if (!child.isMesh || child === activeWing || Array.isArray(child.material)) continue;
      child.updateMatrix();
      const geom = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
      geom.applyMatrix4(child.matrix);
      if (!geom.attributes.uv)
        geom.setAttribute(
          'uv',
          new THREE.BufferAttribute(new Float32Array(geom.attributes.position.count * 2), 2),
        );
      const key = child.material;
      if (!batches.has(key)) batches.set(key, []);
      batches.get(key).push({ child, geom });
    }
    for (const [mat, items] of batches) {
      if (items.length < 2) {
        items.forEach((i) => i.geom.dispose());
        continue;
      }
      const merged = mergeGeometries(items.map((i) => i.geom));
      if (merged) {
        items.forEach((i) => {
          group.remove(i.child);
          i.child.geometry.dispose();
        });
        mesh(merged, mat, null, group);
      }
      items.forEach((i) => i.geom.dispose());
    }
  }
  batch(car);
  return {
    car,
    paint,
    glass,
    lamps,
    lamplights,
    steering,
    vision,
    heritage,
    activeWing,
    setVision(v) {
      vision.visible = v;
      heritage.visible = !v;
      paint.color.set(v ? '#321440' : '#3E0A48');
      paint.iridescence = v ? 0.32 : 0.1;
    },
  };
}
const lamplights = [];
