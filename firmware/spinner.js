const DEVICE_NAME = 'Spinduino';

function enable() {
  digitalPulse(LED, 0, 1000);
  digitalWrite(D4, 1);
  pinMode(D5, 'input_pullup');

  const buf = new Uint8Array(9);
  const bufView = new DataView(buf.buffer);
  setWatch((e) => {
    bufView.setInt8(0, e.state ? 1 : 0);
    bufView.setFloat32(1, e.time);
    bufView.setFloat32(5, e.lastTime);
    NRF.updateServices({
      0xfa00: {
        0xfa01: { value: buf, notify: true }
      }
    });
  }, D5, true);
}

function disable() {
  digitalPulse(LED, 0, 100);
  digitalWrite(D4, 0);
  pinMode(D5, 'input');
}

function onInit() {
  NRF.on('connect', enable);
  NRF.on('disconnect', disable);

  const eirEntry = (type, data) => [data.length + 1, type].concat(data);
  NRF.setAdvertising([].concat(
    eirEntry(0x3, [0x00, 0xfa]),
    eirEntry(0x9, DEVICE_NAME),
  ), { name: DEVICE_NAME });

  NRF.setServices({
    0xfa00: {
      0xfa01: {
        value: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        maxLen: 9,
        readable: true,
        notify: true
      }
    }
  });
}

