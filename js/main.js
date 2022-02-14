'use strict';

import { getUrlQueries } from './utils.js';

const width = document.body.clientWidth;
const height = document.body.clientHeight;
const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;

(function confettiAnime() {
  const angle = width < 800 ? 80 : 60;
  const x = width < 1200 ? 0 : 0.2;
  confetti({
    angle: angle,
    origin: { x: x, y: 0.5 }
  });
  confetti({
    angle: 180 - angle,
    origin: { x: 1 - x, y: 0.5 }
  });
  setTimeout(function () {
    requestAnimationFrame(confettiAnime);
  }, 1000);
})();

(function init() {
  // material
  const strawberryMaterial = new THREE.MeshLambertMaterial({ color: 0xe60033 });
  const chocolateMaterial = new THREE.MeshLambertMaterial({ color: 0x58352a });
  const creamMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const spongeMaterial = new THREE.MeshLambertMaterial({ color: 0xf7e28b });

  // head
  const head = new THREE.Group();

  const strawberries = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const strawberry = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 15, 100), strawberryMaterial);
    const radian = (i / 10) * Math.PI * 2;
    strawberry.position.set(65 * Math.cos(radian), 32, 65 * Math.sin(radian));
    strawberries.add(strawberry);
  }

  const chocolate = new THREE.Mesh(new THREE.BoxGeometry(100, 2, 50), chocolateMaterial);
  chocolate.position.set(0, 28, 0);

  head.add(chocolate, strawberries);

  // body
  const body = new THREE.Group();

  const cream1 = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 5, 100), creamMaterial);
  cream1.position.set(0, 25, 0);

  const sponge1 = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 15, 100), spongeMaterial);
  sponge1.position.set(0, 15, 0);

  const cream2 = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 15, 100), creamMaterial);
  cream2.position.set(0, 0, 0);

  const sponge2 = new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 15, 100), spongeMaterial);
  sponge2.position.set(0, -15, 0);

  body.add(cream1, sponge1, cream2, sponge2);

  const cake = new THREE.Group();
  cake.add(head, body);

  // text
  const loader = new THREE.FontLoader();
  loader.load(
    'https://threejs-plactice.vercel.app/fontloader/fonts/helvetiker_regular.typeface.json',
    function (font) {
      const matLite = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide
        }), // マテリアルを設定
        message = 'Happy birthday!!', // 出力する文字
        shapes = font.generateShapes(message, 8), // 文字の大きさを設定
        text_geometry = new THREE.ShapeGeometry(shapes), // ジオメトリを設定
        text = new THREE.Mesh(text_geometry, matLite); // textという変数を作成し設定したジオメトリ・マテリアルにメッシュのクラスに引数として渡す
      cake.add(text); // シーンに作成したtextを引数として渡す。
      text.position.set(-40, 30, 5);
      text.rotation.set(-1.54, 0, 0);
    }
  );

  const msg = getUrlQueries().msg || 'Congratulations!!';
  const canvasTexture = new THREE.CanvasTexture(createCanvasForTexture(width * 10, height * 10, msg, 28));

  const sprite = createSprite(
    canvasTexture,
    { x: width, y: width * (height / width), z: width },
    { x: 0, y: 70, z: 0 }
  );

  // light
  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(0, 50, 30);

  const ambient = new THREE.AmbientLight(0xf8f8ff, 0.9);

  // scene
  const scene = new THREE.Scene();
  scene.add(cake, sprite, light, ambient);

  // camera
  const camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
  const controls = new THREE.OrbitControls(camera, canvas);
  camera.position.set(0, 120, 160);
  camera.lookAt(scene.position);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0xe6e6fa);
  renderer.setPixelRatio(window.devicePixelRatio);

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    cake.rotation.y -= 0.01;
  }

  render();
})();

function createSprite(texture, scale, position) {
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(scale.x, scale.y, scale.z);
  sprite.position.set(position.x, position.y, position.z);
  return sprite;
}

function createCanvasForTexture(width, height, text, fontSize) {
  const canvasForText = document.createElement('canvas');
  const ctx = canvasForText.getContext('2d');
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const fs = document.body.clientWidth < 1200 ? `${fontSize}vw` : `300px`;
  ctx.font = `bold ${fs} sans-serif`;
  ctx.fillStyle = 'yellow';
  ctx.fillText(
    text,
    (width - ctx.measureText(text).width) / 2,
    height / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
  );
  return canvasForText;
}
