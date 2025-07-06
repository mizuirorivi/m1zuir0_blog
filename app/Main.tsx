'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import MicroorganismScene from '@/components/Home/MicroorganismScene'
import WebGLNavigation from '@/components/Home/WebGLNavigation'

export default function WebGL2DMicroorganismBlog() {
  const [showJellyfish, setShowJellyfish] = useState(false)

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* LCP target - transparent SVG for optimal performance */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '30vh',
          opacity: 0.001,
          pointerEvents: 'none',
        }}
      >
        <rect width="100%" height="100%" fill="transparent" />
      </svg>
      {/* WebGL Canvas - 2D view */}
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        orthographic={false}
      >
        <Suspense fallback={null}>
          {/* Scientific lighting */}
          <ambientLight intensity={0.7} color="#fef3c7" />
          <directionalLight position={[0, 0, 5]} intensity={0.6} color="#d4af37" />
          <pointLight position={[5, 5, 3]} intensity={0.3} color="#cd853f" />
          <pointLight position={[-5, -5, 3]} intensity={0.2} color="#daa520" />

          {/* Main 2D Scene - Hide when jellyfish is visible */}
          {!showJellyfish && <MicroorganismScene />}

          {/* 2D Navigation */}
          <WebGLNavigation showJellyfish={showJellyfish} setShowJellyfish={setShowJellyfish} />
        </Suspense>
      </Canvas>

      {/* Scientific grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="h-full w-full opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d4af37" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  )
}
