import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  NgZone,
  PLATFORM_ID,
  Inject,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { RouterLink } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private buildingGroup!: THREE.Group;
  private clock!: THREE.Clock;
  private lenis!: Lenis;
  private animationId!: number;
  private mouse = { x: 0, y: 0 };
  private targetRotation = { x: 0, y: 0 };
  private particleCtx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private particleAnimId!: number;
  private lenisRaf!: number;
  private isBrowser: boolean;
  private resizeObserver!: ResizeObserver;
  private countersStarted = false;
  private timelineStarted = false;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      this.runLoadingScreen().then(() => {
        this.initLenis();
        this.initScrollProgress();
        this.initNavbar();
        this.initParticles();
        this.initThreeJS();
        this.initMouseParallax();
        this.initGSAPAnimations();
        this.initProjectVideosScroll();
        this.initServiceTilt();
        this.initFAQ();
        this.initHamburger();
        this.initSmoothLinks();
      });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    cancelAnimationFrame(this.animationId);
    cancelAnimationFrame(this.particleAnimId);
    cancelAnimationFrame(this.lenisRaf);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    if (this.lenis) this.lenis.destroy();
    if (this.resizeObserver) this.resizeObserver.disconnect();

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.killAll();
  }
  private runLoadingScreen(): Promise<void> {
    return new Promise((resolve) => {
      const screen = document.getElementById('loadingScreen');
      const bar = document.getElementById('loadingBar');
      const percent = document.getElementById('loadingPercent');

      if (!screen || !bar || !percent) { resolve(); return; }

      let progress = 0;
      const duration = 1800;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        progress = Math.min((elapsed / duration) * 100, 100);

        bar.style.width = `${progress}%`;
        percent.textContent = `${Math.round(progress)}%`;

        if (progress < 100) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(() => {
            screen.classList.add('hidden');
            setTimeout(resolve, 650);
          }, 200);
        }
      };

      requestAnimationFrame(tick);
    });
  }
  private initLenis(): void {
    if (typeof Lenis === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      this.lenisRaf = requestAnimationFrame(raf);
    };

    this.lenisRaf = requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => this.lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  private initScrollProgress(): void {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${scrolled}%`;
    }, { passive: true });
  }
  private initNavbar(): void {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }
  private initHamburger(): void {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.classList.toggle('active');
      btn.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
      menu.classList.toggle('open', isOpen);
    });

    menu.querySelectorAll('.navbar-mobile-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        menu.classList.remove('open');
      });
    });
  }
  private initSmoothLinks(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector<HTMLElement>(href);

        if (target) {
          e.preventDefault();

          if (this.lenis) {
            this.lenis.scrollTo(target as HTMLElement, {
              offset: -80,
              duration: 1.4
            });
          } else {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }
  private initParticles(): void {
    const canvas = document.getElementById('heroParticles') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.particleCtx = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    this.particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist / 70)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      this.particleAnimId = requestAnimationFrame(draw);
    };

    draw();
  }
  private initThreeJS(): void {
    const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.error('Falha ao criar WebGL', e);
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.8;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0B0F19, 0.008);

    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(0, 3.5, 18);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 30;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.enablePan = false;

    this.clock = new THREE.Clock();
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    this.scene.add(ambientLight);

    const mainSunLight = new THREE.DirectionalLight(0xffffff, 4.0);
    mainSunLight.position.set(12, 25, 15);
    mainSunLight.castShadow = true;
    mainSunLight.shadow.mapSize.width = 1024;
    mainSunLight.shadow.mapSize.height = 1024;
    this.scene.add(mainSunLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 2.5);
    fillLight.position.set(-15, 12, -10);
    this.scene.add(fillLight);

    const blueRimLight = new THREE.DirectionalLight(0x3b82f6, 3.0);
    blueRimLight.position.set(0, -10, -15);
    this.scene.add(blueRimLight);

    const accentFrontLight = new THREE.PointLight(0x93c5fd, 3.0, 30);
    accentFrontLight.position.set(0, 5, 8);
    this.scene.add(accentFrontLight);
    const loader = new GLTFLoader();

    loader.load(
      '/models/modern_building.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -2.2, 0);
        model.scale.set(0.38, 0.38, 0.38);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.needsUpdate = true;
              if ('roughness' in child.material) child.material.roughness = 0.35;
              if ('metalness' in child.material) child.material.metalness = 0.25;
            }
          }
        });

        this.buildingGroup = new THREE.Group();
        this.buildingGroup.add(model);
        this.scene.add(this.buildingGroup);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        this.controls.target.copy(center);
        this.camera.lookAt(center);
      },
      undefined,
      (error) => console.error('Erro ao carregar modelo GLB:', error)
    );
    const pGeo = new THREE.BufferGeometry();
    const pCount = 60;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = Math.random() * 14 - 2;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const points = new THREE.Points(pGeo, pMat);
    this.scene.add(points);
    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.4,
      metalness: 0.4,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.8;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.resizeObserver = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
    this.resizeObserver.observe(canvas);
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  private initMouseParallax(): void {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }
  private initGSAPAnimations(): void {
    if (typeof gsap === 'undefined') {
      document.querySelectorAll('[data-gsap]').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .fromTo('[data-gsap="hero-content"] .hero-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.title-line',
        { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.9, stagger: 0.12, ease: 'power4.out' },
        '-=0.4'
      )
      .fromTo('[data-gsap="hero-desc"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('[data-gsap="hero-actions"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('[data-gsap="hero-trust"]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.hero-3d',
        { opacity: 0, scale: 0.9, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: 'power4.out' },
        '-=1.2'
      );
    this.scrollReveal('[data-gsap="fade-up"]', {
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
    });

    this.scrollReveal('[data-gsap="fade-right"]', {
      from: { opacity: 0, x: -50 },
      to: { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
    });

    this.scrollRevealStagger('[data-gsap="card"]', {
      from: { opacity: 0, y: 60, scale: 0.95 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
    }, '.services-grid');

    this.scrollRevealStagger('[data-gsap="diff-item"]', {
      from: { opacity: 0, y: 40, scale: 0.97 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
    }, '.differentials-grid');

    this.scrollRevealStagger('[data-gsap="timeline-step"]', {
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
    }, '.timeline');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.timeline',
        start: 'top 70%',
        onEnter: () => {
          if (!this.timelineStarted) {
            this.timelineStarted = true;
            const fill = document.getElementById('timelineFill');
            if (fill) fill.style.width = '100%';
          }
        },
      });
    }

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.stats',
        start: 'top 75%',
        onEnter: () => {
          if (!this.countersStarted) {
            this.countersStarted = true;
            this.runCounters();
            document.querySelectorAll('.stat-bar-fill').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.width = '100%';
              }, i * 150);
            });
          }
        },
      });
    } else {
      this.runCounters();
    }

    this.scrollRevealStagger('[data-gsap="stat"]', {
      from: { opacity: 0, y: 40, scale: 0.9 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.2)', stagger: 0.12 },
    }, '.stats-grid');

    this.scrollRevealStagger('[data-gsap="testimonial"]', {
      from: { opacity: 0, y: 50, scale: 0.96 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
    }, '.testimonials-grid');

    this.scrollRevealStagger('[data-gsap="faq-item"]', {
      from: { opacity: 0, x: 30 },
      to: { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 },
    }, '.faq-list');

    this.scrollReveal('[data-gsap="cta"]', {
      from: { opacity: 0, y: 60, scale: 0.97 },
      to: { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' },
    });
  }

  private initProjectVideosScroll(): void {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      const video = card.querySelector('.project-hover-video') as HTMLVideoElement;
      if (!video) return;

      video.pause();
      video.currentTime = 0;

      let activeWheelHandler: ((e: WheelEvent) => void) | null = null;

      const onMouseEnter = () => {
        const startHijack = () => {
          const duration = video.duration;
          if (!duration || isNaN(duration)) return;

          activeWheelHandler = (e: WheelEvent) => {
            const delta = e.deltaY;
            const current = video.currentTime;
            
            // Adjust speedFactor so it takes about 8 scroll ticks to play the video
            const speedFactor = duration / 800; 
            let target = current + delta * speedFactor;
            
            const isAtUpperLimit = current >= duration && delta > 0;
            const isAtLowerLimit = current <= 0 && delta < 0;

            if (isAtUpperLimit || isAtLowerLimit) {
              // Let page scroll normally
              return;
            }

            // Hijack scroll input to update video current time
            e.preventDefault();
            target = Math.max(0, Math.min(duration, target));
            video.currentTime = target;
          };

          window.addEventListener('wheel', activeWheelHandler, { passive: false });
        };

        if (video.readyState >= 1) {
          startHijack();
        } else {
          video.addEventListener('loadedmetadata', startHijack, { once: true });
        }
      };

      const onMouseLeave = () => {
        if (activeWheelHandler) {
          window.removeEventListener('wheel', activeWheelHandler);
          activeWheelHandler = null;
        }
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  private scrollReveal(
    selector: string,
    anim: { from: Record<string, any>; to: Record<string, any> }
  ): void {
    const el = document.querySelector(selector);
    if (!el) return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(el, anim.from, {
        ...anim.to,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      gsap.fromTo(el, anim.from, anim.to);
    }
  }

  private scrollRevealStagger(
    selector: string,
    anim: { from: Record<string, any>; to: Record<string, any> },
    triggerEl: string
  ): void {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const trigger = document.querySelector(triggerEl) || elements[0];

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(elements, anim.from, {
        ...anim.to,
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      gsap.fromTo(elements, anim.from, anim.to);
    }
  }
  private runCounters(): void {
    const counters = document.querySelectorAll<HTMLElement>('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset['target'] || '0', 10);
      const suffix = counter.dataset['suffix'] || '';
      const duration = 2000;
      const startTime = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        counter.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  private initServiceTilt(): void {
    const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');
    cards.forEach(card => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03) translateY(-6px)`;
      };
      const onLeave = () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease';
      };
      const onEnter = () => {
        card.style.transition = 'transform 0.1s ease, box-shadow 0.5s ease';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('mouseenter', onEnter);
    });
  }
  private initFAQ(): void {
    const items = document.querySelectorAll<HTMLElement>('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector<HTMLButtonElement>('.faq-question');
      const answer = item.querySelector<HTMLElement>('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => {
          i.classList.remove('open');
          const b = i.querySelector<HTMLButtonElement>('.faq-question');
          const a = i.querySelector<HTMLElement>('.faq-answer');
          if (b) b.setAttribute('aria-expanded', 'false');
          if (a) a.setAttribute('aria-hidden', 'true');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }
  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser || !this.renderer) return;
    this.ngZone.runOutsideAngular(() => {
      const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
      if (canvas) {
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      }
    });
  }
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
}