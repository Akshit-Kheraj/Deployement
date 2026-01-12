const logos = [
  'Mayo Clinic',
  'Johns Hopkins',
  'Cleveland Clinic',
  'Stanford Health',
  'Mass General',
  'UCLA Health',
];

const SocialProof = () => {
  return (
    <section className="relative py-20 overflow-hidden border-y border-border/30">
      <div className="container px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            Trusted by Modern Clinicians
          </p>
          <h3 className="text-2xl font-semibold">
            Powering diagnostics at leading healthcare institutions
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex items-center justify-center px-6 py-3 rounded-lg glass opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-lg font-semibold text-muted-foreground">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
