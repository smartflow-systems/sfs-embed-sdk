import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Widget SDK</h3>
            <p className="text-sm text-muted-foreground">
              Drop-in widgets for forms, calculators, and chat. Built for developers.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Developer Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Customization
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Widget SDK. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              data-testid="link-github"
              onClick={() => console.log('GitHub clicked')}
            >
              <Github className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              data-testid="link-twitter"
              onClick={() => console.log('Twitter clicked')}
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              data-testid="link-email"
              onClick={() => console.log('Email clicked')}
            >
              <Mail className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
