precision mediump float;

varying float vIndex;
varying vec2 vresolution;

void main() {
  // 正規化
  vec2 uPos = ( gl_FragCoord.xy / vresolution.xy );
  uPos -= .5;
  vec3 color = vec3(0.0);
	float vertColor = 0.0;
  float fTemp = 8.0*abs(1.0 / uPos.y / 100.0);
	vertColor += fTemp;
  // 波の外側に向かって色が変化
	color += vec3( fTemp*(10.0-vIndex)/10.0, fTemp*vIndex/10.0, pow(fTemp,0.99)*1.5 );

  gl_FragColor = vec4(color, 1.0);
}

