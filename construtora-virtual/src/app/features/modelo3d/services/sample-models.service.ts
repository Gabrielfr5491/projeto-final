import { Injectable } from '@angular/core';

export interface SampleModel {
  name: string;
  format: 'obj' | 'stl' | 'fbx' | 'gltf';
  getBlob: () => Blob;
}

function generateGearOBJ(teeth = 16, innerRadius = 1.0, outerRadius = 2.0, depth = 0.8, toothHeight = 0.4): string {
  const lines: string[] = ['# Procedural Industrial Gear OBJ file'];
  const vertices: [number, number, number][] = [];
  const faces: number[][] = [];
  const zFront = -depth / 2;
  const zBack = depth / 2;
  const steps = teeth * 4;

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const toothStep = i % 4;
    let r = outerRadius;
    if (toothStep === 1 || toothStep === 2) r = outerRadius + toothHeight;
    vertices.push([Math.cos(angle) * r, Math.sin(angle) * r, zFront]);
  }
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    vertices.push([Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, zFront]);
  }
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const toothStep = i % 4;
    let r = outerRadius;
    if (toothStep === 1 || toothStep === 2) r = outerRadius + toothHeight;
    vertices.push([Math.cos(angle) * r, Math.sin(angle) * r, zBack]);
  }
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    vertices.push([Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, zBack]);
  }

  for (const v of vertices) {
    lines.push(`v ${v[0].toFixed(4)} ${v[1].toFixed(4)} ${v[2].toFixed(4)}`);
  }

  const outerFrontOffset = 1;
  const innerFrontOffset = outerFrontOffset + steps;
  const outerBackOffset = innerFrontOffset + steps;
  const innerBackOffset = outerBackOffset + steps;

  for (let i = 0; i < steps; i++) {
    const next = (i + 1) % steps;
    faces.push([outerFrontOffset + i, outerFrontOffset + next, innerFrontOffset + next, innerFrontOffset + i]);
  }
  for (let i = 0; i < steps; i++) {
    const next = (i + 1) % steps;
    faces.push([innerBackOffset + i, innerBackOffset + next, outerBackOffset + next, outerBackOffset + i]);
  }
  for (let i = 0; i < steps; i++) {
    const next = (i + 1) % steps;
    faces.push([outerFrontOffset + i, outerBackOffset + i, outerBackOffset + next, outerFrontOffset + next]);
  }
  for (let i = 0; i < steps; i++) {
    const next = (i + 1) % steps;
    faces.push([innerFrontOffset + i, innerFrontOffset + next, innerBackOffset + next, innerBackOffset + i]);
  }

  for (const f of faces) lines.push(`f ${f.join(' ')}`);
  return lines.join('\n');
}

function generateStarPrismSTL(points = 5, innerR = 0.8, outerR = 1.8, height = 3.0): string {
  const lines: string[] = ['solid star_column'];
  const zBottom = -height / 2;
  const zTop = height / 2;
  const steps = points * 2;
  const bottomPoints: [number, number, number][] = [];
  const topPoints: [number, number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = i % 2 === 0 ? outerR : innerR;
    bottomPoints.push([Math.cos(angle) * r, Math.sin(angle) * r, zBottom]);
    topPoints.push([Math.cos(angle) * r, Math.sin(angle) * r, zTop]);
  }
  const addFacet = (v1: [number, number, number], v2: [number, number, number], v3: [number, number, number]) => {
    const ux = v2[0] - v1[0], uy = v2[1] - v1[1], uz = v2[2] - v1[2];
    const vx = v3[0] - v1[0], vy = v3[1] - v1[1], vz = v3[2] - v1[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len > 0) { nx /= len; ny /= len; nz /= len; }
    lines.push(`  facet normal ${nx.toFixed(4)} ${ny.toFixed(4)} ${nz.toFixed(4)}`);
    lines.push('    outer loop');
    lines.push(`      vertex ${v1[0].toFixed(4)} ${v1[1].toFixed(4)} ${v1[2].toFixed(4)}`);
    lines.push(`      vertex ${v2[0].toFixed(4)} ${v2[1].toFixed(4)} ${v2[2].toFixed(4)}`);
    lines.push(`      vertex ${v3[0].toFixed(4)} ${v3[1].toFixed(4)} ${v3[2].toFixed(4)}`);
    lines.push('    endloop');
    lines.push('  endfacet');
  };
  const originBottom: [number, number, number] = [0, 0, zBottom];
  const originTop: [number, number, number] = [0, 0, zTop];
  for (let i = 0; i < steps; i++) {
    const next = (i + 1) % steps;
    addFacet(bottomPoints[next], bottomPoints[i], originBottom);
    addFacet(topPoints[i], topPoints[next], originTop);
    addFacet(bottomPoints[i], bottomPoints[next], topPoints[next]);
    addFacet(bottomPoints[i], topPoints[next], topPoints[i]);
  }
  lines.push('endsolid star_column');
  return lines.join('\n');
}

function generateVaseOBJ(segments = 24, height = 3.0): string {
  const lines: string[] = ['# Procedural Geometric Vase OBJ file'];
  const vertices: [number, number, number][] = [];
  const faces: number[][] = [];
  const getRadius = (t: number) => 1.2 - 0.6 * Math.sin(t * Math.PI) + 0.4 * Math.cos(t * Math.PI * 2);
  const layers = 15;
  for (let j = 0; j <= layers; j++) {
    const t = j / layers;
    const y = -height / 2 + t * height;
    const r = getRadius(t);
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
    }
  }
  for (const v of vertices) lines.push(`v ${v[0].toFixed(4)} ${v[1].toFixed(4)} ${v[2].toFixed(4)}`);
  for (let j = 0; j < layers; j++) {
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      faces.push([j * segments + i + 1, j * segments + next + 1, (j + 1) * segments + next + 1, (j + 1) * segments + i + 1]);
    }
  }
  const bottomCenterIndex = vertices.length + 1;
  lines.push(`v 0.0000 ${(-height / 2).toFixed(4)} 0.0000`);
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push([next + 1, i + 1, bottomCenterIndex]);
  }
  for (const f of faces) lines.push(`f ${f.join(' ')}`);
  return lines.join('\n');
}

function generateCubeGLTF(): string {
  const positions = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,1,-1,-1,1,1,-1,-1,1,-1]);
  const normals = new Float32Array([-0.57,-0.57,0.57,0.57,-0.57,0.57,0.57,0.57,0.57,-0.57,0.57,0.57,-0.57,-0.57,-0.57,0.57,-0.57,-0.57,0.57,0.57,-0.57,-0.57,0.57,-0.57]);
  const indices = new Uint16Array([0,1,2,0,2,3,1,5,6,1,6,2,5,4,7,5,7,6,4,0,3,4,3,7,3,2,6,3,6,7,4,5,1,4,1,0]);
  const toBase64 = (arr: ArrayBufferView) => {
    const bytes = new Uint8Array(arr.buffer);
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  };
  const gltf = {
    asset: { version: '2.0' }, scene: 0,
    scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
    materials: [{ pbrMetallicRoughness: { baseColorFactor: [1.0, 0.42, 0.10, 1.0], metallicFactor: 0.6, roughnessFactor: 0.3 } }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 8, type: 'VEC3', max: [1,1,1], min: [-1,-1,-1] },
      { bufferView: 1, componentType: 5126, count: 8, type: 'VEC3' },
      { bufferView: 2, componentType: 5123, count: 36, type: 'SCALAR' }
    ],
    bufferViews: [
      { buffer: 0, byteLength: 96, target: 34962 },
      { buffer: 1, byteLength: 96, target: 34962 },
      { buffer: 2, byteLength: 72, target: 34963 }
    ],
    buffers: [
      { uri: `data:application/octet-stream;base64,${toBase64(positions)}`, byteLength: 96 },
      { uri: `data:application/octet-stream;base64,${toBase64(normals)}`, byteLength: 96 },
      { uri: `data:application/octet-stream;base64,${toBase64(indices)}`, byteLength: 72 }
    ]
  };
  return JSON.stringify(gltf, null, 2);
}

@Injectable({ providedIn: 'root' })
export class SampleModelsService {
  readonly SAMPLE_MODELS: SampleModel[] = [
    {
      name: 'Engrenagem Industrial',
      format: 'obj',
      getBlob: () => new Blob([generateGearOBJ()], { type: 'text/plain' })
    },
    {
      name: 'Coluna Estrelada',
      format: 'stl',
      getBlob: () => new Blob([generateStarPrismSTL()], { type: 'text/plain' })
    },
    {
      name: 'Vaso Geométrico',
      format: 'obj',
      getBlob: () => new Blob([generateVaseOBJ()], { type: 'text/plain' })
    },
    {
      name: 'Cubo Laranja (GLTF)',
      format: 'gltf',
      getBlob: () => new Blob([generateCubeGLTF()], { type: 'application/json' })
    }
  ];
}
