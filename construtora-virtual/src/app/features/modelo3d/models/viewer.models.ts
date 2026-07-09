export interface Annotation {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  color: string;
  createdAt: string;
  iconName?: string;
  attachedUrl?: string;
  attachedImageUrl?: string;
}

export interface Measurement {
  id: string;
  startPoint: [number, number, number];
  endPoint: [number, number, number];
  distance: number;
  label?: string;
}

export interface LightingConfig {
  ambientColor: string;
  ambientIntensity: number;
  dirColor: string;
  dirIntensity: number;
  dirPos: [number, number, number];
  pointColor: string;
  pointIntensity: number;
  pointPos: [number, number, number];
  bgColor: string;
  showGrid: boolean;
  showAxes: boolean;
}

export interface ModelMetadata {
  name: string;
  format: 'obj' | 'stl' | 'fbx' | 'gltf';
  verticesCount: number;
  trianglesCount: number;
  boundingBox: {
    width: number;
    height: number;
    depth: number;
  };
  scaleFactor?: number;
}

export type RenderMode = 'wireframe' | 'shaded' | 'shaded-edges' | 'textured';

export interface Project {
  id: string;
  name: string;
  modelName: string;
  modelFormat: 'obj' | 'stl' | 'fbx' | 'gltf' | null;
  modelDataUrl?: string;
  annotations: Annotation[];
  measurements: Measurement[];
  lighting: LightingConfig;
  renderMode: RenderMode;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectedPin {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface ProjectedMeasurement {
  id: string;
  x: number;
  y: number;
  distance: number;
  visible: boolean;
}
