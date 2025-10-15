import { useEffect, useState } from "react";
import Logo from "../icons/Logo";
import MobileMenuIcon from "./MobileMenu/MobileMenuIcon";
import { navigationLinks } from "../../utils/content";
import { useModalContext } from "../../contexts/ModalContext";
import logoImage from "../../assets/logo.png";

export default function Navigation() {
  const { setActiveModal } = useModalContext();
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
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-transparent transition-shadow duration-300"
      style={{
        boxShadow: scrollY > 10 ? "0 8px 25px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* Inner container for content */}
      <div className="m-auto flex max-w-[90rem] justify-between px-24 py-3 text-primary-50 text-lg/8 font-light max-xl:px-16 max-xl:text-base/loose max-lg:px-8 max-md:px-6">
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
                className="hover:text-primary-500 transition-properties"
                onClick={(e) => handleSmoothScroll(e, link.href)}
              >
                {link.link}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-x-3 max-lg:hidden">
          {/* Login Button */}
          <button
            className="border-primary-50 transition-properties hover:bg-primary-50 hover:text-primary-1300 box-border cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg/8 font-normal max-xl:px-6 max-xl:py-3 max-xl:text-base/loose"
            onClick={() => setActiveModal("login")}
          >
            Login
          </button>

          {/* Signup Button */}
          <button
            className="bg-primary-500 border-primary-500 text-primary-1300 primary-glow hover:border-primary-50 hover:bg-primary-50 primary-glow-hover transition-properties cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg/8 font-normal max-xl:px-6 max-xl:py-3 max-xl:text-base/loose"
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