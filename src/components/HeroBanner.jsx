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

const BASE = import.meta.env.BASE_URL;

export default function HeroBanner() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1440 / 560',
        overflow: 'hidden',
      }}
    >
      {/* 1. 山景背景 */}
      <img
        src={`${BASE}hero-bg.png`}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* 2. 人物剪影 */}
      <img
        src={`${BASE}hero-silhouette.png`}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          mixBlendMode: 'multiply',
        }}
      />

      {/* 3. 漫畫角色（左側，保持原始比例，佔高 120%，從頂部溢出有裁切效果） */}
      <img
        src={`${BASE}hero-character.png`}
        alt=""
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '120%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'left top',
        }}
      />

      {/* 4. 眼睛（最高層，供動畫控制） */}
      <img
        src={`${BASE}hero-eye-left.png`}
        alt=""
        style={{
          position: 'absolute',
          zIndex: 30,
          left: '18.5%',
          top: '36%',
          width: '3.5%',
        }}
      />
      <img
        src={`${BASE}hero-eye-right.png`}
        alt=""
        style={{
          position: 'absolute',
          zIndex: 30,
          left: '23%',
          top: '36%',
          width: '3.5%',
        }}
      />

      {/* 5. Heelco Logo（右側中央，最高層，供動畫控制） */}
      <img
        src={`${BASE}hero-logo.png`}
        alt="Heelco"
        style={{
          position: 'absolute',
          zIndex: 30,
          right: '5%',
          top: '22%',
          width: '38%',
        }}
      />

      {/* Top Work 標記 */}
      <span
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '2%',
          color: 'white',
          fontSize: '0.85em',
          fontWeight: 'bold',
          opacity: 0.6,
          zIndex: 10,
          letterSpacing: '0.05em',
        }}
      >
        Top Work
      </span>
    </div>
  );
}
