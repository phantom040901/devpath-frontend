import { footerCols } from "../../utils/content";
import Logo from "../icons/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef } from "react";

function FooterColumn({ col, theme }) {
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      if (theme === 'light') {
        titleRef.current.style.setProperty('color', '#000000', 'important');
      } else {
        titleRef.current.style.setProperty('color', '#ffffff', 'important');
      }
    }
    if (containerRef.current) {
      const allElements = containerRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        if (theme === 'light') {
          if (!el.hasAttribute('data-logo')) {
            el.style.setProperty('color', '#374151', 'important');
          }
        } else {
          if (!el.hasAttribute('data-logo')) {
            el.style.setProperty('color', '#f3f4f6', 'important');
          }
        }
      });
    }
  }, [theme]);

  return (
    <div ref={containerRef}>
      <p ref={titleRef} className="dark:text-white light:text-black mb-8 text-xl/loose font-semibold max-md:text-lg/8 max-md:tracking-tight">
        {col.category}
      </p>
      <ul className="flex flex-col gap-y-4">
        {col.links.map((link, i) => (
          <FooterLink key={i} link={link} theme={theme} />
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ link, theme }) {
  const linkRef = useRef(null);

  useEffect(() => {
    if (linkRef.current) {
      if (theme === 'light') {
        linkRef.current.style.setProperty('color', '#4b5563', 'important');
      } else {
        linkRef.current.style.setProperty('color', '#f3f4f6', 'important');
      }
    }
  }, [theme]);

  return (
    <li className="cursor-pointer">
      <a
        ref={linkRef}
        className="dark:text-gray-100 light:text-gray-600 dark:hover:text-cyan-400 light:hover:text-primary-600 transition-properties text-lg/8 font-light max-xl:text-base/loose"
        href="#"
      >
        {link}
      </a>
    </li>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  const logoTextRef = useRef(null);
  const logoContainerRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (logoTextRef.current) {
      if (theme === 'light') {
        logoTextRef.current.style.setProperty('color', '#000000', 'important');
      } else {
        logoTextRef.current.style.setProperty('color', '#ffffff', 'important');
      }
    }
    if (logoContainerRef.current) {
      const logoText = logoContainerRef.current.querySelector('p');
      if (logoText) {
        logoText.setAttribute('data-logo', 'true');
      }
    }

    // Force footer background color to match FAQ section
    if (footerRef.current) {
      if (theme === 'light') {
        // Match FAQ light background (gray-50)
        footerRef.current.style.setProperty('background-color', '#f9fafb', 'important');
      } else {
        // Match FAQ dark background - continue from black
        footerRef.current.style.setProperty('background-color', '#000000', 'important');
      }

      // Hide the gradient overlay div to blend seamlessly with FAQ
      const gradientDiv = footerRef.current.querySelector('.absolute.inset-0');
      if (gradientDiv) {
        gradientDiv.style.setProperty('display', 'none', 'important');
      }

      // Force all text in footer to be visible
      const allTextElements = footerRef.current.querySelectorAll('p, a, li, span, div');
      allTextElements.forEach(el => {
        if (theme === 'light') {
          el.style.setProperty('color', '#1f2937', 'important');
        } else {
          el.style.setProperty('color', '#f9fafb', 'important');
        }
      });

      // Override for logo text specifically
      if (logoTextRef.current) {
        if (theme === 'light') {
          logoTextRef.current.style.setProperty('color', '#000000', 'important');
        } else {
          logoTextRef.current.style.setProperty('color', '#ffffff', 'important');
        }
      }
    }
  }, [theme]);

  return (
    <footer ref={footerRef} className="relative overflow-hidden dark:bg-primary-1500 light:bg-gray-100">
      {/* Smooth gradient blend from FAQ */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-black dark:to-primary-1500 light:bg-gray-100" />

      <div className="relative m-auto flex max-w-[90rem] justify-between px-24 py-32 max-xl:px-16 max-xl:py-24 max-lg:grid max-lg:gap-y-18 max-lg:px-8 max-md:px-6 max-sm:pb-16">
        <div ref={logoContainerRef}>
          <a className="flex items-center gap-x-3 max-md:gap-x-2" href="#">
            <Logo
              className="stroke-primary-500 h-6"
              alt="NoteFlow Logo Icon"
              width={5}
            />
            <p ref={logoTextRef} data-logo="true" className="dark:text-white light:text-black text-xl font-bold tracking-tight max-md:text-lg/8 max-md:tracking-tighter">
              DevPath
            </p>
          </a>
        </div>
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-24 max-xl:gap-x-18 max-lg:gap-x-24 max-md:grid-cols-2 max-md:gap-y-14">
          {footerCols.map((col) => (
            <FooterColumn key={col.id} col={col} theme={theme} />
          ))}
        </div>
      </div>
    </footer>
  );
}
