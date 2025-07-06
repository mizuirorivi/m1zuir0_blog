'use client'

import { useState, useEffect } from 'react'

interface NixieTubeProps {
  digit: string
}

function NixieTube({ digit }: NixieTubeProps) {
  const [animationOffset, setAnimationOffset] = useState(0)
  const [glitchOffset, setGlitchOffset] = useState(0)
  const [showLightning, setShowLightning] = useState(false)
  const [lightningPosition, setLightningPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset((prev) => (prev + 1) % 100)

      // ランダムに横線を表示（より低い確率でゆっくり）
      if (Math.random() < 0.08) {
        setShowLightning(true)
        setLightningPosition(0)
      }

      // 横線を上から下にゆっくり移動
      if (showLightning) {
        setLightningPosition((prev) => {
          if (prev >= 100) {
            setShowLightning(false)
            return 0
          }
          return prev + 3 // より遅く
        })
      }

      // 壊れた地デジ感のためのランダムグリッチ（より低い確率）
      if (Math.random() < 0.05) {
        setGlitchOffset(Math.random() * 6 - 3)
      } else {
        setGlitchOffset(0)
      }
    }, 150) // より遅いアニメーション
    return () => clearInterval(interval)
  }, [showLightning])

  // 各数字をより縦長のドットパターンで定義（7x15のグリッド）
  const dotPatterns = {
    '0': [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '1': [
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    '2': [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    '3': [
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '4': [
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
    ],
    '5': [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '6': [
      [0, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '7': [
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ],
    '8': [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '9': [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
    ],
    '.': [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
    ],
  }

  const pattern = dotPatterns[digit as keyof typeof dotPatterns] || dotPatterns['0']

  return (
    <div className="relative mx-0.5 h-48 w-16">
      {/* ガラス管本体 - 強化されたレトロ感 */}
      <div
        className="absolute top-0 right-0 bottom-8 left-0 overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 8, 4, 0.98) 0%,
              rgba(25, 12, 6, 0.95) 15%,
              rgba(35, 18, 9, 0.92) 30%,
              rgba(45, 22, 11, 0.88) 45%,
              rgba(35, 18, 9, 0.92) 60%,
              rgba(25, 12, 6, 0.95) 75%,
              rgba(10, 5, 2, 0.99) 100%
            )
          `,
          borderRadius: '32px 32px 8px 8px',
          border: '1px solid rgba(50, 25, 12, 0.8)',
          boxShadow: `
            inset 0 0 35px rgba(0, 0, 0, 0.95),
            inset 3px 3px 15px rgba(60, 30, 15, 0.5),
            inset -3px -3px 15px rgba(0, 0, 0, 0.98),
            0 0 4px rgba(120, 60, 30, 0.02)
          `,
        }}
      >
        {/* 強化されたレトロな汚れとサビ感 */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(ellipse at 8% 3%, rgba(100, 70, 50, 0.6) 0%, transparent 20%),
              radial-gradient(ellipse at 92% 97%, rgba(80, 60, 45, 0.5) 0%, transparent 18%),
              radial-gradient(ellipse at 55% 20%, rgba(70, 50, 35, 0.4) 0%, transparent 12%),
              radial-gradient(ellipse at 25% 80%, rgba(60, 45, 30, 0.4) 0%, transparent 15%),
              radial-gradient(ellipse at 75% 60%, rgba(90, 60, 40, 0.3) 0%, transparent 10%),
              linear-gradient(35deg, transparent 60%, rgba(50, 30, 20, 0.5) 75%, transparent 85%),
              linear-gradient(-35deg, transparent 70%, rgba(45, 25, 15, 0.4) 80%, transparent 90%),
              linear-gradient(125deg, transparent 65%, rgba(40, 20, 12, 0.4) 78%, transparent 88%)
            `,
            borderRadius: '32px 32px 8px 8px',
          }}
        />

        {/* サビのテクスチャ */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(80, 50, 30, 0.1) 2px,
                rgba(80, 50, 30, 0.1) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                rgba(70, 45, 25, 0.08) 3px,
                rgba(70, 45, 25, 0.08) 6px
              )
            `,
            borderRadius: '32px 32px 8px 8px',
          }}
        />

        {/* 内部の真空空間 */}
        <div
          className="absolute inset-1"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(5, 2, 1, 0.99) 0%, rgba(2, 1, 0, 0.995) 100%)',
            borderRadius: '30px 30px 6px 6px',
          }}
        />

        {/* 雷のような横線（上から下へゆっくり） - 数字から独立 */}
        {showLightning && (
          <div className="absolute inset-2 top-2 bottom-8 overflow-hidden">
            <div
              className="absolute h-1 w-full"
              style={{
                top: `${lightningPosition}%`,
                background: `linear-gradient(to right,
                  transparent 0%,
                  rgba(255, 200, 100, 0.9) 25%,
                  rgba(255, 220, 120, 1) 50%,
                  rgba(255, 200, 100, 0.9) 75%,
                  transparent 100%
                )`,
                clipPath: `polygon(
                  0% 50%,
                  ${15 + Math.sin(lightningPosition * 0.1) * 10}% ${40 + Math.sin(lightningPosition * 0.15) * 20}%,
                  ${30 + Math.sin(lightningPosition * 0.12) * 15}% ${60 + Math.sin(lightningPosition * 0.18) * 15}%,
                  ${45 + Math.sin(lightningPosition * 0.08) * 20}% ${30 + Math.sin(lightningPosition * 0.22) * 25}%,
                  ${60 + Math.sin(lightningPosition * 0.14) * 12}% ${70 + Math.sin(lightningPosition * 0.16) * 18}%,
                  ${75 + Math.sin(lightningPosition * 0.11) * 18}% ${35 + Math.sin(lightningPosition * 0.19) * 20}%,
                  ${90 + Math.sin(lightningPosition * 0.13) * 8}% ${55 + Math.sin(lightningPosition * 0.17) * 15}%,
                  100% 50%,
                  ${90 + Math.sin(lightningPosition * 0.13) * 8}% ${45 + Math.sin(lightningPosition * 0.17) * 15}%,
                  ${75 + Math.sin(lightningPosition * 0.11) * 18}% ${65 + Math.sin(lightningPosition * 0.19) * 20}%,
                  ${60 + Math.sin(lightningPosition * 0.14) * 12}% ${30 + Math.sin(lightningPosition * 0.16) * 18}%,
                  ${45 + Math.sin(lightningPosition * 0.08) * 20}% ${70 + Math.sin(lightningPosition * 0.22) * 25}%,
                  ${30 + Math.sin(lightningPosition * 0.12) * 15}% ${40 + Math.sin(lightningPosition * 0.18) * 15}%,
                  ${15 + Math.sin(lightningPosition * 0.1) * 10}% ${60 + Math.sin(lightningPosition * 0.15) * 20}%
                )`,
                boxShadow: `
                  0 0 8px rgba(255, 200, 100, 0.8),
                  0 0 16px rgba(255, 220, 120, 0.4),
                  0 0 24px rgba(255, 180, 80, 0.2)
                `,
                filter: 'blur(0.3px)',
                opacity: 0.8,
              }}
            />
          </div>
        )}

        {/* カソードメッシュ - より古い感じ */}
        <div className="absolute inset-3 bottom-3 opacity-6">
          {/* 縦のメッシュ */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${i * 10}%`,
                background: 'rgba(80, 50, 25, 0.4)',
                opacity: Math.random() > 0.3 ? 0.2 : 0.05, // ランダムに薄くなる
              }}
            />
          ))}
          {/* 横のメッシュ */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute h-px w-full"
              style={{
                top: `${i * 6.67}%`,
                background: 'rgba(80, 50, 25, 0.4)',
                opacity: Math.random() > 0.3 ? 0.2 : 0.05, // ランダムに薄くなる
              }}
            />
          ))}
        </div>

        {/* レトロなガラス表面の反射 - より控えめ */}
        <div
          className="absolute top-10 left-1/4 h-8 w-1 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* 古い感じの側面反射 */}
        <div
          className="absolute top-16 left-0.5 h-16 w-0.5 opacity-8"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
            filter: 'blur(1px)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* 筒の底から少し浮かせたドット状数字表示 */}
      <div className="absolute right-0 bottom-20 left-0 flex justify-center">
        <div
          className="relative"
          style={{
            width: '28px',
            height: '75px',
            transform: `translateX(${glitchOffset}px)`, // 壊れた地デジ感
          }}
        >
          {pattern.map((row, rowIndex) =>
            row.map((dot, colIndex) => {
              const flickerIntensity =
                Math.sin((animationOffset + rowIndex * 3 + colIndex * 2) * 0.15) * 0.08
              const glitchFlicker = Math.random() < 0.02 ? Math.random() * 0.5 : 0 // 地デジグリッチ
              const rustEffect = Math.random() < 0.04 ? 0.25 : 0 // サビ感
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="absolute"
                  style={{
                    left: `${colIndex * 4}px`,
                    top: `${rowIndex * 5}px`,
                    width: '2px',
                    height: '3px',
                    background: dot
                      ? `rgba(160, 80, 30, ${0.8 + flickerIntensity - glitchFlicker - rustEffect})`
                      : 'rgba(30, 20, 10, 0.08)',
                    boxShadow: dot
                      ? `0 0 1px rgba(160, 80, 30, ${0.6 + flickerIntensity}), 0 0 2px rgba(140, 70, 25, ${0.4 + flickerIntensity * 0.5})`
                      : 'none',
                    borderRadius: '50%',
                    opacity: dot
                      ? Math.random() > 0.015
                        ? 0.85 + flickerIntensity - glitchFlicker - rustEffect
                        : 0.15
                      : 0.08,
                  }}
                />
              )
            })
          )}
        </div>
      </div>

      {/* 底部ベース - より古い感じ */}
      <div
        className="absolute right-0 bottom-0 left-0 h-8"
        style={{
          background: `
            linear-gradient(135deg,
              rgba(15, 10, 8, 1) 0%,
              rgba(8, 5, 4, 1) 25%,
              rgba(4, 2, 2, 1) 50%,
              rgba(2, 1, 1, 1) 75%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
          borderRadius: '4px',
          border: '1px solid rgba(25, 15, 10, 0.6)',
          boxShadow: `
            inset 0 2px 4px rgba(30, 20, 15, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.98)
          `,
        }}
      >
        {/* ベース上部の金属リング - サビ感 */}
        <div
          className="absolute top-0 left-1/2 h-1 w-12 -translate-x-1/2 transform opacity-25"
          style={{
            background: 'linear-gradient(135deg, rgba(40, 30, 25, 1) 0%, rgba(20, 15, 12, 1) 100%)',
            borderRadius: '2px',
          }}
        />

        {/* ベースの強化されたサビ感 */}
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background: `
              radial-gradient(ellipse at 10% 30%, rgba(80, 50, 30, 0.5) 0%, transparent 30%),
              radial-gradient(ellipse at 90% 70%, rgba(60, 40, 25, 0.4) 0%, transparent 25%),
              radial-gradient(ellipse at 50% 90%, rgba(70, 45, 28, 0.3) 0%, transparent 20%),
              linear-gradient(45deg, transparent 70%, rgba(50, 30, 18, 0.3) 85%, transparent 95%)
            `,
            borderRadius: '4px',
          }}
        />

        {/* サビのテクスチャ */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              repeating-linear-gradient(
                30deg,
                transparent,
                transparent 1px,
                rgba(70, 45, 25, 0.2) 1px,
                rgba(70, 45, 25, 0.2) 2px
              )
            `,
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  )
}

export interface NixieTubeDisplayProps {
  /** 表示する数値（文字列または数値） */
  value?: string | number
  /** 表示する桁数の上限 */
  maxDigits?: number
  /** カスタムクラス名 */
  className?: string
}

export function NixieTubeDisplay({
  value = '0',
  maxDigits = 8,
  className = '',
}: NixieTubeDisplayProps) {
  const displayValue = String(value).slice(0, maxDigits)

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {displayValue.split('').map((char, index) => (
        <NixieTube key={`${char}-${index}`} digit={char} />
      ))}
    </div>
  )
}
