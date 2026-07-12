export default function LogoIcon({ size = 36, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      className={className}
      style={{ display: 'block' }}
    >
      {/* Stylized S Monogram */}
      {/* Top-Left Segment of S */}
      <path d="M 330,60 
               L 200,60 
               L 140,120 
               L 200,180 
               L 260,180 
               L 190,250 
               L 230,290 
               L 350,170 
               L 300,120 
               L 250,120 
               L 300,70 Z" 
            fill="currentColor" />
            
      {/* Bottom-Right Segment of S */}
      <path d="M 180,290 
               L 310,290 
               L 370,230 
               L 310,170 
               L 250,170 
               L 320,100 
               L 280,60 
               L 160,180 
               L 210,230 
               L 260,230 
               L 200,290 Z" 
            fill="currentColor" />

      {/* Code bracket stroke in the center */}
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* < */}
        <path d="M 235,165 L 220,175 L 235,185" />
        {/* / */}
        <path d="M 260,155 L 250,195" />
        {/* > */}
        <path d="M 275,165 L 290,175 L 275,185" />
      </g>
    </svg>
  );
}
