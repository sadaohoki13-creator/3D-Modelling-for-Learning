/**
 * Introductory analytical vehicle models, expressed in SI units.
 * Independent of the visual showroom: these functions do not calibrate its geometry,
 * animation, audio, or design-brief specifications. See docs/research/MODEL_VALIDITY.md.
 */
export const STANDARD_GRAVITY = 9.80665;

function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, non-negative number`);
  }
  return value;
}
function positive(value, name) {
  nonnegative(value, name);
  if (value === 0) throw new RangeError(`${name} must be greater than zero`);
  return value;
}
function efficiency(value) {
  positive(value, 'efficiency');
  if (value > 1) throw new RangeError('efficiency must not exceed one');
  return value;
}

/** P = T * omega, with rpm converted to rad/s and W converted to kW. */
export function shaftPowerKw(torqueNm, rpm) {
  return (nonnegative(torqueNm, 'torqueNm') * nonnegative(rpm, 'rpm') * 2 * Math.PI) / 60_000;
}

/** Positive motoring ratios; excludes losses that vary with load/speed. */
export function wheelTorqueNm(torqueNm, gearRatio, finalDriveRatio, drivetrainEfficiency = 0.9) {
  return (
    nonnegative(torqueNm, 'torqueNm') *
    positive(gearRatio, 'gearRatio') *
    positive(finalDriveRatio, 'finalDriveRatio') *
    efficiency(drivetrainEfficiency)
  );
}

/** Ideal contact-patch force before traction limits or tire deformation. */
export function tractiveForceN(torqueNm, rollingRadiusM) {
  return nonnegative(torqueNm, 'torqueNm') / positive(rollingRadiusM, 'rollingRadiusM');
}

/** Quasi-steady drag magnitude; speed is relative to the air, not necessarily ground. */
export function dragForceN(airDensityKgM3, dragCoefficient, frontalAreaM2, airspeedMS) {
  return (
    0.5 *
    positive(airDensityKgM3, 'airDensityKgM3') *
    nonnegative(dragCoefficient, 'dragCoefficient') *
    positive(frontalAreaM2, 'frontalAreaM2') *
    nonnegative(airspeedMS, 'airspeedMS') ** 2
  );
}

/** Signed vertical aero force: positive lift, negative downforce. */
export function liftForceN(airDensityKgM3, liftCoefficient, referenceAreaM2, airspeedMS) {
  if (!Number.isFinite(liftCoefficient)) throw new RangeError('liftCoefficient must be finite');
  return (
    0.5 *
    positive(airDensityKgM3, 'airDensityKgM3') *
    liftCoefficient *
    positive(referenceAreaM2, 'referenceAreaM2') *
    nonnegative(airspeedMS, 'airspeedMS') ** 2
  );
}

/** Level-ground static axle loads; CG location is measured rearward from the front axle. */
export function staticAxleLoadsN(massKg, wheelbaseM, cgFromFrontM, gravityMS2 = STANDARD_GRAVITY) {
  positive(massKg, 'massKg');
  positive(wheelbaseM, 'wheelbaseM');
  nonnegative(cgFromFrontM, 'cgFromFrontM');
  positive(gravityMS2, 'gravityMS2');
  if (cgFromFrontM > wheelbaseM) throw new RangeError('CG must lie between the axles');
  const rear = (massKg * gravityMS2 * cgFromFrontM) / wheelbaseM;
  return { front: massKg * gravityMS2 - rear, rear };
}

/** Positive forward acceleration transfers this signed load from front to rear. */
export function longitudinalLoadTransferN(massKg, accelerationMS2, cgHeightM, wheelbaseM) {
  positive(massKg, 'massKg');
  nonnegative(cgHeightM, 'cgHeightM');
  positive(wheelbaseM, 'wheelbaseM');
  if (!Number.isFinite(accelerationMS2)) throw new RangeError('accelerationMS2 must be finite');
  return (massKg * accelerationMS2 * cgHeightM) / wheelbaseM;
}

/** Ideal constant-deceleration braking distance; no driver reaction distance. */
export function idealBrakingDistanceM(speedMS, frictionCoefficient, gravityMS2 = STANDARD_GRAVITY) {
  return (
    nonnegative(speedMS, 'speedMS') ** 2 /
    (2 * positive(frictionCoefficient, 'frictionCoefficient') * positive(gravityMS2, 'gravityMS2'))
  );
}
