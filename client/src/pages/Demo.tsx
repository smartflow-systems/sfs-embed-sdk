import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState<'form' | 'calculator' | 'chat'>('form');

  useEffect(() => {
    // Load the SDK script
    const script = document.createElement('script');
    script.src = '/widget-sdk.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if ((window as any).WidgetSDK) {
      // Clear any existing widgets
      const containers = document.querySelectorAll('[id^="demo-"]');
      containers.forEach(c => c.innerHTML = '');
      
      // Remove any existing chat widgets
      const existingChatWidgets = document.querySelectorAll('[class*="widget-chat"]');
      existingChatWidgets.forEach(w => w.remove());

      // Initialize the selected widget
      if (activeDemo === 'form') {
        (window as any).WidgetSDK.init({
          form: {
            target: '#demo-form',
            onSubmit: (data: any) => {
              console.log('Form submitted:', data);
              alert('Form submitted successfully!');
            }
          }
        });
      } else if (activeDemo === 'calculator') {
        (window as any).WidgetSDK.init({
          calculator: {
            target: '#demo-calculator'
          }
        });
      } else if (activeDemo === 'chat') {
        (window as any).WidgetSDK.init({
          chat: {
            position: 'bottom-right',
            onMessage: (data: any) => {
              console.log('Message sent:', data);
            }
          }
        });
      }
    }
  }, [activeDemo]);

  const codeSnippets = {
    form: `<script src="${window.location.origin}/widget-sdk.js"></script>
<div id="contact-form"></div>
<script>
  WidgetSDK.init({
    form: {
      target: '#contact-form',
      onSubmit: (data) => console.log(data)
    }
  });
</script>`,
    calculator: `<script src="${window.location.origin}/widget-sdk.js"></script>
<div id="calculator"></div>
<script>
  WidgetSDK.init({
    calculator: {
      target: '#calculator'
    }
  });
</script>`,
    chat: `<script src="${window.location.origin}/widget-sdk.js"></script>
<script>
  WidgetSDK.init({
    chat: {
      position: 'bottom-right',
      onMessage: (msg) => console.log(msg)
    }
  });
</script>`
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Live Widget Demo</h1>
          <p className="text-lg text-muted-foreground">
            See the widgets in action and grab the integration code
          </p>
        </div>

        <Tabs defaultValue="form" onValueChange={(v) => setActiveDemo(v as any)}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="form" data-testid="tab-demo-form">Form</TabsTrigger>
            <TabsTrigger value="calculator" data-testid="tab-demo-calculator">Calculator</TabsTrigger>
            <TabsTrigger value="chat" data-testid="tab-demo-chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Widget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div id="demo-form" className="min-h-[400px]"></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono">
                      <code>{codeSnippets.form}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(codeSnippets.form);
                        alert('Code copied to clipboard!');
                      }}
                      data-testid="button-copy-form-code"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Usage Notes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Add a container element with an ID</li>
                      <li>• Target it in the SDK init config</li>
                      <li>• Handle form submissions via callback</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Widget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div id="demo-calculator" className="min-h-[400px] flex items-center justify-center"></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono">
                      <code>{codeSnippets.calculator}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(codeSnippets.calculator);
                        alert('Code copied to clipboard!');
                      }}
                      data-testid="button-copy-calc-code"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Usage Notes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create a container with unique ID</li>
                      <li>• Calculator renders fully self-contained</li>
                      <li>• No additional configuration needed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Widget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <p className="text-muted-foreground">
                        Look for the chat button in the bottom-right corner of your screen!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click it to open the chat widget
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono">
                      <code>{codeSnippets.chat}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(codeSnippets.chat);
                        alert('Code copied to clipboard!');
                      }}
                      data-testid="button-copy-chat-code"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Usage Notes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• No container element needed</li>
                      <li>• Renders as floating button</li>
                      <li>• Position options: bottom-right, bottom-left, top-right, top-left</li>
                      <li>• Receives bot auto-responses</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Direct DOM Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Widgets render directly into your page's DOM with scoped styles to prevent conflicts. Perfect for same-origin integration where you control both the host site and widget behavior.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Simple</h4>
                <p className="text-muted-foreground">No iframe complexity</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Compatible</h4>
                <p className="text-muted-foreground">Works with any framework</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Lightweight</h4>
                <p className="text-muted-foreground">Under 15KB gzipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
