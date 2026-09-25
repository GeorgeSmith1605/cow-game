export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => this.off(event, callback);
  }

  off(event, callback) {
    const eventGroup = this.listeners.get(event);
    if (eventGroup) {
      eventGroup.delete(callback);
      if (eventGroup.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event, payload) {
    const eventGroup = this.listeners.get(event);
    if (eventGroup) {
      eventGroup.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }
}

export const globalBus = new EventBus();