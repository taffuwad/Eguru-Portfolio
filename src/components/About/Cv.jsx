import resume from "../../assets/Fuwad_Talukder_Resume.pdf";

export default function DownloadToggle() {
  return (
    <div className="CV">
      <a className="cv-download" href={resume} download="Fuwad_Talukder_Resume.pdf">
        <span>Download résumé</span>
        <span className="cv-download-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
