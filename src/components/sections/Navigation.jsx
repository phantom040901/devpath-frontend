import { useEffect, useState } from "react";
import Logo from "../icons/Logo";
import MobileMenuIcon from "./MobileMenu/MobileMenuIcon";
import { navigationLinks } from "../../utils/content";
import { useModalContext } from "../../contexts/ModalContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import logoImage from "../../assets/logo.png";

export default function Navigation() {
  const { setActiveModal } = useModalContext();
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md dark:bg-transparent light:bg-white/95 transition-all duration-300 dark:border-transparent light:border-b light:border-gray-200"
      style={{
        boxShadow: scrollY > 10 ? "0 8px 25px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* Inner container for content */}
      <div className="m-auto flex max-w-[90rem] justify-between px-24 py-3 dark:text-primary-50 light:text-gray-900 text-lg/8 font-light max-xl:px-16 max-xl:text-base/loose max-lg:px-8 max-md:px-6">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-x-4 max-xl:gap-x-3 max-md:gap-x-2 group"
          onClick={(e) => handleSmoothScroll(e, "#hero")}
        >
          <div className="relative">
            <img
              src={logoImage}
              alt="DevPath Logo"
              className="h-16 max-md:h-12 transition-all duration-300 group-hover:scale-110 relative z-10"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 16px rgba(6, 182, 212, 0.4)) brightness(1.2)',
              }}
            />
            <div 
              className="absolute inset-0 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(14, 116, 144, 0.6) 50%, transparent 70%)',
              }}
            />
          </div>
          <p className="text-2xl font-bold tracking-tight max-xl:text-xl max-md:text-lg/8 max-md:tracking-tighter bg-gradient-to-r from-cyan-300 via-primary-500 to-cyan-400 bg-clip-text text-transparent group-hover:from-primary-400 group-hover:via-cyan-300 group-hover:to-primary-500 transition-all duration-300"
             style={{
               textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
             }}>
            DevPath
          </p>
        </a>

        {/* Navigation Links */}
        <ul className="flex items-center gap-x-8 max-xl:gap-x-6 max-lg:hidden">
          {navigationLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className="dark:text-gray-200 light:text-black transition-colors duration-200 font-medium"
                style={{
                  color: theme === 'light' ? '#000000' : undefined
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.setProperty('color', '#06b6d4', 'important'); // cyan-500
                }}
                onMouseLeave={(e) => {
                  if (theme === 'light') {
                    e.currentTarget.style.setProperty('color', '#000000', 'important');
                  } else {
                    e.currentTarget.style.removeProperty('color');
                  }
                }}
                onClick={(e) => handleSmoothScroll(e, link.href)}
              >
                {link.link}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-x-3 max-lg:hidden">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full dark:bg-primary-1200/50 light:bg-gray-100 dark:hover:bg-primary-1200 light:hover:bg-gray-200 transition-all duration-200 border border-transparent dark:hover:border-primary-500/30 light:hover:border-primary-500/30"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="dark:text-primary-400 light:text-primary-600" />
            ) : (
              <Moon size={20} className="dark:text-primary-400 light:text-primary-600" />
            )}
          </button>

          {/* Login Button */}
          <button
            style={{
              borderColor: theme === 'light' ? '#111827' : undefined,
              color: theme === 'light' ? '#111827' : undefined,
            }}
            className="border-2 rounded-full px-8 py-3.5 text-lg/8 font-normal max-xl:px-6 max-xl:py-3 max-xl:text-base/loose box-border cursor-pointer transition-all duration-200
                       dark:border-primary-50 dark:text-primary-50 dark:hover:bg-primary-50 dark:hover:text-primary-1300"
            onMouseEnter={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.setProperty('background-color', '#111827', 'important');
                e.currentTarget.style.setProperty('color', '#ffffff', 'important');
              } else {
                e.currentTarget.style.setProperty('background-color', '#ffffff', 'important');
                e.currentTarget.style.setProperty('color', '#111827', 'important');
              }
            }}
            onMouseLeave={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.setProperty('background-color', 'transparent', 'important');
                e.currentTarget.style.setProperty('color', '#111827', 'important');
              } else {
                e.currentTarget.style.setProperty('background-color', 'transparent', 'important');
                e.currentTarget.style.setProperty('color', '#ecfcfd', 'important');
              }
            }}
            onClick={() => setActiveModal("login")}
          >
            Login
          </button>

          {/* Signup Button */}
          <button
            className="bg-primary-500 border-primary-500 dark:text-primary-1300 light:text-white primary-glow primary-glow-hover transition-all duration-200 cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg/8 font-normal max-xl:px-6 max-xl:py-3 max-xl:text-base/loose"
            onMouseEnter={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.setProperty('background-color', '#111827', 'important');
                e.currentTarget.style.setProperty('border-color', '#111827', 'important');
                e.currentTarget.style.setProperty('color', '#ffffff', 'important');
              } else {
                e.currentTarget.style.setProperty('background-color', '#ffffff', 'important');
                e.currentTarget.style.setProperty('border-color', '#ffffff', 'important');
                e.currentTarget.style.setProperty('color', '#111827', 'important');
              }
            }}
            onMouseLeave={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.setProperty('background-color', '#44e5e7', 'important');
                e.currentTarget.style.setProperty('border-color', '#44e5e7', 'important');
                e.currentTarget.style.setProperty('color', '#ffffff', 'important');
              } else {
                e.currentTarget.style.setProperty('background-color', '#44e5e7', 'important');
                e.currentTarget.style.setProperty('border-color', '#44e5e7', 'important');
                e.currentTarget.style.setProperty('color', '#0e2e2e', 'important');
              }
            }}
            onClick={() => setActiveModal("sign-up")}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenuIcon />
      </div>
    </nav>
  );
}