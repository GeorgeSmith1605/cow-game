export class AdService {
  constructor() {
    this.isInitialized = false;
    this.provider = 'mock';
  }

  async init() {
    if (window.CrazyGames && window.CrazyGames.SDK) {
      try {
        await window.CrazyGames.SDK.init();
        this.provider = 'crazygames';
        this.isInitialized = true;
        console.log('CrazyGames SDK initialized');
        return;
      } catch (err) {
        console.warn('CrazyGames SDK init failed, falling back to mock:', err);
      }
    }

    if (window.PokiSDK) {
      try {
        await window.PokiSDK.init();
        this.provider = 'poki';
        this.isInitialized = true;
        console.log('Poki SDK initialized');
        return;
      } catch (err) {
        console.warn('Poki SDK init failed, falling back to mock:', err);
      }
    }

    this.provider = 'mock';
    this.isInitialized = true;
  }

  async showRewardAd() {
    if (!this.isInitialized) {
      await this.init();
    }

    if (this.provider === 'crazygames') {
      return new Promise((resolve) => {
        window.CrazyGames.SDK.ad.requestAd('rewarded', {
          adFinished: () => resolve(true),
          adError: () => resolve(false)
        });
      });
    }

    if (this.provider === 'poki') {
      return new Promise((resolve) => {
        window.PokiSDK.rewardedBreak().then((success) => {
          resolve(success);
        });
      });
    }

    return new Promise((resolve) => {
      const watched = confirm('🎬 [Dev Ad Preview]: Watch mock sponsor video for reward?');
      setTimeout(() => resolve(watched), 1000);
    });
  }
}

export const adService = new AdService();