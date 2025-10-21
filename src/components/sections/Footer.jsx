import { useState } from "react";
import { footerCols, socialLinks } from "../../utils/content";
import Logo from "../icons/Logo";
import { useTheme } from "../../contexts/ThemeContext";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import ContactSupportModal from "./ContactSupportModal";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

function SocialMediaLinks() {
  return (
    <div className="flex gap-4 mt-6">
      {socialLinks.map((social) => {
        const Icon = socialIcons[social.icon];
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group"
            aria-label={social.name}
          >
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
          </a>
        );
      })}
    </div>
  );
}

function FooterColumn({ col, onContactClick }) {
  return (
    <div>
      <p className="dark:text-white light:text-black mb-6 text-lg font-semibold">
        {col.category}
      </p>
      <ul className="flex flex-col gap-y-3">
        {col.links.map((link, i) => (
          <FooterLink
            key={i}
            link={link}
            onContactClick={onContactClick}
          />
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ link, onContactClick }) {
  const handleClick = (e) => {
    if (link.isModal) {
      e.preventDefault();
      onContactClick();
    }
  };

  return (
    <li className="cursor-pointer">
      <a
        className="dark:text-gray-400 light:text-gray-600 dark:hover:text-blue-400 light:hover:text-blue-600 transition-colors text-base font-normal hover:translate-x-1 inline-block transition-transform"
        href={link.href}
        onClick={handleClick}
      >
        {link.text}
      </a>
    </li>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <footer className="relative overflow-hidden dark:bg-black light:bg-gray-50 border-t dark:border-gray-800 light:border-gray-200">
        <div className="relative m-auto max-w-[90rem] px-8 py-16 max-lg:px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 mb-12">
            {/* Left Side - Logo and Social */}
            <div>
              <a className="flex items-center gap-x-3 mb-4" href="/">
                <Logo
                  className="stroke-primary-500 h-7"
                  alt="DevPath Logo Icon"
                  width={5}
                />
                <p className="dark:text-white light:text-black text-2xl font-bold tracking-tight">
                  DevPath
                </p>
              </a>
              <p className="dark:text-gray-400 light:text-gray-600 text-base mb-6 max-w-sm">
                Discover your ideal tech career path with AI-powered assessments
                and personalized recommendations.
              </p>
              <SocialMediaLinks />
            </div>

            {/* Right Side - Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerCols.map((col) => (
                <FooterColumn
                  key={col.id}
                  col={col}
                  onContactClick={() => setIsContactModalOpen(true)}
                />
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t dark:border-gray-800 light:border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="dark:text-gray-500 light:text-gray-600 text-sm">
                © {new Date().getFullYear()} DevPath. All rights reserved.
              </p>
              <p className="dark:text-gray-500 light:text-gray-600 text-sm">
                Made with ❤️ for aspiring developers
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
