'use client'

import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function MicroorganismScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { size, camera, mouse } = useThree()

  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Interactive states for deep engagement (simplified on mobile)
  const [hoveredOrganism, setHoveredOrganism] = useState<number | null>(null)
  const [clickedOrganism, setClickedOrganism] = useState<number | null>(null)
  const [mouseProximity, setMouseProximity] = useState<{ x: number; y: number; intensity: number }>(
    { x: 0, y: 0, intensity: 0 }
  )
  const [globalExcitement, setGlobalExcitement] = useState(0)
  const [lastInteractionTime, setLastInteractionTime] = useState(0)

  // Calculate responsive scale for background elements
  const backgroundScale = useMemo(() => {
    // Use viewport width instead of pixel size for better WebGL scaling
    const viewportWidth = (size.width / size.height) * 10 // Approximate viewport width
    const baseViewportWidth = 16
    const scale = viewportWidth / baseViewportWidth
    return Math.max(0.7, Math.min(1.2, scale))
  }, [size.width, size.height])

  // Generate complex scientific microorganism shapes with orbital data
  const microorganisms = useMemo(() => {
    const organisms: Array<{
      orbitRadius: number
      orbitSpeed: number
      orbitAngle: number
      eccentricity: number
      inclination: number
      size: number
      color: string
      opacity: number
      phase: number
      type: number
      complexity: number
      // Interactive enhancement properties
      baseSize: number
      excitability: number
      socialRadius: number
      curiosity: number
      fearLevel: number
      birthTime: number
      elasticity: number
      viscosity: number
    }> = []

    const organismCount = isMobile ? 34 : 89 // Reduce count for mobile (34 is Fibonacci)
    for (let i = 0; i < organismCount; i++) {
      // Fibonacci spiral positioning - nature's perfect arrangement
      const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio φ ≈ 1.618
      const phiInverse = 1 / phi // φ⁻¹ ≈ 0.618

      // Multi-scale fractal organization
      const primaryIndex = Math.floor(i / 13) // 13 = Fibonacci number
      const secondaryIndex = Math.floor((i % 13) / 5) // 5 = Fibonacci number
      const tertiaryIndex = i % 5 // Smallest Fibonacci subdivision

      // Fibonacci spiral radius - logarithmic growth
      const fibTurn = i * 2 * Math.PI * phiInverse // Golden angle ≈ 137.5°
      const spiralRadius = 1.5 + Math.sqrt(i) * 0.8 // √ growth for natural density
      const fractalOffset = Math.sin(fibTurn * phi) * 0.3 // Fractal perturbation
      const orbitRadius = spiralRadius + fractalOffset

      // Golden ratio speed harmonics - Kepler's celestial music (reduced for subtlety)
      const baseFreq = 0.012 // Reduced from 0.018
      const fibonacciSpeed = baseFreq / Math.pow(phi, primaryIndex / 3)
      const fractalModulation = Math.sin(secondaryIndex * phi) * 0.002 // Reduced from 0.003
      const goldenPhase = (tertiaryIndex * 2 * Math.PI) / 5 // Pentagon symmetry
      const orbitSpeed = fibonacciSpeed + fractalModulation + Math.cos(goldenPhase) * 0.001 // Reduced from 0.002

      // Sacred spiral angle - Fibonacci phyllotaxis
      const fibonacciAngle = i * 2 * Math.PI * phiInverse // 137.5° divergence angle
      const fractalRotation = (Math.sin(primaryIndex * phi) * Math.PI) / 8
      const pentagonalShift = (secondaryIndex * 2 * Math.PI) / 5
      const orbitAngle = fibonacciAngle + fractalRotation + pentagonalShift

      // Fractal membrane dynamics - self-similar elasticity (reduced for subtlety)
      const fractalLevel = Math.floor(Math.log(i + 1) / Math.log(phi)) // Fractal depth
      const membraneBase = 0.15 + Math.cos(primaryIndex * phi) * 0.1 // Reduced from 0.25 and 0.2
      const fractalVariation = Math.sin(fibTurn + fractalLevel * phi) * 0.08 // Reduced from 0.15
      const eccentricity = membraneBase + fractalVariation

      // Golden ratio 3D inclination - Platonic solid orientation (reduced movement)
      const goldenInclination = Math.sin(fibonacciAngle / phi) * 0.4 // Reduced from 0.7
      const fractalTilt = Math.cos(fractalLevel * phi + secondaryIndex) * 0.2 // Reduced from 0.4
      const pentagonalLift = Math.sin((tertiaryIndex * 2 * Math.PI) / 5) * 0.15 // Reduced from 0.3
      const inclination = goldenInclination + fractalTilt + pentagonalLift

      // Fractal size scaling - nano-microscopic proportions
      const fibonacciSize = 0.02 + Math.pow(phi, fractalLevel) / 80 // Nano-scale exponential φ growth
      const fractalScale = 1 + Math.sin(fibTurn * phi) * 0.04 // Tiny self-similar variation
      const goldenProportion = 1 + Math.cos(primaryIndex * phi) * 0.03 // Micro golden modulation
      const size = fibonacciSize * fractalScale * goldenProportion

      // Sacred orange microbial chromatics with rare exotic variants
      const isRareVariant = i % 21 === 0 // Fibonacci 21 - rare bioluminescent variants
      const isMutant = i % 34 === 0 // Fibonacci 34 - ultra-rare mutants

      let baseHue
      if (isMutant) {
        baseHue = 160 + Math.sin(fractalLevel * phi) * 20 // Rare cyan-green mutants
      } else if (isRareVariant) {
        baseHue = 120 + Math.cos(fibTurn) * 15 // Exotic green bioluminescence
      } else {
        baseHue = 25 + Math.sin(fractalLevel * phi) * 8 // Classic deep orange
      }

      const mysticalShift = Math.cos(fibTurn + i * phiInverse) * 12 // Mysterious color drift
      const cuteVariation = Math.sin((tertiaryIndex * Math.PI) / 2) * 6 // Gentle cute shifts
      const eerieUndertone = Math.cos(primaryIndex * phi) * 4 // Subtle eerie quality
      const hueTotal = baseHue + mysticalShift + cuteVariation + eerieUndertone

      // Microbial saturation - organic intensity with exotic variants
      const baseSaturation = isRareVariant || isMutant ? 70 : 45 // High saturation for exotic variants
      const organicSaturation = baseSaturation + fractalLevel * 6 // Gentle organic base
      const sacredCalm = Math.sin(fibTurn * phi) * 10 // Sacred tranquility
      const cuteVibrancy = Math.cos((tertiaryIndex * 2 * Math.PI) / 5) * 8 // Adorable energy
      const eerieDepth = Math.sin(primaryIndex / phi + fractalLevel) * 6 // Mysterious depth
      const exoticBoost = isRareVariant || isMutant ? 15 : 0 // Extra vibrancy for rare variants
      const saturation = Math.max(
        30,
        Math.min(85, organicSaturation + sacredCalm + cuteVibrancy + eerieDepth + exoticBoost)
      )

      // Bioluminescent glow - sacred microbial light with exotic brilliance
      const baseGlow = isRareVariant || isMutant ? 65 : 55 // Brighter exotic variants
      const sacredGlow = baseGlow + Math.sqrt(i) * 2 // Gentle sacred luminosity
      const cuteWarmth = Math.cos(fibTurn / phi) * 8 // Warm adorable light
      const mysticalDimness = Math.sin(fractalLevel * phi) * 6 // Mysterious shadow play
      const eerieFlicker = Math.cos(i * phiInverse * 3 * Math.PI) * 4 // Subtle eerie pulse
      const organicRadiance = Math.sin((tertiaryIndex * 2 * Math.PI) / 5) * 5 // Natural bio-light
      const exoticBrilliance = isMutant ? 12 : isRareVariant ? 8 : 0 // Special exotic glow
      const lightness =
        sacredGlow +
        cuteWarmth +
        mysticalDimness +
        eerieFlicker +
        organicRadiance +
        exoticBrilliance

      // Microbial membrane transparency - sacred life essence with dual nature
      const sacredBase = 0.25 + fractalLevel * 0.06 // Sacred translucent foundation
      const cuteShimmer = Math.sin(fibTurn + i * phiInverse) * 0.1 // Adorable shimmer
      const mysticalVeil = Math.cos((primaryIndex * phi) / 2) * 0.08 // Mysterious veil effect
      const eeriePhase = Math.sin(fibTurn * phi + fractalLevel) * 0.06 // Eerie phase shift
      const organicPulse = Math.cos((tertiaryIndex * 2 * Math.PI) / 5) * 0.05 // Gentle organic pulse
      const opacity = sacredBase + cuteShimmer + mysticalVeil + eeriePhase + organicPulse

      // Gentle interactive personality traits - more subtle responses
      const excitability =
        0.1 + Math.sin(fibTurn * phi) * 0.15 + (isRareVariant ? 0.1 : 0) + (isMutant ? 0.2 : 0)
      const socialRadius = 2.5 + Math.cos(fractalLevel * phi) * 1.2 // Larger, gentler interaction zones
      const curiosity = 0.05 + Math.sin(i * phiInverse) * 0.2 + fractalLevel * 0.03
      const fearLevel = 0.02 + Math.cos(primaryIndex * phi) * 0.08 + (isRareVariant ? -0.02 : 0.03)
      const birthTime = i * 100 // Staggered birth for emergence animation

      // Cellular elasticity properties for bouncy interactions
      const elasticity = 0.8 + Math.sin(fibTurn) * 0.15 // Bounce factor
      const viscosity = 0.3 + Math.cos(fractalLevel * phi) * 0.2 // Fluid resistance

      organisms.push({
        orbitRadius,
        orbitSpeed,
        orbitAngle,
        eccentricity,
        inclination,
        size,
        color: `hsl(${Math.abs(hueTotal) % 360}, ${saturation}%, ${Math.max(30, Math.min(85, lightness))}%)`,
        opacity: Math.max(0.15, Math.min(0.75, opacity)),
        phase: fibonacciAngle, // Fibonacci spiral phase alignment
        type: (fractalLevel * 5 + primaryIndex * 3 + secondaryIndex * 2 + tertiaryIndex) % 8, // Fractal type matrix
        complexity: 0.3 + fractalLevel * 0.15 + Math.sin(fibTurn) * 0.2 + i * phiInverse * 0.1, // Golden complexity
        // Interactive properties
        baseSize: size,
        excitability,
        socialRadius,
        curiosity,
        fearLevel,
        birthTime,
        elasticity,
        viscosity,
      })
    }

    return organisms
  }, [isMobile])

  // Deep interactive behaviors and complex ecosystem simulation (simplified on mobile)
  const calculateOrganismInteractions = useCallback(
    (time: number) => {
      // Skip complex interactions on mobile for performance
      if (isMobile) {
        return microorganisms.map((organism, i) => {
          // Simple orbital movement only on mobile
          const angle = organism.orbitAngle + time * organism.orbitSpeed
          const x =
            Math.cos(angle) * organism.orbitRadius * (1 + organism.eccentricity * Math.sin(angle))
          const y =
            Math.sin(angle) * organism.orbitRadius * (1 + organism.eccentricity * Math.cos(angle))
          const z = Math.sin(time * 0.3 + organism.phase) * organism.inclination * 0.7 // Reduced Z movement

          return {
            ...organism,
            currentSize: organism.baseSize,
            excitement: 0,
            socialForceX: 0,
            socialForceY: 0,
            collisionForceX: 0,
            collisionForceY: 0,
            emotionalSpeedBoost: 1,
            mouseInfluence: 0,
            distanceToMouse: 100,
            position: new THREE.Vector3(x, y, z),
            collisionCount: 0,
          }
        })
      }

      // Full interactions for desktop
      const mouseWorldPos = new THREE.Vector3(mouse.x * 10, mouse.y * 8, 0)
      let proximitySum = 0
      let nearbyCount = 0

      return microorganisms.map((organism, i) => {
        // Current position calculation
        const angle = organism.orbitAngle + time * organism.orbitSpeed
        const x =
          Math.cos(angle) * organism.orbitRadius * (1 + organism.eccentricity * Math.sin(angle))
        const y =
          Math.sin(angle) * organism.orbitRadius * (1 + organism.eccentricity * Math.cos(angle))
        const z = Math.sin(time * 0.3 + organism.phase) * organism.inclination * 0.7 // Reduced Z movement

        const organismPos = new THREE.Vector3(x, y, z)
        const distanceToMouse = organismPos.distanceTo(mouseWorldPos)

        // Emotional state calculations
        const isNearMouse = distanceToMouse < organism.socialRadius
        const mouseInfluence = Math.max(0, 1 - distanceToMouse / organism.socialRadius)

        if (isNearMouse) {
          proximitySum += mouseInfluence
          nearbyCount++
        }

        // Fear vs Curiosity response
        const fearResponse = organism.fearLevel * mouseInfluence
        const curiosityResponse = organism.curiosity * mouseInfluence
        const netAttraction = curiosityResponse - fearResponse

        // Gentle cellular interactions with bubble-like physics
        let socialForceX = 0,
          socialForceY = 0,
          collisionForceX = 0,
          collisionForceY = 0
        let flockCount = 0,
          collisionCount = 0

        microorganisms.forEach((other, j) => {
          if (i !== j) {
            const otherAngle = other.orbitAngle + time * other.orbitSpeed
            const otherX = Math.cos(otherAngle) * other.orbitRadius
            const otherY = Math.sin(otherAngle) * other.orbitRadius
            const otherPos = new THREE.Vector3(otherX, otherY, 0)
            const distanceToOther = organismPos.distanceTo(otherPos)

            // Gentle social attraction (like cellular adhesion)
            if (
              distanceToOther < organism.socialRadius &&
              distanceToOther > organism.baseSize + other.baseSize
            ) {
              const socialStrength = (1 - distanceToOther / organism.socialRadius) * 0.02 // Much gentler
              socialForceX += (otherX - x) * socialStrength
              socialForceY += (otherY - y) * socialStrength
              flockCount++
            }

            // Soft collision response (bubble-like bouncing)
            const collisionDistance = organism.baseSize + other.baseSize + 0.1
            if (distanceToOther < collisionDistance) {
              const overlap = collisionDistance - distanceToOther
              const repulsionStrength = overlap * organism.elasticity * 0.05 // Gentle bouncing
              const dirX = (x - otherX) / distanceToOther
              const dirY = (y - otherY) / distanceToOther

              collisionForceX += dirX * repulsionStrength
              collisionForceY += dirY * repulsionStrength
              collisionCount++
            }
          }
        })

        // Gentle size pulsing based on subtle excitement
        const excitement = Math.max(
          0,
          netAttraction * 0.3 + flockCount * 0.02 + collisionCount * 0.05 + globalExcitement
        )
        const excitedSize = organism.baseSize * (1 + excitement * organism.excitability * 0.5)

        // Subtle speed modulation with viscosity damping
        const emotionalSpeedBoost = 1 + excitement * 0.2 - fearResponse * 0.1
        const viscosityDamping = 1 - organism.viscosity * 0.3

        return {
          ...organism,
          currentSize: excitedSize,
          excitement,
          socialForceX,
          socialForceY,
          collisionForceX,
          collisionForceY,
          emotionalSpeedBoost: emotionalSpeedBoost * viscosityDamping,
          mouseInfluence,
          distanceToMouse,
          position: organismPos,
          collisionCount,
        }
      })
    },
    [microorganisms, mouse, globalExcitement, isMobile]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Calculate all organism interactions
    const interactiveOrganisms = calculateOrganismInteractions(time)

    // Update global ecosystem state (skip complex state updates on mobile)
    if (!isMobile) {
      const totalExcitement = interactiveOrganisms.reduce((sum, org) => sum + org.excitement, 0)
      const averageExcitement = totalExcitement / interactiveOrganisms.length
      setGlobalExcitement(averageExcitement * 0.1) // Feedback loop

      // Update mouse proximity state for UI feedback
      const nearbyOrganisms = interactiveOrganisms.filter((org) => org.mouseInfluence > 0.1)
      setMouseProximity({
        x: mouse.x,
        y: mouse.y,
        intensity: nearbyOrganisms.length / 10,
      })
    }

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const organism = microorganisms[i]
        const interactive = interactiveOrganisms[i]
        if (organism && interactive && child.children.length > 0) {
          // Enhanced orbital movement with emotional modulation
          const emotionalSpeed = organism.orbitSpeed * interactive.emotionalSpeedBoost
          const currentAngle = organism.orbitAngle + time * emotionalSpeed

          // Gentle bubble-like forces with smooth damping
          const socialInfluenceX = interactive.socialForceX * Math.sin(time * 1.5) * 0.5
          const socialInfluenceY = interactive.socialForceY * Math.cos(time * 1.5) * 0.5

          // Soft collision forces for bubble bouncing
          const collisionInfluenceX = interactive.collisionForceX * Math.sin(time * 2.5) * 0.8
          const collisionInfluenceY = interactive.collisionForceY * Math.cos(time * 2.5) * 0.8

          // Enhanced orbital movement with interactive forces
          const radiusVariation =
            organism.orbitRadius * (1 + organism.eccentricity * Math.sin(currentAngle * 3))
          const baseX = Math.cos(currentAngle) * radiusVariation
          const baseY =
            Math.sin(currentAngle) *
            radiusVariation *
            (1 + organism.inclination * Math.sin(currentAngle * 2))
          const baseZ = Math.sin(currentAngle * 1.5) * organism.inclination * 0.3

          // Apply gentle influences with viscosity damping
          const mouseAttractionX = interactive.mouseInfluence * mouse.x * 0.1 * organism.viscosity
          const mouseAttractionY = interactive.mouseInfluence * mouse.y * 0.1 * organism.viscosity

          const finalX = baseX + socialInfluenceX + collisionInfluenceX + mouseAttractionX
          const finalY = baseY + socialInfluenceY + collisionInfluenceY + mouseAttractionY
          const finalZ = baseZ + interactive.excitement * Math.sin(time * 2) * 0.1

          child.position.x = finalX
          child.position.y = finalY
          child.position.z = finalZ

          // Gentle size scaling with bubble-like elasticity (simplified on mobile)
          if (isMobile) {
            // Simple breathing only on mobile
            const simpleBreathing = 1 + Math.sin(time * 1.0 + organism.phase) * 0.03
            child.scale.setScalar(simpleBreathing)
          } else {
            // Full interactive scaling on desktop
            const baseBreathing =
              Math.sin(time * 1.0 + organism.phase) * 0.04 +
              Math.sin(time * 2.3 + organism.phase * 1.2) * 0.02 +
              Math.sin(time * 4 + organism.phase * 1.8) * 0.01
            const excitementScale = 1 + interactive.excitement * organism.excitability * 0.15 // Gentler
            const fearContraction = 1 - interactive.mouseInfluence * organism.fearLevel * 0.08 // Subtler
            const collisionExpansion = 1 + interactive.collisionCount * organism.elasticity * 0.03 // Bubble compression
            const totalScale =
              (1 + baseBreathing) * excitementScale * fearContraction * collisionExpansion

            child.scale.setScalar(totalScale)
          }

          // Add slight membrane-like deformation for more organic feel
          if (child.children.length > 0) {
            const deformation = Math.sin(time * 2.5 + organism.phase) * 0.02
            child.rotation.z = deformation
          }

          // Rotate internal patterns with more biological irregularity
          const patterns = child.children.slice(1)
          patterns.forEach((pattern, j) => {
            if (pattern) {
              const rotationSpeed = 0.1 + Math.sin(time * 0.5 + j) * 0.05
              const direction = j % 2 === 0 ? 1 : -1
              pattern.rotation.z = time * rotationSpeed * direction + organism.phase

              // Add slight pulsing to internal structures
              const internalPulse = 1 + Math.sin(time * 3 + j + organism.phase) * 0.03
              pattern.scale.setScalar(internalPulse)
            }
          })
        }
      })
    }
  })

  return (
    <group ref={groupRef} scale={[backgroundScale, backgroundScale, 1]}>
      {microorganisms.map((organism, i) => (
        <group key={i}>
          {/* Complex main body shapes */}
          {organism.type === 0 && (
            // Elongated diatom-like form
            <>
              <mesh scale={[1, 2.5, 1]}>
                <circleGeometry args={[organism.size, 16]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Internal ribbed structure */}
              {[...Array(8)].map((_, j) => (
                <mesh
                  key={`rib-${j}`}
                  position={[0, (j - 3.5) * organism.size * 0.4, 0.001]}
                  scale={[0.8, 0.1, 1]}
                >
                  <circleGeometry args={[organism.size * 0.9, 16]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 1 && (
            // Triangular dinoflagellate form
            <>
              <mesh>
                <circleGeometry args={[organism.size, 3]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Armor plates */}
              {[...Array(6)].map((_, j) => (
                <mesh key={`plate-${j}`} rotation={[0, 0, (j * Math.PI) / 3]}>
                  <ringGeometry args={[organism.size * 0.3, organism.size * 0.8, 3]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
              {/* Flagella */}
              <mesh
                position={[organism.size * 1.2, 0, 0.01]}
                rotation={[0, 0, Math.PI / 4]}
                scale={[0.05, 2, 1]}
              >
                <circleGeometry args={[organism.size * 0.5, 8]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity * 0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </>
          )}

          {organism.type === 2 && (
            // Star-shaped radiolarian
            <>
              <mesh>
                <circleGeometry args={[organism.size, 8]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Star points */}
              {[...Array(8)].map((_, j) => (
                <mesh
                  key={`star-${j}`}
                  position={[
                    Math.cos((j * Math.PI * 2) / 8) * organism.size * 1.5,
                    Math.sin((j * Math.PI * 2) / 8) * organism.size * 1.5,
                    0.01,
                  ]}
                  rotation={[0, 0, (j * Math.PI * 2) / 8]}
                  scale={[0.1, 1.5, 1]}
                >
                  <circleGeometry args={[organism.size * 0.3, 6]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 3 && (
            // Hexagonal diatom
            <>
              <mesh>
                <circleGeometry args={[organism.size, 6]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Hexagonal chambers */}
              {[...Array(3)].map((_, j) => (
                <mesh key={`hex-ring-${j}`}>
                  <ringGeometry
                    args={[organism.size * (0.2 + j * 0.25), organism.size * (0.3 + j * 0.25), 6]}
                  />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
              {/* Corner decorations */}
              {[...Array(6)].map((_, j) => (
                <mesh
                  key={`corner-${j}`}
                  position={[
                    Math.cos((j * Math.PI * 2) / 6) * organism.size * 0.8,
                    Math.sin((j * Math.PI * 2) / 6) * organism.size * 0.8,
                    0.01,
                  ]}
                >
                  <circleGeometry args={[organism.size * 0.1, 6]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 4 && (
            // Complex spiral form
            <>
              <mesh scale={[1.5, 1, 1]}>
                <circleGeometry args={[organism.size, 12]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Spiral chambers */}
              {[...Array(12)].map((_, j) => {
                const angle = (j / 12) * Math.PI * 4
                const radius = organism.size * (0.1 + (j / 12) * 0.6)
                return (
                  <mesh
                    key={`spiral-${j}`}
                    position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0.01]}
                  >
                    <circleGeometry args={[organism.size * 0.08, 8]} />
                    <meshBasicMaterial
                      color={organism.color}
                      transparent
                      opacity={organism.opacity * 0.8}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}
            </>
          )}

          {organism.type === 5 && i < 2 && (
            // Simple circular form (only 1-2 instances)
            <>
              <mesh>
                <circleGeometry args={[organism.size, 32]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Simple concentric rings */}
              {[...Array(3)].map((_, j) => (
                <mesh key={`simple-ring-${j}`}>
                  <ringGeometry
                    args={[organism.size * (0.3 + j * 0.2), organism.size * (0.35 + j * 0.2), 32]}
                  />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.4}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 5 && i >= 2 && (
            // Replace remaining simple forms with complex boat-shaped
            <>
              <mesh scale={[2, 1, 1]} rotation={[0, 0, organism.phase]}>
                <circleGeometry args={[organism.size, 8]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Boat ribs */}
              {[...Array(5)].map((_, j) => (
                <mesh
                  key={`boat-rib-${j}`}
                  position={[(j - 2) * organism.size * 0.4, 0, 0.001]}
                  scale={[0.1, 1.2, 1]}
                  rotation={[0, 0, organism.phase]}
                >
                  <circleGeometry args={[organism.size * 0.6, 8]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 6 && (
            // Chain-like colonial bacteria
            <>
              {[...Array(8)].map((_, j) => {
                const chainAngle = (j / 8) * Math.PI * 2
                const chainRadius = organism.size * (0.3 + j * 0.1)
                return (
                  <mesh
                    key={`chain-${j}`}
                    position={[
                      Math.cos(chainAngle) * chainRadius,
                      Math.sin(chainAngle) * chainRadius,
                      Math.sin(j) * 0.1,
                    ]}
                    scale={[1 - j * 0.08, 1 - j * 0.08, 1]}
                  >
                    <circleGeometry args={[organism.size * (0.4 - j * 0.03), 12]} />
                    <meshBasicMaterial
                      color={organism.color}
                      transparent
                      opacity={organism.opacity * (1 - j * 0.1)}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}
              {/* Connecting filaments */}
              {[...Array(7)].map((_, j) => (
                <mesh
                  key={`filament-${j}`}
                  position={[organism.size * 0.2 * j, 0, 0.005]}
                  rotation={[0, 0, j * 0.2]}
                  scale={[0.02, organism.size * 0.8, 1]}
                >
                  <circleGeometry args={[organism.size * 0.1, 4]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.5}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 7 && (
            // Multi-cellular cluster
            <>
              <mesh>
                <circleGeometry args={[organism.size, 16]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Cellular divisions */}
              {[...Array(12)].map((_, j) => {
                const cellAngle = (j / 12) * Math.PI * 2
                const cellDistance = organism.size * 0.6
                return (
                  <mesh
                    key={`cell-${j}`}
                    position={[
                      Math.cos(cellAngle) * cellDistance,
                      Math.sin(cellAngle) * cellDistance,
                      0.002,
                    ]}
                    rotation={[0, 0, cellAngle]}
                  >
                    <circleGeometry args={[organism.size * 0.15, 6]} />
                    <meshBasicMaterial
                      color={organism.color}
                      transparent
                      opacity={organism.opacity * 0.8}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}
              {/* Central nucleus cluster */}
              {[...Array(3)].map((_, j) => (
                <mesh
                  key={`nucleus-${j}`}
                  position={[
                    (Math.random() - 0.5) * organism.size * 0.4,
                    (Math.random() - 0.5) * organism.size * 0.4,
                    0.003,
                  ]}
                >
                  <circleGeometry args={[organism.size * 0.08, 8]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 8 && (
            // Rod-shaped bacteria with flagella
            <>
              <mesh scale={[3, 1, 1]} rotation={[0, 0, organism.phase]}>
                <circleGeometry args={[organism.size * 0.7, 12]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Multiple flagella */}
              {[...Array(6)].map((_, j) => (
                <mesh
                  key={`flagella-${j}`}
                  position={[
                    organism.size * 2 + j * 0.1,
                    Math.sin(organism.phase + j) * organism.size * 0.3,
                    0.001,
                  ]}
                  rotation={[0, 0, Math.sin(organism.phase * 2 + j) * 0.5]}
                  scale={[0.02, 1.5 + Math.sin(organism.phase + j) * 0.3, 1]}
                >
                  <circleGeometry args={[organism.size * 0.05, 4]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.6}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}

          {organism.type === 9 && (
            // Virus-like with spikes
            <>
              <mesh>
                <circleGeometry args={[organism.size, 20]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity * 0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Protein spikes */}
              {[...Array(16)].map((_, j) => {
                const spikeAngle = (j / 16) * Math.PI * 2
                const spikeLength = 0.3 + Math.sin(organism.phase * 3 + j) * 0.1
                return (
                  <mesh
                    key={`spike-${j}`}
                    position={[
                      Math.cos(spikeAngle) * organism.size * 0.9,
                      Math.sin(spikeAngle) * organism.size * 0.9,
                      0.001,
                    ]}
                    rotation={[0, 0, spikeAngle]}
                    scale={[0.04, spikeLength, 1]}
                  >
                    <circleGeometry args={[organism.size * 0.15, 3]} />
                    <meshBasicMaterial
                      color={organism.color}
                      transparent
                      opacity={organism.opacity}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}
              {/* Central genetic material */}
              <mesh position={[0, 0, 0.002]}>
                <circleGeometry args={[organism.size * 0.3, 6]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity * 1.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </>
          )}

          {organism.type === 10 && (
            // Ciliated protozoa
            <>
              <mesh scale={[1.5, 1.2, 1]}>
                <circleGeometry args={[organism.size, 24]} />
                <meshBasicMaterial
                  color={organism.color}
                  transparent
                  opacity={organism.opacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Cilia covering the surface */}
              {[...Array(32)].map((_, j) => {
                const ciliaAngle = (j / 32) * Math.PI * 2
                const wave = Math.sin(organism.phase * 6 + j * 0.5) * 0.3
                return (
                  <mesh
                    key={`cilia-${j}`}
                    position={[
                      Math.cos(ciliaAngle) * organism.size * 1.2,
                      Math.sin(ciliaAngle) * organism.size * 1.2,
                      0.001,
                    ]}
                    rotation={[0, 0, ciliaAngle + wave]}
                    scale={[0.01, 0.4 + wave * 0.2, 1]}
                  >
                    <circleGeometry args={[organism.size * 0.02, 3]} />
                    <meshBasicMaterial
                      color={organism.color}
                      transparent
                      opacity={organism.opacity * 0.7}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )
              })}
              {/* Food vacuoles */}
              {[...Array(4)].map((_, j) => (
                <mesh
                  key={`vacuole-${j}`}
                  position={[
                    (Math.random() - 0.5) * organism.size * 0.8,
                    (Math.random() - 0.5) * organism.size * 0.8,
                    0.002,
                  ]}
                  scale={[
                    1 + Math.sin(organism.phase + j) * 0.2,
                    1 + Math.sin(organism.phase + j) * 0.2,
                    1,
                  ]}
                >
                  <circleGeometry args={[organism.size * 0.1, 8]} />
                  <meshBasicMaterial
                    color={organism.color}
                    transparent
                    opacity={organism.opacity * 0.5}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
            </>
          )}
        </group>
      ))}

      {/* Scientific background */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[35, 25]} />
        <meshBasicMaterial color="#faf7f0" transparent opacity={0.3} />
      </mesh>

      {/* Orbital guide lines (very subtle) */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`orbit-${i}`} position={[0, 0, -1.8]}>
          <ringGeometry args={[3 + i * 2, 3.05 + i * 2, 64]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.03} />
        </mesh>
      ))}
    </group>
  )
}
