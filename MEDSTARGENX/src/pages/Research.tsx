import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight, BookOpen, FileText, Users, Award, ExternalLink, Calendar, TrendingUp, Microscope, Brain, Dna } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const Research = () => {
  const publications = [
    {
      title: "Deep Learning for Early-Stage Cancer Detection: A Multi-Modal Approach",
      journal: "Nature Medicine",
      date: "December 2024",
      authors: "Chen et al.",
      impact: "Impact Factor: 87.2",
      citations: 1247,
      category: "Machine Learning"
    },
    {
      title: "Biomarker Analysis Using Transformer Networks for Oncological Screening",
      journal: "The Lancet Oncology",
      date: "November 2024",
      authors: "Williams et al.",
      impact: "Impact Factor: 51.1",
      citations: 892,
      category: "Oncology"
    },
    {
      title: "Predictive Modeling in Cancer Prognosis: A Systematic Review",
      journal: "Cell",
      date: "October 2024",
      authors: "Johnson et al.",
      impact: "Impact Factor: 66.8",
      citations: 634,
      category: "Review"
    },
    {
      title: "Integration of Genomic Data with Clinical Features for Cancer Risk Assessment",
      journal: "Science Translational Medicine",
      date: "September 2024",
      authors: "Park et al.",
      impact: "Impact Factor: 19.3",
      citations: 421,
      category: "Genomics"
    }
  ];

  const researchAreas = [
    {
      icon: Brain,
      title: "Neural Network Architectures",
      description: "Developing novel deep learning architectures specifically designed for medical imaging and biomarker analysis.",
      projects: 12
    },
    {
      icon: Dna,
      title: "Genomic Analysis",
      description: "Integrating genetic markers with clinical data for personalized cancer risk prediction.",
      projects: 8
    },
    {
      icon: Microscope,
      title: "Pathology AI",
      description: "Automated analysis of histopathological slides for accurate tumor classification.",
      projects: 15
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Building models for treatment response prediction and patient outcome forecasting.",
      projects: 10
    }
  ];

  const stats = [
    { value: "150+", label: "Published Papers", icon: FileText },
    { value: "45", label: "Active Researchers", icon: Users },
    { value: "12", label: "Research Grants", icon: Award },
    { value: "8", label: "Clinical Trials", icon: Activity }
  ];

  const collaborators = [
    "Mayo Clinic",
    "Stanford Medicine",
    "Johns Hopkins",
    "MD Anderson",
    "Cleveland Clinic",
    "Memorial Sloan Kettering"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="container px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Research & Innovation
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Advancing the Science of
              <span className="block text-primary">Early Detection</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Our research team is at the forefront of AI-driven cancer diagnostics, 
              publishing groundbreaking work and collaborating with leading institutions worldwide.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg">
                View Publications
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Focus Areas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multidisciplinary approach combines cutting-edge AI with deep clinical expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <area.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{area.description}</p>
                <div className="text-sm text-primary font-medium">{area.projects} Active Projects</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-20 bg-card/50">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Publications</h2>
              <p className="text-muted-foreground max-w-2xl">
                Peer-reviewed research from our team published in leading medical journals.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Publications
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{pub.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {pub.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{pub.journal}</span>
                      <span>{pub.authors}</span>
                      <span>{pub.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{pub.citations}</div>
                      <div className="text-xs text-muted-foreground">Citations</div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="py-20">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Collaborating with world-renowned medical institutions and research centers.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {collaborators.map((name, index) => (
              <div
                key={index}
                className="px-8 py-4 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <span className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Research Initiative
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              We're looking for passionate researchers and clinicians to help advance AI-driven cancer detection.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg">
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Research Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Research;
