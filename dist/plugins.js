const apps=[{name:'Gmail',icon:'gmail',category:'Communication',description:'Email & conversations'},{name:'Google Drive',icon:'drive',category:'Documents',description:'Files & shared knowledge'},{name:'Notion',icon:'notion',category:'Documents',description:'Notes & team knowledge'},{name:'GitHub',icon:'github',category:'Development',description:'Code & collaboration'},{name:'Shopify',icon:'shopify',category:'Sales',description:'Store & commerce'},{name:'Google Calendar',icon:'calendar',category:'Productivity',description:'Meetings & schedules'},{name:'Dropbox',icon:'dropbox',category:'Documents',description:'Files & folders'},{name:'Linear',icon:'linear',category:'Development',description:'Projects & issues'},{name:'Figma',icon:'figma',category:'Productivity',description:'Design & collaboration'}];
// Two staggered streams, matching the reference's scattered horizontal flow.
const heroPlugins = ['Google','Slack','Microsoft','Asana','Salesforce','Supabase','Shopify','Discord','PayPal','PostHog','Linear','Reddit','GitLab','Pinterest','Webflow','Stripe','Coinbase','Algolia','Google Analytics','Zoom'];
const track = document.querySelector('#app-track');
track.innerHTML = heroPlugins.map(name => `<a class="moving-plugin" href="#apps" aria-label="Explore ${name}"><span class="plugin-face"><img src="assets/plugins/brands/${name.toLowerCase().replaceAll(' ','-')}.svg" alt="${name}" draggable="false"></span><span class="plugin-label">${name}</span></a>`).join('');
const heroTiles = [...track.children];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heights = [-32, 24, -12, 40, -42, 15, -24, 36, -8, 28];
const sizes = [1.04, .8, 1.16, .88, .98, 1.12, .84, 1.02, .92, 1.08];
let elapsed = 0, previousTime = 0, heroVisible = true, frameId;
// Pause the hovered band together so following tiles never collide with it.
const bandTimes = [0, 0];
const hoveredTiles = new Set();
heroTiles.forEach(tile => {
  tile.addEventListener('pointerenter', () => hoveredTiles.add(tile));
  tile.addEventListener('pointerleave', () => hoveredTiles.delete(tile));
  tile.addEventListener('focus', () => hoveredTiles.add(tile));
  tile.addEventListener('blur', () => hoveredTiles.delete(tile));
});
function paintPlugins() {
  const width = track.clientWidth;
  const mobile = width < 600;
  const gap = mobile ? 145 : 210;
  const loopWidth = 10 * gap;
  const height = track.clientHeight;
  heroTiles.forEach((tile, i) => {
    const row = i < 10 ? 0 : 1;
    const index = i % 10;
    // Both bands travel left, with offset positions and slightly different speeds.
    const offset = bandTimes[row] * (row ? 59 : 66);
    const x = ((index * gap + row * gap * .48 - offset + loopWidth / 2) % loopWidth + loopWidth) % loopWidth - loopWidth / 2;
    const bandBase = row ? height - 158 : Math.min(112, height * .15) - 28;
    const y = bandBase + heights[(index + row * 3) % 10] * (mobile ? .7 : .65);
    const focus = Math.exp(-Math.pow(x / (width * .29), 2));
    const scale = sizes[index] * (.8 + .4 * focus) * (mobile ? .65 : .76);
    const visible = Math.abs(x) < width / 2 + 130;
    tile.style.visibility = visible ? 'visible' : 'hidden';
    tile.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
    tile.style.zIndex = String(Math.round(focus * 100) + 1);
    tile.style.opacity = '1';
    tile.style.setProperty('--tile-scale', scale);
    tile.tabIndex = visible ? 0 : -1;
  });
}
function animatePlugins(time) {
  if (previousTime && !document.hidden && heroVisible && !reducedMotion.matches) {
    const dt = Math.min((time - previousTime) / 1000, .05);
    elapsed += dt;
    for (let row = 0; row < 2; row++) {
      const paused = [...hoveredTiles].some(tile => (heroTiles.indexOf(tile) < 10 ? 0 : 1) === row);
      if (!paused) bandTimes[row] += dt;
    }
  }
  previousTime = time;
  paintPlugins();
  frameId = requestAnimationFrame(animatePlugins);
}
new IntersectionObserver(([entry]) => {heroVisible = entry.isIntersecting;}, {threshold:0}).observe(track);
new ResizeObserver(paintPlugins).observe(track);
requestAnimationFrame(animatePlugins);
const backgroundVideo = document.querySelector('#hero-bg-video');
function setBackgroundPlayback() {
  // Source is stretched 10×; browser 0.25× yields effective 0.025×.
  backgroundVideo.defaultPlaybackRate = .25;
  backgroundVideo.playbackRate = .25;
  backgroundVideo.loop = true;
  if (reducedMotion.matches || document.hidden || !heroVisible) backgroundVideo.pause();
  else backgroundVideo.play().catch(() => {});
}
backgroundVideo.addEventListener('loadedmetadata', setBackgroundPlayback);
reducedMotion.addEventListener('change', setBackgroundPlayback);
document.addEventListener('visibilitychange', setBackgroundPlayback);
new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) setBackgroundPlayback();
  else backgroundVideo.pause();
}).observe(document.querySelector('.hero'));
setBackgroundPlayback();
