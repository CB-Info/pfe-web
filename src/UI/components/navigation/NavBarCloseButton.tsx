interface NavBarCloseButtonProps {
  onClose: () => void;
}

export const NavBarCloseButton: React.FC<NavBarCloseButtonProps> = ({
  onClose,
}) => (
  <button
    aria-label="Fermer le menu"
    onClick={onClose}
    className="md:hidden absolute top-4 right-4 p-2 text-white focus:outline-none"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
