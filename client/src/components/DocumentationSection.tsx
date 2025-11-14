import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const apiReference = [
  { method: "WidgetSDK.init(config)", description: "Initialize the SDK with widget configuration" },
  { method: "config.form.target", description: "CSS selector where form widget should mount" },
  { method: "config.chat.position", description: "Position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'" },
  { method: "config.calculator.target", description: "CSS selector where calculator widget should mount" },
  { method: "config.theme.primaryColor", description: "Primary color in hex format (e.g., '#3B82F6')" },
  { method: "WidgetSDK.destroy()", description: "Remove all widgets and clean up event listeners" }
];

export default function DocumentationSection() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Quick Start Guide</h2>
          <p className="text-lg text-muted-foreground">
            Get up and running in under 5 minutes
          </p>
        </div>
        
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form" data-testid="tab-doc-form">Form Widget</TabsTrigger>
            <TabsTrigger value="calculator" data-testid="tab-doc-calculator">Calculator</TabsTrigger>
            <TabsTrigger value="chat" data-testid="tab-doc-chat">Chat Widget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Installation Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Add the SDK script</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`<script src="https://cdn.example.com/widget-sdk.js"></script>`}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Create a container element</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`<div id="contact-form"></div>`}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Initialize the widget</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`WidgetSDK.init({
  form: {
    target: '#contact-form',
    onSubmit: (data) => console.log(data)
  }
});`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Installation Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Add the SDK script</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`<script src="https://cdn.example.com/widget-sdk.js"></script>`}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Create a container element</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`<div id="calculator"></div>`}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Initialize the widget</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`WidgetSDK.init({
  calculator: {
    target: '#calculator'
  }
});`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Installation Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Add the SDK script</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`<script src="https://cdn.example.com/widget-sdk.js"></script>`}</code>
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Initialize the chat widget</h4>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm font-mono">{`WidgetSDK.init({
  chat: {
    position: 'bottom-right',
    onMessage: (msg) => console.log(msg)
  }
});`}</code>
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground">
                  The chat widget appears as a floating button and expands when clicked.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Method / Option</th>
                    <th className="text-left p-3 text-sm font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiReference.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-3">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.method}</code>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center pt-8">
          <Button size="lg" data-testid="button-full-docs">
            View Full Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}
