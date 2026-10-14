# Technical architecture

## Separation of concerns

- `apps/showcase`: Vite browser application; Three.js procedural representation and interaction.
- `packages/vehicle-science`: framework-independent analytical teaching functions; no DOM or Three.js dependency.
- `docs`: research and lesson design, provenance and selected demonstration evidence.
- `tests`: separate analytical-unit and browser-smoke layers.

The scientific package deliberately does not consume fictional specifications or procedural dimensions. Connecting calculations to the UI is future work, requiring explicit parameter provenance and units.

## Rendering path

`index.html → src/main.js → src/scene/vehicle.js`

The scene module builds geometry, era variants and materials. Main orchestrates lights, environment, floor reflection, camera/orbit controls, hotspots, UI state and recorded audio. Static geometry is batched by material, while animated subassemblies retain separate transforms. Fonts and media are served locally.

Mobile/software-GPU rendering uses tinted glass, reduced shadows and no planar reflection. Full physical transmission and reflections are reserved for the hardware path. This is fidelity management, not scientific level-of-detail validation.

## Interaction and diagnostics

The ignition starts source audio only after a gesture. Throttle controls RPM animation and recording playback rate, not a solved engine model. The four hotspot regions use projected accessible buttons and raycast targets. Native dialogs provide the source gallery and specifications.

`window.__showroomReady`, `window.__showroomDiagnostics()` and `window.__pauseRender` support smoke tests and captures. Diagnostics are test instrumentation, not persisted analytics. Reduced-motion preferences and focus/visibility handling limit unnecessary effects.

## Build and CI

Run commands at repository root. Vite's configured root is `apps/showcase`; production output is `apps/showcase/dist`. CI checks formatting, asset integrity, analytical functions and build, then starts a preview and runs browser tests. Dependencies are locked. Build products and raw captures are ignored; selected compressed screenshots belong in `docs/media` only.

## Further modularization

Main remains an orchestration module. Future work should extract audio, camera, hotspot and environment controllers with explicit interfaces and tests before adding component disassembly or live engineering parameters. This reorganization improves navigation without claiming that every subsystem has already been decoupled.
