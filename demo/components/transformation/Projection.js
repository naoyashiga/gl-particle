
export default class Projection {
  constructor(canvas) {
    var fieldOfView = 30.0
    var aspectRatio = canvas.width / canvas.height
    var nearPlane = 1.0
    var farPlane = 10000
    var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360)
    var bottom = -top
    var right = top * aspectRatio
    var left = -right

    // glFrustum
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = (farPlane + nearPlane) / (farPlane - nearPlane);
    var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    var x = (2 * nearPlane) / (right - left);
    var y = (2 * nearPlane) / (top - bottom);
    this.matrix = [
      x, 0, a, 0,
      0, y, b, 0,
      0, 0, c, d,
      0, 0, -1, 0
    ];
  }
}
