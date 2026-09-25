export class ParticleManager {
  constructor(container) {
    this.container = container;
  }

  spawnText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-particle';
    el.textContent = text;

    // Slight randomized horizontal drift
    const driftX = (Math.random() - 0.5) * 40;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--drift-x', `${driftX}px`);

    this.container.appendChild(el);

    // Clean up DOM node once animation ends
    el.addEventListener('animationend', () => {
      el.remove();
    });
  }
}