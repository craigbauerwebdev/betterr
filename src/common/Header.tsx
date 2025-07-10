import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 text-white p-4 shadow-md bg-gray-800 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-blue-500 text-2xl font-bold">Betterr</h1>
        <div className="md:hidden">
          <div
            onClick={toggleMenu}
            className="text-blue-500 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link
                to="/"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/breath-trainer"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Breath trainer
              </Link>
            </li>
            <li>
              <Link
                to="/daily-habbits"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Daily Habits
              </Link>
            </li>
            <li>
              <Link
                to="/relax"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Relax
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 bg-gray-800 z-50 md:hidden transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-end">
            <div
              onClick={toggleMenu}
              className="text-blue-500 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-2xl text-blue-500 hover:text-blue-400 block"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/breath-trainer"
                  className="text-2xl text-blue-500 hover:text-blue-400 block"
                  onClick={toggleMenu}
                >
                  Breath trainer
                </Link>
              </li>
              <li>
                <Link
                  to="/daily-habbits"
                  className="text-2xl text-blue-500 hover:text-blue-400 block"
                  onClick={toggleMenu}
                >
                  Daily Habits
                </Link>
              </li>
              <li>
                <Link
                  to="/relax"
                  className="text-2xl text-blue-500 hover:text-blue-400 block"
                  onClick={toggleMenu}
                >
                  Relax
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
