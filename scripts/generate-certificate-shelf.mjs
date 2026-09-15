import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const sourcePath = join(projectRoot, 'public/landing-pages/complete-shelf-v2.html');
const dataPath = join(projectRoot, 'app/components/experience/certificates/data.ts');
const outputPath = join(projectRoot, 'public/landing-pages/certificate-shelf.html');

const localRuntimeStyles = `
    <style id="certificate-local-runtime">
      html,
      body,
      .experience {
        background-color: #403125;
      }

      .experience {
        background-image:
          linear-gradient(rgba(30, 22, 18, 0.54), rgba(30, 22, 18, 0.54)),
          url("../artwork/saint-jerome-study-1920.jpg");
        background-position: center;
        background-size: cover;
      }
    </style>
`;

const runtimeWatchdog = `
  <script>
    window.__certificateArchiveWatchdog = window.setTimeout(() => {
      const experience = document.querySelector("#experience");
      if (experience?.classList.contains("webgl-ready")) return;

      const loading = document.querySelector("#loading");
      const staticFallback = document.querySelector("#static-fallback");
      const fallbackStatus = document.querySelector("#fallback-status");
      if (loading) loading.hidden = true;
      if (staticFallback) staticFallback.hidden = false;
      if (fallbackStatus) {
        fallbackStatus.textContent = "The interactive shelf is taking longer than expected. The complete static catalog remains available.";
      }
      window.parent.postMessage({ type: "certificate-archive:ready" }, "*");
    }, 6000);
  </script>
`;

const certificateArtwork = `
    function drawCertificateArtwork(ctx, book, width, height) {
      const centerX = width * 0.5;
      const centerY = height * 0.37;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = book.foil;
      ctx.fillStyle = book.foil;
      ctx.globalAlpha = 0.34;
      ctx.lineWidth = 3;
      for (let ring = 0; ring < 5; ring += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, 92 + ring * 48, ring % 2 ? Math.PI * 0.18 : 0, Math.PI * (1.25 + ring * 0.11));
        ctx.stroke();
      }
      ctx.globalAlpha = 0.85;
      if (book.issuer === "Fortinet") {
        ctx.fillStyle = "#ee3124";
        ctx.fillRect(-78, -78, 156, 156);
        ctx.fillStyle = "#fff8f0";
        ctx.fillRect(-48, -49, 27, 98);
        ctx.fillRect(-9, -49, 27, 98);
        ctx.fillRect(30, -49, 27, 98);
        ctx.fillRect(-48, -14, 105, 27);
      } else {
        const microsoft = ["#f25022", "#7fba00", "#00a4ef", "#ffb900"];
        microsoft.forEach((color, index) => {
          ctx.fillStyle = color;
          ctx.fillRect(-70 + (index % 2) * 76, -70 + Math.floor(index / 2) * 76, 66, 66);
        });
      }
      ctx.restore();
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = book.foil;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '500 18px Inter, "Helvetica Neue", Arial, sans-serif';
      ctx.letterSpacing = "4px";
      ctx.fillText(book.issuer.toUpperCase(), centerX, height * 0.12);
      ctx.globalAlpha = 0.58;
      ctx.font = '500 13px Inter, "Helvetica Neue", Arial, sans-serif';
      ctx.letterSpacing = "2px";
      ctx.fillText(book.validity.toUpperCase(), centerX, height * 0.9);
      ctx.globalAlpha = 1;
    }
`;

const fluidMotionStyles = `
    <style id="certificate-fluid-motion">
      .detail-panel {
        will-change: opacity, transform;
      }

      .mode-detail.is-opening .detail-panel {
        animation: certificate-detail-in 560ms var(--ease-out) 360ms both;
        pointer-events: none;
      }

      .mode-detail.is-closing .detail-panel {
        opacity: 0;
        transform: translateY(calc(-50% + 16px));
        transition-delay: 0ms;
        transition-duration: 260ms;
        pointer-events: none;
      }

      .mode-detail.is-closing .masthead,
      .mode-detail.is-closing .editorial-header {
        opacity: 0.18;
      }

      @keyframes certificate-detail-in {
        from {
          opacity: 0;
          transform: translateY(calc(-50% + 18px));
        }
        to {
          opacity: 1;
          transform: translateY(-50%);
        }
      }

      @media (max-width: 819px) {
        .mode-detail.is-closing .detail-panel {
          transform: translateY(14px);
        }

        @keyframes certificate-detail-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      }
    </style>
`;

function readCertificateBooks(source) {
  const match = source.match(/export const CERTIFICATE_BOOKS[^=]*=\s*(\[[\s\S]*\]);\s*$/);
  if (!match) throw new Error('Could not read the certificate registry.');
  return Function(`"use strict"; return (${match[1]});`)();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildCertificateShelf(source, books) {
  const booksStart = source.indexOf('    const BOOKS = [');
  const booksEnd = source.indexOf('    const COVER_ATLAS_DATA', booksStart);
  if (booksStart < 0 || booksEnd < 0) {
    throw new Error('The registered shelf source no longer contains its BOOKS registry.');
  }

  const bookBlock = `    const BOOKS = ${JSON.stringify(books, null, 2)};\n\n`;
  const fallbackBooks = books.map((book) => {
    const height = Math.round(350 + (book.height - 1.5) * 360);
    return `        <article class="fallback-book" style="--book-color:${escapeHtml(book.color)};--book-foil:${escapeHtml(book.foil)};--book-height:${height}px"><span>Volume ${escapeHtml(book.roman)} · ${escapeHtml(book.issuer)}</span><strong>${escapeHtml(book.coverTitle)}</strong></article>`;
  }).join('\n');
  let output = `${source.slice(0, booksStart)}${bookBlock}${source.slice(booksEnd)}`;
  output = output.replace(
    'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js',
    '../vendor/three-r165/three.module.js'
  );
  output = output.replace(
    'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/',
    '../vendor/three-r165/addons/'
  );
  output = output.replace(
    '</head>',
    `${localRuntimeStyles}<style id="certificate-archive-status">\n      .credential-status { color: #c87046; font-weight: 600; }\n      .credential-status[data-status="expired"] { color: #d98b78; }\n    </style>\n${fluidMotionStyles}</head>`
  );
  output = output.replace('  <script type="module">', `${runtimeWatchdog}  <script type="module">`);
  output = output.replace('    const COVER_ATLAS_DATA =', `${certificateArtwork}\n    const COVER_ATLAS_DATA =`);
  output = output.replace(
    '      ctx.fillStyle = book.color;\n      ctx.fillRect(0, 0, canvasTexture.width, canvasTexture.height);',
    '      ctx.fillStyle = book.color;\n      ctx.fillRect(0, 0, canvasTexture.width, canvasTexture.height);\n      drawCertificateArtwork(ctx, book, canvasTexture.width, canvasTexture.height);'
  );
  output = output.replace(
    '      const titleSize = book.title.length > 10 ? 72 : 88;',
    '      const coverTitle = book.coverTitle || book.title;\n      const titleSize = coverTitle.length > 10 ? 72 : 88;'
  );
  output = output.replace(
    '      ctx.fillText(book.title, canvasTexture.width / 2, canvasTexture.height * 0.72);',
    '      ctx.fillText(coverTitle, canvasTexture.width / 2, canvasTexture.height * 0.72);'
  );
  output = output.replace(
    '      const titleSize = book.title.length > 10 ? 64 : 78;',
    '      const coverTitle = book.coverTitle || book.title;\n      const titleSize = coverTitle.length > 10 ? 64 : 78;'
  );
  output = output.replace(
    '      ctx.fillText(book.title, 58, 1020);',
    '      ctx.fillText(coverTitle, 58, 1020);'
  );
  output = output.replace('        coverAtlasReady = true;', '        coverAtlasReady = false;');
  output = output.replaceAll('Working Volumes', 'Certificate Archive');
  output = output.replaceAll('working volumes', 'certificate archive');
  output = output.replaceAll('WORKING VOLUMES', 'CERTIFICATE ARCHIVE');
  output = output.replace('Binding the collection', 'Preparing your credentials');
  output = output.replace('Seven Tools for Making', 'Five Verified Credentials');
  output = output.replaceAll('Seven field guides for making', 'Five verified credentials');
  output = output.replace(
    '<span>Five verified credentials</span>',
    '<span>Security · cloud · systems</span>'
  );
  output = output.replaceAll('Edition 02 · 2026', 'Credential archive · 2026');
  output = output.replace('seven tactile field guides for contemporary creative tools', 'five verified credentials for security, cloud, and systems engineering');
  output = output.replace('Working Volumes · Static catalog', 'Certificate Archive · Static catalog');
  output = output.replace('<h2 id="fallback-title">Seven tools for making.</h2>', '<h2 id="fallback-title">Five verified credentials.</h2>');
  output = output.replace(
    /      <div class="fallback__grid" aria-label="Seven conceptual hardcovers">[\s\S]*?      <\/div>\n      <div class="fallback__footer">/,
    `      <div class="fallback__grid" aria-label="Five credential volumes">\n${fallbackBooks}\n      </div>\n      <div class="fallback__footer">`
  );
  output = output.replace(
    '        <span>All bindings, motifs, descriptions, geometry, and cover artworks are original to this conceptual study.</span>\n        <span>Product names are used editorially and remain the property of their respective owners.</span>',
    '        <span>Credential dates and status are presented as listed in this portfolio archive.</span>\n        <span>Fortinet and Microsoft names remain the property of their respective owners.</span>'
  );
  output = output.replace(
    '<dl class="meta-list">\n        <div>',
    '<dl class="meta-list">\n        <div class="meta-status">\n          <dt>Status</dt>\n          <dd id="detail-status" class="credential-status"></dd>\n        </div>\n        <div>'
  );
  output = output.replace(
    '    const detailMotif = document.querySelector("#detail-motif");',
    '    const detailMotif = document.querySelector("#detail-motif");\n    const detailStatus = document.querySelector("#detail-status");'
  );
  output = output.replace(
    '      detailBinding.textContent = book.binding;\n      detailFormat.textContent = book.format;\n      detailTheme.textContent = book.theme;\n      detailMotif.textContent = book.motif;',
    '      detailBinding.textContent = book.issuer;\n      detailFormat.textContent = book.issued;\n      detailTheme.textContent = book.validity;\n      detailMotif.textContent = book.credentialId || "Available from issuer";\n      detailStatus.textContent = book.statusLabel;\n      detailStatus.dataset.status = book.status;'
  );
  output = output.replace('<dt>Binding</dt>', '<dt>Issuer</dt>');
  output = output.replace('<dt>Format</dt>', '<dt>Issued</dt>');
  output = output.replace('<dt>Theme</dt>', '<dt>Validity</dt>');
  output = output.replace('<dt>Motif</dt>', '<dt>Credential ID</dt>');
  output = output.replace(
    '    const DETAIL_TRANSITION_DURATION = 0.92;\n    const SHELF_TRANSITION_DURATION = 0.92;',
    '    const DETAIL_TRANSITION_DURATION = 0.88;\n    const SHELF_TRANSITION_DURATION = 1.04;'
  );
  output = output.replace(
    '      experience.classList.add("mode-detail", "is-opening");',
    '      experience.classList.remove("is-closing");\n      experience.classList.add("mode-detail", "is-opening");'
  );
  output = output.replace(
    '      experience.classList.remove("is-opening");\n      alignShelfToSelection();\n      closingBookPosition.set(\n        0,\n        shelfBoardTop + activeBook.base.height * 0.5 + 0.15,\n        0.37\n      );',
    '      experience.classList.remove("is-opening");\n      experience.classList.add("is-closing");\n      alignShelfToSelection();\n      closingBookPosition.copy(openingBookPosition);\n      closingBookQuaternion.copy(openingBookQuaternion);\n      closingBookScale.copy(openingBookScale);'
  );
  output = output.replace(
    '      experience.classList.remove("mode-detail");\n      detailPanel.setAttribute("aria-hidden", "true");\n      detailPanel.inert = true;\n      liveRegion.textContent = `Returning ${activeBook.data.title} to the shelf.`;',
    '      liveRegion.textContent = `Returning ${activeBook.data.title} to the shelf.`;'
  );
  output = output.replace(
    '      const eased = smootherstep(clamp(progress, 0, 1));\n      const shelfReturnEased = smootherstep(\n        clamp((progress - 0.24) / 0.76, 0, 1)\n      );',
    '      const travelEased = smootherstep(clamp((progress - 0.16) / 0.84, 0, 1));\n      const shelfReturnEased = smootherstep(\n        clamp((progress - 0.22) / 0.78, 0, 1)\n      );'
  );
  [
    ['closingBookStartPosition', 'closingBookPosition'],
    ['closingBookStartQuaternion', 'closingBookQuaternion'],
    ['closingBookStartScale', 'closingBookScale'],
    ['closingMotionPosition', 'restingMotionPosition'],
    ['closingMotionQuaternion', 'restingMotionQuaternion'],
    ['closingCameraPosition', 'shelfCameraPosition'],
    ['closingCameraTarget', 'shelfCameraTarget'],
  ].forEach(([from, to]) => {
    output = output.replace(
      `        ${from},\n        ${to},\n        eased\n      );`,
      `        ${from},\n        ${to},\n        travelEased\n      );`
    );
  });
  output = output.replace(
    '      currentViewOffsetX = lerp(closingViewOffsetX, 0, eased);',
    '      currentViewOffsetX = lerp(closingViewOffsetX, 0, travelEased);'
  );
  output = output.replace(
    '      controls.target.copy(shelfCameraTarget);\n      browseUi.inert = false;',
    '      controls.target.copy(shelfCameraTarget);\n      experience.classList.remove("mode-detail", "is-closing");\n      detailPanel.setAttribute("aria-hidden", "true");\n      detailPanel.inert = true;\n      browseUi.inert = false;'
  );
  output = output.replace(
    '    function onWindowBlur() {',
    `    function onParentPlaybackMessage(event) {
      if (event.source !== window.parent) return;
      const type = event.data?.type;
      if (type === "certificate-archive:pause") {
        suspended = true;
        settlePageDrag(true);
        resetDetailPress();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (type === "certificate-archive:resume") {
        suspended = false;
        lastTime = performance.now();
        requestFrame();
      }
    }

    function onWindowBlur() {`
  );
  output = output.replace(
    '      window.removeEventListener("blur", onWindowBlur);',
    '      window.removeEventListener("blur", onWindowBlur);\n      window.removeEventListener("message", onParentPlaybackMessage);'
  );
  output = output.replace(
    '      window.addEventListener("blur", onWindowBlur);',
    '      window.addEventListener("blur", onWindowBlur);\n      window.addEventListener("message", onParentPlaybackMessage);'
  );
  output = output.replace(
    '      fallbackStatus.textContent = message;',
    '      fallbackStatus.textContent = message;\n      window.clearTimeout(window.__certificateArchiveWatchdog);\n      window.parent.postMessage({ type: "certificate-archive:ready" }, "*");'
  );
  output = output.replace(
    '      experience.classList.add("webgl-ready");\n      requestFrame();',
    '      experience.classList.add("webgl-ready");\n      window.clearTimeout(window.__certificateArchiveWatchdog);\n      window.parent.postMessage({ type: "certificate-archive:ready" }, "*");\n      requestFrame();'
  );
  output = output.replace(
    '        if (!ready || suspended || !renderer) return;',
    '        if (!ready || !renderer) return;'
  );
  // Keep the authored scene, but cap raster work on high-density displays.
  output = output.replace(
    'Math.min(window.devicePixelRatio || 1, viewWidth < 820 ? 1.5 : 2)',
    'Math.min(window.devicePixelRatio || 1, 1.5)'
  );
  output = output.replace('key.shadow.mapSize.set(2048, 2048);', 'key.shadow.mapSize.set(1024, 1024);');
  return output;
}

const [source, dataSource] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(dataPath, 'utf8')
]);
await writeFile(outputPath, buildCertificateShelf(source, readCertificateBooks(dataSource)));
