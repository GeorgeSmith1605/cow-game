export class AdService {
  constructor() {
    this.isInitialized = false;
    this.provider = 'mock'; // Default fallback
  }

  async init() {
    if (window.CrazyGames && window.CrazyGames.SDK) {
      try {
        await window.CrazyGames.SDK.init();
        this.provider = 'crazygames';
        this.isInitialized = true;
        console.log('CrazyGames SDK initialized successfully');
        return;
      } catch (err) {
        console.warn('CrazyGames SDK init error:', err);
      }
    }

    // Fallback to mock
    this.provider = 'mock';
    this.isInitialized = true;
  }

  // Check if Poki SDK is present
  if(window.PokiSDK) {
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

    console.log('Running in local/dev mock mode');
    this.isInitialized = true;
  }

  /**
   * Request a Rewarded Video Ad
   * @returns {Promise<boolean>} True if the player watched the full ad
   */
  async showRewardAd() {
  if (!this.isInitialized) await this.init();

  // 1. CrazyGames Provider
  if (this.provider === 'crazygames') {
    return new Promise((resolve) => {
      window.CrazyGames.SDK.ad.requestAd('rewarded', {
        adFinished: () => resolve(true),
        adError: () => resolve(false)
      });
    });
  }

  // 2. Poki Provider
  if (this.provider === 'poki') {
    return new Promise((resolve) => {
      window.PokiSDK.rewardedBreak().then((success) => {
        resolve(success);
      });
    });
  }

  // 3. Dev / Mock Fallback (local testing)
  return new Promise((resolve) => {
    const watched = confirm('🎬 [Dev Ad Preview]: Watch mock sponsor video for reward?');
    setTimeout(() => resolve(watched), 1000);
  });
}
}

export const adService = new AdService();