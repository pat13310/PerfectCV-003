import React from 'react';
import { BarChart3, Users, FileText, Settings, Mail, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'cvs', label: 'Mes CVs', icon: FileText },
    { id: 'letters', label: 'Mes lettres', icon: Mail },
    { id: 'profile', label: 'Profil', icon: Users },
    { id: 'subscription', label: 'Abonnement', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="sticky top-0 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex items-center w-full px-4 py-2.5 rounded-lg transition-colors",
                currentPage === item.id
                  ? "text-[#9333ea] bg-[#9333ea]/10"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}