import { Box } from "@mui/material"

export default function HamsterWheel() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 140,
        height: 140,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Rotating wheel */}
        <g
          style={{
            transformOrigin: "70px 70px",
            animation: "spin 2s linear infinite",
          }}
        >
          {/* Outer circle */}
          <circle cx="70" cy="70" r="50" fill="none" stroke="#4caf50" strokeWidth="6" />

          {/* Wheel spokes */}
          <line x1="70" y1="20" x2="70" y2="120" stroke="#4caf50" strokeWidth="3" />
          <line x1="20" y1="70" x2="120" y2="70" stroke="#4caf50" strokeWidth="3" />
          <line x1="35" y1="35" x2="105" y2="105" stroke="#4caf50" strokeWidth="3" />
          <line x1="105" y1="35" x2="35" y2="105" stroke="#4caf50" strokeWidth="3" />
        </g>

        {/* Hamster body (bouncing) - cute rounded design facing right */}
        <g
          style={{
            transformOrigin: "70px 70px",
            animation: "bounce 0.5s ease-in-out infinite",
          }}
        >
          {/* Main body - rounded chubby shape */}
          <ellipse cx="65" cy="72" rx="22" ry="18" fill="#999" />

          {/* Belly - lighter gray overlay */}
          <ellipse cx="63" cy="76" rx="14" ry="12" fill="#d0d0d0" />

          {/* Head - rounded */}
          <circle cx="82" cy="65" r="12" fill="#999" />

          {/* Outer ear (dark gray) */}
          <ellipse cx="80" cy="56" rx="6" ry="8" fill="#666" />
          {/* Inner ear (pink) */}
          <ellipse cx="80" cy="57" rx="4" ry="5" fill="#ffc0cb" />

          {/* Eye */}
          <circle cx="86" cy="64" r="2.5" fill="#000" />

          {/* Nose (pink) */}
          <circle cx="92" cy="68" r="2" fill="#ffc0cb" />

          {/* Cheek highlight */}
          <ellipse cx="88" cy="70" rx="3" ry="2" fill="#e0e0e0" opacity="0.6" />

          {/* Small tail */}
          <circle cx="45" cy="78" r="3" fill="#999" />

          {/* Front paw */}
          <ellipse cx="75" cy="86" rx="4" ry="3" fill="#999" />
          {/* Back paw */}
          <ellipse cx="55" cy="86" rx="4" ry="3" fill="#999" />
        </g>
      </svg>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </Box>
  )
}
