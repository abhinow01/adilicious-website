'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function PlateModel() {
  const { scene } = useGLTF('/models/plate.glb');

  return (
    <primitive
      object={scene}
      scale={42}
      position={[0, -2, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
}

export default function Plate3D() {
  return (
    <div className="relative h-full w-full overflow-visible">
      <Canvas
        style={{
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        camera={{
          position: [0, 0, 8],
          fov: 35,
        }}
      >
        <ambientLight intensity={3} />
        <directionalLight
          position={[4, 5, 4]}
          intensity={2}
        />

        <Suspense fallback={null}>
          <PlateModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/plate.glb');