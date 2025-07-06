'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrganismMeshProps {
  organism: string
  color: string
  secondaryColor?: string
  scale?: number
  divine?: boolean
  is2D?: boolean
}

export default function OrganismMesh({
  organism,
  color,
  secondaryColor = color,
  scale = 1,
  divine = false,
  is2D = false,
}: OrganismMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const flagellaRef = useRef<THREE.Group>(null)

  // Sacred transparent material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        secondaryColor: { value: new THREE.Color(secondaryColor) },
        divine: { value: divine ? 1.0 : 0.0 },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          vec3 pos = position;
          
          // Gentle breathing
          float breathe = sin(time * 2.0) * 0.1;
          pos *= (1.0 + breathe);
          
          // Soft ripples
          float ripple = sin(pos.x * 5.0 + time * 3.0) * 0.05;
          pos.y += ripple;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 secondaryColor;
        uniform float divine;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vec3 normal = normalize(vNormal);
          
          // Gentle fresnel
          float fresnel = pow(1.0 - abs(normal.z), 2.0);
          
          // Soft pulsing
          float pulse = sin(time * 1.5) * 0.3 + 0.7;
          
          // Color mixing
          vec3 baseColor = mix(color, secondaryColor, 
            sin(time * 2.0 + vPosition.x * 2.0) * 0.5 + 0.5);
          
          baseColor *= pulse;
          
          // Sacred orange divine enhancement
          float divineGlow = divine * (sin(time * 1.0) * 0.3 + 0.7);
          baseColor += divineGlow * vec3(1.0, 0.6, 0.3) * 0.4; // Warm amber glow
          
          // Transparent membrane effect
          vec3 finalColor = baseColor + fresnel * secondaryColor * 0.5;
          
          gl_FragColor = vec4(finalColor, 0.7 + fresnel * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
  }, [color, secondaryColor, divine])

  // Generate microbial appendages (flagella, cilia, pseudopodia)
  const flagella = useMemo(() => {
    const count =
      organism === 'euglena'
        ? 2 // Single or double flagella
        : organism === 'paramecium'
          ? 20 // Many short cilia
          : organism === 'bacteria'
            ? 4 // Peritrichous flagella
            : organism === 'spirillum'
              ? 1 // Single polar flagellum
              : organism === 'amoeba'
                ? 0 // No flagella (pseudopodia instead)
                : Math.floor(Math.random() * 8) + 2 // Variable for others
    const flagellaGeometry: Array<{ geometry: THREE.TubeGeometry; angle: number }> = []

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const length = 1.5 + Math.random() * 0.5

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0),
        new THREE.Vector3(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 0),
        new THREE.Vector3(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0),
        new THREE.Vector3(Math.cos(angle) * length, Math.sin(angle) * length, 0),
      ])

      const geometry = new THREE.TubeGeometry(curve, 20, 0.02, 6, false)
      flagellaGeometry.push({ geometry, angle })
    }

    return flagellaGeometry
  }, [organism])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (meshRef.current) {
      material.uniforms.time.value = time

      // Simple gentle breathing
      const breathe = 1 + Math.sin(time * 2) * 0.1
      meshRef.current.scale.setScalar(breathe)

      // Gentle rotation
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05
      meshRef.current.rotation.y = Math.cos(time * 0.4) * 0.05
    }

    // Animate graceful flagella
    if (flagellaRef.current) {
      flagellaRef.current.children.forEach((child, i) => {
        const wave = Math.sin(time * 3 + i * 0.5) * 0.3
        child.rotation.z = wave

        const breathe = 1 + Math.sin(time * 2 + i) * 0.1
        child.scale.setScalar(breathe)
      })
    }
  })

  const getGeometry = () => {
    switch (organism) {
      case 'euglena':
        return <capsuleGeometry args={[0.2, 0.8, 6, 12]} /> // Elongated spindle shape
      case 'paramecium':
        return <capsuleGeometry args={[0.3, 0.7, 8, 16]} /> // Slipper-like shape
      case 'volvox':
        return <sphereGeometry args={[0.5, 16, 12]} /> // Spherical colony
      case 'amoeba':
        return <octahedronGeometry args={[0.4, 2]} /> // Irregular blob-like shape
      case 'bacteria':
        return <capsuleGeometry args={[0.15, 0.4, 4, 8]} /> // Small rod-shaped
      case 'diatom':
        return <cylinderGeometry args={[0.3, 0.25, 0.1, 12]} /> // Disc-like shell
      case 'spirillum':
        return <torusGeometry args={[0.3, 0.08, 6, 16]} /> // Spiral bacteria
      default:
        return <sphereGeometry args={[0.3, 12, 8]} /> // Basic microbial sphere
    }
  }

  return (
    <group scale={scale}>
      {/* Main organism body */}
      <mesh ref={meshRef} material={material}>
        {getGeometry()}
      </mesh>

      {/* Graceful flagella */}
      <group ref={flagellaRef}>
        {flagella.map((flagellum, i) => (
          <mesh key={i} geometry={flagellum.geometry}>
            <meshBasicMaterial
              color={i % 2 === 0 ? secondaryColor : color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Sacred nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Divine aura */}
      {divine && (
        <>
          <mesh>
            <circleGeometry args={[2, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.05}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Sacred geometry */}
          {[...Array(3)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <ringGeometry args={[1 + i * 0.5, 1.1 + i * 0.5, 6]} />
              <meshBasicMaterial
                color={`hsl(${i * 60 + 45}, 50%, 70%)`}
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}
