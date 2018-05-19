
function renderLoop(timeStamp, init = false) {
  if (init === true) {
    window.game = new Game();
  } else {
    window.game.update(timeStamp);
  }

  requestAnimationFrame(renderLoop);
}

// Vertex shader program
const vsSource = `
attribute vec4 aVertexPos;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPos;
  vTextureCoord = aTextureCoord;
}
`;

// Fragment shader program
const fsSource = `
// precision mediump float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

class Game {
  constructor() {
    this.canvasElm = document.createElement("canvas");
    this.canvasElm.width = 800;
    this.canvasElm.height = 600;

    this.gl = this.canvasElm.getContext("webgl2");
    this.gl.clearColor(0.4, 0.6, 1.0, 0.0);

    document.body.appendChild(this.canvasElm);

    // let vs = document.getElementById("vs_01").innerHTML;
    // let fs = document.getElementById("fs_01").innerHTML;

    this.camera = new Camera(this.gl)

    this.sprite1 = new Sprite(this.gl, vsSource, fsSource);
    this.sprite2 = new Sprite(this.gl, vsSource, fsSource);

    this.sprite1.setSize(360, 360);
    this.sprite2.setSize(460, 460);

    this.sprite1.setPosition(0, 150)
    this.sprite2.setPosition(0, -150)

    let image1 = new Image();
    image1.src = 'res/img1.png';
    image1.onload = () => {
      this.sprite1.setSpriteFrame(image1);
    }

    let image2 = new Image();
    image2.src = 'res/img2.png';
    image2.onload = () => {
      this.sprite2.setSpriteFrame(image2);
    }

    this.timeElapse = 0;
    this.timeStampLast = -1;
  }

  update(timeStamp) {
    // TODO: 生成精灵帧，控制精灵帧缩放，旋转，平移
    let dt = 0;
    if (this.timeStampLast >= 0) {
      dt = (timeStamp - this.timeStampLast) / 1000;
      this.timeStampLast = timeStamp;
    } else {
      this.timeStampLast = timeStamp;
    }

    this.timeElapse += dt;
    if (this.timeElapse > 2) {
      this.timeElapse = 0;
    }

    let posX = 200 * this.timeElapse;
    this.sprite1.setPosition(posX, this.sprite1.y)
    this.sprite2.setPosition(-posX, this.sprite2.y)

    this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.sprite1.render(this.camera.projectionMatrix);

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.sprite2.render(this.camera.projectionMatrix);

    this.gl.flush();
  }
}