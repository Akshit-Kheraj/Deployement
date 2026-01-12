import { Badge } from '@/components/ui/badge';

const ProductPreview = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Product Preview</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See it in <span className="text-secondary">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the powerful diagnostic dashboard that clinicians love
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 via-secondary/10 to-secondary/20 rounded-3xl blur-2xl" />
          
          {/* Preview card */}
          <div className="relative glass-card rounded-2xl p-2 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-muted/50 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-success rounded-full" />
                  medstargenx.app/dashboard
                </div>
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 bg-gradient-to-br from-card to-card/80">
              <div className="grid grid-cols-12 gap-4">
                {/* Sidebar mock */}
                <div className="col-span-2 space-y-3">
                  <div className="h-10 rounded-lg bg-secondary/20 animate-pulse" />
                  <div className="h-8 rounded-lg bg-muted/30" />
                  <div className="h-8 rounded-lg bg-muted/30" />
                  <div className="h-8 rounded-lg bg-muted/30" />
                  <div className="h-8 rounded-lg bg-muted/30" />
                </div>

                {/* Main content */}
                <div className="col-span-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-48 rounded-lg bg-muted/30" />
                    <div className="h-10 w-32 rounded-lg bg-secondary/30" />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass rounded-xl p-4 space-y-2">
                        <div className="h-4 w-20 rounded bg-muted/30" />
                        <div className="h-8 w-16 rounded bg-secondary/30" />
                      </div>
                    ))}
                  </div>

                  {/* Table mock */}
                  <div className="glass rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-32 rounded bg-muted/30" />
                      <div className="h-8 w-24 rounded bg-muted/30" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-muted/30" />
                        <div className="flex-1 space-y-1">
                          <div className="h-4 w-32 rounded bg-muted/40" />
                          <div className="h-3 w-24 rounded bg-muted/20" />
                        </div>
                        <div className="h-6 w-16 rounded-full bg-success/20" />
                        <div className="h-6 w-20 rounded bg-muted/30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
