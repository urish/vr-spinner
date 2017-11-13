import { SpinnerClient } from './spinner-client.js';

const client = new SpinnerClient();
const rootEntity = document.querySelector('#sphere1');

document.getElementById('connect').onclick = () => {
  client.connect();
}

let speed = 0;
let lastSpinTime = 0;
let lastSpinEvent = 0;
let nextSpeed = 0;
client.addListener(spin => {
  if (!spin.state) {
    const delta = spin.time - lastSpinTime;
    if (delta && (delta < 1000)) {
      nextSpeed = 10 / delta;
    } else if (delta > 1) {
      nextSpeed = 0;
    }
    lastSpinTime = spin.time;
    lastSpinEvent = new Date().getTime();
  }
});

let rotation = 0;
let lastRotateTime = 0;
function doFrame() {
  if (speed < nextSpeed) {
    speed += 1;
  }
  if (speed > nextSpeed) {
    speed -= 1;
  }
    if (speed && (new Date().getTime() - lastSpinEvent > 1000.0)) {
    speed = 0;
  }
  const s = 1 + speed / 400;
  rootEntity.setAttribute('fireball', { brightness: speed / 100.0, speed: speed / 100.0 });
  rootEntity.setAttribute('scale', `${s} ${s} ${s}`);
  requestAnimationFrame(doFrame);
}

doFrame();