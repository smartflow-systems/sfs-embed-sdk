import { Palette, Code, Zap, Lock, Smartphone, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Match your brand with theme colors, custom CSS, and configuration options"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean API, comprehensive docs, and TypeScript support out of the box"
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Lazy loading, minimal bundle size, and optimized for Core Web Vitals"
  },
  {
    icon: Lock,
    title: "Secure & Isolated",
    description: "PostMessage API ensures widgets run securely without affecting your site"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "All widgets adapt seamlessly to mobile, tablet, and desktop screens"
  },
  {
    icon: Globe,
    title: "Cross-Browser",
    description: "Works on all modern browsers with graceful fallbacks for legacy support"
  }
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for developers who want powerful widgets without the complexity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="hover-elevate">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
