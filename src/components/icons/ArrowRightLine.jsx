function ArrowRightLine({ width = 1.5, className, alt, stroke }) {
  return (
    <svg
      width="19"
      height="2"
      viewBox="0 0 19 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className={className}
    >
      <path
        d="M1 1H17.83"
        stroke={stroke || "currentColor"}
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowRightLine;
