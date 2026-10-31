import { motion } from "framer-motion";
import { ResumenGeneral } from "../sections/ResumenGeneral/resumen-general";
import { AnalisisGeografico } from "../sections/AnalisisGeografico/analisis-geografico";
import { AnalisisTemporal } from "../sections/AnalisisTemporal/analisis-temporal";
import { AnalisisEventos } from "../sections/AnalisisEventos/analisis-eventos";

interface MainContentProps {
  activeSection: string;
  isSidebarCollapsed: boolean;
}

const sectionComponents = {
  resumen: ResumenGeneral,
  geografico: AnalisisGeografico,
  temporal: AnalisisTemporal,
  eventos: AnalisisEventos,
};

export function MainContent({
  activeSection,
  isSidebarCollapsed,
}: MainContentProps) {
  const SectionComponent =
    sectionComponents[activeSection as keyof typeof sectionComponents] ||
    ResumenGeneral;

  return (
    <div
      className="fixed top-0 right-0 bottom-0 transition-all duration-300 ease-in-out"
      style={{
        left: isSidebarCollapsed ? "80px" : "280px",
      }}
    >
      <div className="h-full overflow-auto bg-background">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="p-4 lg:p-5"
        >
          <div className="max-w-[1600px] mx-auto">
            <SectionComponent />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
