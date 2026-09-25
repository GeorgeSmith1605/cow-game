import { GameState } from './core/GameState.js';
import { GameLoop } from './core/GameLoop.js';
import { Storage } from './core/Storage.js';
import { globalBus } from './core/EventBus.js';

// 1. Storage & State Initialization
const storage = new Storage();
const savedData = storage.load();
const state = new GameState(savedData);

// 2. DOM Elements
const milkDisplay = document.getElementById('milk-display');
const mpsDisplay = document.getElementById('mps-display');
const cowButton = document.getElementById('cow-clicker');
const btnFeed = document.getElementById('btn-feed');

// 3. UI Listeners
globalBus.on('milk:changed', ({ total }) => {
  milkDisplay.textContent = Math.floor(total).toLocaleString();
});

globalBus.on('rate:changed', ({ mps }) => {
  mpsDisplay.textContent = mps.toLocaleString();
});

globalBus.on('offline:reward', ({ earned, seconds }) => {
  const minutes = Math.floor(seconds / 60);
  alert(`Welcome back! While you were away (${minutes}m), your cow produced ${Math.floor(earned).toLocaleString()} milk!`);
});

// Render initial state
globalBus.emit('milk:changed', { total: state.milk });
globalBus.emit('rate:changed', { mps: state.milkPerSecond });

// 4. Inputs
cowButton.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  state.addMilk(state.milkPerClick);
});

btnFeed.addEventListener('click', () => {
  state.setMilkPerSecond(state.milkPerSecond + 1);
});

// 5. Game Loop
const loop = new GameLoop((dt) => {
  if (state.milkPerSecond > 0) {
    state.addMilk(state.milkPerSecond * dt);
  }
});
loop.start();

// 6. Auto-Save every 5 seconds & on tab close
setInterval(() => {
  storage.save(state);
}, 5000);

window.addEventListener('beforeunload', () => {
  storage.save(state);
});