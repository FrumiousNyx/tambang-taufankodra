import IndexPage from '@/pages/Index';
import AboutPage from '@/pages/About';
import AdminPage from '@/pages/Admin';
import AuthPage from '@/pages/Auth';
import CMSPage from '@/pages/CMS';
import CSRPage from '@/pages/CSR';
import ContactPage from '@/pages/Contact';
import DashboardPage from '@/pages/Dashboard';
import DownloadPage from '@/pages/Download';
import InvestorRelationsPage from '@/pages/InvestorRelations';
import NotFoundPage from '@/pages/NotFound';
import ProductsPage from '@/pages/Products';
import ProjectsPage from '@/pages/Projects';
import SustainabilityPage from '@/pages/Sustainability';
import CMSContentPage from '@/pages/CMSPage';

export default function CatchAllPage({ params }: { params: { segments?: string[] } }) {
  const segments = params.segments || [];
  const [first, second] = segments;

  if (!first) return <IndexPage />;

  if (first === 'produk') {
    return <ProductsPage slug={second} />;
  }

  if (first === 'proyek') {
    return <ProjectsPage slug={second} />;
  }

  if (first === 'download') return <DownloadPage />;
  if (first === 'tentang') return <AboutPage />;
  if (first === 'kontak') return <ContactPage />;
  if (first === 'auth') return <AuthPage />;
  if (first === 'keberlanjutan') return <SustainabilityPage />;
  if (first === 'investor') return <InvestorRelationsPage />;
  if (first === 'csr') return <CSRPage />;
  if (first === 'dashboard') return <DashboardPage />;
  if (first === 'admin') return <AdminPage />;
  if (first === 'cms') return <CMSPage />;

  if (first === 'p' && second) {
    return <CMSContentPage slug={second} />;
  }

  return <NotFoundPage />;
}
