import { GameState } from './core/GameState.js';
import { GameLoop } from './core/GameLoop.js';
import { globalBus } from './core/EventBus.js';

const state = new GameState();

const milkDisplay = document.getElementById('milk-display');
const mpsDisplay = document.getElementById('mps-display');
const cowButton = document.getElementById('cow-clicker');
const btnFeed = document.getElementById('btn-feed');

globalBus.on('milk:changed', ({ total }) => {
  milkDisplay.textContent = Math.floor(total).toLocaleString();
});

globalBus.on('rate:changed', ({ mps }) => {
  mpsDisplay.textContent = mps.toLocaleString();
});

cowButton.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  state.addMilk(state.milkPerClick);
});

btnFeed.addEventListener('click', () => {
  state.setMilkPerSecond(state.milkPerSecond + 1);
});

const loop = new GameLoop((dt) => {
  if (state.milkPerSecond > 0) {
    state.addMilk(state.milkPerSecond * dt);
  }
});

loop.start();