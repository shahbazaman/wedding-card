import React from 'react'

export const CoupleIllustration = () => (
  <svg viewBox="0 0 340 460" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
    <defs>
      <radialGradient id="illBg" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#2a0f0f" />
        <stop offset="100%" stopColor="#0d0404" />
      </radialGradient>
    </defs>
    <rect width="340" height="460" fill="url(#illBg)" />
    <line x1="170" y1="0" x2="170" y2="38" stroke="#d4af7a" strokeWidth="1.5" opacity="0.6" />
    <ellipse cx="170" cy="42" rx="45" ry="9" fill="none" stroke="#d4af7a" strokeWidth="0.8" opacity="0.5" />
    {[130,155,170,185,210].map((x,i)=>(
      <g key={i}>
        <line x1={x} y1={42} x2={x} y2={42+20+i%2*8} stroke="#d4af7a" strokeWidth="0.5" opacity="0.4" />
        <circle cx={x} cy={42+22+i%2*8} r="3" fill="#ffd700" opacity="0.7" />
      </g>
    ))}
    <ellipse cx="50" cy="70" rx="22" ry="6" fill="none" stroke="#d4af7a" strokeWidth="0.6" opacity="0.35" />
    <ellipse cx="290" cy="70" rx="22" ry="6" fill="none" stroke="#d4af7a" strokeWidth="0.6" opacity="0.35" />
    <path d="M15 90 Q12 200 40 340" stroke="#4a7a3a" strokeWidth="2.2" fill="none" opacity="0.55" />
    {[{cx:22,cy:110,r:12,c:'#c0392b'},{cx:16,cy:140,r:9,c:'#d4af7a'},{cx:22,cy:168,r:11,c:'#c8a882'},{cx:14,cy:200,r:8,c:'#c0392b'},{cx:24,cy:230,r:7,c:'#d4af7a'}].map((f,i)=>(
      <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill={f.c} opacity="0.65" />
    ))}
    {[45,70,95,120].map((y,i)=>(
      <ellipse key={i} cx={18+i*2} cy={y+95} rx="9" ry="4" fill="#4a7a3a" opacity="0.4" transform={`rotate(-${30+i*8},${18+i*2},${y+95})`} />
    ))}
    <path d="M325 90 Q328 200 300 340" stroke="#4a7a3a" strokeWidth="2.2" fill="none" opacity="0.55" />
    {[{cx:318,cy:110,r:12,c:'#c0392b'},{cx:324,cy:140,r:9,c:'#d4af7a'},{cx:318,cy:168,r:11,c:'#c8a882'},{cx:326,cy:200,r:8,c:'#c0392b'},{cx:316,cy:230,r:7,c:'#d4af7a'}].map((f,i)=>(
      <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill={f.c} opacity="0.65" />
    ))}
    <ellipse cx="128" cy="165" rx="23" ry="25" fill="#d4a57a" />
    <path d="M107 156 Q117 143 128 141 Q139 143 149 156" fill="#2c1a0e" opacity="0.9" />
    <path d="M115 172 Q128 182 141 172 Q137 184 128 186 Q119 184 115 172Z" fill="#3a2010" opacity="0.5" />
    <path d="M102 188 Q100 192 96 248 L160 248 Q156 192 154 188Z" fill="#3a3a3a" opacity="0.95" />
    <path d="M122 188 L128 202 L134 188" fill="#444" opacity="0.8" />
    <rect x="98" y="246" width="62" height="88" rx="4" fill="#c8b89a" opacity="0.9" />
    <ellipse cx="215" cy="163" rx="21" ry="23" fill="#d4a57a" />
    <path d="M194 154 Q204 140 215 138 Q226 140 236 154 Q241 165 238 187 Q226 196 215 197 Q204 196 192 187 Q189 165 194 154Z" fill="#1a1a1a" opacity="0.92" />
    <circle cx="215" cy="144" r="5" fill="#d4af7a" opacity="0.8" />
    <line x1="210" y1="144" x2="220" y2="144" stroke="#d4af7a" strokeWidth="1.2" opacity="0.7" />
    <path d="M200 190 Q215 202 230 190" stroke="#d4af7a" strokeWidth="1.5" fill="none" opacity="0.75" />
    <circle cx="215" cy="198" r="3.5" fill="#d4af7a" opacity="0.65" />
    <path d="M193 196 Q191 198 184 256 L246 256 Q239 198 237 196Z" fill="#1a1a1a" opacity="0.92" />
    <path d="M186 254 Q174 276 168 334 L262 334 Q256 276 244 254Z" fill="#1a1a1a" opacity="0.88" />
    {[205,220,235,250].map((y,i)=>(
      <path key={i} d={`M193 ${y} Q215 ${y-5} 237 ${y}`} stroke="rgba(212,175,122,0.18)" strokeWidth="0.8" fill="none" />
    ))}
    <path d="M158 245 Q170 250 190 248" stroke="#d4a57a" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M174 244 Q177 241 180 244" stroke="#8b4513" strokeWidth="1.2" fill="none" opacity="0.7" />
    {[{x:70,y:365},{x:75,y:378},{x:270,y:365},{x:265,y:378}].map((f,i)=>(
      <circle key={i} cx={f.x} cy={f.y} r={i%2===0?13:9} fill={i%2===0?'#c0392b':'#d4af7a'} opacity="0.5" />
    ))}
    <ellipse cx="80" cy="372" rx="11" ry="4.5" fill="#4a7a3a" opacity="0.4" transform="rotate(30,80,372)" />
    <ellipse cx="260" cy="372" rx="11" ry="4.5" fill="#4a7a3a" opacity="0.4" transform="rotate(-30,260,372)" />
    <path d="M30 420 Q170 405 310 420" stroke="#d4af7a" strokeWidth="0.5" fill="none" opacity="0.4" />
    <text x="128" y="425" fontFamily="Georgia,serif" fontSize="14" fill="#d4af7a" textAnchor="middle" opacity="0.85" fontStyle="italic">Athif Aziz</text>
    <text x="170" y="423" fontFamily="Georgia,serif" fontSize="12" fill="#c0392b" textAnchor="middle" opacity="0.75">&amp;</text>
    <text x="215" y="425" fontFamily="Georgia,serif" fontSize="14" fill="#d4af7a" textAnchor="middle" opacity="0.85" fontStyle="italic">Namra Shehsy</text>
    <ellipse cx="170" cy="260" rx="90" ry="110" fill="rgba(212,175,122,0.04)" />
    {[{x:55,y:90},{x:285,y:95},{x:80,y:300},{x:260,y:295}].map((s,i)=>(
      <circle key={i} cx={s.x} cy={s.y} r={i<2?2:1.2} fill="#ffd700" opacity="0.5" />
    ))}
  </svg>
)
