// Core JavaScript for Purple Birthday Portal

// --- GLOBAL STATE ---
let currentScreen = 'screen-intro';
let ytPlayer = null;
let ytApiReady = false;
let warpSpeed = false;
let warpIntensity = 1;
const starsArray = [];
const confettiArray = [];
let confettiActive = false;

// --- DOM ELEMENTS ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const musicControl = document.getElementById('music-control');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicIcon = musicToggleBtn.querySelector('i');

// --- INITIALIZE ON LOAD ---
window.addEventListener('DOMContentLoaded', () => {
  setupCanvas();
  createStars(120);
  animateStars();
  
  // Start Intro Tornado Animation
  generateTornadoRings();
  
  // Transition Intro to Portal after 5 seconds
  setTimeout(() => {
    transitionIntroToPortal();
  }, 5000);

  // Setup Event Listeners
  setupEventListeners();
});

window.addEventListener('resize', setupCanvas);

// --- CANVAS STARFIELD ---
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.color = this.getRandomPurpleTone();
    this.prevX = this.x;
    this.prevY = this.y;
  }

  getRandomPurpleTone() {
    const tones = [
      'rgba(255, 255, 255, ',
      'rgba(142, 45, 226, ', // primary purple
      'rgba(207, 169, 255, ', // light purple
      'rgba(255, 0, 127, '   // neon pink
    ];
    const randomIndex = Math.floor(Math.random() * tones.length);
    return tones[randomIndex];
  }

  update() {
    this.prevX = this.x;
    this.prevY = this.y;

    let currentSpeedX = this.speedX;
    let currentSpeedY = this.speedY;

    if (warpSpeed) {
      // Pull towards/push from center during warp
      const dx = this.x - canvas.width / 2;
      const dy = this.y - canvas.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      currentSpeedX += (dx / dist) * 15 * warpIntensity;
      currentSpeedY += (dy / dist) * 15 * warpIntensity;
    }

    this.x += currentSpeedX;
    this.y += currentSpeedY;

    // Boundary check
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
      if (warpSpeed) {
        // Start them at the center for warp effect
        this.x = canvas.width / 2 + (Math.random() - 0.5) * 20;
        this.y = canvas.height / 2 + (Math.random() - 0.5) * 20;
        this.prevX = this.x;
        this.prevY = this.y;
      }
    }
  }

  draw() {
    ctx.beginPath();
    if (warpSpeed) {
      // Draw lines for stretching stars effect
      ctx.moveTo(this.prevX, this.prevY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = this.color + this.opacity + ')';
      ctx.lineWidth = this.size * 1.5;
      ctx.stroke();
    } else {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }
}

function createStars(count) {
  starsArray.length = 0;
  for (let i = 0; i < count; i++) {
    starsArray.push(new Star());
  }
}

function animateStars() {
  // Clear with semi-transparent layer for star trailing effect during warp
  if (warpSpeed) {
    ctx.fillStyle = `rgba(6, 2, 18, 0.2)`;
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Draw & Update stars
  starsArray.forEach(star => {
    star.update();
    star.draw();
  });

  // Render Confetti if active
  if (confettiActive) {
    animateConfetti();
  }

  requestAnimationFrame(animateStars);
}

// --- TORNADO RINGS GENERATOR ---
function generateTornadoRings() {
  const container = document.getElementById('tornado-vortex');
  if (!container) return;
  container.innerHTML = '';
  
  const ringCount = 22;
  for (let i = 0; i < ringCount; i++) {
    const ring = document.createElement('div');
    ring.classList.add('tornado-ring');
    
    // Size distribution (funnel shape)
    const width = 10 + (i * i * 0.4);
    const height = 4 + (i * i * 0.08);
    ring.style.width = `${width}px`;
    ring.style.height = `${height}px`;
    
    // Vertical stacking
    const bottomOffset = i * 10;
    ring.style.bottom = `${bottomOffset}px`;
    
    // Animation properties
    const duration = 0.5 + (i * 0.06);
    const delay = i * 0.03;
    ring.style.animationDuration = `${duration}s`;
    ring.style.animationDelay = `${delay}s`;
    
    // Opacity
    ring.style.opacity = 0.15 + (i / ringCount) * 0.7;
    
    container.appendChild(ring);
  }
}

function transitionIntroToPortal() {
  const introScreen = document.getElementById('screen-intro');
  const tornado = document.getElementById('tornado-vortex');
  
  // Spin tornado super fast and shrink it
  if (tornado) {
    tornado.style.transition = 'all 1.5s ease-in-out';
    tornado.style.transform = 'scale(0.05) rotate(720deg)';
    tornado.style.opacity = '0';
  }
  
  setTimeout(() => {
    showScreen('screen-portal');
  }, 1200);
}

// --- SCREEN SYSTEM ---
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });

  const nextScreen = document.getElementById(screenId);
  if (nextScreen) {
    nextScreen.classList.add('active');
    currentScreen = screenId;
  }
}

// --- YOUTUBE AUDIO PLAYER ---
// This is automatically called by the script loaded in index.html
function onYouTubeIframeAPIReady() {
  ytApiReady = true;
  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: CONFIG.YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: CONFIG.YOUTUBE_VIDEO_ID, // required for looping
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      origin: window.location.origin // fixes iframe domain restriction on GitHub Pages
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Ready to play on user gesture
}

function onPlayerStateChange(event) {
  // Handle state change if needed
}

function startMusic() {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.unMute();
    ytPlayer.setVolume(80);
    ytPlayer.playVideo();
    
    // Show music controller overlay
    musicControl.classList.remove('music-control-hidden');
  }
}

function toggleMusic() {
  if (!ytPlayer) return;
  
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    musicIcon.className = 'fas fa-volume-mute';
    musicControl.classList.add('music-paused');
  } else {
    ytPlayer.playVideo();
    musicIcon.className = 'fas fa-volume-up';
    musicControl.classList.remove('music-paused');
  }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // 1. Enter Portal Click
  const enterPortalBtn = document.getElementById('enter-portal-btn');
  if (enterPortalBtn) {
    enterPortalBtn.addEventListener('click', enterPortalAndStart);
  }

  // 2. Music Controller Toggle
  musicToggleBtn.addEventListener('click', toggleMusic);

  // 3. Candle Extinguishing Click
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    candle.addEventListener('click', () => extinguishCandle(candle));
  });

  // 4. Send Wish Click
  const sendWishBtn = document.getElementById('send-wish-btn');
  if (sendWishBtn) {
    sendWishBtn.addEventListener('click', submitWish);
  }

  // 5. Open Gift Box Click
  const giftBox = document.getElementById('interactive-gift-box');
  if (giftBox) {
    giftBox.addEventListener('click', openGiftBox);
  }

  // 6. Next to Farewell Click
  const nextBtn = document.getElementById('next-to-farewell');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showScreen('screen-farewell');
      setupFarewellScreen();
    });
  }

  // 7. Replay Click
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', resetAndReplay);
  }

  // 8. Copy Buttons Handler
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => copyCredential(btn));
  });
}

// --- PORTAL WARP & START ---
function enterPortalAndStart() {
  // Start Music
  startMusic();

  // Trigger starfield warp speed
  warpSpeed = true;
  warpIntensity = 1;

  // Slowly increase warp intensity
  let warpInterval = setInterval(() => {
    warpIntensity += 0.5;
  }, 100);

  // Animate Portal expanding
  const portalOuter = document.querySelector('.portal-outer-ring');
  if (portalOuter) {
    portalOuter.style.transition = 'all 1.5s cubic-bezier(0.895, 0.03, 0.685, 0.22)';
    portalOuter.style.transform = 'scale(10)';
    portalOuter.style.opacity = '0';
  }

  setTimeout(() => {
    clearInterval(warpInterval);
    warpSpeed = false;
    showScreen('screen-chat');
    startChatExperience();
  }, 1500);
}

// --- CHATROOM LOGIC ---
let chatIndex = 0;
const typingIndicator = document.getElementById('chat-typing-indicator');
const chatMessages = document.getElementById('chat-messages');
const charAvatar = document.getElementById('char-avatar');
const avatarRing = document.querySelector('.avatar-glow-ring');
const moodText = document.getElementById('char-mood-text');

function startChatExperience() {
  chatIndex = 0;
  chatMessages.innerHTML = '';
  chatMessages.appendChild(typingIndicator);
  playNextChatMessage();
}

function playNextChatMessage() {
  if (chatIndex >= CONFIG.CHAT_SCRIPT.length) {
    // End of Chat -> transition to cake
    setTimeout(() => {
      showScreen('screen-cake');
    }, 3000);
    return;
  }

  const msg = CONFIG.CHAT_SCRIPT[chatIndex];
  
  // Show Typing Indicator
  typingIndicator.style.display = 'flex';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Dynamic status update
  if (moodText) {
    moodText.textContent = getMoodText(msg.expression);
  }

  // Calculate typing speed/duration (between 1.2s and 2.5s)
  const typingTime = Math.min(2500, Math.max(1200, msg.text.length * 25));

  setTimeout(() => {
    // Hide Typing Indicator
    typingIndicator.style.display = 'none';

    // Update Character Expression
    updateCharacterExpression(msg.expression);

    // Create & Inject Chat Bubble
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble', `message-${msg.sender}`);
    bubble.textContent = msg.text;
    
    // Inject bubble before the hidden typing indicator
    chatMessages.insertBefore(bubble, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatIndex++;
    
    // Calculate reading time based on message length (approx 65ms per character, min 2.2s)
    const readTime = Math.max(2200, msg.text.length * 65);
    
    // Play next message after the reading time
    setTimeout(playNextChatMessage, readTime);

  }, typingTime);
}

function updateCharacterExpression(expression) {
  if (!charAvatar) return;

  // Set avatar image source
  charAvatar.src = `assets/${expression}.png`;

  // Blushing special effect
  if (expression === 'blushing') {
    avatarRing.classList.add('blush-active');
  } else {
    avatarRing.classList.remove('blush-active');
  }
}

function getMoodText(expression) {
  switch (expression) {
    case 'smiling': return 'smiling at you... 😊';
    case 'blushing': return 'blushing... 🙈';
    case 'excited': return 'super excited! 🥳';
    case 'neutral': 
    default:
      return 'talking now...';
  }
}

// --- BIRTHDAY CAKE & CANDLES ---
let activeCandlesCount = 5;
const candlesCounterEl = document.getElementById('candles-counter');

function extinguishCandle(candle) {
  if (candle.classList.contains('extinguished')) return;

  candle.classList.add('extinguished');
  
  // Trigger small smoke particle effect
  createSmokeParticles(candle);

  activeCandlesCount--;
  if (candlesCounterEl) {
    candlesCounterEl.textContent = activeCandlesCount;
  }

  if (activeCandlesCount === 0) {
    // All candles blown out!
    setTimeout(() => {
      triggerConfettiRain();
    }, 500);

    setTimeout(() => {
      showScreen('screen-wish');
    }, 3500);
  }
}

function createSmokeParticles(candle) {
  const rect = candle.getBoundingClientRect();
  // We can just create floating div particles that fade away
  for (let i = 0; i < 6; i++) {
    const smoke = document.createElement('div');
    smoke.style.position = 'fixed';
    smoke.style.top = `${rect.top}px`;
    smoke.style.left = `${rect.left + rect.width / 2}px`;
    smoke.style.width = `${Math.random() * 8 + 4}px`;
    smoke.style.height = smoke.style.width;
    smoke.style.backgroundColor = 'rgba(255,255,255,0.4)';
    smoke.style.borderRadius = '50%';
    smoke.style.pointerEvents = 'none';
    smoke.style.zIndex = '1000';
    smoke.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(smoke);
    
    // Animate outwards and upwards
    setTimeout(() => {
      smoke.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -${Math.random() * 50 + 20}px) scale(1.5)`;
      smoke.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      smoke.remove();
    }, 1000);
  }
}

// --- HIGH PERFORMANCE CONFETTI CANVAS ---
class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = Math.random() * 8 + 5;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = Math.random() * 3 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const colors = [
      '#8e2de2', // Primary purple
      '#4a00e0', // Dark purple
      '#cfa9ff', // Light purple
      '#ff007f', // Neon pink
      '#ffd700', // Gold
      '#00f3ff'  // Neon blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    
    if (this.y > canvas.height) {
      this.y = Math.random() * -100;
      this.x = Math.random() * canvas.width;
      this.speedY = Math.random() * 3 + 4;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    // Draw rectangles representing confetti
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function triggerConfettiRain() {
  confettiArray.length = 0;
  for (let i = 0; i < 150; i++) {
    confettiArray.push(new ConfettiParticle());
  }
  confettiActive = true;
  
  // Stop after 6 seconds
  setTimeout(() => {
    confettiActive = false;
  }, 6000);
}

function animateConfetti() {
  confettiArray.forEach(p => {
    p.update();
    p.draw();
  });
}

// --- WISH SCREEN LOGIC ---
function submitWish() {
  const wishTextarea = document.getElementById('wish-textarea');
  const wish = wishTextarea.value.trim();
  const form = document.querySelector('.wish-form');

  if (!wish) {
    wishTextarea.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      wishTextarea.style.animation = '';
    }, 500);
    return;
  }

  // Send the wish to Formspree if configured
  if (CONFIG.FORMSPREE_ENDPOINT) {
    fetch(CONFIG.FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        wish: wish,
        date: new Date().toLocaleString()
      })
    }).catch(err => console.error('Error sending wish to Formspree:', err));
  }

  // Create flying text animation
  createFlyingWishAnimation(wishTextarea);

  // Transition to Gift Box Screen
  setTimeout(() => {
    showScreen('screen-gift');
    // Prepare the Gift contents
    document.getElementById('netflix-email').textContent = CONFIG.NETFLIX.email;
  }, 2200);
}

function createFlyingWishAnimation(textarea) {
  const rect = textarea.getBoundingClientRect();
  const textVal = textarea.value;
  
  // Create virtual clone
  const flyingText = document.createElement('div');
  flyingText.textContent = textVal;
  flyingText.style.position = 'fixed';
  flyingText.style.top = `${rect.top}px`;
  flyingText.style.left = `${rect.left}px`;
  flyingText.style.width = `${rect.width}px`;
  flyingText.style.height = `${rect.height}px`;
  flyingText.style.padding = '20px';
  flyingText.style.color = 'var(--purple-light)';
  flyingText.style.fontSize = '1.1rem';
  flyingText.style.fontFamily = 'inherit';
  flyingText.style.textAlign = 'center';
  flyingText.style.background = 'transparent';
  flyingText.style.pointerEvents = 'none';
  flyingText.style.zIndex = '1000';
  flyingText.style.textShadow = '0 0 10px var(--purple-glow)';
  flyingText.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  document.body.appendChild(flyingText);
  
  // Animate it: fade, scale down, and fly towards sky
  setTimeout(() => {
    flyingText.style.transform = `translate(${window.innerWidth / 2 - rect.left - rect.width/2}px, -${rect.top + 200}px) scale(0.1)`;
    flyingText.style.opacity = '0';
  }, 50);

  // Clear original textbox
  textarea.value = '';
  
  setTimeout(() => {
    flyingText.remove();
  }, 2200);
}

// CSS SHAKE ANIMATION KEYFRAME INJECTOR
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(styleSheet);

// --- GIFT REVEAL SCREEN ---
function openGiftBox() {
  const giftBox = document.getElementById('interactive-gift-box');
  const giftCard = document.getElementById('gift-card');
  
  if (giftBox.classList.contains('opened')) return;

  giftBox.classList.add('opened');

  setTimeout(() => {
    // Hide giftbox
    giftBox.style.display = 'none';
    
    // Reveal Netflix card
    giftCard.classList.remove('gift-card-hidden');
    giftCard.classList.add('gift-card-active');
    
    // Rain a light confetti burst
    triggerConfettiRain();
  }, 1000);
}

function copyCredential(btn) {
  const targetId = btn.getAttribute('data-copy');
  const targetVal = document.getElementById(targetId).textContent;
  
  navigator.clipboard.writeText(targetVal).then(() => {
    // Show success checkmark
    const icon = btn.querySelector('i');
    icon.className = 'fas fa-check';
    icon.style.color = '#39ff14'; // bright green
    
    setTimeout(() => {
      icon.className = 'far fa-copy';
      icon.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// --- FAREWELL SCREEN ---
function setupFarewellScreen() {
  const fwTitle = document.getElementById('farewell-title');
  const fwBody = document.getElementById('farewell-body');
  const fwSign = document.getElementById('farewell-signoff');

  fwTitle.textContent = CONFIG.FAREWELL.title;
  fwBody.textContent = CONFIG.FAREWELL.body;
  fwSign.textContent = CONFIG.FAREWELL.signOff;
}

// --- RESET & REPLAY ---
function resetAndReplay() {
  // 1. Reset chat
  chatIndex = 0;
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  chatMessages.appendChild(typingIndicator);
  
  // Reset character expression
  updateCharacterExpression('neutral');
  if (moodText) moodText.textContent = 'Connecting...';

  // 2. Relight Candles
  activeCandlesCount = 5;
  if (candlesCounterEl) candlesCounterEl.textContent = '5';
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    candle.classList.remove('extinguished');
  });

  // 3. Reset Gift box
  const giftBox = document.getElementById('interactive-gift-box');
  const giftCard = document.getElementById('gift-card');
  giftBox.style.display = 'block';
  giftBox.classList.remove('opened');
  giftCard.classList.add('gift-card-hidden');
  giftCard.classList.remove('gift-card-active');

  // 4. Return to Portal Screen
  const portalOuter = document.querySelector('.portal-outer-ring');
  if (portalOuter) {
    portalOuter.style.transition = '';
    portalOuter.style.transform = '';
    portalOuter.style.opacity = '';
  }
  
  showScreen('screen-portal');
}
