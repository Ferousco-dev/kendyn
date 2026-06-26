import * as THREE from "three";

/**
 * Procedural CanvasTextures — micro-surface variation and printed/molded
 * detail without shipping image assets. Client-side only (used inside
 * dynamically imported three components).
 */

/** Grayscale noise for roughness/bump maps — kills the "perfect CG" look. */
export function noiseTexture(size = 256, base = 150, variance = 70): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = base + (Math.random() - 0.5) * variance;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Marbled, mottled rubber — the gray blotching real tyres get from the
 * moulding process and first contact with the ground. Soft overlapping
 * radial blobs, light and dark, over near-black.
 */
export function mottleTexture(size = 512, base = "#151515"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const blobs = Math.round(size * 0.55);
  for (let i = 0; i < blobs; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = size * (0.015 + Math.random() * 0.08);
    const light = Math.random() > 0.38;
    const a = 0.035 + Math.random() * 0.075;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, light ? `rgba(185,190,196,${a})` : `rgba(0,0,0,${a * 1.4})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Molded sidewall lettering on a transparent ring — brand, size marking and
 * regulatory text running around the tyre, like rubber relief.
 */
export function sidewallTexture(): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;

  const ringText = (
    text: string,
    radius: number,
    startAngle: number,
    font: string,
    fill: string,
    spacing = 1.0
  ) => {
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let angle = startAngle;
    for (const ch of text) {
      const w = ctx.measureText(ch).width;
      const da = ((w * spacing) / radius) * 1.05;
      angle += da / 2;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * radius, cx + Math.sin(angle) * radius);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      angle += da / 2;
    }
  };

  // concentric moulding ridges
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 5;
  for (const r of [620, 700, 905]) {
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const light = "rgba(255,255,255,0.34)";
  const dim = "rgba(255,255,255,0.2)";
  ringText("K E N D Y N", 800, -Math.PI / 2 - 0.42, "bold 110px Arial", light, 1.25);
  ringText("295/80 R22.5  RADIAL", 800, Math.PI / 2 - 0.55, "bold 64px Arial", dim, 1.1);
  ringText("HEAVY DUTY · TUBELESS · MAX LOAD 3550 KG", 655, -Math.PI / 2 - 0.9, "44px Arial", dim, 1.1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Battery front label — modelled on the client's HD reference: a slashed
 * dark panel with HEAVY DUTY / MAINTENANCE FREE, a big amber HD mark,
 * ratings block and a Ca/Ca technology chip.
 */
export function batteryLabelTexture(): THREE.CanvasTexture {
  const w = 1536;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // case-black label stock
  ctx.fillStyle = "#121316";
  ctx.fillRect(0, 0, w, h);

  // slashed lighter panel behind the headline
  ctx.fillStyle = "#1c1e22";
  ctx.beginPath();
  ctx.moveTo(60, 70);
  ctx.lineTo(760, 70);
  ctx.lineTo(660, 320);
  ctx.lineTo(60, 320);
  ctx.closePath();
  ctx.fill();
  // amber accent along the slash
  ctx.strokeStyle = "#c89035";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(764, 66);
  ctx.lineTo(664, 324);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#f0efec";
  ctx.font = "bold 92px Arial";
  ctx.fillText("HEAVY DUTY", 100, 200);
  ctx.fillStyle = "#9aa0a7";
  ctx.font = "44px Arial";
  ctx.fillText("MAINTENANCE FREE", 100, 272);

  // big amber HD mark
  ctx.fillStyle = "#cf9a3d";
  ctx.font = "italic bold 190px Arial";
  ctx.fillText("HD", 1060, 230);
  ctx.fillStyle = "#e8e7e4";
  ctx.font = "bold 42px Arial";
  ctx.fillText("DEEP CYCLE", 1064, 292);

  // ratings
  ctx.fillStyle = "#f0efec";
  ctx.font = "bold 96px Arial";
  ctx.fillText("12V  225Ah", 100, 470);
  ctx.fillStyle = "#9aa0a7";
  ctx.font = "46px Arial";
  ctx.fillText("CCA 1300A (EN)", 100, 548);

  // technology chip
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 4;
  ctx.strokeRect(1080, 420, 200, 84);
  ctx.fillStyle = "#e8e7e4";
  ctx.font = "bold 46px Arial";
  ctx.fillText("Ca/Ca", 1108, 478);
  ctx.fillStyle = "#9aa0a7";
  ctx.font = "30px Arial";
  ctx.fillText("TECHNOLOGY", 1080, 545);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
