import test from 'node:test';
import assert from 'node:assert/strict';
import * as science from '../../packages/vehicle-science/src/index.js';
const near = (actual, expected, tolerance = 1e-8) =>
  assert(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('shaft power converts torque and RPM to SI power', () => {
  near(science.shaftPowerKw(250, 6000), 157.07963267948966);
  assert.equal(science.shaftPowerKw(250, 0), 0);
});
test('gearing increases wheel torque; contact force uses rolling radius', () => {
  near(science.wheelTorqueNm(250, 3.2, 4.1, 0.9), 2952);
  near(science.tractiveForceN(2952, 0.32), 9225);
});
test('aerodynamic force scales with airspeed squared and area', () => {
  const drag = science.dragForceN(1.225, 0.3, 2.1, 30);
  near(drag, 347.2875);
  near(science.dragForceN(1.225, 0.3, 2.1, 60), 4 * drag);
  near(science.dragForceN(1.225, 0.3, 4.2, 30), 2 * drag);
  assert.equal(science.dragForceN(1.225, 0.3, 2.1, 0), 0);
});
test('signed lift distinguishes lift from downforce', () => {
  near(science.liftForceN(1.225, -0.8, 2.1, 30), -926.1);
  near(science.liftForceN(1.225, 0.8, 2.1, 30), 926.1);
});
test('static axle reactions conserve total weight', () => {
  const { front, rear } = science.staticAxleLoadsN(1400, 2.6, 1.4);
  near(front + rear, 1400 * science.STANDARD_GRAVITY);
  assert(rear > front);
  near(science.staticAxleLoadsN(1400, 2.6, 0).rear, 0);
  near(science.staticAxleLoadsN(1400, 2.6, 2.6).front, 0);
});
test('load transfer changes sign under braking and vanishes at zero CG height', () => {
  near(science.longitudinalLoadTransferN(1400, 3, 0.5, 2.6), 807.6923076923077);
  near(science.longitudinalLoadTransferN(1400, -3, 0.5, 2.6), -807.6923076923077);
  assert.equal(science.longitudinalLoadTransferN(1400, 3, 0, 2.6), 0);
});
test('ideal braking distance is quadratic in speed', () => {
  const d = science.idealBrakingDistanceM(20, 0.8);
  near(science.idealBrakingDistanceM(40, 0.8), 4 * d);
  assert.equal(science.idealBrakingDistanceM(0, 0.8), 0);
});
test('invalid inputs cannot silently produce credible-looking outputs', () => {
  for (const value of [-1, NaN, Infinity])
    assert.throws(() => science.shaftPowerKw(value, 1000), RangeError);
  assert.throws(() => science.wheelTorqueNm(100, 3, 4, 1.1), RangeError);
  assert.throws(() => science.tractiveForceN(100, 0), RangeError);
  assert.throws(() => science.dragForceN(0, 0.3, 2, 30), RangeError);
  assert.throws(() => science.liftForceN(1.2, NaN, 2, 30), RangeError);
  assert.throws(() => science.staticAxleLoadsN(1000, 2.5, 3), RangeError);
  assert.throws(() => science.longitudinalLoadTransferN(1000, NaN, 0.5, 2.5), RangeError);
  assert.throws(() => science.idealBrakingDistanceM(20, 0), RangeError);
});
