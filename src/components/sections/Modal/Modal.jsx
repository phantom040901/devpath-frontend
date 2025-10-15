import { useModalContext } from "../../../contexts/ModalContext";
import { motion } from "motion/react";
import { useEffect } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function Modal() {
  const { activeModal, setActiveModal } = useModalContext();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      // Save the original overflow style
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';

      // Cleanup: restore original overflow when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeModal]);

  // Pick which modal to render
  let content = null;
  if (activeModal === "login") content = <LoginModal />;
  if (activeModal === "sign-up") content = <SignUpModal />;

  if (!content) return null;

  return (
    <motion.div
      animate={activeModal ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, visibility: "hidden" },
        visible: { opacity: 1, visibility: "visible" },
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      // outer backdrop: centers modal but allows scrolling if needed
      className="bg-primary-1300/50 fixed inset-0 z-[9999] flex items-center justify-center 
                 overflow-y-auto px-4 py-6 backdrop-blur-sm"
      onClick={(e) => e.currentTarget === e.target && setActiveModal("")}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={activeModal ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative w-full max-w-4xl rounded-2xl shadow-[0px_0px_20px_rgb(6,18,18,.10)]"
      >
        {/* 
          Outer wrapper constrains modal height.
          Inner scroll area handles content overflow. 
        */}
        <div className="max-h-[90vh] flex flex-col overflow-hidden rounded-2xl">
          <div className="flex-1 min-h-0 overflow-y-auto">
            {content}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
