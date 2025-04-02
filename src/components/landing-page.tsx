import React, { useEffect, useState } from 'react';
import { Download, Zap, LayoutTemplate, Check } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from '../lib/utils';

export function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Show initial content immediately
    setIsLoaded(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <div className={cn(
        "text-center transform transition-all duration-300",
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block text-transparent bg-clip-text">
          Perfect CV
        </h1>
        <h2 className={cn(
          "mt-4 text-4xl font-semibold transition-all duration-300 delay-100",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <span className="text-gray-900">En </span>
          <span className="text-[#c026d3]">Quelques Minutes</span>
        </h2>
        <p className={cn(
          "mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-300 delay-200",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          Construisez un CV professionnel qui vous démarque. Notre technologie IA avancée et nos
          templates modernes vous permettent de créer un CV parfaitement adapté à votre profil et
          au poste de vos rêves.
        </p>
        <div className={cn(
          "mt-10 flex justify-center gap-6 transition-all duration-300 delay-300",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <button className="px-8 py-4 bg-[#c026d3] text-white rounded-full hover:bg-[#a21caf] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#c026d3]/25 hover:shadow-[#c026d3]/40 hover:translate-y-[-2px] transform hover:scale-105">
            Commencer Votre CV
            <span className="text-xl">→</span>
          </button>
          <button className="px-8 py-4 border-2 border-[#c026d3] text-[#c026d3] rounded-full hover:bg-[#c026d3] hover:text-white transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-[#c026d3]/25 hover:translate-y-[-2px] transform hover:scale-105">
            Améliorer mon CV
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div 
        ref={featuresRef}
        className={cn(
          "mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 transition-all duration-500",
          featuresInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
      >
        {[
          {
            icon: Zap,
            title: "Rapide & Intelligent",
            description: "Notre IA analyse votre profil et suggère les meilleures formulations pour mettre en valeur vos compétences"
          },
          {
            icon: LayoutTemplate,
            title: "Templates Premium",
            description: "Des modèles professionnels conçus par des experts en recrutement pour maximiser vos chances"
          },
          {
            icon: Check,
            title: "Optimisé ATS",
            description: "Vos CVs sont optimisés pour passer les systèmes de suivi des candidatures (ATS) avec succès"
          }
        ].map((feature, index) => (
          <div 
            key={feature.title}
            className={cn(
              "text-center group transition-all duration-300 transform",
              featuresInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              featuresInView ? `delay-[${index * 100}ms]` : ""
            )}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#c026d3]/20 to-[#9333ea]/20 rounded-3xl flex items-center justify-center mx-auto transform group-hover:rotate-6 transition-transform duration-300">
              {React.createElement(feature.icon, {
                className: "w-10 h-10 text-[#9333ea]"
              })}
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-4 text-gray-600 leading-relaxed px-4">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div 
        ref={statsRef}
        className={cn(
          "mt-24 bg-gradient-to-br from-[#9333ea] to-[#c026d3] rounded-2xl p-12 text-white transform transition-all duration-500",
          statsInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "100K+", label: "CVs Créés" },
            { value: "50+", label: "Templates" },
            { value: "95%", label: "Satisfaction" },
            { value: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "transform transition-all duration-300",
                statsInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                statsInView ? `delay-[${index * 100}ms]` : ""
              )}
            >
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div 
        ref={ctaRef}
        className={cn(
          "mt-24 text-center transform transition-all duration-500",
          ctaInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
      >
        <h2 className="text-3xl font-bold mb-6">Prêt à créer votre CV professionnel ?</h2>
        <p className="text-lg mb-8 text-gray-600">
          Rejoignez des milliers de professionnels qui ont déjà transformé leur carrière avec Perfect CV
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white rounded-full hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
          Commencer Gratuitement
        </button>
      </div>
    </div>
  );
}