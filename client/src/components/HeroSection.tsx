import { Button } from "@/components/ui/button";
import { Code2, Zap, Shield } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          Drop-in widgets for any website
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">
          Embed Powerful Widgets
          <span className="block text-primary mt-2">In Seconds</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Add forms, calculators, and chat to your website with a single script tag. 
          No framework required. Works anywhere.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/demo">
            <Button size="lg" className="h-12 px-8" data-testid="button-get-started">
              Try Live Demo
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8" data-testid="button-view-docs">
            View Docs
          </Button>
        </div>
        
        <div className="pt-8 space-y-3">
          <p className="text-sm text-muted-foreground">Quick Install</p>
          <div className="relative max-w-2xl mx-auto">
            <pre className="bg-card border border-card-border rounded-lg p-4 text-left overflow-x-auto">
              <code className="text-sm font-mono text-card-foreground">
                {`<script src="${window.location.origin}/widget-sdk.js"></script>
<script>
  WidgetSDK.init({
    form: { target: '#contact-form' },
    chat: { position: 'bottom-right' }
  });
</script>`}
              </code>
            </pre>
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-2 right-2"
              data-testid="button-copy-code"
              onClick={() => {
                const code = `<script src="${window.location.origin}/widget-sdk.js"></script>
<script>
  WidgetSDK.init({
    form: { target: '#contact-form' },
    chat: { position: 'bottom-right' }
  });
</script>`;
                navigator.clipboard.writeText(code);
                console.log('Copy code triggered');
              }}
            >
              Copy
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 text-center">
            <Code2 className="w-8 h-8 text-primary" />
            <h3 className="font-semibold">Framework Agnostic</h3>
            <p className="text-sm text-muted-foreground">Works with any tech stack</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Zap className="w-8 h-8 text-primary" />
            <h3 className="font-semibold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Minimal bundle size</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="font-semibold">Secure by Default</h3>
            <p className="text-sm text-muted-foreground">PostMessage API isolation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
