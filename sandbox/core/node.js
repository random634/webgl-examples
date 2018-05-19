/**
 * 节点
 * @func 管理节点的缩放，旋转，平移
 */

class Node {
  constructor(gl) {
    this.gl = gl

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    this._baseMat4 = mat4.create();

    this.modelViewMatrix = mat4.create();
    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(
      this.modelViewMatrix, // destination matrix
      this._baseMat4,       // matrix to translate
      [-0.0, 0.0, -6.0]);   // amount to translate
    
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
  }

  setScale(scale) {

  }

  setRotation(rotation) {
    // 2d is angle, 3d is euler angle
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    mat4.translate(this.modelViewMatrix, this._baseMat4, [x, y, -6.0]);
  }
}