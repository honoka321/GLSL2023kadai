attribute vec3 position;
attribute float index;

uniform float time;
uniform vec2 resolution;

varying float vIndex;
varying vec2 vresolution;

void main() {
  vIndex = index;
  vresolution = resolution;
  
  vec3 pos = position;

  pos.y += sin( pos.x*(index+1.0) + (time * 1.9)   +index/2.0 ) * 0.4;

  gl_Position = vec4(pos, 1.0);

  gl_PointSize = 8.0;
}

