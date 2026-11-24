const examples = {
  call: {
    prompt: 'Mery, llama a Ana.',
    response: 'Encontré a Ana en tus contactos. ¿Quieres que la llame?',
    title: 'Tú tienes la última palabra.',
    detail: 'Mery pide tu confirmación antes de iniciar la llamada.',
    phone: '¿Llamo a Ana?',
  },
  app: {
    prompt: 'Mery, abre YouTube.',
    response: 'Claro. Abriendo YouTube.',
    title: 'Tu app, sin recorrer menús.',
    detail: 'Mery busca la aplicación instalada y solicita abrirla.',
    phone: 'Abriendo YouTube',
  },
  battery: {
    prompt: 'Mery, ¿cuánta batería tengo?',
    response: 'Tu celular tiene un 78 % de batería.',
    title: 'Una pregunta, una respuesta.',
    detail: 'Un ejemplo de cómo consultar el estado de tu teléfono.',
    phone: 'Tienes un 78 %',
  },
};
type Example = keyof typeof examples;
let selected: Example = 'call';
let heroIndex = 0;
let resetPhone: ReturnType<typeof setTimeout> | undefined;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function writeText(id: string, value: string) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function selectExample(key: Example) {
  selected = key;
  const example = examples[key];
  writeText('demo-prompt', example.prompt);
  writeText('demo-response', example.response);
  writeText('demo-result-title', example.title);
  writeText('demo-result-text', example.detail);
  document.querySelectorAll<HTMLButtonElement>('[data-demo]').forEach((button) => {
    const active = button.dataset.demo === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const conversation = document.querySelector('.conversation-body');
  if (conversation instanceof HTMLElement && !reducedMotion.matches) {
    conversation.animate([{ opacity: 0.4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
  }
}

document.querySelectorAll<HTMLButtonElement>('[data-demo]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.demo;
    if (key && Object.hasOwn(examples, key)) selectExample(key as Example);
  });
});
document.querySelector('.replay-demo')?.addEventListener('click', () => selectExample(selected));

document.querySelector('.mic-button')?.addEventListener('click', () => {
  const keys: Example[] = ['call', 'app', 'battery'];
  const key = keys[heroIndex++ % keys.length];
  const example = examples[key];
  writeText('phone-status', example.phone);
  writeText('hero-demo-status', `Ejemplo simulado. Tú: ${example.prompt} Mery: ${example.response}`);
  selectExample(key);
  clearTimeout(resetPhone);
  resetPhone = setTimeout(() => writeText('phone-status', 'Te escucho'), 4500);
});

const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir menú');
  if (mobileNav) mobileNav.hidden = true;
}
toggle?.addEventListener('click', () => {
  if (!mobileNav) return;
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 1025px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
