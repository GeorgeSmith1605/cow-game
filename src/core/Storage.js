export class Storage {
  constructor(saveKey = 'grazing_guru_save') {
    this.saveKey = saveKey;
  }

  save(state) {
    try {
      const payload = {
        milk: state.milk,
        baseMps: state.baseMps,
        baseClick: state.baseClick,
        ownedHats: Array.from(state.ownedHats),
        equippedHatId: state.equippedHatId,
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
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('Unable to load from localStorage:', err);
      return null;
    }
  }
}