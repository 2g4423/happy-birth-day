'use strict';

import { getUrlQueries, getFontSize, getWindowSize } from './utils.js';

(function init() {
  const { width, height } = getWindowSize();
  const canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;

  // cake
  const cake = createCake();
  const message = createMessage();

  // light
  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(0, 50, 30);

  const ambient = new THREE.AmbientLight(0xf8f8ff, 0.9);

  // scene
  const scene = new THREE.Scene();
  scene.add(cake, message, light, ambient);

  // camera
  const camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
  camera.position.set(0, 120, 160);
  camera.lookAt(scene.position);

  // orbit control
  new THREE.OrbitControls(camera, canvas);

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

  function confettiAnime() {
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
  }

  render();
  confettiAnime();
})();

function createCake() {
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
        }),
        message = 'Happy birthday!!',
        shapes = font.generateShapes(message, 8), // 文字の大きさを設定
        text_geometry = new THREE.ShapeGeometry(shapes), // ジオメトリを設定
        text = new THREE.Mesh(text_geometry, matLite); // textという変数を作成し設定したジオメトリ・マテリアルにメッシュのクラスに引数として渡す
      chocolate.add(text); // シーンに作成したtextを引数として渡す。
      text.position.set(-40, 1.1, 5);
      text.rotation.set(-Math.PI / 2, 0, 0);
    }
  );

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

  return cake;
}

function getCanvasSize(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = getFontSize();

  ctx.font = `bold ${fontSize} sans-serif`;

  const margin = 80;
  const mesure = ctx.measureText(text);

  return {
    width: mesure.width + margin,
    height: mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent + margin
  };
}

function createMessage() {
  const msg = getUrlQueries().msg || 'Congratulations!!';
  const canvasSize = getCanvasSize(msg);
  const canvasTexture = new THREE.CanvasTexture(
    createCanvasForTexture(canvasSize.width, canvasSize.height, msg)
  );

  const scaleMaster = 200;
  const sprite = createSprite(
    canvasTexture,
    { x: scaleMaster, y: scaleMaster * (canvasSize.height / canvasSize.width), z: 1 },
    { x: 0, y: 100, z: 0 }
  );

  return sprite;
}

function createSprite(texture, scale, position) {
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(scale.x, scale.y, scale.z);
  sprite.position.set(position.x, position.y, position.z);
  return sprite;
}

function createCanvasForTexture(width, height, text) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const fontSize = getFontSize();

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = `bold ${fontSize} sans-serif`;
  ctx.fillStyle = 'yellow';
  ctx.fillText(
    text,
    (width - ctx.measureText(text).width) / 2,
    height / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
  );

  return canvas;
}
