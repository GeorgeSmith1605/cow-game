import { globalBus } from './EventBus.js';
import { HATS } from '../config/hats.js';

export class GameState {
  constructor(savedData = null) {
    this.milk = savedData?.milk ?? 0;
    this.baseMps = savedData?.baseMps ?? 0;
    this.baseClick = savedData?.baseClick ?? 1;
    this.ownedHats = new Set(savedData?.ownedHats ?? []);
    this.equippedHatId = savedData?.equippedHatId ?? null;

    if (savedData?.lastSavedTimestamp && this.getEffectiveMps() > 0) {
      this.calculateOfflineProgress(savedData.lastSavedTimestamp);
    }
  }

  get equippedHat() {
    return HATS.find(h => h.id === this.equippedHatId) || null;
  }

  getEffectiveClick() {
    let click = this.baseClick;
    const hat = this.equippedHat;
    if (hat) {
      if (hat.effect.type === 'click_bonus') click += hat.effect.value;
      if (hat.effect.type === 'hybrid') click += hat.effect.clickVal;
    }
    return click;
  }

  getEffectiveMps() {
    let mps = this.baseMps;
    const hat = this.equippedHat;
    if (hat) {
      if (hat.effect.type === 'mps_multiplier') mps += this.baseMps * hat.effect.value;
      if (hat.effect.type === 'hybrid') mps += this.baseMps * hat.effect.mpsMultiplier;
    }
    return mps;
  }

  calculateOfflineProgress(lastSavedTimestamp) {
    const elapsedSeconds = Math.max(0, (Date.now() - lastSavedTimestamp) / 1000);
    const cappedSeconds = Math.min(elapsedSeconds, 43200); // 12hr cap
    const offlineEarned = cappedSeconds * this.getEffectiveMps() * 0.5;

    if (offlineEarned > 0) {
      this.addMilk(offlineEarned);
      globalBus.emit('offline:reward', {
        earned: offlineEarned,
        seconds: Math.floor(cappedSeconds)
      });
    }
  }

  addMilk(amount) {
    this.milk += amount;
    globalBus.emit('milk:changed', { total: this.milk, delta: amount });
  }

  spendMilk(amount) {
    if (this.milk >= amount) {
      this.milk -= amount;
      globalBus.emit('milk:changed', { total: this.milk, delta: -amount });
      return true;
    }
    return false;
  }

  addBaseMps(amount) {
    this.baseMps += amount;
    globalBus.emit('rate:changed', { mps: this.getEffectiveMps() });
  }

  buyHat(hatId) {
    const hat = HATS.find(h => h.id === hatId);
    if (!hat || this.ownedHats.has(hatId)) return false;

    if (this.spendMilk(hat.cost)) {
      this.ownedHats.add(hatId);
      this.equipHat(hatId);
      globalBus.emit('inventory:updated', { ownedHats: Array.from(this.ownedHats) });
      return true;
    }
    return false;
  }

  equipHat(hatId) {
    if (this.equippedHatId === hatId) {
      this.equippedHatId = null; // Toggle off
    } else if (this.ownedHats.has(hatId)) {
      this.equippedHatId = hatId;
    }
    globalBus.emit('hat:changed', { equippedHat: this.equippedHat });
    globalBus.emit('rate:changed', { mps: this.getEffectiveMps() });
  }
}