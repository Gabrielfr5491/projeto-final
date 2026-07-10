import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import {
  Annotation, Measurement, LightingConfig, ModelMetadata,
  RenderMode, Project, ProjectedPin, ProjectedMeasurement
} from './models/viewer.models';
import { SampleModelsService, SampleModel } from './services/sample-models.service';
import { Modelo3dApiService, Modelo3dResponse } from '../../core/services/modelo3d-api.service';
import { ObraService } from '../../core/services/obra.service';

@Component({
  selector: 'app-modelo3d',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modelo3d.component.html',
  styleUrls: ['./modelo3d.component.scss']
})
export class Modelo3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  // ─── Three.js core objects ───────────────────────────────────────────────
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private modelGroup!: THREE.Group;
  private measurementLinesGroup!: THREE.Group;
  private annotationPinsGroup!: THREE.Group;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;
  private gridHelper!: THREE.GridHelper;
  private axesHelper!: THREE.AxesHelper;
  private animationFrameId!: number;
  private resizeObserver!: ResizeObserver;
  private scaleFactor = 1.0;

  // ─── Model state ─────────────────────────────────────────────────────────
  modelFile: Blob | null = null;
  modelFormat: 'obj' | 'stl' | 'fbx' | 'gltf' | null = null;
  modelName = '';
  metadata: ModelMetadata | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  isDragOver = false;

  // ─── Interaction mode ─────────────────────────────────────────────────────
  viewerMode: 'view' | 'annotate' | 'measure' = 'view';
  renderMode: RenderMode = 'textured';

  // ─── Annotations ─────────────────────────────────────────────────────────
  annotations: Annotation[] = [];
  activeAnnotationId: string | null = null;

  // ─── Measurements ────────────────────────────────────────────────────────
  measurements: Measurement[] = [];
  measureStartPoint: THREE.Vector3 | null = null;

  // ─── UI tab ──────────────────────────────────────────────────────────────
  currentTab: 'tools' | 'lighting' | 'annotations' | 'projects' = 'tools';
  sidebarCollapsed = false;
  scaleProportion = 1.0; // Fator de escala/proporção para calibrar para metros reais

  // ─── Projected overlays ──────────────────────────────────────────────────
  projectedPins: ProjectedPin[] = [];
  projectedMeasurements: ProjectedMeasurement[] = [];
  projectedTempMeasure: { x: number; y: number; distance: number } | null = null;

  // ─── Lighting ────────────────────────────────────────────────────────────
  lighting: LightingConfig = {
    ambientColor: '#ffffff',
    ambientIntensity: 0.6,
    dirColor: '#ffffff',
    dirIntensity: 0.8,
    dirPos: [5, 10, 7],
    pointColor: '#ff6b1a',
    pointIntensity: 0.6,
    pointPos: [0, 5, 3],
    bgColor: '#0d0d0d',
    showGrid: true,
    showAxes: true,
  };

  // ─── Projects ────────────────────────────────────────────────────────────
  savedProjects: Modelo3dResponse[] = [];
  activeProjectId: number | null = null;
  newProjectName = '';
  showSaveModal = false;
  isSaving = false;
  listaObras: any[] = [];
  obraSelecionadaId: number | null = null;
  viewModeSource: 'obra' | 'local' = 'local';
  obraVisualizarId: number | null = null;
  selectedObraHasModel = false;

  // ─── Sample models ────────────────────────────────────────────────────────
  sampleModels: SampleModel[] = [];

  // ─── Render mode options ─────────────────────────────────────────────────
  renderModes: { key: RenderMode; label: string; icon: string }[] = [
    { key: 'textured', label: 'Texturizado', icon: '◈' },
    { key: 'shaded', label: 'Sombreado', icon: '◉' },
    { key: 'shaded-edges', label: 'Bordas', icon: '◫' },
    { key: 'wireframe', label: 'Wireframe', icon: '⬡' },
  ];

  // ─── Drag tracking ───────────────────────────────────────────────────────
  private dragStart: { x: number; y: number; time: number } | null = null;
  private tempV = new THREE.Vector3();
  private hoverPoint: THREE.Vector3 | null = null;
  private isOverModel = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private sampleModelsService: SampleModelsService,
    private modelo3dApi: Modelo3dApiService,
    private obraService: ObraService
  ) {
    this.sampleModels = sampleModelsService.SAMPLE_MODELS;
    this.carregarProjetos();
    this.carregarObras();
  }

  setSourceMode(mode: 'obra' | 'local'): void {
    this.viewModeSource = mode;
    this.modelFile = null;
    this.modelName = '';
    this.modelFormat = null;
    this.metadata = null;
    this.annotations = [];
    this.measurements = [];
    this.activeAnnotationId = null;
    this.obraVisualizarId = null;
    this.selectedObraHasModel = false;
    this.clearModelGroup();
    this.clearMeasurementLines();
    this.rebuildAnnotationPins();
  }

  onObraVisualizarChange(obraId: number | null): void {
    // Força conversão para number (select pode retornar string)
    const id = obraId != null ? +obraId : null;

    if (!id) {
      this.selectedObraHasModel = false;
      return;
    }

    // Busca a obra diretamente pelo ID para garantir todos os dados Base64
    this.obraService.buscarPorId(id).subscribe({
      next: (obra: any) => {
        console.log('Obra carregada do banco:', obra?.nome, '| tem modelo3d:', !!obra?.modelo3dBase64);

        if (obra && obra.modelo3dBase64 && obra.modelo3dFormato) {
          this.selectedObraHasModel = true;
          this.modelName = obra.modelo3dNome || `Modelo Obra #${obra.id}`;
          this.modelFormat = obra.modelo3dFormato.toLowerCase() as any;
          this.isLoading = true;

          fetch(obra.modelo3dBase64)
            .then(res => res.blob())
            .then(blob => {
              this.modelFile = blob;
              this.loadBlob(blob, this.modelFormat!);
            })
            .catch(err => {
              console.error('Erro ao converter Base64 para Blob:', err);
              this.errorMessage = 'Erro ao ler arquivo 3D da obra.';
              this.isLoading = false;
            });
        } else {
          this.selectedObraHasModel = false;
          this.modelFile = null;
          this.modelName = '';
          this.modelFormat = null;
          this.metadata = null;
          this.clearModelGroup();
          this.clearMeasurementLines();
          console.warn('Obra selecionada não possui modelo3dBase64 ou modelo3dFormato.');
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar obra por ID:', err);
        this.selectedObraHasModel = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  // ── Scene Initialization ─────────────────────────────────────────────────
  private initScene(): void {
    const container = this.canvasContainer.nativeElement;
    const canvas = this.canvasEl.nativeElement;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.lighting.bgColor);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    this.camera.position.set(5, 5, 8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Lights
    this.ambientLight = new THREE.AmbientLight(this.lighting.ambientColor, this.lighting.ambientIntensity);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(this.lighting.dirColor, this.lighting.dirIntensity);
    this.dirLight.position.set(...this.lighting.dirPos);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    this.pointLight = new THREE.PointLight(this.lighting.pointColor, this.lighting.pointIntensity, 100);
    this.pointLight.position.set(...this.lighting.pointPos);
    this.scene.add(this.pointLight);

    // Grid and axes
    this.gridHelper = new THREE.GridHelper(20, 20, 0xff6b1a, 0x333333);
    this.gridHelper.position.y = -2;
    this.scene.add(this.gridHelper);

    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);

    // Model group
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    this.measurementLinesGroup = new THREE.Group();
    this.scene.add(this.measurementLinesGroup);

    this.annotationPinsGroup = new THREE.Group();
    this.scene.add(this.annotationPinsGroup);

    // Resize observer
    this.resizeObserver = new ResizeObserver(() => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      this.camera.aspect = cw / ch;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(cw, ch);
    });
    this.resizeObserver.observe(container);
  }

  // ── Animation loop ───────────────────────────────────────────────────────
  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.projectOverlays();
  }

  private projectOverlays(): void {
    if (!this.camera || !this.canvasContainer) return;
    const cw = this.canvasContainer.nativeElement.clientWidth;
    const ch = this.canvasContainer.nativeElement.clientHeight;

    const pins2D: ProjectedPin[] = this.annotations.map(ann => {
      this.tempV.set(...ann.position).project(this.camera);
      const visible = this.tempV.z <= 1.0 && Math.abs(this.tempV.x) <= 1 && Math.abs(this.tempV.y) <= 1;
      return { id: ann.id, x: (this.tempV.x * 0.5 + 0.5) * cw, y: (-this.tempV.y * 0.5 + 0.5) * ch, visible };
    });

    const m2D: ProjectedMeasurement[] = this.measurements.map(m => {
      const mx = (m.startPoint[0] + m.endPoint[0]) / 2;
      const my = (m.startPoint[1] + m.endPoint[1]) / 2;
      const mz = (m.startPoint[2] + m.endPoint[2]) / 2;
      this.tempV.set(mx, my, mz).project(this.camera);
      const visible = this.tempV.z <= 1.0 && Math.abs(this.tempV.x) <= 1 && Math.abs(this.tempV.y) <= 1;
      return { id: m.id, x: (this.tempV.x * 0.5 + 0.5) * cw, y: (-this.tempV.y * 0.5 + 0.5) * ch, distance: m.distance * this.scaleProportion, visible };
    });

    let tempMeasure: { x: number; y: number; distance: number } | null = null;
    if (this.viewerMode === 'measure' && this.measureStartPoint && this.hoverPoint && this.isOverModel) {
      const midX = (this.measureStartPoint.x + this.hoverPoint.x) / 2;
      const midY = (this.measureStartPoint.y + this.hoverPoint.y) / 2;
      const midZ = (this.measureStartPoint.z + this.hoverPoint.z) / 2;
      this.tempV.set(midX, midY, midZ).project(this.camera);
      const dist = (this.measureStartPoint.distanceTo(this.hoverPoint) / this.scaleFactor) * this.scaleProportion;
      tempMeasure = { x: (this.tempV.x * 0.5 + 0.5) * cw, y: (-this.tempV.y * 0.5 + 0.5) * ch, distance: dist };
    }

    // Only trigger change detection if something changed
    const pinsChanged = JSON.stringify(pins2D) !== JSON.stringify(this.projectedPins);
    const mChanged = JSON.stringify(m2D) !== JSON.stringify(this.projectedMeasurements);
    const tChanged = JSON.stringify(tempMeasure) !== JSON.stringify(this.projectedTempMeasure);

    if (pinsChanged || mChanged || tChanged) {
      this.ngZone.run(() => {
        this.projectedPins = pins2D;
        this.projectedMeasurements = m2D;
        this.projectedTempMeasure = tempMeasure;
      });
    }
  }

  // ── Model Loading ────────────────────────────────────────────────────────
  loadSampleModel(sample: SampleModel): void {
    this.modelFile = sample.getBlob();
    this.modelFormat = sample.format;
    this.modelName = sample.name;
    this.annotations = [];
    this.measurements = [];
    this.activeAnnotationId = null;
    this.viewerMode = 'view';
    this.renderMode = 'textured';
    this.loadBlob(this.modelFile, this.modelFormat);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.loadFile(file);
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void { this.isDragOver = false; }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) this.loadFile(file);
  }

  private loadFile(file: File): void {
    let ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'glb') ext = 'gltf';
    if (!['obj', 'stl', 'fbx', 'gltf'].includes(ext)) {
      this.errorMessage = 'Formato não suportado. Use .obj, .stl, .fbx, .gltf ou .glb';
      return;
    }
    this.modelFile = file;
    this.modelFormat = ext as any;
    this.modelName = file.name;
    this.annotations = [];
    this.measurements = [];
    this.activeAnnotationId = null;
    this.viewerMode = 'view';
    this.loadBlob(file, this.modelFormat!);
  }

  private loadBlob(blob: Blob, format: 'obj' | 'stl' | 'fbx' | 'gltf'): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.clearModelGroup();
    this.clearMeasurementLines();

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contents = e.target?.result;
        if (!contents) throw new Error('Falha ao ler o arquivo.');

        const processModel = (obj: THREE.Object3D) => this.ngZone.run(() => this.processLoadedModel(obj, format));

        if (format === 'stl') {
          const loader = new STLLoader();
          const geo = loader.parse(contents as ArrayBuffer);
          geo.computeVertexNormals();
          const mat = new THREE.MeshStandardMaterial({ color: 0xff6b1a, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide });
          processModel(new THREE.Mesh(geo, mat));
        } else if (format === 'obj') {
          processModel(new OBJLoader().parse(contents as string));
        } else if (format === 'fbx') {
          processModel(new FBXLoader().parse(contents as ArrayBuffer, ''));
        } else if (format === 'gltf') {
          new GLTFLoader().parse(contents as ArrayBuffer, '', (gltf) => processModel(gltf.scene), (err) => {
            this.ngZone.run(() => {
              this.errorMessage = 'Falha ao decodificar arquivo GLTF/GLB.';
              this.isLoading = false;
            });
            console.error(err);
          });
        }
      } catch (err: any) {
        this.ngZone.run(() => {
          this.errorMessage = err.message || 'Erro ao analisar o arquivo 3D.';
          this.isLoading = false;
        });
      }
    };

    if (format === 'stl' || format === 'fbx' || format === 'gltf') {
      reader.readAsArrayBuffer(blob);
    } else {
      reader.readAsText(blob);
    }
  }

  private processLoadedModel(loaded: THREE.Object3D, format: string): void {
    let vCount = 0, tCount = 0;
    const defaultMat = new THREE.MeshStandardMaterial({ color: 0xff6b1a, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide });

    loaded.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!mesh.material) mesh.material = defaultMat;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => { m.side = THREE.DoubleSide; });
        } else if (mesh.material) {
          (mesh.material as THREE.Material).side = THREE.DoubleSide;
        }
        mesh.userData['originalMaterial'] = mesh.material;
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundingSphere();
          vCount += mesh.geometry.attributes['position'].count;
          if (mesh.geometry.index) tCount += mesh.geometry.index.count / 3;
          else tCount += mesh.geometry.attributes['position'].count / 3;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(loaded);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const targetDim = 4.0;
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    this.scaleFactor = targetDim / maxDim;
    loaded.scale.setScalar(this.scaleFactor);

    this.modelGroup.add(loaded);
    this.applyRenderMode(this.renderMode);

    loaded.position.set(-center.x * this.scaleFactor, -center.y * this.scaleFactor, -center.z * this.scaleFactor);
    loaded.updateMatrixWorld(true);
    this.modelGroup.updateMatrixWorld(true);

    const scaledH = size.y * this.scaleFactor;
    this.gridHelper.position.y = -scaledH / 2 - 0.01;

    const fov = this.camera.fov;
    let cameraZ = Math.abs(targetDim / 2 / Math.tan((fov * Math.PI) / 360)) * 2.2;
    this.camera.position.set(cameraZ * 0.7, cameraZ * 0.5, cameraZ * 1.2);
    this.camera.lookAt(0, 0, 0);
    this.camera.near = targetDim * 0.01;
    this.camera.far = cameraZ * 10;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.metadata = {
      name: this.modelName,
      format: format as any,
      verticesCount: vCount,
      trianglesCount: Math.round(tCount),
      boundingBox: { width: +size.x.toFixed(2), height: +size.y.toFixed(2), depth: +size.z.toFixed(2) },
      scaleFactor: this.scaleFactor
    };
    this.isLoading = false;
    this.measureStartPoint = null;
  }

  // ── Render Mode ──────────────────────────────────────────────────────────
  setRenderMode(mode: RenderMode): void {
    this.renderMode = mode;
    if (this.modelFile) this.applyRenderMode(mode);
  }

  private applyRenderMode(mode: RenderMode): void {
    this.modelGroup.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const existing = mesh.getObjectByName('edge-helper');
      if (existing) mesh.remove(existing);

      if (mode === 'wireframe') {
        mesh.material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, side: THREE.DoubleSide });
      } else if (mode === 'shaded') {
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xff6b1a, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide });
      } else if (mode === 'shaded-edges') {
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xff6b1a, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide });
        if (mesh.geometry) {
          const edges = new THREE.EdgesGeometry(mesh.geometry);
          const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1a1a1a }));
          line.name = 'edge-helper';
          mesh.add(line);
        }
      } else if (mode === 'textured') {
        if (mesh.userData['originalMaterial']) mesh.material = mesh.userData['originalMaterial'];
      }
    });
  }

  // ── Lighting ─────────────────────────────────────────────────────────────
  updateLighting(): void {
    this.scene.background = new THREE.Color(this.lighting.bgColor);
    this.ambientLight.color.set(this.lighting.ambientColor);
    this.ambientLight.intensity = this.lighting.ambientIntensity;
    this.dirLight.color.set(this.lighting.dirColor);
    this.dirLight.intensity = this.lighting.dirIntensity;
    this.dirLight.position.set(...this.lighting.dirPos);
    this.pointLight.color.set(this.lighting.pointColor);
    this.pointLight.intensity = this.lighting.pointIntensity;
    this.pointLight.position.set(...this.lighting.pointPos);
    this.gridHelper.visible = this.lighting.showGrid;
    this.axesHelper.visible = this.lighting.showAxes;
  }

  // ── Canvas interaction ────────────────────────────────────────────────────
  onPointerDown(e: PointerEvent): void {
    this.dragStart = { x: e.clientX, y: e.clientY, time: Date.now() };
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.dragStart) return;
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const elapsed = Date.now() - this.dragStart.time;
    this.dragStart = null;
    if (dist > 10 || elapsed > 300) return;

    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

    // Check annotation pins first
    const pinHits = raycaster.intersectObjects(this.annotationPinsGroup.children);
    if (pinHits.length > 0) {
      const pid = pinHits[0].object.userData?.['id'];
      if (pid) { this.activeAnnotationId = pid; return; }
    }

    const hits = raycaster.intersectObjects(this.modelGroup.children, true);
    if (hits.length > 0) {
      const pt = hits[0].point;
      if (this.viewerMode === 'annotate') {
        this.addAnnotation([pt.x, pt.y, pt.z]);
      } else if (this.viewerMode === 'measure') {
        if (!this.measureStartPoint) {
          this.measureStartPoint = pt.clone();
        } else {
          const distScaled = this.measureStartPoint.distanceTo(pt);
          this.addMeasurement(
            [this.measureStartPoint.x, this.measureStartPoint.y, this.measureStartPoint.z],
            [pt.x, pt.y, pt.z],
            distScaled / this.scaleFactor
          );
          this.measureStartPoint = null;
        }
      }
    } else if (this.viewerMode === 'view') {
      this.activeAnnotationId = null;
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.viewerMode !== 'measure') { this.isOverModel = false; return; }
    const canvas = this.canvasEl.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const hits = raycaster.intersectObjects(this.modelGroup.children, true);
    if (hits.length > 0) {
      this.hoverPoint = hits[0].point;
      this.isOverModel = true;
    } else {
      this.isOverModel = false;
    }
  }

  onMouseLeave(): void { this.isOverModel = false; }

  // ── Annotations ───────────────────────────────────────────────────────────
  addAnnotation(position: [number, number, number]): void {
    const ann: Annotation = {
      id: `ann-${Date.now()}`,
      title: `Anotação #${this.annotations.length + 1}`,
      description: 'Clique para editar esta anotação.',
      position,
      color: '#ff6b1a',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      iconName: 'map-pin'
    };
    this.annotations = [...this.annotations, ann];
    this.activeAnnotationId = ann.id;
    this.currentTab = 'annotations';
    this.viewerMode = 'view';
    this.rebuildAnnotationPins();
  }

  updateAnnotation(id: string, fields: Partial<Annotation>): void {
    this.annotations = this.annotations.map(a => a.id === id ? { ...a, ...fields } : a);
    this.rebuildAnnotationPins();
  }

  deleteAnnotation(id: string): void {
    this.annotations = this.annotations.filter(a => a.id !== id);
    if (this.activeAnnotationId === id) this.activeAnnotationId = null;
    this.rebuildAnnotationPins();
  }

  private rebuildAnnotationPins(): void {
    while (this.annotationPinsGroup.children.length > 0) this.annotationPinsGroup.remove(this.annotationPinsGroup.children[0]);
    this.annotations.forEach(ann => {
      const isSelected = ann.id === this.activeAnnotationId;
      const pinColor = new THREE.Color(ann.color || '#ff6b1a');
      const geo = new THREE.SphereGeometry(isSelected ? 0.08 : 0.05, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: isSelected ? 0.9 : 0.7, depthTest: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...ann.position);
      mesh.userData = { id: ann.id, type: 'pin' };
      this.annotationPinsGroup.add(mesh);
    });
  }

  selectAnnotation(id: string): void {
    this.activeAnnotationId = id;
    this.rebuildAnnotationPins();
    const ann = this.annotations.find(a => a.id === id);
    if (ann && this.controls) {
      this.controls.target.set(...ann.position);
      this.controls.update();
    }
  }

  // ── Measurements ─────────────────────────────────────────────────────────
  addMeasurement(start: [number, number, number], end: [number, number, number], distance: number): void {
    const m: Measurement = {
      id: `m-${Date.now()}`,
      startPoint: start,
      endPoint: end,
      distance,
      label: `Medição #${this.measurements.length + 1}`
    };
    this.measurements = [...this.measurements, m];
    this.viewerMode = 'view';
    this.rebuildMeasurementLines();
  }

  deleteMeasurement(id: string): void {
    this.measurements = this.measurements.filter(m => m.id !== id);
    this.rebuildMeasurementLines();
  }

  private rebuildMeasurementLines(): void {
    this.clearMeasurementLines();
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff6b1a, depthTest: false });
    const sphereGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff6b1a, depthTest: false });
    this.measurements.forEach(m => {
      const p1 = new THREE.Vector3(...m.startPoint);
      const p2 = new THREE.Vector3(...m.endPoint);
      [p1, p2].forEach(p => {
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(p);
        this.measurementLinesGroup.add(sphere);
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      this.measurementLinesGroup.add(new THREE.Line(lineGeo, lineMat));
    });
  }

  private clearMeasurementLines(): void {
    while (this.measurementLinesGroup.children.length > 0) this.measurementLinesGroup.remove(this.measurementLinesGroup.children[0]);
  }

  private clearModelGroup(): void {
    while (this.modelGroup.children.length > 0) this.modelGroup.remove(this.modelGroup.children[0]);
  }

  // ── Projects (API) ────────────────────────────────────────────────────────
  carregarProjetos(): void {
    this.modelo3dApi.listar().subscribe({
      next: (projects) => { this.savedProjects = projects; },
      error: (err) => console.error('Erro ao carregar projetos:', err)
    });
  }

  carregarObras(): void {
    this.obraService.listar().subscribe({
      next: (obras) => { this.listaObras = obras; },
      error: (err) => console.error('Erro ao carregar obras:', err)
    });
  }

  saveProject(): void {
    if (!this.newProjectName.trim() || !this.modelFile) return;
    this.isSaving = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      const payload = {
        nome: this.newProjectName,
        formato: this.modelFormat || '',
        modeloBase64: e.target?.result as string,
        anotacoes: this.annotations,
        medicoes: this.measurements,
        iluminacao: { ...this.lighting },
        modoRenderizacao: this.renderMode,
        obraId: this.obraSelecionadaId ? +this.obraSelecionadaId : undefined
      };

      if (this.activeProjectId) {
        // Atualizar projeto existente
        this.modelo3dApi.atualizar(this.activeProjectId, payload).subscribe({
          next: (saved) => {
            this.savedProjects = this.savedProjects.map(p => p.id === saved.id ? saved : p);
            this.activeProjectId = saved.id;
            this.newProjectName = '';
            this.isSaving = false;
          },
          error: (err) => { console.error(err); this.isSaving = false; }
        });
      } else {
        // Criar novo projeto
        this.modelo3dApi.salvar(payload).subscribe({
          next: (saved) => {
            this.savedProjects = [saved, ...this.savedProjects];
            this.activeProjectId = saved.id;
            this.newProjectName = '';
            this.isSaving = false;
          },
          error: (err) => { console.error(err); this.isSaving = false; }
        });
      }
    };
    reader.readAsDataURL(this.modelFile);
  }

  loadProject(project: Modelo3dResponse): void {
    this.activeProjectId = project.id;
    this.modelName = project.nome;
    this.modelFormat = project.formato as any;
    this.annotations = project.anotacoes || [];
    this.measurements = project.medicoes || [];
    this.obraSelecionadaId = project.obraId || null;
    if (project.iluminacao) {
      this.lighting = { ...project.iluminacao };
      this.updateLighting();
    }
    this.renderMode = (project.modoRenderizacao as any) || 'textured';
    this.rebuildAnnotationPins();
    this.rebuildMeasurementLines();

    if (project.modeloBase64 && project.formato) {
      fetch(project.modeloBase64).then(r => r.blob()).then(blob => {
        this.modelFile = blob;
        this.loadBlob(blob, project.formato as any);
      });
    }
  }

  deleteProject(id: number): void {
    this.modelo3dApi.deletar(id).subscribe({
      next: () => {
        this.savedProjects = this.savedProjects.filter(p => p.id !== id);
        if (this.activeProjectId === id) this.activeProjectId = null;
      },
      error: (err) => console.error('Erro ao deletar projeto:', err)
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  getAnnotation(id: string): Annotation | undefined {
    return this.annotations.find(a => a.id === id);
  }

  getAnnotationBorderColor(id: string): string {
    const ann = this.getAnnotation(id);
    return ann?.color || '#ff6b1a';
  }

  resetCamera(): void {
    this.camera.position.set(5, 5, 8);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  get cursorClass(): string {
    if (this.viewerMode === 'annotate') return 'cursor-cell';
    if (this.viewerMode === 'measure') return 'cursor-crosshair';
    return 'cursor-grab';
  }

  trackById(index: number, item: { id: string }): string { return item.id; }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.renderer) this.renderer.dispose();
  }
}