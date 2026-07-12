import logoImg from '../../assets/logo.png';

export default function LogoIcon({ size = 36, className = "" }) {
  return (
    <img 
      src={logoImg} 
      alt="Syntax Squad Logo" 
      width={size} 
      height={size} 
      className={className}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
