import { globalBus } from './EventBus.js';

export class GameState {
  constructor() {
    this.milk = 0;
    this.milkPerClick = 1;
    this.milkPerSecond = 0;
    this.equippedHat = null;
  }

  addMilk(amount) {
    this.milk += amount;
    globalBus.emit('milk:changed', {
      total: this.milk,
      delta: amount
    });
  }

  setMilkPerSecond(rate) {
    this.milkPerSecond = rate;
    globalBus.emit('rate:changed', { mps: this.milkPerSecond });
  }

  equipHat(hatId) {
    this.equippedHat = hatId;
    globalBus.emit('hat:equipped', { hatId });
  }
}