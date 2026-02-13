import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';

const projects = [
  {
    id: 1,
    slug: 'tol-trans-jawa',
    title: 'Jalan Tol Trans Jawa',
    titleEn: 'Trans Java Toll Road',
    client: 'Kementerian PUPR',
    clientEn: 'Ministry of Public Works',
    location: 'Jawa Tengah - Jawa Timur',
    locationEn: 'Central Java - East Java',
    volume: '850,000 Ton',
    scope: 'Konstruksi jalan tol sepanjang 300 km',
    scopeEn: '300 km toll road construction',
    image: '/images/projects/Trans Java Toll Road.png',
    year: 2023,
  },
  {
    id: 2,
    slug: 'pelabuhan-patimban',
    title: 'Pelabuhan Patimban',
    titleEn: 'Patimban Port',
    client: 'Pelindo',
    clientEn: 'Pelindo',
    location: 'Subang, Jawa Barat',
    locationEn: 'Subang, West Java',
    volume: '420,000 Ton',
    scope: 'Pembangunan dermaga dan terminal',
    scopeEn: 'Pier and terminal construction',
    image: '/images/projects/Patimban Port.png',
    year: 2024,
  },
  {
    id: 3,
    slug: 'kawasan-industri-kendal',
    title: 'Kawasan Industri Kendal',
    titleEn: 'Kendal Industrial Park',
    client: 'PT Kawasan Industri Jababeka',
    clientEn: 'PT Kawasan Industri Jababeka',
    location: 'Kendal, Jawa Tengah',
    locationEn: 'Kendal, Central Java',
    volume: '320,000 Ton',
    scope: 'Infrastruktur kawasan industri',
    scopeEn: 'Industrial park infrastructure',
    image: '/images/projects/Kendal Insdustri Park.png',
    year: 2024,
  },
  {
    id: 4,
    slug: 'bandara-kertajati',
    title: 'Bandara Internasional Kertajati',
    titleEn: 'Kertajati International Airport',
    client: 'PT Angkasa Pura II',
    clientEn: 'PT Angkasa Pura II',
    location: 'Majalengka, Jawa Barat',
    locationEn: 'Majalengka, West Java',
    volume: '280,000 Ton',
    scope: 'Pembangunan runway dan terminal',
    scopeEn: 'Runway and terminal construction',
    image: '/images/projects/Kertajati International Airport.png',
    year: 2023,
  },
  {
    id: 5,
    slug: 'pltu-cirebon',
    title: 'PLTU Cirebon Unit 2',
    titleEn: 'Cirebon Power Plant Unit 2',
    client: 'PT PLN (Persero)',
    clientEn: 'PT PLN (Persero)',
    location: 'Cirebon, Jawa Barat',
    locationEn: 'Cirebon, West Java',
    volume: '180,000 Ton',
    scope: 'Pembangunan pembangkit listrik',
    scopeEn: 'Power plant construction',
    image: '/images/projects/Cirebon Power Plant Unit 2.png',
    year: 2022,
  },
  {
    id: 6,
    slug: 'mrt-jakarta-fase-2',
    title: 'MRT Jakarta Fase 2',
    titleEn: 'Jakarta MRT Phase 2',
    client: 'PT MRT Jakarta',
    clientEn: 'PT MRT Jakarta',
    location: 'DKI Jakarta',
    locationEn: 'Jakarta',
    volume: '150,000 Ton',
    scope: 'Pembangunan jalur MRT',
    scopeEn: 'MRT line construction',
    image: '/images/projects/Jakarta MRT Phase 2.png',
    year: 2024,
  },
];

const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="section-padding">
      <div className="container-enterprise">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="heading-section text-foreground mb-4">
              {t('projects.title')}
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
            <div className="divider-accent mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <Link to={`/proyek/${project.slug}`} className="block group">
                <div className="card-enterprise overflow-hidden h-full">
                  {/* Project Image */}
                  <div className="h-56 bg-gradient-to-br from-muted to-secondary relative overflow-hidden">
                    <img 
                      src={project.image}
                      alt={language === 'id' ? project.title : project.titleEn}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="absolute inset-0 flex items-center justify-center">
                              <div class="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                                <svg class="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                      {project.year}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold font-semibold text-xl text-primary-foreground">
                        {language === 'id' ? project.title : project.titleEn}
                      </h3>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Building className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {t('projects.client')}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {language === 'id' ? project.client : project.clientEn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {language === 'id' ? 'Lokasi' : 'Location'}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {language === 'id' ? project.location : project.locationEn}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {t('projects.volume')}
                        </p>
                        <p className="text-lg font-bold font-semibold text-accent">
                          {project.volume}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Link to="/proyek">
              <Button className="btn-primary">
                {t('projects.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProjectsSection;
