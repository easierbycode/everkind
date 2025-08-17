import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'https://unpkg.com/three@0.160.0/examples/jsm/environments/RoomEnvironment.js';
import { SERVER_BASE_URL } from './config.js';

const canvas = document.getElementById('c');
const statusEl = document.getElementById('status');
const sideChip = document.getElementById('sideChip');

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(10,10,false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Scene + Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0.2, 0.15, 1.0);

// Env lighting
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

// Dog-tag body (rounded rectangle)
function roundedTagShape(w=0.52, h=0.88, r=0.12) {
  const s = new THREE.Shape();
  const x = -w/2, y = -h/2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const depth = 0.04; // thickness
const bodyGeo = new THREE.ExtrudeGeometry(roundedTagShape(), { depth, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 6 });
bodyGeo.center();
const metalMat = new THREE.MeshPhysicalMaterial({ color: 0x9ea3a6, metalness: 1.0, roughness: 0.35, clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 1.0 });
const body = new THREE.Mesh(bodyGeo, metalMat);
scene.add(body);

// Front & Back planes
const planeW = 0.48, planeH = 0.82;
const frontGeo = new THREE.PlaneGeometry(planeW, planeH);
frontGeo.translate(0, 0, depth/2 + 0.001);
const backGeo = new THREE.PlaneGeometry(planeW, planeH);
backGeo.rotateY(Math.PI);
backGeo.translate(0, 0, depth/2 + 0.001);

// Default textures
const phColor = new THREE.CanvasTexture(placeholderCanvas('Add a photo'));
phColor.colorSpace = THREE.SRGBColorSpace;
const frontMat = new THREE.MeshStandardMaterial({ map: phColor, roughness: 0.8, metalness: 0.0 });
const front = new THREE.Mesh(frontGeo, frontMat);
scene.add(front);

let backTex = makeEngravingTexture('Your message here', 24);
const backMat = new THREE.MeshPhysicalMaterial({ map: backTex.color, bumpMap: backTex.bump, bumpScale: -0.02, metalness: 1.0, roughness: 0.45, envMapIntensity: 1.0 });
const back = new THREE.Mesh(backGeo, backMat);
scene.add(back);

let showingFront = true;
updateSideChip();

// UI wiring
const photoInput = document.getElementById('photoInput');
const backTextArea = document.getElementById('backText');
const textSizeInput = document.getElementById('textSize');
const flipBtn = document.getElementById('flipBtn');
const proofBtn = document.getElementById('proofBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

backTextArea.value = 'Our Father, who art in heaven,\nhallowed be Thy name;\nThy kingdom come; Thy will be done\non earth as it is in heaven...';

photoInput.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  const img = await createImageBitmap(file);
  const tex = new THREE.CanvasTexture(imageToCanvas(img));
  tex.colorSpace = THREE.SRGBColorSpace;
  frontMat.map?.dispose();
  frontMat.map = tex;
  frontMat.needsUpdate = true;
  setStatus('Photo applied to front.');
});

function refreshBack() {
  const txt = backTextArea.value || ' ';
  const px = parseInt(textSizeInput.value, 10) || 24;
  const texs = makeEngravingTexture(txt, px);
  backMat.map?.dispose();
  backMat.bumpMap?.dispose();
  backMat.map = texs.color;
  backMat.bumpMap = texs.bump;
  backMat.needsUpdate = true;
}
backTextArea.addEventListener('input', refreshBack);
textSizeInput.addEventListener('input', refreshBack);

flipBtn.addEventListener('click', () => {
  showingFront = !showingFront;
  updateSideChip();
});

proofBtn.addEventListener('click', () => {
  const data = renderer.domElement.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = data; a.download = 'everkind-proof.png'; a.click();
});

checkoutBtn.addEventListener('click', async () => {
  const orderId = 'ord_' + Math.random().toString(36).slice(2,10);
  setStatus('Contacting payment server...');
  try {
    const res = await fetch(`${SERVER_BASE_URL}/create-checkout-session`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, item: 'dogtag-stainless' })
    });
    const json = await res.json();
    if(json.url){ window.location = json.url; return; }
    throw new Error(json.error || 'Unknown error');
  } catch(err){
    console.error(err); setStatus('Checkout error: ' + err.message);
  }
});

function updateSideChip(){ sideChip.textContent = showingFront ? 'Front' : 'Back'; }

function setStatus(msg){ statusEl.textContent = msg; }

// Helpers
function placeholderCanvas(text){
  const s = 1024; const c = document.createElement('canvas'); c.width=c.height=s; const g=c.getContext('2d');
  g.fillStyle = '#ddd'; g.fillRect(0,0,s,s);
  g.fillStyle = '#666'; g.font = 'bold 64px Inter, Arial'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(text, s/2, s/2);
  return c;
}
function imageToCanvas(img){
  const s = 2048; const c = document.createElement('canvas'); c.width=c.height=s; const g=c.getContext('2d');
  const rImg = img.width/img.height; const rOut = 1;
  let dw, dh, dx, dy;
  if(rImg > rOut){ dh = s; dw = s*rImg; dx = (s-dw)/2; dy = 0; }
  else { dw = s; dh = s/rImg; dx = 0; dy = (s-dh)/2; }
  g.fillStyle = '#888'; g.fillRect(0,0,s,s);
  g.drawImage(img, dx, dy, dw, dh);
  return c;
}
function makeEngravingTexture(text, px){
  const S = 2048; const c = document.createElement('canvas'); c.width=c.height=S; const g=c.getContext('2d');
  g.fillStyle = '#e9e9e9'; g.fillRect(0,0,S,S);
  g.fillStyle = '#222'; g.font = `bold ${px*2}px Cormorant Garamond, serif`; g.textAlign='center';
  const lines = wrapText(g, text, S*0.82);
  const lh = px*2*1.25; let y = (S - lines.length*lh)/2 + lh*0.8;
  for(const ln of lines){ g.fillText(ln, S/2, y); y += lh; }
  const colorTex = new THREE.CanvasTexture(c); colorTex.colorSpace = THREE.SRGBColorSpace; colorTex.anisotropy = 8;
  const bump = document.createElement('canvas'); bump.width=bump.height=S; const b=bump.getContext('2d');
  b.drawImage(c,0,0);
  const bumpTex = new THREE.CanvasTexture(bump);
  return { color: colorTex, bump: bumpTex };
}
function wrapText(ctx, text, maxWidth){
  const words = text.split(/\s+/); const lines=[]; let line='';
  for(const w of words){
    const t = line ? line + ' ' + w : w;
    if(ctx.measureText(t).width > maxWidth){ lines.push(line); line = w; }
    else line = t;
  }
  if(line) lines.push(line);
  return lines;
}
// Resize
function onResize(){
  const wrap = canvas.parentElement;
  const { clientWidth, clientHeight } = wrap;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth/clientHeight; camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize); onResize();
// Animate
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
