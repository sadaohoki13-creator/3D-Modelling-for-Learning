# Evaluation and evidence protocol

## Evidence tiers

| Tier                   | Method                                              | What it establishes                              | What it cannot establish                    |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| Asset integrity        | SHA-256, Git blob hashes, optional HTTP hash checks | Traceable source content and local serving       | Licensing, dimensional accuracy             |
| Software correctness   | Build, formatting, unit and browser tests           | Defined functions and UI workflows execute       | Physical accuracy, accessibility compliance |
| Physical validation    | Future measurements / benchmark datasets            | Agreement within stated uncertainty              | Generalization outside validated domain     |
| Educational evaluation | Future controlled study                             | Defined learning outcomes under study conditions | Universal superiority of 3D instruction     |

## Reproduce the software baseline

```sh
npm ci
npm run check
npm run examples
npm run dev -- --port 5173
# In a second terminal:
npm run test:smoke
ASSET_BASE_URL=http://localhost:5173 npm run verify:assets
```

The browser test records desktop/mobile screenshots in ignored `.artifacts/`, asserts rendered geometry and decoded audio, drives ignition and Space throttle, and checks variants, environments, camera selection, dialogs and responsive overflow. Most non-audio controls use dispatched events: this checks handler/state wiring, not full pointer usability. Camera selection assertions do not verify precise final camera pose. Audio decoding and state transitions do not constitute a human listening assessment.

Before teaching, manually inspect pointer interaction, sound quality, touch behavior, keyboard focus, contrast, reduced motion, dialog focus return, and the four views. A software-GPU pass exercises reduced rendering fidelity; inspect the full transmission/reflection path on a hardware GPU separately.

## Benchmark reporting template

Record commit, date, OS, browser, GPU, viewport, pixel ratio, reduced-motion preference, selected era/environment, renderer tier, geometry count and draw calls. Report frame-time distributions after warm-up, not a single FPS number. Distinguish shader compilation/loading from steady-state performance. No hardware performance benchmark is claimed by this repository.

## Analytical checks

Unit tests cover known outputs, dimensional conversions, quadratic scaling, total-weight conservation, signed load transfer, endpoint cases and invalid inputs. Future validated engineering modules need measured references, uncertainty budgets, numerical convergence checks and independent review.

## Classroom evidence

Use the prospective protocol in [RESEARCH_FRAMEWORK.md](RESEARCH_FRAMEWORK.md). Store no identifiable student data in this repository. Report null and negative results. A render screenshot is demonstration evidence, not scientific validation.
