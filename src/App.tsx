import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Labs from '@/pages/Labs';
import LabDetail from '@/pages/LabDetail';
import XssLab from '@/pages/labs/XssLab';
import SqliLab from '@/pages/labs/SqliLab';
import LfiLab from '@/pages/labs/LfiLab';
import RceLab from '@/pages/labs/RceLab';
import SstiLab from '@/pages/labs/SstiLab';
import SsrfLab from '@/pages/labs/SsrfLab';
import AuthBypassLab from '@/pages/labs/AuthBypassLab';
import IdorLab from '@/pages/labs/IdorLab';
import XxeLab from '@/pages/labs/XxeLab';
import CsrfLab from '@/pages/labs/CsrfLab';
import OpenRedirectLab from '@/pages/labs/OpenRedirectLab';
import FileUploadLab from '@/pages/labs/FileUploadLab';
import NosqlLab from '@/pages/labs/NosqlLab';
import GraphqlLab from '@/pages/labs/GraphqlLab';
import ApiSecurityLab from '@/pages/labs/ApiSecurityLab';
import JwtLab from '@/pages/labs/JwtLab';
import CommandInjectionLab from '@/pages/labs/CommandInjectionLab';
import PathTraversalLab from '@/pages/labs/PathTraversalLab';
import XmlInjectionLab from '@/pages/labs/XmlInjectionLab';
import HtmlInjectionLab from '@/pages/labs/HtmlInjectionLab';
import DeserializationLab from '@/pages/labs/DeserializationLab';
import RaceConditionLab from '@/pages/labs/RaceConditionLab';
import MassAssignmentLab from '@/pages/labs/MassAssignmentLab';
import ClickjackingLab from '@/pages/labs/ClickjackingLab';
import CspBypassLab from '@/pages/labs/CspBypassLab';
import WafBypassLab from '@/pages/labs/WafBypassLab';
import ZeroDayLab from '@/pages/labs/ZeroDayLab';
import AdvancedPersistenceLab from '@/pages/labs/AdvancedPersistenceLab';
import ChainExploitLab from '@/pages/labs/ChainExploitLab';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white font-rajdhani">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:labId" element={<LabDetail />} />
            <Route path="/labs/xss" element={<XssLab />} />
            <Route path="/labs/sqli" element={<SqliLab />} />
            <Route path="/labs/lfi" element={<LfiLab />} />
            <Route path="/labs/rce" element={<RceLab />} />
            <Route path="/labs/ssti" element={<SstiLab />} />
            <Route path="/labs/ssrf" element={<SsrfLab />} />
            <Route path="/labs/auth-bypass" element={<AuthBypassLab />} />
            <Route path="/labs/idor" element={<IdorLab />} />
            <Route path="/labs/xxe" element={<XxeLab />} />
            <Route path="/labs/csrf" element={<CsrfLab />} />
            <Route path="/labs/open-redirect" element={<OpenRedirectLab />} />
            <Route path="/labs/file-upload" element={<FileUploadLab />} />
            <Route path="/labs/nosql" element={<NosqlLab />} />
            <Route path="/labs/graphql" element={<GraphqlLab />} />
            <Route path="/labs/api-security" element={<ApiSecurityLab />} />
            <Route path="/labs/jwt" element={<JwtLab />} />
            <Route path="/labs/command-injection" element={<CommandInjectionLab />} />
            <Route path="/labs/path-traversal" element={<PathTraversalLab />} />
            <Route path="/labs/xml-injection" element={<XmlInjectionLab />} />
            <Route path="/labs/html-injection" element={<HtmlInjectionLab />} />
            <Route path="/labs/deserialization" element={<DeserializationLab />} />
            <Route path="/labs/race-condition" element={<RaceConditionLab />} />
            <Route path="/labs/mass-assignment" element={<MassAssignmentLab />} />
            <Route path="/labs/clickjacking" element={<ClickjackingLab />} />
            <Route path="/labs/csp-bypass" element={<CspBypassLab />} />
            <Route path="/labs/waf-bypass" element={<WafBypassLab />} />
            <Route path="/labs/zero-day" element={<ZeroDayLab />} />
            <Route path="/labs/advanced-persistence" element={<AdvancedPersistenceLab />} />
            <Route path="/labs/chain-exploit" element={<ChainExploitLab />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
