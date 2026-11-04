function validarTikTok(cuenta) {
  return /^@[A-Za-z0-9_.]{3,}$/.test(cuenta.trim());
}

function registrarBitácora(tipo, mensaje, idContenedor = 'logOutput') {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString();
  const caja = document.getElementById(idContenedor);
  const item = document.createElement('div');
  item.innerHTML = `[${hora}] <strong>${tipo}:</strong> ${mensaje}`;
  caja.prepend(item);
}

document.addEventListener('DOMContentLoaded', () => {

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeBtn.textContent = isLight ? '☀️' : '🌙';
    });
  }

  const liveAudio = document.getElementById('liveAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn && liveAudio) {
    liveAudio.volume = 0.5;
    audioToggleBtn.addEventListener('click', () => {
      if (liveAudio.paused) {
        liveAudio.play().then(() => {
          audioToggleBtn.textContent = '🔇 Silenciar Live';
        }).catch(() => {
          alert("Haz clic de nuevo para habilitar el audio.");
        });
      } else {
        liveAudio.pause();
        audioToggleBtn.textContent = '🎵 Audio del Live';
      }
    });
  }

});

function filtrar(categoria) {
  document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const tarjetas = document.querySelectorAll('.product-card');
  tarjetas.forEach(card => {
    if (categoria === 'todos' || card.dataset.categoria === categoria) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  const select = document.getElementById('variantSelect');
  Array.from(select.options).forEach(opt => {
    if (categoria === 'todos' || opt.dataset.categoria === categoria) {
      opt.style.display = 'block';
    } else {
      opt.style.display = 'none';
    }
  });

  const primeraOpcion = Array.from(select.options).find(opt => opt.style.display !== 'none');
  if (primeraOpcion) select.value = primeraOpcion.value;

  registrarBitácora('FILTRO_DOM', `Categoría seleccionada: ${categoria}`);
}

function seleccionarProducto(nombreCompleto, nombreCorto) {
  const select = document.getElementById('variantSelect');
  select.value = nombreCompleto;
  registrarBitácora('SELECCIÓN_PREVIA', `Producto seleccionado para venta: ${nombreCorto}`, 'logDia2');
}

const btnSendChat = document.getElementById('btnSendChat');
const chatInput = document.getElementById('chatInput');
const userTikTokChat = document.getElementById('userTikTokChat');

const palabrasVenta = ['quiero', 'comprar', 'precio', 'album', 'álbum', 'pedir', 'maxident', 'oddinary', 'noeasy', 'ate', 'rock-star', '5-star', 'mixtape', 'i am', 'clé', 'go live', 'in life', 'all in', 'giant', 'the sound', 'skzoo', 'lightstick', 'ticket', 'peluche', 'wolf chan', 'leebit', 'dwaekki', 'jiniret', 'bbokari', 'puppym', 'foxi.ny', 'vip', 'soundcheck', 'general'];

function procesarComentarioChat() {
  const usuario = userTikTokChat.value.trim();
  const mensaje = chatInput.value.trim();

  if (!validarTikTok(usuario)) {
    alert('Ingresa una cuenta de TikTok válida que comience con "@" (Ej: @stay_forever)');
    userTikTokChat.focus();
    return;
  }
  if (mensaje === '') {
    alert('Escribe un comentario para el live.');
    chatInput.focus();
    return;
  }

  const mensajeMinuscula = mensaje.toLowerCase();
  const esIntencionVenta = palabrasVenta.some(palabra => mensajeMinuscula.includes(palabra));

  if (esIntencionVenta) {
    registrarBitácora('PEDIDO_CHAT', `${usuario} comentó en el live: "${mensaje}"`, 'logOutput');
  } else {
    registrarBitácora('CHAT_FAN', `${usuario}: "${mensaje}"`, 'logOutput');
  }

  chatInput.value = '';
}

if (btnSendChat) {
  btnSendChat.addEventListener('click', procesarComentarioChat);
}
if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') procesarComentarioChat();
  });
}

document.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'like') {
    registrarBitácora('LIKE_LIVE', '¡Interacción de corazones ❤️ recibida en el directo!', 'logOutput');
  }
});

const orderForm = document.getElementById('orderForm');
const userTikTokOrder = document.getElementById('userTikTokOrder');
const variantSelect = document.getElementById('variantSelect');

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = userTikTokOrder.value.trim();
    const producto = variantSelect.value;

    if (!validarTikTok(usuario)) {
      alert('Por favor ingresa un usuario de TikTok válido para confirmar la orden.');
      userTikTokOrder.focus();
      return;
    }

    registrarBitácora('VENTA_CONFIRMADA', `Orden procesada para ${usuario} -> ${producto}`, 'logDia2');
    orderForm.reset();
  });
}