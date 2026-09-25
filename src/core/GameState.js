import { globalBus } from './EventBus.js';

export class GameState {
  constructor(savedData = null) {
    this.milk = savedData?.milk ?? 0;
    this.milkPerClick = savedData?.milkPerClick ?? 1;
    this.milkPerSecond = savedData?.milkPerSecond ?? 0;
    this.equippedHat = savedData?.equippedHat ?? null;

    // Handle offline progress if save exists
    if (savedData?.lastSavedTimestamp && this.milkPerSecond > 0) {
      this.calculateOfflineProgress(savedData.lastSavedTimestamp);
    }
  }

  calculateOfflineProgress(lastSavedTimestamp) {
    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - lastSavedTimestamp) / 1000);

    // Give 50% efficiency for offline earnings (standard idle mechanic)
    // Capped at 12 hours (43,200 seconds) max offline time
    const cappedSeconds = Math.min(elapsedSeconds, 43200);
    const offlineEarned = cappedSeconds * this.milkPerSecond * 0.5;

    if (offlineEarned > 0) {
      this.addMilk(offlineEarned);
      // Notify the player when they return
      globalBus.emit('offline:reward', {
        earned: offlineEarned,
        seconds: Math.floor(cappedSeconds)
      });
    }
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