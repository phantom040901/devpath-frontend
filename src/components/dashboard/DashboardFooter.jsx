// src/components/dashboard/DashboardFooter.jsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Github, Users } from "lucide-react";
import ContactSupportModal from "../sections/ContactSupportModal";
import PrivacyPolicyModal from "../sections/PrivacyPolicyModal";
import TermsOfServiceModal from "../sections/TermsOfServiceModal";
import { useUserPresence } from "../../hooks/useUserPresence";
import logoImage from "../../assets/logo.png";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

const socialLinks = [
  { id: 1, name: "Facebook", icon: "facebook", url: "https://facebook.com" },
  { id: 2, name: "Twitter", icon: "twitter", url: "https://twitter.com" },
  { id: 3, name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" },
  { id: 4, name: "GitHub", icon: "github", url: "https://github.com" },
];

const dashboardFooterCols = [
  {
    id: 1,
    category: "Dashboard",
    links: [
      { text: "Overview", href: "/student-dashboard" },
      { text: "Assessments", href: "/assessments" },
      { text: "Career Matches", href: "/career-matches" },
      { text: "Learning Roadmap", href: "/career-roadmap" },
    ],
  },
  {
    id: 2,
    category: "Support",
    links: [
      { text: "Messages", href: "/student/messaging" },
      { text: "Contact Support", href: "#contact", isModal: true },
      { text: "Help Center", href: "#" },
    ],
  },
  {
    id: 3,
    category: "Legal",
    links: [
      { text: "Privacy Policy", href: "#privacy", isModal: true },
      { text: "Terms of Service", href: "#terms", isModal: true },
      { text: "Cookie Policy", href: "#privacy", isModal: true },
    ],
  },
];

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

  const content = (
    <span className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-normal hover:translate-x-1 inline-block transition-transform">
      {link.text}
    </span>
  );

  return (
    <li className="cursor-pointer">
      {link.href?.startsWith('/') ? (
        <Link to={link.href} onClick={handleClick}>
          {content}
        </Link>
      ) : (
        <a href={link.href} onClick={handleClick}>
          {content}
        </a>
      )}
    </li>
  );
}

export default function DashboardFooter() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const { onlineUsers } = useUserPresence();

  return (
    <>
      <footer className="relative overflow-hidden bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="relative m-auto max-w-[90rem] px-8 py-16 max-lg:px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 mb-12">
            {/* Left Side - Logo and Social */}
            <div>
              <Link to="/student-dashboard" className="flex items-center gap-x-3 mb-4">
                <img
                  src={logoImage}
                  alt="DevPath Logo"
                  className="h-10 w-auto"
                />
                <p className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
                  DevPath
                </p>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-6 max-w-sm">
                Discover your ideal tech career path with AI-powered assessments
                and personalized recommendations.
              </p>
              <SocialMediaLinks />
            </div>

            {/* Right Side - Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {dashboardFooterCols.map((col) => (
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

              {/* Online Users Count */}
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Users className="w-4 h-4" />
                  <span>{onlineUsers} {onlineUsers === 1 ? 'user' : 'users'} online</span>
                </span>
              </div>

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
