import { motion } from "framer-motion";
import { useDominantColor } from "../../hooks/useDominantColor";

const DynamicBackground = ({ imageUrl }) => {
  const { r, g, b } = useDominantColor(imageUrl);

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      animate={{
        background: `radial-gradient(ellipse at top, rgba(${r}, ${g}, ${b}, 0.35), transparent 70%)`,
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
  );
};

export default DynamicBackground;