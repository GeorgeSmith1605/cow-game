export class AdService {
  constructor() {
    this.isInitialized = false;
    this.provider = 'mock';
  }

  async init() {
    if (this.isInitialized) return;

    if (window.CrazyGames && window.CrazyGames.SDK) {
      try {
        await window.CrazyGames.SDK.init();
        this.provider = 'crazygames';
        this.isInitialized = true;
        console.log('CrazyGames SDK v3 initialized');

        // CrazyGames QA expects game loading start/stop events
        if (window.CrazyGames.SDK.game && window.CrazyGames.SDK.game.loadingStart) {
          window.CrazyGames.SDK.game.loadingStart();
          // Small delay then stop loading
          setTimeout(() => {
            if (window.CrazyGames.SDK.game.loadingStop) {
              window.CrazyGames.SDK.game.loadingStop();
            }
          }, 300);
        }
        return;
      } catch (err) {
        console.warn('CrazyGames SDK init failed:', err);
      }
    }

    if (window.PokiSDK) {
      try {
        await window.PokiSDK.init();
        this.provider = 'poki';
        this.isInitialized = true;
        return;
      } catch (err) {
        console.warn('Poki SDK init failed:', err);
      }
    }

    this.provider = 'mock';
    this.isInitialized = true;
  }

  async showRewardAd() {
    if (!this.isInitialized) await this.init();

    if (this.provider === 'crazygames') {
      return new Promise((resolve) => {
        try {
          window.CrazyGames.SDK.ad.requestAd('rewarded', {
            adFinished: () => resolve(true),
            adError: (error) => {
              console.warn('CrazyGames ad error:', error);
              resolve(false);
            }
          });
        } catch (e) {
          console.warn('CrazyGames requestAd exception:', e);
          resolve(false);
        }
      });
    }

    if (this.provider === 'poki') {
      return new Promise((resolve) => {
        window.PokiSDK.rewardedBreak().then((success) => resolve(success));
      });
    }

    return new Promise((resolve) => {
      const watched = confirm('🎬 [Dev Ad Preview]: Watch mock sponsor video for reward?');
      setTimeout(() => resolve(watched), 1000);
    });
  }
}

export const adService = new AdService();