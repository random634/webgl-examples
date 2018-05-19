/**
 * 相机
 * @func 设置相机属性（透视相机，正交相机）
 */

class Camera extends Node {
  constructor(gl) {
    super(gl)

    this.projectionMatrix = mat4.create();

    // default create a ortho camera
    const boundX = [-0.5 * gl.canvas.clientWidth, 0.5 * gl.canvas.clientWidth]
    const boundY = [-0.5 * gl.canvas.clientHeight, 0.5 * gl.canvas.clientHeight]
    mat4.ortho(this.projectionMatrix, boundX[0], boundX[1], boundY[0], boundY[1], 0.1, 100);
  }

  changeCamera(type, paras) {
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    // mat4.perspective(projectionMatrix,
    //                  fieldOfView,
    //                  aspect,
    //                  zNear,
    //                  zFar);
  }
}