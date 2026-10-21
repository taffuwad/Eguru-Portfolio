import { useState } from "react";

const KEYFRAMES = `
@keyframes dl-pulse {
  0%   { scale: 0.95; box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 70%, transparent); }
  70%  { scale: 1;    box-shadow: 0 0 0 16px color-mix(in srgb, var(--color-accent) 0%, transparent); }
  100% { scale: 0.95; box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent); }
}
@keyframes dl-installing {
  from { height: 0; }
  to   { height: 100%; }
}
@keyframes dl-rotate {
  0%   { transform: rotate(-90deg) translate(27px) rotate(0);     opacity: 1; visibility: visible; }
  99%  { transform: rotate(270deg) translate(27px) rotate(270deg); opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}
@keyframes dl-installed {
  100% { width: 150px; border-color: var(--color-accent-hover); }
}
@keyframes dl-circle-delete {
  100% { opacity: 0; visibility: hidden; }
}
@keyframes dl-show-installed {
  100% { opacity: 1; visibility: visible; right: 56px; }
}
`;

export default function DownloadToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="CV flex items-center justify-center p-0 m-0 font-sans">
      <style>{KEYFRAMES}</style>

      <label
        className={[
          // base
          "relative flex items-center w-40 p-[5px] cursor-pointer rounded-full",
          "border-2 border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-light)] transition-all duration-[400ms] ease",
          "focus-within:ring-2 focus-within:ring-[var(--color-accent-hover)] focus-within:ring-offset-2",
          // rotating dot ::before
          "before:content-[''] before:absolute before:inset-0 before:m-auto",
          "before:w-2 before:h-2 before:rounded-full before:bg-[var(--color-text-light)]",
          "before:opacity-0 before:invisible before:transition-all before:duration-[400ms] before:ease",
          // checked state (mirrors .label:has(.input:checked))
          checked && "w-[57px] [animation:dl-installed_0.4s_ease_3.5s_forwards]",
          checked && "before:[animation:dl-rotate_3s_ease-in-out_0.4s_forwards]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          type="checkbox"
          className="sr-only"
          aria-label="Resume"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />

        {/* circle */}
        <span
          className={[
            "relative flex items-center justify-center w-[45px] h-[45px] rounded-full",
            "bg-[var(--color-accent)] shadow-[0_0_0_0_transparent] overflow-hidden",
            "transition-all duration-[400ms] ease",
            // checked: rotate + animations
            checked && "rotate-180",
            checked && "[animation:dl-pulse_1s_forwards,dl-circle-delete_0.2s_ease_3.5s_forwards]",
            // ::before fill
            "before:content-[''] before:absolute before:left-0 before:top-0",
            "before:w-full before:h-0 before:bg-[var(--color-accent-hover)] before:transition-all before:duration-[400ms] before:ease",
            checked && "before:[animation:dl-installing_3s_ease-in-out_forwards]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* arrow icon */}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={[
              "absolute top-1/2 left-1/2 w-[30px] text-white",
              "-translate-x-1/2 -translate-y-1/2 transition-all duration-[400ms] ease",
              checked && "opacity-0 invisible",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>

          {/* square */}
          <div
            className={[
              "absolute top-1/2 left-1/2 w-[15px] aspect-square rounded-[2px] bg-white",
              "-translate-x-1/2 -translate-y-1/2 transition-all duration-[400ms] ease",
              "opacity-0 invisible",
              checked && "opacity-100 visible",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </span>

        {/* "Download" — hidden when checked */}
        <p
          className={[
            "absolute right-[18px] bottom-[14px] text-[17px] text-white text-center",
            "transition-all duration-[400ms] ease",
            checked && "opacity-0 invisible",
          ]
            .filter(Boolean)
            .join(" ")}
        >
           Resume
        </p>

        {/* "Open" — shown when checked */}
        <p
          className={[
            "absolute right-[18px] bottom-[14px] text-[17px] text-[var(--color-text-light)] text-center",
            "transition-all duration-[400ms] ease",
            "opacity-0 invisible",
            checked &&
              "opacity-100 visible right-[56px] [animation:dl-show-installed_0.4s_ease_3.5s_forwards]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          Open
        </p>
      </label>
    </div>
  );
}