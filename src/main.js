import { SpinnerClient } from './spinner-client.js';

const client = new SpinnerClient();
const rootEntity = document.querySelector('#spinner');

document.getElementById('connect').onclick = () => {
  client.connect();
}

let speed = 0;
let lastSpinTime = 0;
let lastSpinEvent = 0;
client.addListener(spin => {
  if (!spin.state) {
    const delta = spin.time - lastSpinTime;
    if (delta && (delta < 1)) {
      speed = 10 / delta;
    } else if (delta > 1) {
      speed = 0;
    }
    lastSpinTime = spin.time;
    lastSpinEvent = new Date().getTime();
  }
});

let rotation = 0;
let lastRotateTime = 0;
function doFrame() {
  if (speed) {
    const delta = new Date().getTime() - lastRotateTime;
    rotation += delta * speed / 1000.;
    lastRotateTime = new Date().getTime();
    rootEntity.setAttribute('rotation', `0 ${rotation} 0`);
    if (new Date().getTime() - lastSpinEvent > 1000.0) {
      speed = 0;
    }
  }
  requestAnimationFrame(doFrame);
}

doFrame();