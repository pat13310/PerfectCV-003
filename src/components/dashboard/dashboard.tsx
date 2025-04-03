import React, { Suspense, lazy } from 'react';
import { BarChart3, Users, FileText, Settings } from 'lucide-react';
import { SharedLayout } from '../shared-layout';
import { Sidebar } from './sidebar';
import { DashboardSkeleton } from './skeletons/dashboard-skeleton';

// Lazy load dashboard pages
const CVsPage = lazy(() => import('./pages/cvs-page').then(module => ({ default: module.CVsPage })));
const LettersPage = lazy(() => import('./pages/letters-page').then(module => ({ default: module.LettersPage })));
const ProfilePage = lazy(() => import('./pages/profile-page').then(module => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/settings-page').then(module => ({ default: module.SettingsPage })));
const SubscriptionPage = lazy(() =>
  import("./pages/subscription-page").then((module) => ({
    default: module.SubscriptionPage,
  }))
);


export function Dashboard() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'cvs':
        return (
          <Suspense fallback={<DashboardSkeleton type="cvs" />}>
            <CVsPage />
          </Suspense>
        );
      case 'letters':
        return (
          <Suspense fallback={<DashboardSkeleton type="letters" />}>
            <LettersPage />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<DashboardSkeleton type="profile" />}>
            <ProfilePage />
          </Suspense>
        );
      case 'subscription':
        return (
          <Suspense fallback={<DashboardSkeleton type="subscription" />}>
            <SubscriptionPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<DashboardSkeleton type="settings" />}>
            <SettingsPage />
          </Suspense>
        );
      default:
        return (
          <div className={`max-w-7xl mx-auto transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h2>
            <DashboardStats />
            <RecentCVs />
          </div>
        );
    }
  };

  return (
    <SharedLayout>
      <div className="flex min-h-screen">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
          {renderPage()}
        </main>
      </div>
    </SharedLayout>
  );
}

// Dashboard stats component
const DashboardStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[
      { icon: FileText, title: "CVs créés", value: "3", color: "bg-[#9333ea]/10" },
      { icon: Users, title: "Vues totales", value: "127", color: "bg-[#9333ea]/10" },
      { icon: BarChart3, title: "Téléchargements", value: "45", color: "bg-[#9333ea]/10" },
      { icon: Settings, title: "Score moyen", value: "8.7", color: "bg-[#9333ea]/10" }
    ].map((stat, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom duration-500"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <div className={`p-2 rounded-lg ${stat.color}`}>
            <stat.icon className="w-5 h-5 text-[#9333ea]" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
      </div>
    ))}
  </div>
);

// Recent CVs component
const RecentCVs = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: '400ms' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">CVs récents</h3>
    <div className="space-y-4">
      {[
        { name: 'CV Développeur Full-Stack', date: '2025-03-29', views: 45 },
        { name: 'CV Product Manager', date: '2025-03-28', views: 32 },
        { name: 'CV Designer UI/UX', date: '2025-03-27', views: 50 },
      ].map((cv, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-bottom duration-500"
          style={{ animationDelay: `${500 + (index * 100)}ms` }}
        >
          <div>
            <h4 className="font-medium text-gray-900">{cv.name}</h4>
            <p className="text-sm text-gray-500">Créé le {cv.date}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{cv.views} vues</span>
            <button className="px-3 py-1 text-sm text-[#9333ea] hover:bg-[#9333ea]/10 rounded-lg transition-colors">
              Modifier
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);