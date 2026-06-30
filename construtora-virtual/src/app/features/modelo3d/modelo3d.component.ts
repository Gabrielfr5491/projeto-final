import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modelo3d',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modelo3d.component.html',
  styleUrls: ['./modelo3d.component.scss']
})
export class Modelo3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  // Variáveis do motor 3D (Three.js)
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  public currentModel: THREE.Group | null = null;
  private animationFrameId!: number;

  // Variáveis de relacionamento com as obras
  public obraSelecionadaId: string = '';
  public arquivo3dSelecionado: File | null = null;

  // Simulação de dados do banco de dados da Construtora
  public listaObras = [
    { id: '1', nome: 'Edifício Ville de France', localizacao: 'Centro', modelo3dPath: null },
    { id: '2', nome: 'Condomínio EcoGreen', localizacao: 'Barra', modelo3dPath: null },
    { id: '3', nome: 'Shopping Virtual Construtora', localizacao: 'Alferes', modelo3dPath: 'assets/modelos/shopping.glb' }
  ];

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }

  // Inicializa o cenário 3D padrão
  private initThree(): void {
    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Criar a Cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);

    // Criar a Câmera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 3, 6);

    // Criar o Renderizador
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Adicionar Controles de Mouse (Girar, Zoom, Mover)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Iluminação do ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // Grid de chão para referência espacial
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    this.scene.add(gridHelper);
  }

  // Loop de renderização (mantém o canvas atualizando os frames)
  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Processa o arquivo selecionado, renderiza e aplica o tamanho padrão
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Guarda o arquivo físico para enviar ao banco depois
    this.arquivo3dSelecionado = file;

    // Cria a URL temporária para leitura do Three.js
    const fileURL = URL.createObjectURL(file);
    const loader = new GLTFLoader();

    // Limpa o modelo visualizado anteriormente se houver
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
    }

    loader.load(fileURL, (gltf) => {
      this.currentModel = gltf.scene;
      
      // --- CÁLCULO SEGURO DE PADRONIZAÇÃO DE TAMANHO ---
      const box = new THREE.Box3().setFromObject(this.currentModel);
      const size = new THREE.Vector3();
      box.getSize(size);

      const TAMANHO_PADRAO = 4.0; 
      const maiorDimensao = Math.max(size.x, size.y, size.z) || 1;
      const escalaIdeal = TAMANHO_PADRAO / maiorDimensao;
      
      // Força a escala idêntica em todos os eixos
      this.currentModel.scale.set(escalaIdeal, escalaIdeal, escalaIdeal);

      // Recalcula e centraliza nos eixos X e Z
      box.setFromObject(this.currentModel);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      this.currentModel.position.x = -center.x;
      this.currentModel.position.z = -center.z;
      
      // Alinha a base perfeitamente no nível zero do chão (Grid)
      this.currentModel.position.y = -box.min.y;

      // Adiciona o modelo à cena
      this.scene.add(this.currentModel);
      
      // Alinha o foco da câmera para o centro do novo objeto
      this.controls.target.set(0, TAMANHO_PADRAO / 4, 0);
      this.controls.update();

      // Revoga a URL para liberar memória do navegador
      URL.revokeObjectURL(fileURL);

    }, undefined, (error) => {
      console.error('Erro detalhado do Three.js ao carregar o modelo:', error);
      alert('Não foi possível renderizar este arquivo 3D. Verifique se o formato está correto.');
    });
  }

  // Função que simula o salvamento do vínculo entre a Obra e o Modelo 3D
  salvarVinculoObra(): void {
    if (!this.obraSelecionadaId || !this.arquivo3dSelecionado) {
      alert('Por favor, selecione uma obra e carregue um modelo primeiro.');
      return;
    }

    const obraId = this.obraSelecionadaId;
    const obra = this.listaObras.find(o => o.id === obraId);

    // Logs indicando o sucesso da operação (Onde você integraria sua API/Back-end futuramente)
    console.log(`[PROJETO] Relacionando o arquivo: ${this.arquivo3dSelecionado.name}`);
    console.log(`[OBRA] Destino ID: ${obraId}`);

    if (obra) {
      // Simula a gravação do caminho do arquivo no banco de dados
      obra.modelo3dPath = `assets/modelos/salvos/${this.arquivo3dSelecionado.name}`;
      
      alert(`Sucesso! O modelo 3D "${this.arquivo3dSelecionado.name}" foi relacionado à obra "${obra.nome}" com êxito.`);
      
   
    }
  }

  // Destrutor para evitar memory leak ao sair da página
  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}