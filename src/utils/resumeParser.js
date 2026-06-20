/**
 * resumeParser.js
 * ---------------
 * File reader utility for the Skillovix Resume Analyzer.
 * Extracts raw plain text from uploaded resume files.
 *
 * Supported formats:
 *  - PDF  → pdfjs-dist
 *  - DOCX / DOC → mammoth.js
 *  - TXT  → FileReader (plain read)
 *  - PNG / JPG / JPEG / WEBP → Tesseract.js (OCR)
 *
 * Returns:
 *  { text: "<extracted plain text>" }
 *  or on failure:
 *  { error: "unreadable", message: "Could not extract text. Please re-upload." }
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Normalise extracted text:
 *  - Collapse multiple blank lines into one
 *  - Replace sequences of whitespace (except newlines) with a single space
 *  - Trim leading/trailing whitespace
 */
function normaliseText(raw) {
  return raw
    .replace(/[ \t]+/g, ' ')           // collapse horizontal whitespace
    .replace(/\r\n/g, '\n')            // normalise Windows line endings
    .replace(/\r/g, '\n')              // normalise old Mac line endings
    .replace(/\n{3,}/g, '\n\n')        // collapse 3+ blank lines → 2
    .trim();
}

/**
 * Count words in a string (split on whitespace).
 */
function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Wrap a result as a success or error response.
 */
function success(text) {
  const clean = normaliseText(text);
  if (wordCount(clean) < 50) {
    return {
      error: 'unreadable',
      message: 'Could not extract text. Please re-upload.',
    };
  }
  return { text: clean };
}

function failure() {
  return {
    error: 'unreadable',
    message: 'Could not extract text. Please re-upload.',
  };
}

// ─── Format Parsers ─────────────────────────────────────────────────────────

/**
 * Extract text from a PDF file using pdfjs-dist.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function parsePdf(file) {
  // Dynamically import pdfjs-dist so it is only loaded when needed.
  const pdfjsLib = await import('pdfjs-dist');

  // Point the worker at the bundled worker script.
  // Vite copies the worker file to /assets; this CDN fallback ensures
  // it also works in dev mode without extra config.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join items on the same line with a space; different lines with newline.
    let lastY = null;
    const lines = [];
    let currentLine = '';
    for (const item of content.items) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          lines.push(currentLine);
          currentLine = item.str;
        } else {
          currentLine += (currentLine ? ' ' : '') + item.str;
        }
        lastY = item.transform[5];
      }
    }
    if (currentLine) lines.push(currentLine);
    pageTexts.push(lines.join('\n'));
  }

  return pageTexts.join('\n\n');
}

/**
 * Extract text from a DOCX or DOC file using mammoth.js.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function parseDocx(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Read a plain-text file directly.
 * @param {File} file
 * @returns {Promise<string>}
 */
function parseTxt(file) {
  return file.text();
}

/**
 * Extract text from an image using Tesseract.js OCR.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function parseImage(file) {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  try {
    // Convert File to a data URL so Tesseract can read it in the browser.
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const { data } = await worker.recognize(dataUrl);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Extract raw plain text from any supported resume file.
 *
 * @param {File} file - The file object from an <input type="file"> or drag-drop.
 * @returns {Promise<{ text: string } | { error: string, message: string }>}
 *
 * @example
 * const result = await extractResumeText(file);
 * if (result.error) {
 *   console.error(result.message);
 * } else {
 *   console.log(result.text);
 * }
 */
export async function extractResumeText(file) {
  if (!file) return failure();

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  try {
    let raw = '';

    // ── PDF ──────────────────────────────────────────────────────────────
    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      raw = await parsePdf(file);

    // ── DOCX ─────────────────────────────────────────────────────────────
    } else if (
      type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      name.endsWith('.docx')
    ) {
      raw = await parseDocx(file);

    // ── DOC (legacy Word) ─────────────────────────────────────────────────
    } else if (
      type === 'application/msword' ||
      name.endsWith('.doc')
    ) {
      // mammoth can handle .doc as well as .docx
      raw = await parseDocx(file);

    // ── Plain Text ────────────────────────────────────────────────────────
    } else if (
      type === 'text/plain' ||
      name.endsWith('.txt')
    ) {
      raw = await parseTxt(file);

    // ── Images (OCR) ──────────────────────────────────────────────────────
    } else if (
      type.startsWith('image/') ||
      /\.(png|jpe?g|webp)$/.test(name)
    ) {
      raw = await parseImage(file);

    // ── Unsupported ───────────────────────────────────────────────────────
    } else {
      return failure();
    }

    return success(raw);
  } catch (err) {
    console.error('[resumeParser] extraction failed:', err);
    return failure();
  }
}

/**
 * Human-readable label for a file's detected type.
 * Useful for showing the user which parser was used.
 *
 * @param {File} file
 * @returns {'PDF' | 'DOCX' | 'DOC' | 'TXT' | 'Image' | 'Unknown'}
 */
export function detectFileType(file) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'PDF';
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) return 'DOCX';
  if (type === 'application/msword' || name.endsWith('.doc')) return 'DOC';
  if (type === 'text/plain' || name.endsWith('.txt')) return 'TXT';
  if (type.startsWith('image/') || /\.(png|jpe?g|webp)$/.test(name)) return 'Image';
  return 'Unknown';
}
