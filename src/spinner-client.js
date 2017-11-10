export class SpinnerClient {
  constructor() {
    this.listeners = [];
    this.connected = false;
  }

  async connect() {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{
        services: [0xfa00]
      }]
    });
    this.device.addEventListener('gattserverdisconnected', () => {
      this.connected = false;
    });
    const gatt = await this.device.gatt.connect();
    const service = await gatt.getPrimaryService(0xfa00);
    this.characteristic = await service.getCharacteristic(0xfa01);
    this.characteristic.addEventListener('characteristicvaluechanged', e => {
      const data = e.target.value;
      const eventData = {
        state: data.getInt8(0),
        time: data.getFloat32(1),
        lastTime: data.getFloat32(5),
      };
      this.listeners.forEach(listener => {
        listener(eventData);
      });
    });
    await this.characteristic.startNotifications();
    this.connected = true;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filters(item => item !== listener);
  }

  disconnect() {
    if (this.device) {
      this.device.gatt.disconnect();
      this.device = null;
    }
  }
}
