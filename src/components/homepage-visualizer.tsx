'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import { Button } from './ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

const Bpm = 174; // Example BPM for a DnB track

export default function HomepageVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Using refs to hold Three.js and Tone.js objects to prevent re-creation on re-renders
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const patternRef = useRef<Tone.Pattern | null>(null);

  useEffect(() => {
    // This effect runs only once to initialize the scene
    if (!mountRef.current || isInitialized) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: '#F0F8FF',
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Tone.js setup
    const analyzer = new Tone.Analyser('waveform', 128);
    analyzerRef.current = analyzer;
    const synth = new Tone.Synth({
        oscillator: { type: 'fmsquare' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 1 },
    }).connect(analyzer);
    synthRef.current = synth;
    Tone.getDestination().volume.value = -12;

    const pattern = new Tone.Pattern((time, note) => {
        synth.triggerAttackRelease(note, '16n', time);
    }, ['C4', 'E4', 'G4', 'B4'], 'random');
    pattern.interval = '8n';
    patternRef.current = pattern;


    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const analyzer = analyzerRef.current;
      const particles = particlesRef.current;
      const scene = sceneRef.current;

      const elapsedTime = clock.getElapsedTime();

      if (analyzer && particles && scene) {
        const values = analyzer.getValue();
        let sum = 0;
        if (values instanceof Float32Array) {
            for (let i = 0; i < values.length; i++) {
                sum += Math.abs(values[i]);
            }
        }
        const avg = sum / values.length;

        particles.rotation.y += 0.0005 + avg * 0.01;
        particles.rotation.x += 0.0005 + avg * 0.01;
        
        const scale = 1 + avg * 3;
        particles.scale.set(scale, scale, scale);
      } else {
        particles.rotation.y = elapsedTime * 0.05;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount && camera && renderer) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    setIsInitialized(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        Tone.Transport.stop();
        Tone.Transport.cancel();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    };
  }, [isInitialized]);

  const togglePlayback = async () => {
    if (!isInitialized || !patternRef.current) return;

    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      const pattern = patternRef.current;
      Tone.Transport.bpm.value = Bpm;
      pattern.start(0);
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };


  return (
    <div className="relative h-screen w-full">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <div className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center text-center transition-colors duration-1000",
        isPlaying ? "bg-black/30" : "bg-black/60"
        )}>
        <h1 className="font-headline text-5xl md:text-7xl lg:text-9xl font-bold tracking-widest text-primary animate-pulse">JR8CH</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground">Kinetic Sounds. Aggressive Futures.</p>
        <Button onClick={togglePlayback} variant="outline" className="mt-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? 'Pause Visualizer' : 'Start Visualizer'}
        </Button>
      </div>
    </div>
  );
}
