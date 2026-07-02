import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import Dashboard from "@/pages/dashboard";
import IncidentDetail from "@/pages/incident-detail";
import Chat from "@/pages/chat";
import Metrics from "@/pages/metrics";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="chat" element={<Chat />} />
        <Route path="metrics" element={<Metrics />} />
      </Route>
    </Routes>
  );
}

export default App;
