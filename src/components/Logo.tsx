import { Link } from 'react-router-dom';
import svgPaths from "../imports/svg-gvi2gibf3l";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  asLink?: boolean;
}

export function Logo({ className = "", isDark = false, asLink = false }: LogoProps) {
  const fillColor = isDark ? "#FFFFFF" : "#1E130F";
  
  const logoSvg = (
    <div className="relative" style={{ aspectRatio: '595/290', maxHeight: '64px' }}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 595 290" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {/* Todos los paths del logo con fill */}
          <path clipRule="evenodd" d={svgPaths.p3835a700} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2e53c080} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p399b4780} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p360f0800} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2fa1cd80} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p11066000} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.pa87e500} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p10df8ff0} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p21f88f00} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p15904f80} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2950b000} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2aade300} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2262f520} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p34816d70} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2819b780} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p24e0b00} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p1a431800} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p26589500} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2283e800} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3d5a480} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3e6753f2} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.pf2ba280} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p9bd9180} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3c351400} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p13407400} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p29d24c80} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p36607700} fill={fillColor} fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p25e49e00} fill={fillColor} fillRule="evenodd" />
          
          {/* Todos los paths con stroke */}
          <path clipRule="evenodd" d={svgPaths.p3835a700} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2e53c080} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p399b4780} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p360f0800} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2fa1cd80} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p11066000} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.pa87e500} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p10df8ff0} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p21f88f00} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p15904f80} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2950b000} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2aade300} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2262f520} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p34816d70} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2819b780} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p24e0b00} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p1a431800} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p26589500} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p2283e800} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p3d5a480} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p3e6753f2} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.pf2ba280} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p9bd9180} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p3c351400} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p13407400} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p29d24c80} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p36607700} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
          <path clipRule="evenodd" d={svgPaths.p25e49e00} fillRule="evenodd" stroke={fillColor} strokeMiterlimit="10" />
        </g>
      </svg>
    </div>
  );
  
  if (asLink) {
    return (
      <Link to="/" className={`block ${className}`}>
        {logoSvg}
      </Link>
    );
  }
  
  return <div className={className}>{logoSvg}</div>;
}