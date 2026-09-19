"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { ThreeStudioCanvas } from "@/components/studio/ThreeStudioCanvas";
import { StudioControls } from "@/components/studio/StudioControls";
import { Scene3DConfig, Scene3DObject, SceneObjectType } from "@/types/studio";
import { Box, Layers, Maximize2, Compass, Sparkles, Check } from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
  const { projects, updateProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const defaultSceneConfig: Scene3DConfig = project?.scene3DConfig || {
    stallWidth: project?.dimensions.width || 6,
    stallDepth: project?.dimensions.depth || 6,
    stallHeight: project?.dimensions.height || 4,
    flooringType: "EPOXY_GLOSS_WHITE",
    flooringColor: "#f8fafc",
    ambientLightIntensity: 0.7,
    spotlightIntensity: 2.2,
    neonEdgeColor: "#0284c7",
    neonEdgeEnabled: true,
    backWallEnabled: true,
    leftWallEnabled: project?.dimensions.openSides === "1_SIDE_INLINE" || project?.dimensions.openSides === "2_SIDES_CORNER",
    rightWallEnabled: project?.dimensions.openSides === "1_SIDE_INLINE",
    meetingRoomDividerEnabled: true,
    hangingBannerEnabled: project?.dimensions.totalAreaSqm >= 36,
    logoBrandingApplied: true,
    objects: [
      {
        id: "obj-1",
        type: "RECEPTION_COUNTER",
        name: "Illuminated Reception Pod",
        position: [0, 0, 1.8],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        id: "obj-2",
        type: "LED_VIDEO_WALL",
        name: "P2.6 Curved Video Wall (3.6x2.4m)",
        position: [0, 0, -2.4],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        id: "obj-3",
        type: "VIP_LOUNGE_SOFA",
        name: "Executive VIP Sofa",
        position: [1.8, 0, -0.5],
        rotation: [0, -Math.PI / 4, 0],
        scale: [1, 1, 1],
      },
      {
        id: "obj-4",
        type: "TOUCHSCREEN_KIOSK",
        name: "Interactive Touch Kiosk",
        position: [-1.8, 0, 1.2],
        rotation: [0, Math.PI / 4, 0],
        scale: [1, 1, 1],
      },
    ],
  };

  const [sceneConfig, setSceneConfig] = useState<Scene3DConfig>(defaultSceneConfig);

  const handleUpdateConfig = (updates: Partial<Scene3DConfig>) => {
    const updated = { ...sceneConfig, ...updates };
    setSceneConfig(updated);
    if (project) {
      updateProject(project.id, {
        scene3DConfig: updated,
        dimensions: {
          ...project.dimensions,
          width: updated.stallWidth,
          depth: updated.stallDepth,
          height: updated.stallHeight,
          totalAreaSqm: Number((updated.stallWidth * updated.stallDepth).toFixed(2)),
          totalAreaSqft: Number((updated.stallWidth * updated.stallDepth * 10.7639).toFixed(2)),
        },
      });
    }
  };

  const handleAddObject = (type: SceneObjectType) => {
    const names: Record<SceneObjectType, string> = {
      RECEPTION_COUNTER: "Reception Desk Pod",
      LED_VIDEO_WALL: "P2.6 LED Video Wall",
      VIP_LOUNGE_SOFA: "VIP Lounge Sofa",
      MEETING_TABLE: "Conference Meeting Table",
      TOUCHSCREEN_KIOSK: "55\" Touch Kiosk",
      DISPLAY_PODIUM: "Product Display Podium",
      WALL_SOLID: "Solid Wall Module",
      WALL_GLASS: "Glass Divider",
      WALL_CURVED: "Curved Feature Wall",
      CHAIR_EXECUTIVE: "Executive Chair",
      BAR_STOOL: "Barstool",
      HANGING_RING_BANNER: "Hanging Ring",
      CEILING_TRUSS: "Ceiling Truss",
      BRANDING_SIGNAGE: "Brand Signage",
    };

    const newObj: Scene3DObject = {
      id: `obj-${Date.now()}`,
      type,
      name: `${names[type]} #${sceneConfig.objects.length + 1}`,
      position: [
        Number((Math.random() * (sceneConfig.stallWidth * 0.6) - sceneConfig.stallWidth * 0.3).toFixed(1)),
        0,
        Number((Math.random() * (sceneConfig.stallDepth * 0.6) - sceneConfig.stallDepth * 0.3).toFixed(1)),
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };

    const updated = {
      ...sceneConfig,
      objects: [...sceneConfig.objects, newObj],
    };
    setSceneConfig(updated);
    if (project) {
      updateProject(project.id, { scene3DConfig: updated });
    }
  };

  const handleRemoveObject = (id: string) => {
    const updated = {
      ...sceneConfig,
      objects: sceneConfig.objects.filter((o) => o.id !== id),
    };
    setSceneConfig(updated);
    if (project) {
      updateProject(project.id, { scene3DConfig: updated });
    }
  };

  const handleUpdatePosition = (id: string, newPos: [number, number, number]) => {
    const updated = {
      ...sceneConfig,
      objects: sceneConfig.objects.map((o) => (o.id === id ? { ...o, position: newPos } : o)),
    };
    setSceneConfig(updated);
    if (project) {
      updateProject(project.id, { scene3DConfig: updated });
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              Interactive 3D Studio & Geometry Editor
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              Three.js WebGL Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify structural dimensions, toggle wall partitions, position 3D furniture, configure LED screens & swap floor materials.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} — {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 3D Studio Layout: 3D Viewport (8 cols) + Control Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Three.js Viewport (8 cols) */}
        <div className="lg:col-span-8">
          <ThreeStudioCanvas
            project={project}
            config={sceneConfig}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onUpdateObjectPosition={handleUpdatePosition}
          />
        </div>

        {/* Right Studio Controls (4 cols) */}
        <div className="lg:col-span-4 min-h-[580px]">
          <StudioControls
            config={sceneConfig}
            onUpdateConfig={handleUpdateConfig}
            onAddObject={handleAddObject}
            onRemoveObject={handleRemoveObject}
            selectedObjectId={selectedObjectId}
          />
        </div>

      </div>

    </div>
  );
}
