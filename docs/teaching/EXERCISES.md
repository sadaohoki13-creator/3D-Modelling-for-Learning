# Student exercises

All values below are **hypothetical instructional inputs**, not measured Taarzan properties. Use SI units, show assumptions and distinguish computed results from observations.

## 1. Engine power and drivetrain

Given torque `250 Nm` at `6000 rpm`, gear ratio `3.2`, final-drive ratio `4.1`, aggregate efficiency `0.90`, and effective tire radius `0.32 m`:

1. Convert rpm to rad/s and calculate shaft power.
2. Calculate wheel torque and ideal contact force.
3. Explain why tire friction may limit usable force.
4. Explain why changing gear ratio does not create power. Derive ideal vehicle speed at the same engine RPM; show how power is conserved apart from losses.

**Worked check:** `ω = 628.319 rad/s`, `P = 157.080 kW`, `T_w = 2952 Nm`, `F = 9225 N`. The corresponding ideal road speed is approximately `15.325 m/s`; `Fv ≈ 141.372 kW`, equal to shaft power times efficiency. Ignore slip and rotating inertia for this check.

## 2. Bodywork and aerodynamics

Assume density `1.225 kg/m³`, drag coefficient `0.30`, frontal area `2.1 m²`, and air-relative speed `30 m/s`.

- Calculate drag and the power required to overcome it.
- Double speed: predict the force and power multipliers before calculation.
- Repeat with `C_D = 0.36`; explain why this coefficient cannot be inferred from the screenshot.
- For signed `C_L = −0.8` using the same reference area, compute vertical force and identify its sign convention.

**Checks:** drag `347.288 N`; drag power `10.419 kW`; doubled-speed drag increases fourfold and drag power eightfold; vertical force `−926.1 N`. Reference-area conventions must match the supplied coefficients.

## 3. Chassis and axle loading

Assume mass `1400 kg`, wheelbase `2.6 m`, CG `1.4 m` rearward of the front axle and `0.5 m` above ground. Use `g=9.80665 m/s²`.

- Compute static front/rear reactions and verify their sum.
- Find load transfer at forward acceleration `3 m/s²`.
- Subtract transfer from front static load and add to rear. What changes under braking?
- Explain why visual wheel spacing and exterior trim are insufficient to establish chassis strength.

**Checks:** static front `6336.605 N`, rear `7392.705 N`; transfer `807.692 N`. Quasi-static transfer does not predict suspension deflection or transient pitch.

## 4. Braking, sensitivity and model criticism

At `30 m/s` with ideal constant friction `μ=0.8`, compute braking distance. Add a separately assumed `1.2 s` reaction time and discuss wet-road uncertainty.

**Checks:** braking distance approximately `57.36 m`; reaction distance `36 m`. The simple model excludes brake fade, grade, aerodynamic effects and speed-dependent tire behavior. The rainy scene is not a measured friction condition.

## 5. Hybrid power accounting

A concept lists separate engine and motor peaks. Write a short explanation of why their sum need not equal sustained wheel power. Identify required common-operating-point, electrical, thermal, gearing and traction data. Treat the showcase's hybrid targets as fictional, not as evidence.

## 6. Scientific communication

Create a one-page annotated render with four labels: **observed**, **assumed**, **calculated**, **requires measurement**. Include a free-body diagram or energy-flow schematic and a limitation paragraph. Do not annotate hidden engine or gearbox internals as if they were present.

## Reproduce the calculations

Run `npm run examples`. Functions are available from `packages/vehicle-science/src/index.js`; inspect their input units and validity boundaries before changing values. Extension: plot a parameter sweep outside the UI, then propose what measurements would be needed to calibrate it.
