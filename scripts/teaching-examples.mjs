import * as v from '../packages/vehicle-science/src/index.js';
// Hypothetical instructional inputs, not measured or claimed Taarzan properties.
const torqueNm = 250;
const rpm = 6000;
const speedMS = 30;
const wheelTorque = v.wheelTorqueNm(torqueNm, 3.2, 4.1, 0.9);
const drag = v.dragForceN(1.225, 0.3, 2.1, speedMS);
console.log(
  JSON.stringify(
    {
      notice:
        'Hypothetical SI-unit exercises; not vehicle predictions or measured research results.',
      inputs: { torqueNm, rpm, speedMS, massKg: 1400, wheelbaseM: 2.6, cgHeightM: 0.5 },
      shaftPowerKw: v.shaftPowerKw(torqueNm, rpm),
      wheelTorqueNm: wheelTorque,
      idealTractiveForceN: v.tractiveForceN(wheelTorque, 0.32),
      dragN: drag,
      powerToOvercomeDragKw: (drag * speedMS) / 1000,
      verticalAeroForceN: v.liftForceN(1.225, -0.8, 2.1, speedMS),
      staticAxleLoadsN: v.staticAxleLoadsN(1400, 2.6, 1.4),
      forwardAccelerationLoadTransferN: v.longitudinalLoadTransferN(1400, 3, 0.5, 2.6),
      idealBrakingDistanceM: v.idealBrakingDistanceM(speedMS, 0.8),
    },
    null,
    2,
  ),
);
