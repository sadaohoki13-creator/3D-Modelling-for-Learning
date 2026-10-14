# Representation and model validity

## Four distinct layers

1. **Visual model:** procedural surfaces, approximate packaging, materials and presentation.
2. **Interaction model:** camera transitions, throttle-to-RPM animation, audio pitch and lighting.
3. **Analytical teaching models:** independent functions in `packages/vehicle-science/src/index.js`.
4. **Measured physical model:** absent; would require dimensions, component data, calibrated measurements and validation.

The analytical functions are not connected to the scene. Render coordinates must not be used as surveyed dimensions. No learning-effectiveness evidence exists yet.

## Implemented equations

All inputs/outputs use SI units except explicitly named RPM and output kW. Positive scalar ratios describe forward motoring, not reverse gearing.

| Model                 | Equation                              | Assumptions and omissions                                                            |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Shaft power           | `P_kW = T_Nm × 2π × rpm / 60000`      | Torque and speed must describe the same operating point; no torque curve inferred    |
| Wheel torque          | `T_w = T_e × i_g × i_f × η`           | Fixed positive ratios and aggregate efficiency; excludes transient inertia           |
| Contact force         | `F = T_w / r`                         | Effective rolling radius; before traction saturation and tire deformation            |
| Drag                  | `D = ½ρ C_D A v_air²`                 | Quasi-steady coefficient supplied by the instructor, not inferred from shape         |
| Signed lift           | `L = ½ρ C_L A v_air²`                 | Positive lift, negative downforce; no aero balance or ground-effect prediction       |
| Static axle loads     | `N_r = mg x_CG / l`, `N_f = mg − N_r` | Level ground; CG between axles; no aerodynamic loads                                 |
| Longitudinal transfer | `ΔN = m a h / l`                      | Positive acceleration transfers front-to-rear; rigid quasi-static pitch balance      |
| Ideal braking         | `s = v²/(2μg)`                        | Constant tire-limited deceleration; excludes reaction, gradient, aero and brake fade |

Input checks reject nonfinite values, inadmissible negative magnitudes, zero denominators and efficiencies outside `(0, 1]`. These checks establish domain consistency, not empirical calibration.

## Specification caveats

Heritage values originate in the requested creative brief. The 2026 system pairing and 960 BHP / 2.15-second targets are fictional. Motor and engine peak powers may occur at different speeds and are constrained by electrical limits, thermal state, traction and system architecture; adding standalone maxima is invalid without a common operating-point model.

## Not currently represented

- Cylinder/valvetrain geometry, combustion, thermodynamic cycles, emissions or engine maps.
- Gear teeth, clutch engagement, differential or gearbox kinematics.
- Structural chassis members, suspension links, stress, fatigue or crashworthiness.
- Validated lift/drag coefficients, airflow, cooling flow, CFD or wind-tunnel data.
- Battery state, inverter efficiency, regenerative braking, power-split control or traction dynamics.

Hotspots identify body regions, not every mechanical assembly. Silver intake guides and exterior trim are not demonstrated chassis load paths. Rain and Ghost mode are presentation effects, not weather physics or autonomous-control research.
