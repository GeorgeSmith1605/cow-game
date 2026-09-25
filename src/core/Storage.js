export class Storage {
  constructor(saveKey = 'grazing_guru_save') {
    this.saveKey = saveKey;
  }

  save(state) {
    try {
      const payload = {
        milk: state.milk,
        milkPerClick: state.milkPerClick,
        milkPerSecond: state.milkPerSecond,
        equippedHat: state.equippedHat,
        lastSavedTimestamp: Date.now()
      };
      localStorage.setItem(this.saveKey, JSON.stringify(payload));
    } catch (err) {
      console.warn('Unable to save to localStorage:', err);
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.saveKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch (err) {
      console.warn('Unable to load from localStorage:', err);
      return null;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.saveKey);
    } catch (err) {
      console.warn('Unable to clear save:', err);
    }
  }
}