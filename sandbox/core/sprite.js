/**
 * 精灵(2d)
 * @func 控制精灵的渲染
 */

class Sprite extends Node {
  constructor(gl, vs, fs) {
    super(gl)

    this.material = new Material(gl, vs, fs);

    // Init shader location
    this.aVertexPosLoc = gl.getAttribLocation(this.material.program, "aVertexPos");
    this.aTextureCoordLoc = gl.getAttribLocation(this.material.program, "aTextureCoord");

    this.uSamplerLoc = gl.getUniformLocation(this.material.program, "uSampler");
    this.uModelViewMatrixLoc = gl.getUniformLocation(this.material.program, "uModelViewMatrix");
    this.uProjectionMatrixLoc = gl.getUniformLocation(this.material.program, "uProjectionMatrix");

    // Create a buffer for the square's positions.
    this.vertexPosBuffer = gl.createBuffer();
    this._setupVertexPosBuffer(this.width, this.height);

    // Create a buffer for the texture coordinates.
    this.textureCoordBuffer = gl.createBuffer();
    this._setupTextureCoordBuffer();

    // Create the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
    this.indexBuffer = gl.createBuffer();
    this._setupIndexBuffer();

    // Create texture for the sprite.
    this.texture = gl.createTexture();
    this._setupTexture();
  }

  _setupVertexPosBuffer(w, h) {
    let gl = this.gl;

    // Select the vertexPosBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);

    // Now create an array of positions for the square.
    // x from left to right
    // y from bottom to top
    let positions = [
      -0.5 * w, -0.5 * h,
      -0.5 * w, 0.5 * h,
      0.5 * w, 0.5 * h,
      0.5 * w, -0.5 * h,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  _setupTextureCoordBuffer() {
    let gl = this.gl;

    // Now set up the texture coordinates for the faces.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

    // x from left to right
    // y from top to bottom
    let textureCoordinates = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  }

  _setupIndexBuffer() {
    let gl = this.gl;

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    let indices = [
      0, 1, 2, 0, 2, 3,
    ];

    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  _setupTexture(image) {
    let gl = this.gl;

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    if (image == null) {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);

      // Because images have to be download over the internet
      // they might take a moment until they are ready.
      // Until then put a single pixel in the texture so we can
      // use it immediately. When the image has finished downloading
      // we'll update the texture with the contents of the image.
      const width = 1;
      const height = 1;
      const border = 0;
      const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image);

      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (this._isPowerOf2(image.width) && this._isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    }
  }

  _isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  render(projectionMatrix) {
    let gl = this.gl;

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
      gl.vertexAttribPointer(
        this.aVertexPosLoc,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(this.aVertexPosLoc);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
      gl.vertexAttribPointer(
        this.aTextureCoordLoc,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(this.aTextureCoordLoc);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // before set the shader uniforms must use program
    gl.useProgram(this.material.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uSamplerLoc, 0);

    gl.uniformMatrix4fv(this.uModelViewMatrixLoc, false, this.modelViewMatrix);
    gl.uniformMatrix4fv(this.uProjectionMatrixLoc, false, projectionMatrix);

    {
      const vertexCount = 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // {
    //   const offset = 0;
    //   const vertexCount = 4;
    //   gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    // }

    gl.useProgram(null);
  }

  setSize(w, h) {
    super.setSize(w, h)
    this._setupVertexPosBuffer(this.width, this.height);
  }

  setSpriteFrame(spriteFrame) {
    this._setupTexture(spriteFrame);
  }
}