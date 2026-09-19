"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Scene3DConfig, Scene3DObject } from "@/types/studio";
import { Project } from "@/types";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Camera,
  Eye,
  Layers,
  Sparkles,
  Move,
  Trash2,
  Lock,
  Compass,
} from "lucide-react";

interface ThreeStudioCanvasProps {
  project: Project;
  config: Scene3DConfig;
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onUpdateObjectPosition: (id: string, newPos: [number, number, number]) => void;
}

export const ThreeStudioCanvas: React.FC<ThreeStudioCanvasProps> = ({
  project,
  config,
  selectedObjectId,
  onSelectObject,
  onUpdateObjectPosition,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<"corner" | "front" | "top" | "interior">("corner");
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const interactiveMeshesRef = useRef<Map<string, THREE.Mesh | THREE.Group>>(new Map());

  // Camera Orbit state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ theta: Math.PI / 4, phi: Math.PI / 6, radius: 14 });
  const cameraTarget = useRef(new THREE.Vector3(0, 1.5, 0));

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraRotation.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z).add(cameraTarget.current);
    cameraRef.current.lookAt(cameraTarget.current);
  };

  const setPresetView = (view: "corner" | "front" | "top" | "interior") => {
    setCameraView(view);
    if (view === "corner") {
      cameraRotation.current = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 14 };
      cameraTarget.current.set(0, 1.5, 0);
    } else if (view === "front") {
      cameraRotation.current = { theta: 0, phi: Math.PI / 2.2, radius: 13 };
      cameraTarget.current.set(0, 1.5, 0);
    } else if (view === "top") {
      cameraRotation.current = { theta: 0, phi: 0.05, radius: 16 };
      cameraTarget.current.set(0, 0, 0);
    } else if (view === "interior") {
      cameraRotation.current = { theta: -Math.PI / 6, phi: Math.PI / 2.1, radius: 6 };
      cameraTarget.current.set(0, 1.2, 0);
    }
    updateCameraPosition();
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");
    scene.fog = new THREE.FogExp2("#030712", 0.035);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.replaceChildren(renderer.domElement);

    // 4. Ground Blueprint Grid
    const gridHelper = new THREE.GridHelper(30, 30, "#1e293b", "#0f172a");
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight("#ffffff", config.ambientLightIntensity || 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffffff", 1.2);
    dirLight.position.set(8, 14, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const blueSpot = new THREE.SpotLight("#38bdf8", 2.5, 20, Math.PI / 5, 0.4);
    blueSpot.position.set(-6, 8, 4);
    scene.add(blueSpot);

    // 6. Stall Raised Floor Platform
    const { stallWidth, stallDepth } = config;
    const floorGeo = new THREE.BoxGeometry(stallWidth, 0.1, stallDepth);
    
    let floorMatColor = "#f8fafc";
    let roughness = 0.1;
    let metalness = 0.1;

    if (config.flooringType === "DARK_SLATE") {
      floorMatColor = "#0f172a";
      roughness = 0.3;
    } else if (config.flooringType === "WARM_OAK_WOOD") {
      floorMatColor = "#78350f";
      roughness = 0.4;
    } else if (config.flooringType === "CARPET_CHARCOAL") {
      floorMatColor = "#1e293b";
      roughness = 0.9;
    }

    const floorMat = new THREE.MeshStandardMaterial({
      color: floorMatColor,
      roughness,
      metalness,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, 0.05, 0);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Perimeter Glow LED Strip
    if (config.neonEdgeEnabled) {
      const neonGeo = new THREE.BoxGeometry(stallWidth + 0.08, 0.02, stallDepth + 0.08);
      const neonMat = new THREE.MeshBasicMaterial({ color: config.neonEdgeColor || "#0284c7" });
      const neonMesh = new THREE.Mesh(neonGeo, neonMat);
      neonMesh.position.set(0, 0.01, 0);
      scene.add(neonMesh);
    }

    // 7. Parametric Walls
    const wallThickness = 0.12;
    const wallHeight = config.stallHeight || 4.0;
    const wallMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 });
    const accentWallMat = new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.2 });

    // Back Wall
    if (config.backWallEnabled) {
      const backWallGeo = new THREE.BoxGeometry(stallWidth, wallHeight, wallThickness);
      const backWall = new THREE.Mesh(backWallGeo, wallMat);
      backWall.position.set(0, wallHeight / 2 + 0.1, -stallDepth / 2 + wallThickness / 2);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      scene.add(backWall);

      // Back Wall Logo Plaque
      if (config.logoBrandingApplied) {
        const plaqueGeo = new THREE.BoxGeometry(2.4, 0.8, 0.05);
        const plaqueMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });
        const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
        plaque.position.set(0, wallHeight - 1.0, -stallDepth / 2 + wallThickness + 0.02);
        scene.add(plaque);
      }
    }

    // Left Wall
    if (config.leftWallEnabled) {
      const leftWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, stallDepth);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
      leftWall.position.set(-stallWidth / 2 + wallThickness / 2, wallHeight / 2 + 0.1, 0);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      scene.add(leftWall);
    }

    // Right Wall
    if (config.rightWallEnabled) {
      const rightWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, stallDepth);
      const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
      rightWall.position.set(stallWidth / 2 - wallThickness / 2, wallHeight / 2 + 0.1, 0);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      scene.add(rightWall);
    }

    // Meeting Room Glass Enclosure
    if (config.meetingRoomDividerEnabled) {
      const dividerGeo = new THREE.BoxGeometry(stallWidth * 0.4, wallHeight * 0.75, 0.08);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: "#38bdf8",
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.8,
      });
      const glassDivider = new THREE.Mesh(dividerGeo, glassMat);
      glassDivider.position.set(-stallWidth * 0.25, (wallHeight * 0.75) / 2 + 0.1, stallDepth * 0.15);
      scene.add(glassDivider);
    }

    // Suspended Overhead Truss Ring
    if (config.hangingBannerEnabled) {
      const ringGeo = new THREE.TorusGeometry(stallWidth * 0.35, 0.15, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: "#0284c7",
        metalness: 0.8,
        roughness: 0.2,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, wallHeight + 0.8, 0);
      scene.add(ring);
    }

    // 8. Dynamic Scene Objects (Furniture, Screens, Podiums)
    interactiveMeshesRef.current.clear();

    config.objects.forEach((obj) => {
      let meshGroup = new THREE.Group();

      if (obj.type === "RECEPTION_COUNTER") {
        const deskGeo = new THREE.BoxGeometry(1.8, 1.0, 0.7);
        const deskMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.2 });
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.y = 0.5;
        desk.castShadow = true;
        meshGroup.add(desk);

        const stripGeo = new THREE.BoxGeometry(1.82, 0.08, 0.72);
        const stripMat = new THREE.MeshBasicMaterial({ color: "#38bdf8" });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.y = 0.3;
        meshGroup.add(strip);
      } else if (obj.type === "LED_VIDEO_WALL") {
        const frameGeo = new THREE.BoxGeometry(3.6, 2.4, 0.12);
        const frameMat = new THREE.MeshStandardMaterial({ color: "#030712", metalness: 0.8 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 1.6;
        frame.castShadow = true;
        meshGroup.add(frame);

        const screenGeo = new THREE.PlaneGeometry(3.5, 2.3);
        const screenMat = new THREE.MeshBasicMaterial({ color: "#0284c7" });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 1.6, 0.07);
        meshGroup.add(screen);
      } else if (obj.type === "VIP_LOUNGE_SOFA") {
        const sofaBase = new THREE.BoxGeometry(2.0, 0.45, 0.9);
        const sofaMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.7 });
        const base = new THREE.Mesh(sofaBase, sofaMat);
        base.position.y = 0.25;
        base.castShadow = true;
        meshGroup.add(base);

        const backRest = new THREE.BoxGeometry(2.0, 0.5, 0.25);
        const rest = new THREE.Mesh(backRest, sofaMat);
        rest.position.set(0, 0.6, -0.32);
        meshGroup.add(rest);
      } else if (obj.type === "MEETING_TABLE") {
        const tableTop = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32);
        const tableMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", metalness: 0.1 });
        const top = new THREE.Mesh(tableTop, tableMat);
        top.position.y = 0.75;
        top.castShadow = true;
        meshGroup.add(top);

        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.75, 16);
        const legMat = new THREE.MeshStandardMaterial({ color: "#030712", metalness: 0.9 });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.y = 0.375;
        meshGroup.add(leg);
      } else if (obj.type === "TOUCHSCREEN_KIOSK") {
        const standGeo = new THREE.BoxGeometry(0.5, 1.3, 0.4);
        const standMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.2 });
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.y = 0.65;
        stand.castShadow = true;
        meshGroup.add(stand);

        const displayGeo = new THREE.PlaneGeometry(0.42, 0.7);
        const displayMat = new THREE.MeshBasicMaterial({ color: "#38bdf8" });
        const display = new THREE.Mesh(displayGeo, displayMat);
        display.position.set(0, 0.8, 0.21);
        meshGroup.add(display);
      } else {
        // Generic Podium / Plinth
        const podiumGeo = new THREE.BoxGeometry(0.7, 0.9, 0.7);
        const podiumMat = new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.3 });
        const podium = new THREE.Mesh(podiumGeo, podiumMat);
        podium.position.y = 0.45;
        podium.castShadow = true;
        meshGroup.add(podium);
      }

      meshGroup.position.set(...obj.position);
      meshGroup.rotation.set(...obj.rotation);
      meshGroup.scale.set(...obj.scale);
      scene.add(meshGroup);

      interactiveMeshesRef.current.set(obj.id, meshGroup);
    });

    // 9. Animation Loop
    let angle = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      angle += 0.01;

      // Subtle pulse on lights
      blueSpot.intensity = 2.2 + Math.sin(angle) * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    // 10. Mouse Drag Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraRotation.current.theta -= deltaX * 0.007;
      cameraRotation.current.phi = Math.max(0.08, Math.min(Math.PI / 2.05, cameraRotation.current.phi - deltaY * 0.007));

      updateCameraPosition();
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRotation.current.radius = Math.max(3, Math.min(25, cameraRotation.current.radius + e.deltaY * 0.015));
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [config]);

  const handleZoom = (delta: number) => {
    cameraRotation.current.radius = Math.max(3, Math.min(25, cameraRotation.current.radius + delta));
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
      
      {/* Top Floating Viewport Control Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {/* Camera Angles Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-lg">
          <button
            onClick={() => setPresetView("corner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraView === "corner" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Corner 45°
          </button>
          <button
            onClick={() => setPresetView("front")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraView === "front" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Front Elevation
          </button>
          <button
            onClick={() => setPresetView("top")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraView === "top" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Top Floor Plan
          </button>
          <button
            onClick={() => setPresetView("interior")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraView === "interior" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            VIP Walk-In
          </button>
        </div>

        {/* Live Spatial Metric Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-cyan-300 font-bold shadow-lg">
            {config.stallWidth}×{config.stallDepth}m (H: {config.stallHeight}m)
          </div>
        </div>
      </div>

      {/* Center Three.js Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Floating Spatial Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 pointer-events-auto text-xs text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Click & Drag to Rotate 360° • Scroll to Zoom</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 pointer-events-auto">
          <button
            onClick={() => handleZoom(-2)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(2)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPresetView("corner")}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            title="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
