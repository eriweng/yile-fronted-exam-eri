/**
 * HeroBanner — 等比例縮放 Hero 組件
 *
 * 設計畫布：1440 × 560 px
 * 利用 aspect-ratio 使容器跟隨寬度縮放，
 * 所有子元素以百分比定位，確保各尺寸下比例一致。
 *
 * 圖層順序（由下至上）：
 *  1. hero-bg.png        — 山景背景（全覆）
 *  2. hero-silhouette.png — 人物剪影（multiply 混合）
 *  3. hero-character.png  — 漫畫角色（左側）
 *  4. hero-eye-left / right — 眼睛（z-30，供動畫）
 *  5. hero-logo.png       — Heelco Logo（右側，z-30，供動畫）
 */

import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function HeroBanner() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // 以視窗中心點為基準計算偏移量
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // 微幅移動控制 (最大約 ±8px)
      const moveX = ((e.clientX - centerX) / centerX) * 8;
      const moveY = ((e.clientY - centerY) / centerY) * 5;

      setMouseOffset({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* 1. 山景背景 */}
      <img
        src={`${BASE}hero-bg.png`}
        alt="hero-bg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1440 / 823',
        }}
      >
        {/* 2. 人物剪影 */}
        <img
          src={`${BASE}hero-silhouette.png`}
          alt="hero-silhouette"
          style={{
            position: 'absolute',
            inset: 0,
            left: '0%',
            width: '76%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* 3. 漫畫角色 */}
        <img
          src={`${BASE}hero-character.png`}
          alt="hero-character"
          style={{
            position: 'absolute',
            zIndex: 40,
            left: 0,
            top: 0,
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'left top',
          }}
        />

        {/* 4. 眼睛（隨滑鼠座標微幅移動） */}
        <img
          src={`${BASE}hero-eye-left.png`}
          alt="hero-eye-left"
          style={{
            position: 'absolute',
            zIndex: 30,
            left: '40%',
            top: '37%',
            width: '3.5%',
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <img
          src={`${BASE}hero-eye-right.png`}
          alt="hero-eye-right"
          style={{
            position: 'absolute',
            zIndex: 30,
            left: '50%',
            top: '36.5%',
            width: '3.5%',
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </div>
      {/* 5. Heelco Logo */}
      <img
        src={`${BASE}hero-logo.png`}
        className="animate-scale-pulse"
        alt="hero-logo"
        style={{
          position: 'absolute',
          zIndex: 50,
          right: '5%',
          bottom: '10%',
          width: '38%',
        }}
      />
    </div>
  );
}
