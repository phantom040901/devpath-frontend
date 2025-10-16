import { motion, AnimatePresence } from "motion/react";
import Close from "../../icons/Close";
import { navigationLinks } from "../../../utils/content";
import { Moon, Sun } from "lucide-react";

import { useModalContext } from "../../../contexts/ModalContext";
import { useMobileMenuContext } from "../../../contexts/MobileMenuContext";
import { useTheme } from "../../../contexts/ThemeContext";

function MobileMenu() {
  const { setActiveModal } = useModalContext();
  const { mobileMenuOpened, setMobileMenuOpened } = useMobileMenuContext();
  const { theme, toggleTheme } = useTheme();

  function handleLogin() {
    setActiveModal("login");
    setMobileMenuOpened(false); // close menu after opening modal
  }

  function handleGetStarted() {
    setActiveModal("sign-up");
    setMobileMenuOpened(false); // close menu after opening modal
  }

  // Don't render anything if menu is closed
  if (!mobileMenuOpened) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-primary-1300/50 fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-end px-6 py-6 pl-28 backdrop-blur-sm"
      >
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="bg-primary-1400 flex basis-80 flex-col justify-between rounded-2xl bg-[url('../src/assets/Noise.webp')] bg-repeat px-6 py-8"
        >
        <div>
          {/* Close button and Theme Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              className="group transition-properties w-fit cursor-pointer rounded-2xl p-3"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: theme === 'light' ? '#06b6d4' : '#ecfcfd'
              }}
              onMouseEnter={(e) => {
                if (theme === 'light') {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                } else {
                  e.currentTarget.style.backgroundColor = '#ecfcfd';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setMobileMenuOpened(false)}
            >
              <Close
                className={`transition-properties h-4 w-4 ${theme === 'light' ? 'stroke-cyan-500 group-hover:stroke-white' : 'stroke-primary-75 group-hover:stroke-primary-1300'}`}
                width={2}
              />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-primary-1200/50 hover:bg-primary-1200 transition-all duration-200 border border-transparent hover:border-primary-500/30"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-primary-400" />
              ) : (
                <Moon size={20} className="text-primary-400" />
              )}
            </button>
          </div>

          {/* Navigation links */}
          <ul className="mt-16 flex flex-col gap-y-6">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-primary-50 hover:text-primary-500 transition-properties text-lg/8"
                >
                  {link.link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth buttons */}
        <div className="flex flex-col gap-y-3">
          <button
            onClick={handleLogin}
            className="transition-all duration-200 box-border cursor-pointer rounded-full px-6 py-3 text-base/loose font-semibold"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: theme === 'light' ? '#000000' : '#ecfcfd',
              color: theme === 'light' ? '#000000' : '#ecfcfd',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              } else {
                e.currentTarget.style.backgroundColor = '#ecfcfd';
                e.currentTarget.style.color = '#0e2e2e';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              if (theme === 'light') {
                e.currentTarget.style.color = '#000000';
              } else {
                e.currentTarget.style.color = '#ecfcfd';
              }
            }}
          >
            Login
          </button>

          <button
            onClick={handleGetStarted}
            className="transition-all duration-200 cursor-pointer rounded-full px-6 py-3 text-base/loose font-semibold primary-glow"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#06b6d4',
              backgroundColor: '#06b6d4',
              color: theme === 'light' ? '#ffffff' : '#0e2e2e'
            }}
            onMouseEnter={(e) => {
              if (theme === 'light') {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.borderColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              } else {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#06b6d4';
              e.currentTarget.style.borderColor = '#06b6d4';
              if (theme === 'light') {
                e.currentTarget.style.color = '#ffffff';
              } else {
                e.currentTarget.style.color = '#0e2e2e';
              }
            }}
          >
            Get Started
          </button>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MobileMenu;
