import { motion } from "motion/react";
import Menu from "../../icons/Menu";
import { useMobileMenuContext } from "../../../contexts/MobileMenuContext";
import { useTheme } from "../../../contexts/ThemeContext";

function MobileMenuIcon() {
  const { mobileMenuOpened, setMobileMenuOpened } = useMobileMenuContext();
  const { theme } = useTheme();

  return (
    <motion.button
      initial="closed"
      animate={{ rotate: mobileMenuOpened ? 90 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="jusitfy-center hidden items-center hover:cursor-pointer max-lg:flex"
      onClick={() => setMobileMenuOpened(true)}
    >
      <Menu
        className={`h-7 w-7 ${theme === 'light' ? 'stroke-gray-900' : 'stroke-primary-75'}`}
        width={2}
      />
    </motion.button>
  );
}

export default MobileMenuIcon;
