import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Layout } from './components/layout.tsx';
import { LandingPage } from './components/landing-page.tsx';
import { isSupabaseConfigured, getSupabaseClient } from './lib/supabase';
import { useAuthStore } from './lib/store';

// Lazy load non-critical components
const Dashboard = lazy(() => import('./components/dashboard/dashboard').then(module => ({ default: module.Dashboard })));
const PricingPage = lazy(() => import('./components/pricing-page').then(module => ({ default: module.PricingPage })));
const AboutPage = lazy(() => import('./components/about-page').then(module => ({ default: module.AboutPage })));

// Loading component with immediate feedback
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9333ea]"></div>
        <p className="text-[#9333ea] font-medium animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [currentPage, setCurrentPage] = React.useState<'home' | 'pricing' | 'about'>('home');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      toast.error(
        'Configuration Supabase manquante. Veuillez cliquer sur "Connect to Supabase" pour configurer votre projet.',
        { duration: 5000 }
      );
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(() => {
      setUser(null);
      setIsLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  const renderPage = () => {
    if (currentPage === 'home') return <LandingPage />;

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {currentPage === 'pricing' && <PricingPage />}
        {currentPage === 'about' && <AboutPage />}
      </Suspense>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {user ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      ) : (
        <Layout onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App;