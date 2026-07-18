/* ─────────────────────────────────────────────
   QR Generator — app.js
───────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const urlInput       = document.getElementById('url-input');
  const inputWrapper   = document.getElementById('input-wrapper');
  const clearBtn       = document.getElementById('clear-btn');
  const generateBtn    = document.getElementById('generate-btn');
  const qrPlaceholder  = document.getElementById('qr-placeholder');
  const qrResult       = document.getElementById('qr-result');
  const qrContainer    = document.getElementById('qrcode');
  const qrUrlLabel     = document.getElementById('qr-url-label');
  const downloadBtn    = document.getElementById('download-btn');
  const copyBtn        = document.getElementById('copy-btn');
  const toast          = document.getElementById('toast');
  const fgColor        = document.getElementById('fg-color');
  const bgColor        = document.getElementById('bg-color');
  const fgPreview      = document.getElementById('fg-preview');
  const bgPreview      = document.getElementById('bg-preview');
  const sizeBtns       = document.querySelectorAll('.size-btn');

  /* ── State ── */
  let currentQRCode  = null;
  let selectedSize   = 200;
  let toastTimeout   = null;
  let currentDataURL = null;

  /* ── Particles ── */
  (function spawnParticles() {
    const container = document.getElementById('particles');
    const count = 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left     = Math.random() * 100 + 'vw';
      p.style.width    = (Math.random() * 4 + 2) + 'px';
      p.style.height   = p.style.width;
      p.style.animationDuration  = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay    = -(Math.random() * 20) + 's';
      p.style.opacity = Math.random() * 0.6 + 0.2;
      container.appendChild(p);
    }
  })();

  /* ── Size selection ── */
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = parseInt(btn.dataset.size, 10);
    });
  });

  /* ── Color pickers ── */
  fgColor.addEventListener('input', () => {
    fgPreview.style.background = fgColor.value;
  });
  bgColor.addEventListener('input', () => {
    bgPreview.style.background = bgColor.value;
    bgPreview.style.border = bgColor.value === '#ffffff' ? '1px solid #ddd' : '1px solid transparent';
  });

  /* ── Clear button ── */
  urlInput.addEventListener('input', () => {
    clearBtn.classList.toggle('visible', urlInput.value.length > 0);
  });
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    clearBtn.classList.remove('visible');
    urlInput.focus();
  });

  /* ── Generate on Enter ── */
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generateQR();
  });

  /* ── Generate button ── */
  generateBtn.addEventListener('click', generateQR);

  /* ── Main generate function ── */
  function generateQR() {
    const raw = urlInput.value.trim();

    if (!raw) {
      showToast('⚠️  الرجاء إدخال رابط أو نص', 'error');
      urlInput.focus();
      shakeInput();
      return;
    }

    // Normalize URL if needed
    let text = raw;
    if (/^(www\.)/i.test(text) && !text.startsWith('http')) {
      text = 'https://' + text;
    }

    // Show loading
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;

    setTimeout(() => {
      try {
        // Clear old QR
        qrContainer.innerHTML = '';
        currentQRCode = null;
        currentDataURL = null;

        // Create new QR
        currentQRCode = new QRCode(qrContainer, {
          text: text,
          width:  selectedSize,
          height: selectedSize,
          colorDark:  fgColor.value,
          colorLight: bgColor.value,
          correctLevel: QRCode.CorrectLevel.H,
        });

        // Grab canvas/image for download
        setTimeout(() => {
          const canvas = qrContainer.querySelector('canvas');
          if (canvas) {
            currentDataURL = canvas.toDataURL('image/png');
          } else {
            // fallback: img element
            const img = qrContainer.querySelector('img');
            if (img) currentDataURL = img.src;
          }
        }, 100);

        // Show result
        qrUrlLabel.textContent = text;
        qrPlaceholder.classList.add('hidden');
        qrResult.classList.remove('hidden');

        showToast('✅  تم إنشاء رمز QR بنجاح!', 'success');

      } catch (err) {
        console.error(err);
        showToast('❌  حدث خطأ، تأكد من صحة الرابط', 'error');
      } finally {
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
      }
    }, 400);
  }

  /* ── Download ── */
  downloadBtn.addEventListener('click', () => {
    const canvas = qrContainer.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('📥  تم تحميل الصورة!', 'success');
    } else if (currentDataURL) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = currentDataURL;
      link.click();
      showToast('📥  تم تحميل الصورة!', 'success');
    } else {
      showToast('⚠️  لا يوجد رمز QR للتحميل', 'error');
    }
  });

  /* ── Copy to clipboard ── */
  copyBtn.addEventListener('click', async () => {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) {
      showToast('⚠️  لا يوجد رمز QR للنسخ', 'error');
      return;
    }
    try {
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          showToast('📋  تم نسخ الصورة إلى الحافظة!', 'success');
        } catch {
          // Fallback: copy URL text
          await navigator.clipboard.writeText(urlInput.value.trim());
          showToast('📋  تم نسخ الرابط إلى الحافظة!', 'success');
        }
      });
    } catch (err) {
      showToast('❌  فشل النسخ', 'error');
    }
  });

  /* ── Toast ── */
  function showToast(message, type = 'success') {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ── Shake animation for empty input ── */
  function shakeInput() {
    inputWrapper.style.animation = 'none';
    inputWrapper.offsetHeight; // reflow
    inputWrapper.style.animation = 'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)';

    if (!document.getElementById('shake-style')) {
      const s = document.createElement('style');
      s.id = 'shake-style';
      s.textContent = `
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }`;
      document.head.appendChild(s);
    }
  }

})();
