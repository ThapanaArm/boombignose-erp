// ==========================================
//  Client-side PDF → OCR (Thai + English) → row parser
//  Tuned for dense scanned Thai loan tables:
//   - high-resolution page render (scale 3+)
//   - optional grayscale + Otsu binarization (sharpen)
//   - tesseract.js with the high-accuracy `tessdata_best` models
//   - PSM 6 (uniform block) + DPI hint + interword spaces
//   - dual pass: `tha+eng` (ไทย: ชื่อ/สัญญา/ยอดหนี้) + `eng` (ลาติน: ยี่ห้อ/เลขตัวรถ)
//     merged per row, so the English columns read far more accurately.
//  Heavy libs are dynamically imported so they only load in the browser.
// ==========================================

export interface ParsedRow {
  contractNo: string;
  borrowerName: string;
  debtAmount: string;   // kept as string for the editable grid
  brand: string;
  model: string;
  overdueInfo: string;
  statusCode: string;
  color: string;
  chassisNo: string;
  licensePlate: string;
}

export interface OcrResult {
  thaText: string;
  engText: string;      // "" when the English pass is disabled
}

const BRANDS = [
  "TOYOTA", "ISUZU", "NISSAN", "MITSUBISHI", "HONDA", "CHEVROLET",
  "MAZDA", "FORD", "HYUNDAI", "MG", "HINO", "SUZUKI", "BENZ", "BMW", "MERCEDES",
];

/** High-accuracy Thai/English models (slower download, far better than the default `fast`). */
const BEST_LANG_PATH = "https://tessdata.projectnaptha.com/4.0.0_best";

export type ProgressFn = (msg: string) => void;

export interface RenderOptions {
  scale?: number;       // higher = sharper for OCR but slower (default 3)
  preprocess?: boolean; // grayscale + Otsu binarization (default true)
}

export interface OcrOptions {
  dualPass?: boolean;   // add a dedicated English pass for Latin columns (default true)
}

// ---------- image preprocessing ----------

/** Grayscale + Otsu global-threshold binarization, in place. Boosts OCR on scans. */
function binarize(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = img.data;
  const hist = new Array(256).fill(0);
  const gray = new Uint8Array(px.length / 4);
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const g = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) | 0;
    gray[j] = g;
    hist[g]++;
  }
  const total = gray.length;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, max = 0, thr = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > max) { max = between; thr = t; }
  }
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const v = gray[j] < thr ? 0 : 255;
    px[i] = px[i + 1] = px[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
}

// ---------- render + OCR ----------

/** Render up to `maxPages` of the PDF to canvases using pdfjs-dist. */
export async function renderPdf(
  file: File,
  maxPages: number,
  onProgress: ProgressFn,
  opts: RenderOptions = {},
): Promise<HTMLCanvasElement[]> {
  const scale = opts.scale ?? 3;
  const preprocess = opts.preprocess ?? true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any = await import("pdfjs-dist");
  // Worker from unpkg pinned to the installed version (reliable; avoids bundler worker wiring).
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const n = Math.min(pdf.numPages, maxPages);
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= n; i++) {
    onProgress(`กำลังเรนเดอร์หน้า ${i}/${n} (จาก ${pdf.numPages} หน้า)`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    if (preprocess) binarize(canvas);
    canvases.push(canvas);
  }
  return canvases;
}

/** Run one OCR pass over the canvases with the given language(s). */
async function recognize(
  canvases: HTMLCanvasElement[],
  langs: string,
  label: string,
  onProgress: ProgressFn,
): Promise<string> {
  const { createWorker, PSM } = await import("tesseract.js");
  onProgress(`กำลังโหลดโมเดล OCR (${label}) — ครั้งแรกอาจใช้เวลาสักครู่...`);
  const worker = await createWorker(langs, 1, { langPath: BEST_LANG_PATH,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger: (m: any) => {
      if (m.status === "recognizing text") onProgress(`อ่านข้อความ (${label}) ${Math.round(m.progress * 100)}%`);
    },
  });
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // uniform block → preserves table rows
    preserve_interword_spaces: "1",          // keep column spacing
    user_defined_dpi: "300",
  });
  let all = "";
  try {
    for (let i = 0; i < canvases.length; i++) {
      onProgress(`OCR (${label}) หน้า ${i + 1}/${canvases.length}...`);
      const { data } = await worker.recognize(canvases[i]);
      all += "\n" + data.text;
    }
  } finally {
    await worker.terminate();
  }
  return all;
}

/** OCR the canvases. Thai pass always runs; English pass adds accuracy for Latin columns. */
export async function ocrCanvases(
  canvases: HTMLCanvasElement[],
  onProgress: ProgressFn,
  opts: OcrOptions = {},
): Promise<OcrResult> {
  const thaText = await recognize(canvases, "tha+eng", "ไทย", onProgress);
  let engText = "";
  if (opts.dualPass ?? true) {
    engText = await recognize(canvases, "eng", "อังกฤษ", onProgress);
  }
  return { thaText, engText };
}

// ---------- parsing helpers ----------

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/** Map common letter→letter OCR confusions before fuzzy brand matching. */
const lettersFromDigits = (s: string) =>
  s.toUpperCase().replace(/0/g, "O").replace(/1/g, "I").replace(/5/g, "S").replace(/8/g, "B").replace(/6/g, "G");

/** Map letters→digits so a letterised contract number can still be matched. */
const digitsOnly = (s: string) =>
  s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/S/g, "5")
    .replace(/B/g, "8").replace(/G/g, "6").replace(/Z/g, "2").replace(/[^0-9]/g, "");

/** Closest brand to any token in the line (tolerant of OCR noise), or "". */
function fuzzyBrand(line: string): string {
  const tokens = line.toUpperCase().split(/[^A-Z0-9]+/).filter((t) => t.length >= 2);
  let best = "", bestScore = 0.4; // accept ≈ ≤1 edit per 3 chars
  for (const brand of BRANDS) {
    for (const tok of tokens) {
      const score = Math.min(levenshtein(tok, brand), levenshtein(lettersFromDigits(tok), brand)) / brand.length;
      if (score < bestScore) { bestScore = score; best = brand; }
    }
  }
  return best;
}

/** Longest alphanumeric token that looks like a VIN, excluding the (letterised) contract number. */
function extractVin(line: string, contractKey: string): string {
  const candidates = line.toUpperCase().match(/[A-Z0-9]{9,}/g) ?? [];
  let best = "";
  for (const tok of candidates) {
    const letters = (tok.match(/[A-Z]/g) ?? []).length;
    const digits = (tok.match(/[0-9]/g) ?? []).length;
    if (letters < 2 || digits < 1) continue;
    if (contractKey && levenshtein(digitsOnly(tok), contractKey) <= 3) continue; // it's the contract no.
    if (tok.length > best.length) best = tok;
  }
  return best;
}

const firstContract = (line: string) => line.match(/\d{9,}/)?.[0] ?? "";

interface EngRow { key: string; brand: string; vin: string; }

function parseEngRows(engText: string): EngRow[] {
  return engText.split(/\r?\n/).map((l) => l.trim())
    .filter((l) => /\d{6,}/.test(l) && /[A-Za-z]/.test(l))
    .map((l) => {
      const key = digitsOnly(firstContract(l) || l);
      return { key, brand: fuzzyBrand(l), vin: extractVin(l, key) };
    });
}

/**
 * Parse OCR output into draft rows.
 * Thai pass supplies ชื่อ/สัญญา/ยอดหนี้/งวด; the English pass (if present) is merged
 * per row by digit-normalised contract number to supply ยี่ห้อ/เลขตัวรถ accurately.
 * Best-effort — the editable grid is the safety net for review.
 */
export function parseRows(result: OcrResult): ParsedRow[] {
  const engRows = result.engText ? parseEngRows(result.engText) : [];
  const usedEng = new Set<number>();

  const thaLines = result.thaText.split(/\r?\n/).map((l) => l.trim()).filter((l) => /\d{9,}/.test(l));

  return thaLines.map((line) => {
    const contractNo = firstContract(line);
    const after = line.slice(line.indexOf(contractNo) + contractNo.length);

    // ภาระหนี้: number with thousand separators (OCR sometimes reads "," as ".")
    const debtAmount = (after.match(/\d{1,3}(?:[.,]\d{3})+/) ?? line.match(/\d{1,3}(?:[.,]\d{3})+/))?.[0]?.replace(/[.,]/g, "") ?? "";
    // งวดค้าง: e.g. (48-47)-1  — accept "." in place of "-"
    const overdueInfo = line.match(/\(\s*\d+\s*[-.]\s*\d+\s*\)\s*[-.]?\s*\d+/)?.[0]?.replace(/\s+/g, "") ?? "";
    // ชื่อ-สกุล: first run of Thai characters right after the contract number
    const borrowerName = after.match(/[฀-๿][฀-๿.\s]{2,}/)?.[0]?.replace(/\s+/g, " ").trim() ?? "";

    // Brand/VIN: prefer the English pass (matched by digit-normalised contract no.)
    let brand = fuzzyBrand(line);
    let chassisNo = "";
    if (engRows.length) {
      const key = digitsOnly(contractNo);
      let bi = -1, bd = 4;
      engRows.forEach((e, i) => {
        if (usedEng.has(i) || !e.key) return;
        const d = levenshtein(key, e.key);
        if (d < bd) { bd = d; bi = i; }
      });
      if (bi >= 0) {
        usedEng.add(bi);
        const e = engRows[bi];
        if (e.brand) brand = e.brand;
        chassisNo = e.vin;
      }
    }

    return {
      contractNo, borrowerName, debtAmount, brand,
      model: "", overdueInfo, statusCode: "", color: "",
      chassisNo, licensePlate: "",
    };
  });
}

export function emptyRow(): ParsedRow {
  return {
    contractNo: "", borrowerName: "", debtAmount: "", brand: "", model: "",
    overdueInfo: "", statusCode: "", color: "", chassisNo: "", licensePlate: "",
  };
}
