// src/components/dashboard/DashboardFooter.jsx
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Heart,
  ExternalLink
} from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/70 border-t border-gray-800/50 backdrop-blur-sm mt-auto w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary-400">Dev</span>Path
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered career guidance platform helping students discover their ideal tech career path through personalized assessments and roadmaps.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/student-dashboard" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1 group"
                >
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/assessments" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1 group"
                >
                  <span>Assessments</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/career-roadmap" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1 group"
                >
                  <span>Learning Roadmap</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/career-matches" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1 group"
                >
                  <span>Career Matches</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/student/progress" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1 group"
                >
                  <span>Progress</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                >
                  Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact & Legal</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a 
                  href="mailto:support@devpath.com" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  <span>support@devpath.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2"
                >
                  <Phone size={14} />
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} DevPath. All rights reserved.
            </p>
            
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={14} className="text-red-400 fill-red-400" />
              <span>for aspiring tech professionals</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}