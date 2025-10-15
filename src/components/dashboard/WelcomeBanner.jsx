// src/components/dashboard/WelcomeBanner.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Sparkles, TrendingUp, Rocket } from "lucide-react";

const inspirationalQuotes = [
  {
    text: "Every expert was once a beginner. Your journey starts today.",
    author: "Robin Sharma"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Your only limit is you. Start believing in yourself and create your own success story.",
    author: "Anonymous"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  }
];

export default function WelcomeBanner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkUserStatus();
  }, [user]);

  const checkUserStatus = async () => {
    try {
      const resultsRef = collection(db, "users", user.uid, "results");
      const resultsSnap = await getDocs(resultsRef);

      // User is "new" if they have no completed assessments
      setIsNewUser(resultsSnap.empty);
    } catch (err) {
      console.error("Error checking user status:", err);
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRandomQuote = () => {
    return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
  };

  const quote = getRandomQuote();
  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  if (loading) {
    return (
      <div className="relative rounded-2xl h-32 bg-gradient-to-r from-primary-1200/50 via-primary-1100/50 to-primary-1000/50 border border-white/10 backdrop-blur-sm animate-pulse" />
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-md max-sm:rounded-xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-1200 via-primary-1100 to-primary-1000 opacity-90" />
      <div className="absolute top-0 -right-24 sm:right-0 w-48 h-48 sm:w-96 sm:h-96 bg-primary-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 sm:bottom-0 sm:left-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-[80px] sm:blur-[100px]" />

      {/* Content */}
      <div className="relative p-6 md:p-8 max-sm:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 max-sm:gap-4">
          {/* Left: Avatar + Content */}
          <div className="flex items-start gap-4 flex-1 max-sm:gap-3">
            {/* Avatar with glow effect */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 max-sm:w-12 max-sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-cyan-400 text-primary-1300 font-bold shadow-lg text-xl md:text-2xl max-sm:text-base ring-2 ring-white/20">
                {initials}
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              {isNewUser ? (
                // New User Greeting with Quote
                <>
                  <div className="flex items-center gap-2 mb-2 max-sm:mb-1.5">
                    <Sparkles className="text-yellow-400 animate-pulse max-sm:w-4 max-sm:h-4" size={20} />
                    <span className="text-xs md:text-sm max-sm:text-[10px] font-semibold text-primary-300 uppercase tracking-wider">
                      Welcome to DevPath
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl max-sm:text-lg font-extrabold text-white drop-shadow-lg mb-3 max-sm:mb-2">
                    Hello, {user?.firstName || "Developer"}! 🎉
                  </h2>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 max-sm:p-3 border border-white/10">
                    <p className="text-primary-100 text-sm md:text-base max-sm:text-xs leading-relaxed max-sm:leading-relaxed italic mb-2 max-sm:mb-1.5">
                      "{quote.text}"
                    </p>
                    <p className="text-primary-300 text-xs md:text-sm max-sm:text-[10px] font-medium">
                      — {quote.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 max-sm:mt-2 text-primary-200 text-xs md:text-sm max-sm:text-[11px]">
                    <Rocket size={16} className="max-sm:w-3 max-sm:h-3 flex-shrink-0" />
                    <span>Begin your journey to discover your ideal tech career path</span>
                  </div>
                </>
              ) : (
                // Returning User Greeting
                <>
                  <div className="flex items-center gap-2 mb-2 max-sm:mb-1.5">
                    <TrendingUp className="text-emerald-400 max-sm:w-4 max-sm:h-4" size={20} />
                    <span className="text-xs md:text-sm max-sm:text-[10px] font-semibold text-primary-300 uppercase tracking-wider">
                      {getTimeBasedGreeting()}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl max-sm:text-lg font-extrabold text-white drop-shadow-lg mb-2 max-sm:mb-1.5">
                    Welcome back, {user?.firstName || "Developer"}! 👋
                  </h2>
                  <p className="text-primary-200 text-sm md:text-base max-sm:text-xs leading-relaxed max-sm:leading-relaxed">
                    Ready to continue your learning journey? Keep building your skills and tracking your progress.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-3 max-sm:mt-2">
                    <div className="flex items-center gap-2 text-primary-300 text-xs md:text-sm max-sm:text-[11px]">
                      <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Account active</span>
                    </div>
                    <div className="text-primary-400 text-xs md:text-sm max-sm:text-[10px] font-medium truncate max-w-full">
                      {user?.email}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: CTA Button (Only for new users) */}
          {isNewUser && (
            <div className="flex md:flex-none flex-shrink-0 w-full md:w-auto">
              <button
                onClick={() => navigate("/assessments")}
                className="w-full md:w-auto rounded-xl max-sm:rounded-lg bg-gradient-to-r from-primary-500 via-cyan-400 to-emerald-400 px-8 py-4 max-sm:px-6 max-sm:py-3
                         text-base md:text-lg max-sm:text-sm font-bold text-primary-1300
                         hover:scale-105 active:scale-95
                         shadow-[0_0_30px_rgba(0,255,200,0.5)] hover:shadow-[0_0_40px_rgba(0,255,200,0.7)]
                         transition-all duration-300 flex items-center justify-center gap-2 max-sm:gap-1.5"
              >
                <Sparkles size={20} className="max-sm:w-4 max-sm:h-4" />
                <span>Start Assessment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
