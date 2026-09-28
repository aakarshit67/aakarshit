const starField = document.querySelector('.stars');
// Deterministic positions keep the sky consistent between visits.
let seed = 67;
const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const stars = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const star = document.createElement('span');
  star.className = `star${i % 13 === 0 ? ' cross' : i % 4 === 0 ? ' large' : ''}`;
  star.style.left = `${random() * 100}%`;
  star.style.top = `${8 + random() * 78}%`;
  star.style.setProperty('--duration', `${2 + random() * 4}s`);
  star.style.setProperty('--delay', `${-random() * 6}s`);
  stars.append(star);
}
starField.append(stars);

const fireflies = document.querySelector('.fireflies');
for (let i = 0; i < 22; i++) {
  const fly = document.createElement('span');
  fly.style.cssText = `left:${random()*100}%;top:${60+random()*35}%;--delay:${-random()*20}s;--duration:${9+random()*12}s`;
  fireflies.append(fly);
}
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const soundLabel = document.getElementById('soundLabel');
const audioStatus = document.getElementById('audioStatus');
let manuallyPaused = false;
let playingAttempt = false;
music.volume = 0.3;
function updateSound() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.classList.toggle('is-on', playing);
  soundLabel.textContent = playing ? 'Mute ambience' : 'Enable ambience';
}
async function startAmbience(explicit = false) {
  if (manuallyPaused || playingAttempt || !music.paused) return;
  playingAttempt = true;
  try { await music.play(); audioStatus.textContent = ''; }
  catch { if (explicit) audioStatus.textContent = 'Audio could not start. Tap Enable ambience to try again.'; }
  finally { playingAttempt = false; updateSound(); }
}
music.addEventListener('play', updateSound);
music.addEventListener('pause', updateSound);
musicToggle.addEventListener('click', () => {
  if (!music.paused) { manuallyPaused = true; music.pause(); }
  else { manuallyPaused = false; startAmbience(true); }
});
// Audible autoplay may require a user gesture. Never restart after an explicit mute.
for (const event of ['pointerdown', 'keydown']) {
  document.addEventListener(event, e => {
    if (!e.target.closest('#musicToggle') && !manuallyPaused) startAmbience();
  });
}
startAmbience();
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('scene-paused', document.hidden);
});

const navLinks = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main > section')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navLinks) {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
}, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
sections.forEach(section => observer.observe(section));
