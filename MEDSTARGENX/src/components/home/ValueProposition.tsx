import { Target, FileSpreadsheet, Users, Zap, Brain, Lock } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Early Detection Accuracy',
    description: 'Our AI models detect cancer biomarkers at earliest stages with 98.7% accuracy, enabling preventive care before symptoms appear.',
    gradient: 'from-secondary to-cyan-400',
  },
  {
    icon: FileSpreadsheet,
    title: 'Seamless CSV Integration',
    description: 'Upload patient data in standard CSV format. Our system automatically parses, validates, and processes multi-dimensional biomarker data.',
    gradient: 'from-emerald-400 to-success',
  },
  {
    icon: Users,
    title: 'Comprehensive Patient Profiling',
    description: 'Generate detailed patient profiles with risk assessments, historical trends, and AI-powered recommendations for clinical action.',
    gradient: 'from-violet-400 to-purple-500',
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Results in under 3 seconds per patient.',
  },
  {
    icon: Brain,
    title: 'Deep Learning Models',
    description: 'Trained on 50M+ anonymized records.',
  },
  {
    icon: Lock,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade data protection.',
  },
];

const ValueProposition = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative z-10 px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-secondary">Med Star Gen X</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge AI technology designed for modern clinical workflows
          </p>
        </div>

        {/* Main features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional features row */}
        <div className="grid md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 glass rounded-xl p-6"
            >
              <div className="p-3 rounded-lg bg-secondary/10">
                <feature.icon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
