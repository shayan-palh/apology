import { triggerFlowerShower } from './canvas.js';
import { toggleAudio, playCelebrationChime } from './audio.js';

const state = {
  recipient: 'My Dear Friend',
  sender: 'Your Friend',
  letter: `I am so sorry for making you upset. Our friendship means so much to me, and I never meant to hurt your feelings. Can you please forgive me?`,
  theme: 'velvet'
};

const recipientDisplays = document.querySelectorAll('.recipient-name-inline');
const recipientHeroDisplay = document.getElementById('recipient-name-display');
const senderDisplay = document.getElementById('sender-name-display');
const apologyTextMain = document.getElementById('apology-text-main');

const themeBtn = document.getElementById('theme-btn');
const themeDropdown = document.getElementById('theme-dropdown');
const musicToggleBtn = document.getElementById('music-toggle');
const musicIconOn = document.getElementById('music-icon-on');
const musicIconOff = document.getElementById('music-icon-off');

const customizeBtn = document.getElementById('customize-btn');
const customizeDrawer = document.getElementById('customize-drawer');
const drawerCloseBtn = document.getElementById('drawer-close-btn');
const inputRecipient = document.getElementById('input-recipient');
const inputSender = document.getElementById('input-sender');
const inputLetter = document.getElementById('input-letter');
const saveCustomizationBtn = document.getElementById('save-customization-btn');
const shareLinkBtn = document.getElementById('share-link-btn');
const shareToast = document.getElementById('share-toast');

const forgiveFlowerBtn = document.getElementById('forgive-flower-btn');
const forgiveNoBtn = document.getElementById('forgive-no-btn');
const noBtnText = document.getElementById('no-btn-text');
const playfulFeedback = document.getElementById('playful-feedback');
const celebrationModal = document.getElementById('celebration-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalHugBtn = document.getElementById('modal-hug-btn');

function loadParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const to = urlParams.get('to');
  const from = urlParams.get('from');
  const msg = urlParams.get('msg');
  const theme = urlParams.get('theme');

  if (to) state.recipient = decodeURIComponent(to);
  if (from) state.sender = decodeURIComponent(from);
  if (msg) state.letter = decodeURIComponent(msg);
  if (theme && ['velvet', 'midnight', 'blush'].includes(theme)) state.theme = theme;

  updateDOM();
}

function updateDOM() {
  if (recipientHeroDisplay) recipientHeroDisplay.textContent = state.recipient;
  recipientDisplays.forEach(el => el.textContent = state.recipient);
  if (senderDisplay) senderDisplay.textContent = state.sender;
  if (apologyTextMain) apologyTextMain.textContent = `"${state.letter}"`;

  document.body.dataset.theme = state.theme;

  if (inputRecipient) inputRecipient.value = state.recipient;
  if (inputSender) inputSender.value = state.sender;
  if (inputLetter) inputLetter.value = state.letter;

  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.setTheme === state.theme);
  });
}

themeBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  themeDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!themeDropdown.contains(e.target) && e.target !== themeBtn) {
    themeDropdown.classList.add('hidden');
  }
});

document.querySelectorAll('.theme-option').forEach(btn => {
  btn.addEventListener('click', () => {
    state.theme = btn.dataset.setTheme;
    document.body.dataset.theme = state.theme;
    themeDropdown.classList.add('hidden');
    updateDOM();
  });
});

musicToggleBtn?.addEventListener('click', () => {
  const isPlaying = toggleAudio();
  if (isPlaying) {
    musicIconOn?.classList.remove('hidden');
    musicIconOff?.classList.add('hidden');
  } else {
    musicIconOn?.classList.add('hidden');
    musicIconOff?.classList.remove('hidden');
  }
});

customizeBtn?.addEventListener('click', () => {
  customizeDrawer.classList.remove('hidden');
});

drawerCloseBtn?.addEventListener('click', () => {
  customizeDrawer.classList.add('hidden');
});

customizeDrawer?.addEventListener('click', (e) => {
  if (e.target === customizeDrawer) customizeDrawer.classList.add('hidden');
});

saveCustomizationBtn?.addEventListener('click', () => {
  state.recipient = inputRecipient.value.trim() || 'My Dear Friend';
  state.sender = inputSender.value.trim() || 'Your Friend';
  state.letter = inputLetter.value.trim() || state.letter;

  updateDOM();
  customizeDrawer.classList.add('hidden');
});

shareLinkBtn?.addEventListener('click', () => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('to', state.recipient);
  params.set('from', state.sender);
  params.set('msg', state.letter);
  params.set('theme', state.theme);

  const shareUrl = `${baseUrl}?${params.toString()}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    shareToast.classList.remove('hidden');
    setTimeout(() => shareToast.classList.add('hidden'), 3500);
  }).catch(() => {
    alert('Copy URL: ' + shareUrl);
  });
});

// --- Flower Fall & Forgiveness Trigger ---
function triggerFlowerForgiveness() {
  // Trigger dense continuous flower shower cascade from the top
  triggerFlowerShower();

  // Play audio chime
  playCelebrationChime();

  // Open modal
  celebrationModal.classList.remove('hidden');
}

forgiveFlowerBtn?.addEventListener('click', triggerFlowerForgiveness);

let noClickCount = 0;
const playfulPhrases = [
  "Are you sure? 🥺",
  "I'll buy you your favorite coffee! ☕",
  "I promise to be the best friend ever! 🤝",
  "Pretty please with a cherry on top? 🍒",
  "Okay, click the green button now! 😉"
];

forgiveNoBtn?.addEventListener('click', () => {
  noClickCount++;
  
  if (noClickCount <= playfulPhrases.length) {
    noBtnText.textContent = playfulPhrases[noClickCount - 1];
    
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 60;
    forgiveNoBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    if (playfulFeedback) {
      playfulFeedback.textContent = `Aww... let me keep trying to make it up to you! 🌸 (Attempt ${noClickCount})`;
      playfulFeedback.classList.remove('hidden');
    }
  }

  if (noClickCount >= playfulPhrases.length) {
    forgiveNoBtn.classList.remove('btn-no');
    forgiveNoBtn.classList.add('btn-flower-trigger');
    forgiveNoBtn.style.transform = 'none';
    noBtnText.textContent = "Okay, I Forgive You & Accept Flowers! 🌸";
    forgiveNoBtn.onclick = triggerFlowerForgiveness;
  }
});

modalCloseBtn?.addEventListener('click', () => {
  celebrationModal.classList.add('hidden');
});

modalHugBtn?.addEventListener('click', () => {
  triggerFlowerShower();
});

loadParams();
