import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function HeroBanner() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // 以視窗中心點為基準計算偏移量
      const centerX = window.innerWidth / 2;

      // 微幅移動控制
      const moveX = ((e.clientX - centerX) / centerX) * 4;
      setMouseOffset({ x: moveX });
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
            transform: `translateX(${mouseOffset.x}px)`,
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
            transform: `translateX(${mouseOffset.x}px)`,
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
