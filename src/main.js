import { SpinnerClient } from './spinner-client.js';

const client = new SpinnerClient();
client.addListener(console.log);

document.getElementById('connect').onclick = () => {
  client.connect();
}