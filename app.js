/* ═══════════════════════════════════════════
   QR Generator Pro — app.js
   Uses qr-code-styling library
═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── QR dot style definitions ── */
  const QR_STYLES = {
    'square':        { dots:'square',        cornersSquare:'square',        cornersDot:'square' },
    'dots':          { dots:'dots',           cornersSquare:'dot',           cornersDot:'dot'    },
    'rounded':       { dots:'rounded',        cornersSquare:'extra-rounded', cornersDot:'dot'    },
    'extra-rounded': { dots:'extra-rounded',  cornersSquare:'extra-rounded', cornersDot:'dot'    },
    'classy':        { dots:'classy',         cornersSquare:'square',        cornersDot:'square' },
    'classy-rounded':{ dots:'classy-rounded', cornersSquare:'extra-rounded', cornersDot:'dot'    },
  };

  /* ── Logo definitions ── */
  // qrSrc = image shown INSIDE the QR code center
  // SVG data URIs for branded logos that need custom colors

  // Snapchat — yellow background + white ghost (الرسمي)
  const _snapchatQr = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#FFFC00" rx="18"/>
      <!-- Simplified Snapchat ghost shape in white -->
      <path fill="white" d="
        M50 18 C34 18 28 28 28 38 L28 50
        C25 51 20 53 20 57 C20 60 24 62 28 60
        C28 62 28 66 31 68 C31 70 26 72 24 74
        C22 76 24 78 28 77 C32 76 38 75 50 75
        C62 75 68 76 72 77 C76 78 78 76 76 74
        C74 72 69 70 69 68 C72 66 72 62 72 60
        C76 62 80 60 80 57 C80 53 75 51 72 50
        L72 38 C72 28 66 18 50 18 Z
      "/>
      <!-- Ghost eyes (yellow cutouts) -->
      <circle fill="#FFFC00" cx="40" cy="42" r="6"/>
      <circle fill="#FFFC00" cx="60" cy="42" r="6"/>
    </svg>`
  );

  // Etisalat Cash — الأحمر الرسمي الأصلي
  const _etisalatQr = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#CC0000" rx="18"/>
      <text x="50" y="68" font-size="46" font-family="Arial Black,sans-serif"
        font-weight="900" fill="white" text-anchor="middle">e&amp;</text>
    </svg>`
  );

  // InstaPay — الصورة الرسمية مضمّنة كـ base64 (تعمل مع file:// بدون مشاكل)
  const _instapayQr = 'data:image/png;base64,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';


  // Google Reviews — الـ G بالألوان الأربعة الرسمية
  const _googleQr = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="18"/>
      <path fill="#4285F4" d="M91 51c0-3-.3-6-.8-9H50v17h23c-1 5.5-4 10-8.5 13.1v11h13.7C86 75 91 64 91 51z"/>
      <path fill="#34A853" d="M50 92c11.7 0 21.5-3.9 28.7-10.5L65 70.5C61.5 73 57 74.5 50 74.5c-11.4 0-21-7.7-24.5-18H8v11.2C15.2 82.8 31.6 92 50 92z"/>
      <path fill="#FBBC05" d="M25.5 56.5C24.5 53.5 24 50.3 24 47s.5-6.5 1.5-9.5V26.3H8C4.8 32.7 3 39.7 3 47s1.8 14.3 5 20.7L25.5 56.5z"/>
      <path fill="#EA4335" d="M50 21.5c6.5 0 12.3 2.2 16.9 6.6L79 16C71.5 9 61.7 5 50 5 31.6 5 15.2 14.2 8 27.3L25.5 38.5c3.5-10.3 13.1-17 24.5-17z"/>
    </svg>`
  );

  const LOGOS = {
    'none':      { qrSrc: null },
    'whatsapp':  { qrSrc: 'https://cdn.simpleicons.org/whatsapp/25D366' },
    'instagram': { qrSrc: 'https://cdn.simpleicons.org/instagram/C13584' },
    'facebook':  { qrSrc: 'https://cdn.simpleicons.org/facebook/1877F2' },
    'google':    { qrSrc: _googleQr },
    'youtube':   { qrSrc: 'https://cdn.simpleicons.org/youtube/FF0000' },
    'tiktok':    { qrSrc: 'https://cdn.simpleicons.org/tiktok/000000' },
    'x':         { qrSrc: 'https://cdn.simpleicons.org/x/000000' },
    'snapchat':  { qrSrc: _snapchatQr },
    'linkedin':  { qrSrc: 'https://cdn.simpleicons.org/linkedin/0A66C2' },
    'vodafone':  { qrSrc: 'https://cdn.simpleicons.org/vodafone/E60000' },
    'etisalat':  { qrSrc: _etisalatQr },
    'orange':    { qrSrc: 'https://cdn.simpleicons.org/orange/FF6600' },
    'instapay':  { qrSrc: _instapayQr },
    'paypal':    { qrSrc: 'https://cdn.simpleicons.org/paypal/003087' },
    'custom':    { qrSrc: null }, // filled when user uploads
  };


  /* ── DOM refs ── */
  const urlInput         = document.getElementById('url-input');
  const clearBtn         = document.getElementById('clear-btn');
  const inputWrapper     = document.getElementById('input-wrapper');
  const generateBtn      = document.getElementById('generate-btn');
  const btnText          = document.getElementById('btn-text');
  const styleGrid        = document.getElementById('style-grid');
  const logoGrid         = document.getElementById('logo-grid');
  const fgColor          = document.getElementById('fg-color');
  const bgColor          = document.getElementById('bg-color');
  const fgSwatch         = document.getElementById('fg-swatch');
  const bgSwatch         = document.getElementById('bg-swatch');
  const outputCard       = document.getElementById('output-card');
  const qrCanvasContainer= document.getElementById('qr-canvas-container');
  const qrDisplayWrap    = document.getElementById('qr-display-wrap');
  const qrUrlLabel       = document.getElementById('qr-url-label');
  const downloadBtn      = document.getElementById('download-btn');
  const copyBtn          = document.getElementById('copy-btn');
  const shareBtn         = document.getElementById('share-btn');
  const toast            = document.getElementById('toast');
  const customLogoInput  = document.getElementById('custom-logo-input');
  const customLogoCard   = document.getElementById('custom-logo-card');
  const customLogoThumb  = document.getElementById('custom-logo-thumb');
  const customUploadIcon = document.getElementById('custom-upload-icon');

  /* ── State ── */
  let selectedStyle     = 'square';
  let selectedLogo      = 'none';
  let selectedSize      = 400;
  let customLogoDataUrl = null;
  let qrInstance        = null;
  let toastTimer        = null;

  /* ─────────────────────────────────
     Particles
  ───────────────────────────────── */
  (function spawnParticles() {
    const cont = document.getElementById('particles');
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left             = Math.random() * 100 + 'vw';
      const sz                 = (Math.random() * 4 + 2) + 'px';
      p.style.width = p.style.height = sz;
      p.style.animationDuration = (Math.random() * 14 + 10) + 's';
      p.style.animationDelay   = -(Math.random() * 20) + 's';
      p.style.opacity           = (Math.random() * 0.5 + 0.2).toString();
      cont.appendChild(p);
    }
  })();

  /* ─────────────────────────────────
     Clear button
  ───────────────────────────────── */
  urlInput.addEventListener('input', () => {
    clearBtn.classList.toggle('visible', urlInput.value.length > 0);
  });
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    clearBtn.classList.remove('visible');
    urlInput.focus();
  });

  /* Enter key */
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });

  /* ─────────────────────────────────
     Color swatches sync
  ───────────────────────────────── */
  fgColor.addEventListener('input', () => { fgSwatch.style.background = fgColor.value; });
  bgColor.addEventListener('input', () => {
    bgSwatch.style.background = bgColor.value;
    bgSwatch.style.border = bgColor.value.toLowerCase() === '#ffffff'
      ? '2px solid #ccc' : '2px solid rgba(255,255,255,0.12)';
  });

  /* ─────────────────────────────────
     Size buttons
  ───────────────────────────────── */
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = parseInt(btn.dataset.size, 10);
    });
  });

  /* ─────────────────────────────────
     Style selection
  ───────────────────────────────── */
  styleGrid.addEventListener('click', e => {
    const card = e.target.closest('.style-card');
    if (!card) return;
    document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedStyle = card.dataset.style;
  });

  /* ─────────────────────────────────
     Logo selection
  ───────────────────────────────── */
  logoGrid.addEventListener('click', e => {
    const card = e.target.closest('.logo-card');
    if (!card) return;

    const logoId = card.dataset.logo;

    // Custom upload: open file picker
    if (logoId === 'custom') {
      customLogoInput.click();
      return;
    }

    selectLogo(logoId);
  });

  function selectLogo(id) {
    document.querySelectorAll('.logo-card').forEach(c => c.classList.remove('active'));
    const target = document.querySelector(`.logo-card[data-logo="${id}"]`);
    if (target) target.classList.add('active');
    selectedLogo = id;
  }

  /* Custom logo upload */
  customLogoInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️  حجم الصورة كبير جداً (أقصاه 5 MB)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      customLogoDataUrl = ev.target.result;
      LOGOS['custom'].qrSrc = customLogoDataUrl;
      // Update preview thumbnail
      customLogoThumb.src = customLogoDataUrl;
      customLogoThumb.style.display = 'block';
      customUploadIcon.style.display = 'none';
      selectLogo('custom');
      showToast('✅ تم رفع اللوجو بنجاح', 'success');
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    customLogoInput.value = '';
  });

  /* ─────────────────────────────────
     Generate
  ───────────────────────────────── */
  generateBtn.addEventListener('click', generate);

  function generate() {
    let text = urlInput.value.trim();
    if (!text) {
      showToast('⚠️  أدخل رابطاً أو نصاً أولاً', 'error');
      shakeInput();
      return;
    }

    // Auto-prefix http
    if (/^www\./i.test(text) && !text.startsWith('http')) {
      text = 'https://' + text;
      urlInput.value = text;
    }

    setLoading(true);

    // Small delay so the loading state is visible
    setTimeout(() => {
      try {
        const style = QR_STYLES[selectedStyle] || QR_STYLES['square'];
        const logoData = LOGOS[selectedLogo] || LOGOS['none'];
        const logoSrc  = logoData.qrSrc || null;

        const options = {
          width:  selectedSize,
          height: selectedSize,
          type:   'canvas',
          data:   text,
          image:  logoSrc,
          dotsOptions: {
            color: fgColor.value,
            type:  style.dots,
          },
          backgroundOptions: {
            color: bgColor.value,
          },
          imageOptions: {
            crossOrigin:        'anonymous',
            margin:             2,
            imageSize:          0.28,
            hideBackgroundDots: true,
          },
          cornersSquareOptions: {
            type:  style.cornersSquare,
            color: fgColor.value,
          },
          cornersDotOptions: {
            type:  style.cornersDot,
            color: fgColor.value,
          },
          qrOptions: {
            errorCorrectionLevel: 'H',
          },
        };

        // Clear container & re-create for fresh animation
        qrCanvasContainer.innerHTML = '';
        qrInstance = new QRCodeStyling(options);
        qrInstance.append(qrCanvasContainer);

        // Trigger reveal animation
        qrDisplayWrap.classList.remove('qr-reveal');
        void qrDisplayWrap.offsetWidth; // reflow
        qrDisplayWrap.classList.add('qr-reveal');

        // Show output
        qrUrlLabel.textContent = text;
        outputCard.classList.remove('hidden');

        // Smooth scroll to output
        setTimeout(() => {
          outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        showToast('✅ تم إنشاء رمز QR!', 'success');

      } catch (err) {
        console.error('QR generation error:', err);
        showToast('❌ حدث خطأ، تحقق من الإدخال', 'error');
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  function setLoading(on) {
    generateBtn.disabled = on;
    btnText.textContent  = on ? 'جارٍ الإنشاء...' : 'إنشاء رمز QR';
  }

  /* ─────────────────────────────────
     Download
  ───────────────────────────────── */
  downloadBtn.addEventListener('click', () => {
    if (!qrInstance) { showToast('⚠️  أنشئ رمز QR أولاً', 'error'); return; }
    qrInstance.download({ name: 'qr-code', extension: 'png' });
    showToast('📥 تم التحميل!', 'success');
  });

  /* ─────────────────────────────────
     Copy to clipboard
  ───────────────────────────────── */
  copyBtn.addEventListener('click', async () => {
    if (!qrInstance) { showToast('⚠️  أنشئ رمز QR أولاً', 'error'); return; }

    const canvas = qrCanvasContainer.querySelector('canvas');
    if (!canvas) { showToast('❌  لا يوجد canvas', 'error'); return; }

    try {
      await new Promise((resolve, reject) => {
        canvas.toBlob(async blob => {
          if (!blob) { reject(new Error('no blob')); return; }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            resolve();
          } catch (innerErr) {
            reject(innerErr);
          }
        }, 'image/png');
      });
      showToast('📋 تم نسخ الصورة إلى الحافظة!', 'success');
    } catch {
      // Fallback: copy the URL text
      try {
        await navigator.clipboard.writeText(urlInput.value.trim());
        showToast('📋 تم نسخ الرابط إلى الحافظة', 'success');
      } catch {
        showToast('❌  فشل النسخ', 'error');
      }
    }
  });

  /* ─────────────────────────────────
     Share (Web Share API)
  ───────────────────────────────── */
  shareBtn.addEventListener('click', async () => {
    if (!qrInstance) { showToast('⚠️  أنشئ رمز QR أولاً', 'error'); return; }

    const canvas = qrCanvasContainer.querySelector('canvas');
    if (!canvas) return;

    if (!navigator.canShare) {
      showToast('⚠️  المشاركة غير مدعومة في هذا المتصفح', 'error');
      return;
    }

    canvas.toBlob(async blob => {
      if (!blob) return;
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      try {
        await navigator.share({ files: [file], title: 'رمز QR' });
      } catch (err) {
        if (err.name !== 'AbortError') showToast('❌  فشلت المشاركة', 'error');
      }
    }, 'image/png');
  });

  /* ─────────────────────────────────
     Toast
  ───────────────────────────────── */
  function showToast(msg, type = 'success') {
    clearTimeout(toastTimer);
    toast.textContent  = msg;
    toast.className    = `toast show ${type}`;
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* ─────────────────────────────────
     Shake input animation
  ───────────────────────────────── */
  function shakeInput() {
    // Inject keyframes once
    if (!document.getElementById('shake-kf')) {
      const s = document.createElement('style');
      s.id = 'shake-kf';
      s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}
        20%{transform:translateX(-8px)}40%{transform:translateX(8px)}
        60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
      document.head.appendChild(s);
    }
    inputWrapper.style.animation = 'none';
    void inputWrapper.offsetWidth;
    inputWrapper.style.animation = 'shake 0.4s ease';
  }

})();
