import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full text-white  shadow-inner">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-2">
        <p className="text-sm text-gray-300 font-medium text-center">
          ⌨️ Press <span className="font-bold text-white">Tab</span> to restart the test
        </p>

        <a
          href="https://github.com/praveen5665/typerush"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#61dafb] hover:text-white transition-colors"
          aria-label="View project on GitHub"
        >
          <FaGithub className="text-xl" />
          <span className="font-semibold text-sm">View on GitHub</span>
        </a>
        <span className="text-sm text-gray-400  text-center">
          © {new Date().getFullYear()} TypeRush — Built by Praveen
        </span>
      </div>
    </footer>
  );
};

export default Footer;
