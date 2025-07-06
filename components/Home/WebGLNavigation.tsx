'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

// Create responsive navigation items
function createNavigationItems(spacing: number, language: string) {
  return [
    {
      id: 1,
      title: 'Blog',
      href: `/${language}/blog`,
      color: '#d4af37',
      nucleusColor: '#b8860b',
      size: 1.0,
      type: 'diatom',
      position: { x: 0, y: spacing }, // 上
      initialAngle: Math.PI / 2, // 90度
      orbitVariation: { speed: 0.8, amplitude: 0.6, phase: 0 },
    },
    {
      id: 2,
      title: 'Tags',
      href: `/${language}/tags`,
      color: '#cd853f',
      nucleusColor: '#a0522d',
      size: 1.0,
      type: 'dinoflagellate',
      position: { x: spacing, y: 0 }, // 右
      initialAngle: 0, // 0度
      orbitVariation: { speed: 1.2, amplitude: 0.8, phase: Math.PI / 2 },
    },
    {
      id: 3,
      title: 'Projects',
      href: `/${language}/projects`,
      color: '#daa520',
      nucleusColor: '#b8860b',
      size: 1.0,
      type: 'radiolarian',
      position: { x: 0, y: -spacing }, // 下
      initialAngle: (3 * Math.PI) / 2, // 270度
      orbitVariation: { speed: 0.6, amplitude: 0.5, phase: Math.PI },
    },
    {
      id: 4,
      title: 'About',
      href: `/${language}/about`,
      color: '#f4a460',
      nucleusColor: '#cd853f',
      size: 1.0,
      type: 'foraminifera',
      position: { x: -spacing, y: 0 }, // 左
      initialAngle: Math.PI, // 180度
      orbitVariation: { speed: 1.0, amplitude: 0.7, phase: (3 * Math.PI) / 2 },
    },
  ]
}

interface NavigationItem {
  id: number
  title: string
  href: string
  color: string
  nucleusColor: string
  size: number
  type: string
  position: { x: number; y: number }
  initialAngle: number
  orbitVariation: { speed: number; amplitude: number; phase: number }
}

interface ComplexMicroorganismProps {
  item: NavigationItem
  onHover: (id: number | null) => void
  onClick: () => void
  animationDelay: number
}

// Water Dish Component
function WaterDish({
  isVisible,
  animationProgress,
}: {
  isVisible: boolean
  animationProgress: number
}) {
  const dishRef = useRef<THREE.Group>(null)
  const waterDropsRef = useRef<THREE.Group>(null)

  // Generate water drops from dish edge
  const waterDrops = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      return {
        id: i,
        x: Math.cos(angle) * 3.9,
        z: Math.sin(angle) * 3.9,
        delay: Math.random() * 2,
        speed: 0.4 + Math.random() * 0.3,
        size: 0.04 + Math.random() * 0.06,
      }
    })
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (dishRef.current) {
      // Gentle floating motion for the dish
      dishRef.current.position.y = -6 + Math.sin(time * 0.5) * 0.1
    }

    if (waterDropsRef.current && isVisible) {
      waterDropsRef.current.children.forEach((drop, i) => {
        const dropData = waterDrops[i]
        if (drop) {
          // Water drop falling from dish edge
          const fallProgress = ((time * dropData.speed + dropData.delay) % 2) / 2
          drop.position.y = -fallProgress * 6
          drop.position.x = dropData.x
          drop.position.z = dropData.z

          // Fade out as it falls
          const material = (drop as THREE.Mesh).material as THREE.MeshBasicMaterial
          if (material) {
            material.opacity = (1 - fallProgress) * 0.7 * animationProgress
          }
        }
      })
    }
  })

  if (!isVisible) return null

  return (
    <group ref={dishRef} position={[0, -5, 0]}>
      {/* Flat 2D dish/plate - circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial
          color="#e8e8e8"
          transparent
          opacity={0.4 * animationProgress}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dish rim - simple ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4.1, 32]} />
        <meshBasicMaterial
          color="#cccccc"
          transparent
          opacity={0.6 * animationProgress}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water puddle on the dish */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.3 * animationProgress}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water drops falling from dish edge */}
      <group ref={waterDropsRef}>
        {waterDrops.map((drop) => (
          <mesh key={drop.id} position={[drop.x, 0, drop.z]}>
            <sphereGeometry args={[drop.size, 6, 4]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.7 * animationProgress} />
          </mesh>
        ))}
      </group>

      {/* Water streams from edge */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 3.9
        const z = Math.sin(angle) * 3.9
        return (
          <group key={`stream-${i}`} position={[x, 0, z]}>
            {/* Individual water stream */}
            {[...Array(3)].map((_, j) => (
              <mesh key={j} position={[0, -j * 0.3, 0]} scale={[1, 1 - j * 0.2, 1]}>
                <sphereGeometry args={[0.06, 6, 4]} />
                <meshBasicMaterial
                  color="#3b82f6"
                  transparent
                  opacity={(0.6 - j * 0.15) * animationProgress}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

// Jellyfish Navbar Component
function JellyfishNavbar({
  isVisible,
  navigationItems,
  onItemClick,
}: {
  isVisible: boolean
  navigationItems: NavigationItem[]
  onItemClick: (href: string) => void
}) {
  const jellyfishGroupRef = useRef<THREE.Group>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [hoveredTentacle, setHoveredTentacle] = useState<number | null>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (!isVisible) {
      setAnimationProgress(Math.max(0, animationProgress - 0.05))
      return
    }

    if (isVisible && animationProgress < 1) {
      setAnimationProgress(Math.min(1, animationProgress + 0.03))
    }

    if (jellyfishGroupRef.current) {
      // Drop-down animation from above to center-top position
      const targetY = isVisible ? 3 : 8
      const currentY = THREE.MathUtils.lerp(jellyfishGroupRef.current.position.y, targetY, 0.05)
      jellyfishGroupRef.current.position.y = currentY

      // Gentle floating when visible
      if (isVisible && animationProgress > 0.8) {
        jellyfishGroupRef.current.position.y = targetY + Math.sin(time * 0.8) * 0.15
        jellyfishGroupRef.current.rotation.z = Math.sin(time * 0.5) * 0.03
      }

      // Scale animation
      const scale = animationProgress * 0.8 + 0.2
      jellyfishGroupRef.current.scale.setScalar(scale)

      // Umbrella bouncing animation
      jellyfishGroupRef.current.children.forEach((child, i) => {
        if (child.name === 'umbrella-segment') {
          const wave = Math.sin(time * 2 + i * 0.3) * 0.1 * animationProgress
          child.scale.y = 1 + wave
          child.rotation.z = Math.sin(time * 1.5 + i * 0.5) * 0.02 * animationProgress
        }
        if (child.name === 'tentacle') {
          const sway = Math.sin(time * 3 + i * 0.8) * 0.15 * animationProgress
          child.rotation.z = sway
        }
      })
    }
  })

  if (!isVisible && animationProgress <= 0) return null

  return (
    <group ref={jellyfishGroupRef} position={[0, 8, 1]}>
      {/* Main umbrella body - glass-cellular transparency */}
      <mesh name="umbrella">
        <sphereGeometry args={[4, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.12 * animationProgress}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Umbrella segments for bouncy effect */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={`umbrella-segment-${i}`}
            name="umbrella-segment"
            position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, -0.4]}
            rotation={[0, 0, angle]}
          >
            <cylinderGeometry args={[0.4, 0.15, 1.8, 8]} />
            <meshBasicMaterial
              color="#d4af37"
              transparent
              opacity={0.2 * animationProgress}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}

      {/* Navigation items as clickable tentacles with larger interactive areas */}
      {navigationItems.map((item, index) => {
        const angle = (index / navigationItems.length) * Math.PI * 2
        const radius = 3.5
        const isHovered = hoveredTentacle === index

        // Color transitions on hover
        const tentacleColor = isHovered ? '#ff6b35' : item.color
        const textColor = isHovered ? '#ffffff' : '#fb923c'
        const bulbColor = isHovered ? '#ff4500' : item.nucleusColor

        return (
          <group
            key={`nav-tentacle-${index}`}
            name="tentacle"
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, -1.5]}
          >
            {/* Large invisible clickable area */}
            <mesh
              position={[0, -1, 0]}
              onClick={() => onItemClick(item.href)}
              onPointerEnter={() => setHoveredTentacle(index)}
              onPointerLeave={() => setHoveredTentacle(null)}
            >
              <sphereGeometry args={[0.8, 16, 12]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Tentacle body */}
            <mesh rotation={[0, 0, angle + Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.06, 3, 8]} />
              <meshBasicMaterial
                color={tentacleColor}
                transparent
                opacity={(isHovered ? 0.9 : 0.7) * animationProgress}
              />
            </mesh>

            {/* Navigation text - larger and more prominent */}
            <Text
              position={[0, -1.5, 0]}
              fontSize={isHovered ? 0.55 : 0.5}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              fillOpacity={animationProgress}
              font="/fonts/Arian Geralde.otf"
              outlineWidth={isHovered ? 0.03 : 0.02}
              outlineColor={isHovered ? '#ff4500' : '#773C1A'}
              outlineOpacity={animationProgress * (isHovered ? 1.0 : 0.8)}
            >
              {item.title}
            </Text>

            {/* Glowing end bulb - larger and more visible */}
            <mesh position={[0, -2, 0]}>
              <sphereGeometry args={[isHovered ? 0.3 : 0.25, 12, 8]} />
              <meshBasicMaterial
                color={bulbColor}
                transparent
                opacity={(isHovered ? 1.0 : 0.9) * animationProgress}
              />
            </mesh>

            {/* Additional glow effect around text */}
            <mesh position={[0, -1.5, -0.1]}>
              <circleGeometry args={[isHovered ? 1.0 : 0.8, 16]} />
              <meshBasicMaterial
                color={tentacleColor}
                transparent
                opacity={(isHovered ? 0.3 : 0.1) * animationProgress}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )
      })}

      {/* Inner cellular structures - larger for bigger jellyfish */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 1.2 + Math.random() * 1.5
        return (
          <mesh
            key={`cell-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              -0.3 + Math.random() * 0.6,
            ]}
          >
            <sphereGeometry args={[0.15 + Math.random() * 0.15, 8, 6]} />
            <meshBasicMaterial color="#f4a460" transparent opacity={0.3 * animationProgress} />
          </mesh>
        )
      })}
    </group>
  )
}

function ComplexMicroorganism({
  item,
  onHover,
  onClick,
  animationDelay,
}: ComplexMicroorganismProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [localHovered, setLocalHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [rotationStarted, setRotationStarted] = useState(false)
  const rotationStartTimeRef = useRef<number | null>(null)

  // Calculate rotation radius from center
  const baseRotationRadius = Math.sqrt(
    item.position.x * item.position.x + item.position.y * item.position.y
  )

  // Generate unique properties for each internal element
  const internalElements = useRef(
    Array.from({ length: 15 }, () => ({
      size: 0.6 + Math.random() * 0.8,
      breatheSpeed: 0.8 + Math.random() * 1.4,
      breathePhase: Math.random() * Math.PI * 2,
      breatheAmplitude: 0.1 + Math.random() * 0.3,
    }))
  ).current

  // Start animation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])

  // Start rotation directly after expansion completes - no loading phase
  useEffect(() => {
    if (animationProgress >= 1 && !rotationStarted) {
      // Skip loading phase to prevent white flash
      setRotationStarted(true)
    }
  }, [animationProgress, rotationStarted])
  // Note: isLoading and rotationStarted are intentionally omitted to prevent infinite loops

  // Ultra-fast easing functions for immediate appearance
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 2.5) // Further optimized for faster ease-out
  }

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 1.8) // Even faster for immediate response
  }

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    // Even faster animation progress for immediate navunit appearance
    if (hasStarted && animationProgress < 1) {
      setAnimationProgress(Math.min(animationProgress + 0.04, 1)) // Increased from 0.025 to 0.04
    }

    // Enhanced hover effects for internal structures only
    const hoverScale = localHovered ? 1.8 : 1
    const hoverPulse = localHovered ? Math.sin(time * 6) * 0.2 : 0

    let targetX: number, targetY: number, targetZ: number

    if (animationProgress < 1) {
      // During expansion animation - move from center to diamond position
      const easedProgress = easeOutCubic(animationProgress)
      targetX = item.position.x * easedProgress
      targetY = item.position.y * easedProgress
      targetZ = 0
    } else {
      // Default position after expansion - stay at diamond position
      targetX = item.position.x
      targetY = item.position.y
      targetZ = 0
    }

    if (rotationStarted) {
      // 回転開始時間を記録
      if (rotationStartTimeRef.current === null) {
        rotationStartTimeRef.current = time
      }

      // 回転開始からの経過時間
      const rotationElapsedTime = time - rotationStartTimeRef.current
      const rotationSpeed = 0.08 // Reduced back to more subtle movement

      // 初期位置から継続的に回転
      const currentAngle = item.initialAngle + rotationElapsedTime * rotationSpeed

      // 現在の半径を維持
      const currentRadius = baseRotationRadius
      const radiusVariation =
        Math.sin(time * 0.8 + item.orbitVariation.phase) * item.orbitVariation.amplitude * 0.15 // Reduced radius variation

      const dynamicRadius = currentRadius + radiusVariation

      // Override target position with rotation values
      targetX = Math.cos(currentAngle) * dynamicRadius
      targetY = Math.sin(currentAngle) * dynamicRadius
      targetZ = Math.sin(time * 0.4 + item.orbitVariation.phase) * 0.08 // Reduced Z-axis movement
    }

    // Smooth position transitions
    const lerpFactor = rotationStarted ? 0.05 : 0.1
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      lerpFactor
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      lerpFactor
    )
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      lerpFactor
    )

    // Scale animation and effects
    const scaleProgress = easeOutQuart(animationProgress)
    const breathe = 1 + Math.sin(time * 1.2 + item.id) * 0.04 // Reduced breathing frequency and amplitude

    const finalScale = (breathe + hoverPulse) * hoverScale * scaleProgress
    meshRef.current.scale.setScalar(finalScale)

    // Enhanced internal structure animation when hovered
    const rotationSpeed = localHovered ? 0.4 : 0.05 // Reduced internal rotation speeds
    const structures = meshRef.current.children.slice(1)
    structures.forEach((structure, i) => {
      if (structure) {
        structure.rotation.z = time * rotationSpeed * (i % 2 === 0 ? 1 : -1) + item.id

        // Individual breathing for each internal element
        if (i < internalElements.length) {
          const element = internalElements[i]
          const individualBreathe =
            1 +
            Math.sin(time * element.breatheSpeed + element.breathePhase) * element.breatheAmplitude
          const hoverEffect = localHovered ? 1 + Math.sin(time * 4 + i) * 0.3 : 1
          structure.scale.setScalar(individualBreathe * hoverEffect)
        }
      }
    })
  })

  return (
    <group>
      <group
        ref={meshRef}
        onPointerEnter={() => {
          setLocalHovered(true)
          requestAnimationFrame(() => onHover(item.id))
        }}
        onPointerLeave={() => {
          setLocalHovered(false)
          requestAnimationFrame(() => onHover(null))
        }}
        onPointerDown={() => {
          // スマートフォン対応: タッチ時にもホバー状態を設定
          setLocalHovered(true)
          requestAnimationFrame(() => onHover(item.id))
        }}
        onClick={onClick}
      >
        {/* Complex shapes based on type */}
        {item.type === 'diatom' && (
          // Elongated diatom with varied internal ribs
          <>
            <mesh scale={[1, 2.2, 1]}>
              <circleGeometry args={[item.size, 16]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Internal ribbed structure - each with different size and breathing */}
            {[...Array(9)].map((_, i) => {
              const element = internalElements[i] || internalElements[0]
              return (
                <mesh
                  key={`rib-${i}`}
                  position={[0, (i - 4) * item.size * 0.35, 0.001]}
                  scale={[0.4 + element.size * 0.2, 0.04 + element.size * 0.04, 1]}
                >
                  <circleGeometry args={[item.size * (0.3 + element.size * 0.15), 16]} />
                  <meshBasicMaterial
                    color={item.nucleusColor}
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )
            })}
            {/* End caps with different sizes */}
            {[-1, 1].map((dir, i) => {
              const element = internalElements[7 + i] || internalElements[0]
              return (
                <mesh
                  key={`cap-${i}`}
                  position={[0, dir * item.size * 1.1, 0.002]}
                  scale={[0.25 + element.size * 0.2, 0.1 + element.size * 0.1, 1]}
                >
                  <circleGeometry args={[item.size * (0.4 + element.size * 0.15), 12]} />
                  <meshBasicMaterial
                    color={item.nucleusColor}
                    transparent
                    opacity={0.85}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )
            })}
            {/* Additional varied internal dots */}
            {[...Array(6)].map((_, i) => {
              const element = internalElements[9 + i] || internalElements[0]
              const angle = (i / 6) * Math.PI * 2
              // Add random horizontal offset for more organic placement
              const xOffset = (Math.random() - 0.5) * item.size * 0.6
              return (
                <mesh
                  key={`dot-${i}`}
                  position={[
                    Math.cos(angle) * item.size * 0.4 + xOffset,
                    Math.sin(angle) * item.size * 0.3,
                    0.003,
                  ]}
                >
                  <circleGeometry args={[item.size * (0.01 + element.size * 0.015), 8]} />
                  <meshBasicMaterial
                    color={item.nucleusColor}
                    transparent
                    opacity={0.75}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )
            })}
          </>
        )}

        {item.type === 'dinoflagellate' && (
          // Triangular armored form
          <>
            <mesh>
              <circleGeometry args={[item.size, 3]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Armor plates - rotating when hovered */}
            {[...Array(6)].map((_, i) => (
              <mesh key={`armor-${i}`} rotation={[0, 0, (i * Math.PI) / 3]}>
                <ringGeometry args={[item.size * 0.3, item.size * 0.85, 3]} />
                <meshBasicMaterial
                  color={item.nucleusColor}
                  transparent
                  opacity={0.65}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            {/* Flagella - waving when hovered */}
            <mesh
              position={[item.size * 1.3, 0, 0.01]}
              rotation={[0, 0, Math.PI / 6]}
              scale={[0.08, 2.5, 1]}
            >
              <circleGeometry args={[item.size * 0.4, 8]} />
              <meshBasicMaterial
                color={item.nucleusColor}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh
              position={[-item.size * 0.8, item.size * 0.8, 0.01]}
              rotation={[0, 0, -Math.PI / 3]}
              scale={[0.06, 1.8, 1]}
            >
              <circleGeometry args={[item.size * 0.3, 8]} />
              <meshBasicMaterial
                color={item.nucleusColor}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}

        {item.type === 'radiolarian' && (
          // Star-shaped with complex spikes
          <>
            <mesh>
              <circleGeometry args={[item.size, 8]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Spikes - extending when hovered */}
            {[...Array(8)].map((_, i) => (
              <mesh
                key={`spike-${i}`}
                position={[
                  Math.cos((i * Math.PI * 2) / 8) * item.size * 1.6,
                  Math.sin((i * Math.PI * 2) / 8) * item.size * 1.6,
                  0.01,
                ]}
                rotation={[0, 0, (i * Math.PI * 2) / 8]}
                scale={[0.12, 1.8, 1]}
              >
                <circleGeometry args={[item.size * 0.25, 6]} />
                <meshBasicMaterial
                  color={item.nucleusColor}
                  transparent
                  opacity={0.75}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            {/* Inner geometric pattern - pulsing when hovered */}
            {[...Array(3)].map((_, i) => (
              <mesh key={`inner-${i}`}>
                <ringGeometry
                  args={[item.size * (0.2 + i * 0.2), item.size * (0.25 + i * 0.2), 8]}
                />
                <meshBasicMaterial
                  color={item.nucleusColor}
                  transparent
                  opacity={0.55}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
          </>
        )}

        {item.type === 'foraminifera' && (
          // Spiral chambered form
          <>
            <mesh scale={[1.4, 1, 1]}>
              <circleGeometry args={[item.size, 12]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Spiral chambers - individual pulsing when hovered */}
            {[...Array(15)].map((_, i) => {
              const angle = (i / 15) * Math.PI * 5
              const radius = item.size * (0.1 + (i / 15) * 0.7)
              return (
                <mesh
                  key={`chamber-${i}`}
                  position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0.01]}
                >
                  <circleGeometry args={[item.size * (0.06 + i * 0.01), 8]} />
                  <meshBasicMaterial
                    color={item.nucleusColor}
                    transparent
                    opacity={0.75}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )
            })}
          </>
        )}
      </group>
    </group>
  )
}

// Hook for responsive scaling
function useResponsiveScale() {
  const { viewport, size } = useThree()
  const [scale, setScale] = useState(1)
  const [spacing, setSpacing] = useState(6)

  useEffect(() => {
    // Use viewport dimensions for proper WebGL scaling
    const viewportWidth = viewport.width
    const viewportHeight = viewport.height

    // Base design assumes viewport width of ~20 units and height of ~15 units
    const baseViewportWidth = 20
    const baseViewportHeight = 15

    // Calculate scale factors
    const scaleX = viewportWidth / baseViewportWidth
    const scaleY = viewportHeight / baseViewportHeight

    // Use the smaller scale to ensure everything fits
    const responsiveScale = Math.min(scaleX, scaleY)

    // Apply more conservative scale constraints
    const finalScale = Math.max(0.6, Math.min(1.0, responsiveScale))
    setScale(finalScale)

    // Adjust spacing based on viewport size rather than pixel size
    let baseSpacing = 6
    if (viewportWidth < 12) {
      baseSpacing = 3.5 // Small viewport
    } else if (viewportWidth < 16) {
      baseSpacing = 4.5 // Medium viewport
    }

    setSpacing(baseSpacing)
  }, [viewport.width, viewport.height])

  return { scale, spacing }
}

interface WebGLNavigationProps {
  showJellyfish: boolean
  setShowJellyfish: (show: boolean) => void
}

export default function WebGLNavigation({ showJellyfish, setShowJellyfish }: WebGLNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const centralGroupRef = useRef<THREE.Group>(null)
  const jellyfishRef = useRef<THREE.Group>(null)
  const { scale, spacing } = useResponsiveScale()

  // タッチデバイス検出
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Create responsive navigation items
  const navigationItems = createNavigationItems(spacing, language)

  // React DevToolsで直接編集可能な色設定
  const [colorConfig] = useState({
    // テキスト関連
    textColor: '#fb923c',
    textOpacity: 0.9,
    textSize: 0.8, // Keep text size consistent

    // テキストアウトライン関連
    outlineWidth: 0.1,
    outlineColor: '#773C1A',
    outlineOpacity: 0.8,
    useOutline: true,

    // 背景関連
    bgColor: '#b8860b',
    bgOpacity: 0.9,
    centralBg: '#d4af37',
    centralOpacity: 0.7,

    // リング関連
    ringOpacity: 0.6,
    radialsOpacity: 0.8,

    // 表示設定
    showTitle: true,
    useCustomFont: true,
  })

  // ホバーされたアイテムの詳細を取得
  const hoveredItemData = hoveredItem
    ? navigationItems.find((item) => item.id === hoveredItem)
    : null

  const handleClick = (href: string) => {
    router.push(href)
  }

  // Handle central hexagon click to show jellyfish navbar
  const handleCentralClick = () => {
    setShowJellyfish(!showJellyfish)
  }

  // 背景タップでホバー状態をクリア（タッチデバイス用）
  const handleBackgroundTouch = () => {
    if (isTouchDevice && hoveredItem !== null) {
      setHoveredItem(null)
    }
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (centralGroupRef.current) {
      // 六角形のリングを六角形に沿ってゆっくり回転 - more subtle movement
      centralGroupRef.current.rotation.z = time * 0.08
    }
  })

  return (
    <>
      {/* 背景タップ領域（タッチデバイス用） */}
      {isTouchDevice && (
        <mesh position={[0, 0, -1]} onPointerDown={handleBackgroundTouch}>
          <planeGeometry args={[30, 20]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      <group scale={[scale, scale, scale]}>
        {/* Hide microorganisms when jellyfish is visible */}
        {!showJellyfish &&
          navigationItems.map((item, index) => (
            <ComplexMicroorganism
              key={index}
              item={item}
              onHover={setHoveredItem}
              onClick={() => handleClick(item.href)}
              animationDelay={50} // Ultra-short delay for immediate appearance
            />
          ))}

        {/* Central gravitational mass */}
        <group position={[0, 0, 0]}>
          {/* Main hexagonal body - 固定 with click handler for jellyfish */}
          <mesh onClick={handleCentralClick} onPointerEnter={() => {}} onPointerLeave={() => {}}>
            <circleGeometry args={[2, 6]} />
            <meshBasicMaterial
              color={colorConfig.centralBg}
              transparent
              opacity={colorConfig.centralOpacity}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Central nucleus - 固定 */}
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.4, 12]} />
            <meshBasicMaterial
              color={colorConfig.bgColor}
              transparent
              opacity={colorConfig.bgOpacity}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 回転する要素グループ - Hide when jellyfish is visible */}
          <group ref={centralGroupRef}>
            {/* Enhanced radial pattern */}
            {!showJellyfish &&
              [...Array(24)].map((_, i) => {
                const length = i % 4 === 0 ? 2 : i % 2 === 0 ? 1.5 : 1
                return (
                  <mesh
                    key={`central-spike-${i}`}
                    position={[
                      Math.cos((i * Math.PI * 2) / 24) * (2.2 + length * 0.4),
                      Math.sin((i * Math.PI * 2) / 24) * (2.2 + length * 0.4),
                      0.01,
                    ]}
                    rotation={[0, 0, (i * Math.PI * 2) / 24]}
                    scale={[0.1, length, 1]}
                  >
                    <circleGeometry args={[0.5, 6]} />
                    <meshBasicMaterial
                      color={colorConfig.bgColor}
                      transparent
                      opacity={colorConfig.radialsOpacity}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}

            {/* Enhanced hexagonal chambers */}
            {!showJellyfish &&
              [...Array(4)].map((_, i) => (
                <mesh key={`central-hex-${i}`}>
                  <ringGeometry args={[0.3 + i * 0.3, 0.4 + i * 0.3, 6]} />
                  <meshBasicMaterial
                    color={colorConfig.bgColor}
                    transparent
                    opacity={colorConfig.ringOpacity}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            {/* ホバー時の中央表示 - Hide when jellyfish is visible */}
            {!showJellyfish && colorConfig.showTitle && (
              <Text
                position={[0, 0, 0.03]}
                fontSize={colorConfig.textSize}
                color={colorConfig.textColor}
                anchorX="center"
                anchorY="middle"
                fillOpacity={hoveredItemData ? colorConfig.textOpacity : 0}
                font={colorConfig.useCustomFont ? '/fonts/Arian Geralde.otf' : undefined}
                outlineWidth={colorConfig.useOutline ? colorConfig.outlineWidth : 0}
                outlineColor={colorConfig.outlineColor}
                outlineOpacity={hoveredItemData ? colorConfig.outlineOpacity : 0}
              >
                {hoveredItemData?.title || ''}
              </Text>
            )}
          </group>
        </group>

        {/* Jellyfish Navbar - drops from above when hexagon is clicked */}
        <JellyfishNavbar
          isVisible={showJellyfish}
          navigationItems={navigationItems}
          onItemClick={handleClick}
        />

        {/* Water Dish - appears at bottom when jellyfish is visible */}
        <WaterDish isVisible={showJellyfish} animationProgress={showJellyfish ? 1 : 0} />
      </group>
    </>
  )
}
