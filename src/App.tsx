import { useState } from "react";
import { Sidebar } from "./components/layout/sidebar";
import { MainContent } from "./components/layout/main-content";
import { NotificacionHost } from "./components/ui/notificacion";

function App() {
  const [activeSection, setActiveSection] = useState("resumen");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-full overflow-hidden bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onToggleCollapse={setIsSidebarCollapsed}
      />
      <MainContent
        activeSection={activeSection}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <NotificacionHost />
    </div>
  );
}

export default App;
