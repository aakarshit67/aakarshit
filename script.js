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

const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const soundLabel = document.getElementById('soundLabel');
const audioStatus = document.getElementById('audioStatus');
music.volume = 0.35;
function updateSound() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.classList.toggle('is-on', playing);
  soundLabel.textContent = playing ? 'Sound on' : 'Sound off';
}
music.addEventListener('play', updateSound);
music.addEventListener('pause', updateSound);
musicToggle.addEventListener('click', async () => {
  audioStatus.textContent = '';
  if (!music.paused) { music.pause(); return; }
  musicToggle.disabled = true;
  try { await music.play(); }
  catch { audioStatus.textContent = 'The music could not play. Please try again.'; updateSound(); }
  finally { musicToggle.disabled = false; }
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
