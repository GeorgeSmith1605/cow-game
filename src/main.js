import { GameState } from './core/GameState.js';
import { GameLoop } from './core/GameLoop.js';
import { Storage } from './core/Storage.js';
import { globalBus } from './core/EventBus.js';
import { HATS } from './config/hats.js';

// 1. Initialization
const storage = new Storage();
const state = new GameState(storage.load());

// 2. DOM Elements
const milkDisplay = document.getElementById('milk-display');
const mpsDisplay = document.getElementById('mps-display');
const cowButton = document.getElementById('cow-clicker');
const btnFeed = document.getElementById('btn-feed');
const btnWardrobe = document.getElementById('btn-wardrobe');
const wardrobeModal = document.getElementById('wardrobe-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const hatsList = document.getElementById('hats-list');
const hatSlot = document.getElementById('hat-slot');
const btnAdBoost = document.getElementById('btn-ad-boost');

// 3. Render Helpers
function renderCowHat(hat) {
  hatSlot.innerHTML = hat ? hat.svg : '';
}

function renderWardrobe() {
  hatsList.innerHTML = '';
  HATS.forEach(hat => {
    const isOwned = state.ownedHats.has(hat.id);
    const isEquipped = state.equippedHatId === hat.id;

    const card = document.createElement('div');
    card.className = `hat-card ${isEquipped ? 'equipped' : ''}`;

    card.innerHTML = `
      <div class="hat-info">
        <h4>${hat.name}</h4>
        <p>${hat.desc}</p>
        <small>${isOwned ? 'Owned' : `Cost: ${hat.cost} 🥛`}</small>
      </div>
      <button class="action-btn" data-id="${hat.id}">
        ${isEquipped ? 'Unequip' : (isOwned ? 'Equip' : 'Buy')}
      </button>
    `;

    const actionBtn = card.querySelector('button');
    actionBtn.addEventListener('click', () => {
      if (!isOwned) {
        if (!state.buyHat(hat.id)) {
          alert('Not enough milk!');
        }
      } else {
        state.equipHat(hat.id);
      }
      renderWardrobe();
    });

    hatsList.appendChild(card);
  });
}

// 4. Subscriptions
globalBus.on('milk:changed', ({ total }) => {
  milkDisplay.textContent = Math.floor(total).toLocaleString();
});

globalBus.on('rate:changed', ({ mps }) => {
  mpsDisplay.textContent = Math.round(mps * 10) / 10;
});

globalBus.on('hat:changed', ({ equippedHat }) => {
  renderCowHat(equippedHat);
});

// Render state on launch
globalBus.emit('milk:changed', { total: state.milk });
globalBus.emit('rate:changed', { mps: state.getEffectiveMps() });
renderCowHat(state.equippedHat);

// 5. Interactions
cowButton.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  state.addMilk(state.getEffectiveClick());
});

btnFeed.addEventListener('click', () => {
  state.addBaseMps(1);
});

btnWardrobe.addEventListener('click', () => {
  renderWardrobe();
  wardrobeModal.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', () => {
  wardrobeModal.classList.add('hidden');
});

// Simulated Rewarded Video Ad
btnAdBoost.addEventListener('click', () => {
  const confirmed = confirm('🎬 [Ad Simulation]: Watch 5-second sponsor video for +250 milk?');
  if (confirmed) {
    btnAdBoost.disabled = true;
    btnAdBoost.textContent = 'Playing ad...';
    setTimeout(() => {
      state.addMilk(250);
      btnAdBoost.disabled = false;
      btnAdBoost.textContent = '📺 Watch Ad (+250 Milk)';
      alert('Reward claimed: +250 🥛!');
    }, 1500);
  }
});

// 6. Game Loop & Persistence
const loop = new GameLoop((dt) => {
  const currentMps = state.getEffectiveMps();
  if (currentMps > 0) {
    state.addMilk(currentMps * dt);
  }
});
loop.start();

setInterval(() => storage.save(state), 5000);
window.addEventListener('beforeunload', () => storage.save(state));