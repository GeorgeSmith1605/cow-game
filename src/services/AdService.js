export class AdService {
  constructor() {
    this.isInitialized = false;
    this.provider = 'mock';
  }

  // Poll briefly in case the external CDN script is still finishing download
  async waitForSDK(timeoutMs = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (window.CrazyGames && window.CrazyGames.SDK) return 'crazygames';
      if (window.PokiSDK) return 'poki';
      await new Promise((r) => setTimeout(r, 100));
    }
    return null;
  }

  async init() {
    if (this.isInitialized) return;

    const detected = await this.waitForSDK();

    if (detected === 'crazygames') {
      try {
        await window.CrazyGames.SDK.init();
        this.provider = 'crazygames';
        this.isInitialized = true;
        console.log('CrazyGames SDK v3 ready');

        // Required by CrazyGames QA to detect active game lifecycle
        if (window.CrazyGames.SDK.game) {
          window.CrazyGames.SDK.game.loadingStart();
          setTimeout(() => {
            window.CrazyGames.SDK.game.loadingStop();
          }, 500);
        }
        return;
      } catch (err) {
        console.warn('CrazyGames SDK init error, using mock:', err);
      }
    }

    if (detected === 'poki') {
      try {
        await window.PokiSDK.init();
        this.provider = 'poki';
        this.isInitialized = true;
        return;
      } catch (err) {
        console.warn('Poki SDK init error, using mock:', err);
      }
    }

    // Default development fallback
    this.provider = 'mock';
    this.isInitialized = true;
    console.log('Using local mock Ad provider');
  }

  async showRewardAd() {
    if (!this.isInitialized) await this.init();

    if (this.provider === 'crazygames') {
      return new Promise((resolve) => {
        try {
          const callbacks = {
            adFinished: () => resolve(true),
            adError: (error) => {
              console.warn('CrazyGames ad error:', error);
              resolve(false);
            }
          };

          window.CrazyGames.SDK.ad.requestAd('rewarded', callbacks);
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

    // Dev fallback
    return new Promise((resolve) => {
      const watched = confirm('🎬 [Dev Ad Preview]: Watch mock sponsor video for reward?');
      setTimeout(() => resolve(watched), 1000);
    });
    gameplayStart() {
      if (window.CrazyGames?.SDK?.game?.gameplayStart) {
        window.CrazyGames.SDK.game.gameplayStart();
        console.log('CrazyGames: gameplayStart triggered');
      }
    }

    gameplayStop() {
      if (window.CrazyGames?.SDK?.game?.gameplayStop) {
        window.CrazyGames.SDK.game.gameplayStop();
        console.log('CrazyGames: gameplayStop triggered');
      }
    }


    export const adService = new AdService();