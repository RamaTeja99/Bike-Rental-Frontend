import type { SVGProps } from "react";

export function GearShareLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 2a10 10 0 0 0-3.54 19.48" />
      <path d="m12 12-4 4" />
      <path d="m12 12 4-4" />
      <path d="m12 12 4 4" />
      <path d="m12 12-4-4" />
      <path d="M12 2v4" />
      <path d="M22 12h-4" />
      <path d="M12 22v-4" />
      <path d="M2 12h4" />
      <path d="m19.07 4.93-2.83 2.83" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m19.07 19.07-2.83-2.83" />
      <path d="m4.93 4.93 2.83 2.83" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
