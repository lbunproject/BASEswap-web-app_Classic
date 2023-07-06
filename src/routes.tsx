import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import PairPage from "./pages/Dashboard/Pair"
import Swap from "./pages/Swap"
import Affiliate from "./pages/Dashboard/gen_aff"
import UnstakeStatus from "./pages/Dashboard/UnstakeStatus"

export default () => (
  <Routes>
    <Route index element={<Dashboard />} />
    <Route path="/swap" element={<Swap />} />
    <Route path="/affiliate" element={<Affiliate />} />
    <Route path="/unstakestatus" element={<UnstakeStatus />} />
    <Route path="/pairs/:address" element={<PairPage />} />
    <Route path="/migration" element={<Swap />} />
    <Route path="*" element={<Navigate to="/swap" replace />} />
  </Routes>
)
