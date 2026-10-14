# Research framework

## Problem and contribution

Automotive teaching combines spatial understanding with mechanics, thermodynamics, materials and control. Static illustrations can make system relationships difficult to inspect; photorealistic graphics can also create false confidence. This prototype explores an inspectable browser scene alongside explicitly bounded analytical exercises.

The proposed contribution is a reproducible teaching workflow and representation architecture—not a novel rendering algorithm, validated digital twin, or completed learning-outcomes study.

## Research questions

1. Does guided 3D inspection improve students' identification of vehicle features and spatial relationships relative to matched static views?
2. Does pairing visualization with explicit equations improve transfer to unfamiliar torque, gearing, aero and load-transfer problems?
3. Can visible validity labels reduce confusion between appearance, assumption, calculation and measurement?
4. How do input device, rendering performance and accessibility affect participation?

Hypotheses are prospective. No effect sizes or participant outcomes are available.

## Proposed study design

- Recruit consenting students from the intended advanced course; seek institutional approval before collection.
- Randomize, where feasible, to interactive instruction and a matched static-diagram control. Equalize teaching time, vocabulary, instructor support and numerical exercises.
- Record prior knowledge with a pre-test; use a post-test and a delayed transfer test, with a counterbalanced item set to reduce practice effects.
- Score spatial identification, calculation accuracy, unit consistency, assumption awareness and transfer separately. Use blinded scoring and a pre-agreed rubric.
- Record completion time, technical failures, input-device difficulties and optional usability responses. Do not interpret satisfaction as learning.
- Pre-register primary outcomes and exclusions. Determine sample size through an a priori power analysis; do not choose an arbitrary sample or stop on significance.
- Report group sizes, missingness, distributions, effect sizes and uncertainty. Account for clustering by class/instructor and multiplicity when applicable.

## Materials and reproducibility

Freeze the Git commit, dependency lockfile, browser/device description, teaching script, static control images and assessment version. Use the same illustrative inputs in both conditions. Store de-identified results outside Git; publish a data dictionary and analysis code only with permission.

The present repository supplies the demonstrator, analytical equations, exercises and a prospective rubric. It does not yet supply a validated assessment instrument or experimental dataset.

## Ethics and accessibility

Participation should be voluntary and unrelated to grades. Avoid student names, screen recordings containing identity, and unnecessary analytics. Provide static diagrams and text exercises if WebGL, audio, motion or interaction is inaccessible. No telemetry collection is implemented in this application.

## Threats to validity

Novelty effects; unequal teacher enthusiasm; visually salient but irrelevant effects; unverified geometry; device-dependent fidelity; repeated-test familiarity; prior game/3D experience; and treating equations with assumed coefficients as experimental evidence. Assess these explicitly rather than claiming immersion guarantees understanding.
