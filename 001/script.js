import { WebGLUtility, ShaderProgram } from '../lib/webgl.js';

window.addEventListener('DOMContentLoaded', async () => {
  // WebGLApp クラスの初期化とリサイズ処理の設定
  const app = new WebGLApp();
  window.addEventListener('resize', app.resize, false);
  // アプリケーションのロードと初期化
  app.init('webgl-canvas');
  await app.load();
  // セットアップして描画を開始
  app.setup();
  app.render();
}, false);

class WebGLApp {
  /**
   * @constructor
   */
  constructor() {
    // 汎用的なプロパティ
    this.canvas = null;
    this.gl = null;
    this.running = false;
    this.startTime = Date.now();

    // uniform 変数用
    this.uTime = 0.0;

    // this を固定するためメソッドをバインドする
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.uResolution = [window.innerWidth, window.innerHeight];
  }
  /**
   * シェーダやテクスチャ用の画像など非同期で読み込みする処理を行う。
   * @return {Promise}
   */
  async load() {
    const vs = await WebGLUtility.loadFile('./main.vert');
    const fs = await WebGLUtility.loadFile('./main.frag');
    this.shaderProgram = new ShaderProgram(this.gl, {
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
      attribute: [
        'position',
        'index'
      ],
      stride: [
        3,
        1
      ],
      uniform: [
        'time',
        'resolution',
      ],
      type: [
        'uniform1f',
        'uniform2fv',
      ],
    });
  }
  /**
   * WebGL のレンダリングを開始する前のセットアップを行う。
   */
  setup() {
    this.setupGeometry();
    this.resize();
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.running = true; // 繰り返し描画を行うためにフラグを真にする @@@
  }
  /**
   * ジオメトリ（頂点情報）を構築するセットアップを行う。
   */
  setupGeometry() {
    // 頂点座標の定義
    this.position = [];
    this.index = [];

    const Line = 10;
    const Ver = 600;
    for (let i = 0; i < Line; ++i) {
      for (let j = 0; j < Ver; ++j) {
        const x = j / (Ver - 1);
        const X = x * 2.0 - 1.0;
        this.position.push(X, 0.0, 0.0);
        this.index.push(i);
      }
    }


    // 頂点の生データを VBO に変換し配列に入れておく
    this.vbo = [
      WebGLUtility.createVbo(this.gl, this.position),
      WebGLUtility.createVbo(this.gl, this.index),
    ];
  }
  /**
   * WebGL を利用して描画を行う。
   */
  render() {
    const gl = this.gl;

    // running が true の場合は requestAnimationFrame を呼び出す
    if (this.running === true) {
      requestAnimationFrame(this.render);
    }
    this.uTime = (Date.now() - this.startTime) / 1000;

    // ビューポートの設定と背景のクリア
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // プログラムオブジェクトを指定し、VBO と uniform 変数を設定
    this.shaderProgram.use();
    this.shaderProgram.setAttribute(this.vbo);
    this.shaderProgram.setUniform([
      this.uTime,
      this.uResolution,
    ]);

    // 設定済みの情報を使って、頂点を画面にレンダリングする
    gl.drawArrays(gl.POINTS, 0, this.position.length / 3);
  }
  /**
   * リサイズ処理を行う。
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  /**
   * WebGL を実行するための初期化処理を行う。
   * @param {HTMLCanvasElement|string} canvas - canvas への参照か canvas の id 属性名のいずれか
   * @param {object} [option={}] - WebGL コンテキストの初期化オプション
   */
  init(canvas, option = {}) {
    if (canvas instanceof HTMLCanvasElement === true) {
      this.canvas = canvas;
    } else if (Object.prototype.toString.call(canvas) === '[object String]') {
      const c = document.querySelector(`#${canvas}`);
      if (c instanceof HTMLCanvasElement === true) {
        this.canvas = c;
      }
    }
    if (this.canvas == null) {
      throw new Error('invalid argument');
    }
    this.gl = this.canvas.getContext('webgl', option);
    if (this.gl == null) {
      throw new Error('webgl not supported');
    }
  }
}

