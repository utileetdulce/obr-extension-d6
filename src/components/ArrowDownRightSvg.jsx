export const ArrowDownRightSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 27 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <g>
        {/* line top to bottom */}
        <line x1="12" y1="0" x2="12" y2="12" />

        {/* line left to right */}
        <line x1="12" y1="12" x2="24" y2="12" />

        {/* arrow head */}
        <line x1="24" y1="12" x2="21" y2="15" />
        <line x1="24" y1="12" x2="21" y2="9" />
      </g>
    </svg>
  )
}
