import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = process.cwd();
const sourcePath = join(projectRoot, 'public/landing-pages/complete-shelf-v2.html');
const dataPath = join(projectRoot, 'app/components/experience/certificates/data.ts');
const outputPath = join(projectRoot, 'public/landing-pages/certificate-shelf.html');

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

function readCertificateBooks(source) {
  const match = source.match(/export const CERTIFICATE_BOOKS[^=]*=\s*(\[[\s\S]*\]);\s*$/);
  if (!match) throw new Error('Could not read the certificate registry.');
  return Function(`"use strict"; return (${match[1]});`)();
}

function buildCertificateShelf(source, books) {
  const booksStart = source.indexOf('    const BOOKS = [');
  const booksEnd = source.indexOf('    const COVER_ATLAS_DATA', booksStart);
  if (booksStart < 0 || booksEnd < 0) {
    throw new Error('The registered shelf source no longer contains its BOOKS registry.');
  }

  const bookBlock = `    const BOOKS = ${JSON.stringify(books, null, 2)};\n\n`;
  let output = `${source.slice(0, booksStart)}${bookBlock}${source.slice(booksEnd)}`;
  const activeCount = books.filter((book) => book.status === 'active').length;
  const expiredCount = books.filter((book) => book.status === 'expired').length;
  output = output.replace(
    '</head>',
    `<style id="certificate-archive-status">\n      .credential-status { color: #c87046; font-weight: 600; }\n      .credential-status[data-status="expired"] { color: #d98b78; }\n    </style>\n</head>`
  );
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
    `<span>${books.length} credentials · ${activeCount} active · ${expiredCount} expired</span>`
  );
  output = output.replaceAll('Edition 02 · 2026', 'Credential archive · 2026');
  output = output.replace('seven tactile field guides for contemporary creative tools', 'five verified credentials for security, cloud, and systems engineering');
  output = output.replace('Working Volumes · Static catalog', 'Certificate Archive · Static catalog');
  output = output.replace(
    '<dl class="meta-list">\n        <div>',
    '<dl class="meta-list">\n        <div class="meta-status">\n          <dt>Status</dt>\n          <dd id="detail-status" class="credential-status"></dd>\n        </div>\n        <div>'
  );
  output = output.replace(
    '    const detailMotif = document.querySelector("#detail-motif");',
    '    const detailMotif = document.querySelector("#detail-motif");\n    const detailStatus = document.querySelector("#detail-status");'
  );
  output = output.replace(
    '      detailMotif.textContent = book.motif;',
    '      detailMotif.textContent = book.motif;\n      detailStatus.textContent = book.statusLabel;\n      detailStatus.dataset.status = book.status;'
  );
  return output;
}

const [source, dataSource] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(dataPath, 'utf8')
]);
await writeFile(outputPath, buildCertificateShelf(source, readCertificateBooks(dataSource)));
