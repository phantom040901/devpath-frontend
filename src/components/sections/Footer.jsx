import { useState } from "react";
import { footerCols, socialLinks } from "../../utils/content";
import { useTheme } from "../../contexts/ThemeContext";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import ContactSupportModal from "./ContactSupportModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";
import logoImage from "../../assets/logo.png";

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
            className="w-11 h-11 rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-primary-600 dark:hover:bg-primary-600 hover:scale-110 flex items-center justify-center transition-all duration-300 group shadow-md hover:shadow-xl"
            aria-label={social.name}
          >
            <Icon className="w-5 h-5 text-white dark:text-gray-400 group-hover:text-white transition-colors" />
          </a>
        );
      })}
    </div>
  );
}

function FooterColumn({ col, onContactClick, onPrivacyClick, onTermsClick }) {
  return (
    <div>
      <p className="text-gray-900 dark:text-white mb-6 text-lg font-semibold">
        {col.category}
      </p>
      <ul className="flex flex-col gap-y-3">
        {col.links.map((link, i) => (
          <FooterLink
            key={i}
            link={link}
            onContactClick={onContactClick}
            onPrivacyClick={onPrivacyClick}
            onTermsClick={onTermsClick}
          />
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ link, onContactClick, onPrivacyClick, onTermsClick }) {
  const handleClick = (e) => {
    if (link.isModal) {
      e.preventDefault();
      if (link.text === "Contact Support") {
        onContactClick();
      } else if (link.text === "Privacy Policy") {
        onPrivacyClick();
      } else if (link.text === "Terms of Service") {
        onTermsClick();
      }
    }
  };

  return (
    <li className="cursor-pointer">
      <a
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-normal hover:translate-x-1 inline-block transition-transform"
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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative overflow-hidden bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="relative m-auto max-w-[90rem] px-8 py-16 max-lg:px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 mb-12">
            {/* Left Side - Logo and Social */}
            <div>
              <a className="flex items-center gap-x-3 mb-4" href="/">
                <img
                  src={logoImage}
                  alt="DevPath Logo"
                  className="h-10 w-auto"
                />
                <p className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
                  DevPath
                </p>
              </a>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-6 max-w-sm">
                Discover your ideal tech career path with AI-powered assessments
                and personalized recommendations.
              </p>
              <SocialMediaLinks />
            </div>

            {/* Right Side - Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {footerCols.map((col) => (
                <FooterColumn
                  key={col.id}
                  col={col}
                  onContactClick={() => setIsContactModalOpen(true)}
                  onPrivacyClick={() => setIsPrivacyModalOpen(true)}
                  onTermsClick={() => setIsTermsModalOpen(true)}
                />
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                © {new Date().getFullYear()} DevPath. All rights reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Made with ❤️ for aspiring developers
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
}
