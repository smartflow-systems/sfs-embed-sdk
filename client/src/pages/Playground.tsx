/**
 * Interactive Widget Playground
 * Test and configure widgets in real-time
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Copy, Play, Sparkles } from 'lucide-react';

export default function Playground() {
  const [widgetType, setWidgetType] = useState<'form' | 'chat' | 'calculator' | 'changelog'>('chat');
  const [workspaceId, setWorkspaceId] = useState('demo-workspace');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [borderRadius, setBorderRadius] = useState('12px');
  const [showCode, setShowCode] = useState(false);

  const generateCode = () => {
    const config = {
      workspace: workspaceId,
      theme: {
        primaryColor,
        borderRadius,
      },
      widgets: [
        {
          type: widgetType,
          enabled: true,
          config: getWidgetConfig(),
        },
      ],
    };

    return `<script
  src="https://cdn.sfs.dev/embed.js"
  data-workspace="${workspaceId}"
  data-theme='${JSON.stringify(config.theme, null, 2)}'
  data-widgets='${JSON.stringify([config.widgets[0]], null, 2)}'>
</script>`;
  };

  const getWidgetConfig = () => {
    switch (widgetType) {
      case 'chat':
        return {
          workspaceId,
          position: { bottom: '20px', right: '20px' },
        };
      case 'form':
        return {
          formId: 'contact-form',
          title: 'Get in Touch',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
          ],
        };
      case 'calculator':
        return {
          calculatorId: 'demo-calc',
          title: 'ROI Calculator',
          formula: 'investment * (1 + rate / 100) * years',
          inputs: [
            { name: 'investment', label: 'Investment', type: 'slider', min: 1000, max: 100000, default: 10000, prefix: '$' },
          ],
        };
      case 'changelog':
        return {
          workspaceId,
          badge: true,
        };
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SFS Playground</span>
          </div>
          <Badge variant="secondary">Interactive Demo</Badge>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Widget Playground
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test, customize, and preview all SFS widgets in real-time. Copy the code and embed anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Customize your widget appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Widget Type Selector */}
              <div className="space-y-2">
                <Label>Widget Type</Label>
                <Tabs value={widgetType} onValueChange={(v) => setWidgetType(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="chat">💬 Chat</TabsTrigger>
                    <TabsTrigger value="form">📝 Form</TabsTrigger>
                    <TabsTrigger value="calculator">🧮 Calc</TabsTrigger>
                    <TabsTrigger value="changelog">📢 News</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Workspace ID */}
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace ID</Label>
                <Input
                  id="workspace"
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  placeholder="your-workspace-id"
                />
              </div>

              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Theme</h3>

                <div className="space-y-2">
                  <Label htmlFor="color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">Border Radius</Label>
                  <Input
                    id="radius"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    placeholder="12px"
                  />
                </div>
              </div>

              {/* Widget-Specific Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Widget Settings</h3>

                {widgetType === 'chat' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Typing Indicators</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Read Receipts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>File Upload</Label>
                      <Switch />
                    </div>
                  </div>
                )}

                {widgetType === 'form' && (
                  <div className="space-y-2">
                    <Label>Form Title</Label>
                    <Input defaultValue="Get in Touch" />
                    <Label>Submit Button Text</Label>
                    <Input defaultValue="Submit" />
                  </div>
                )}

                {widgetType === 'calculator' && (
                  <div className="space-y-2">
                    <Label>Calculator Title</Label>
                    <Input defaultValue="ROI Calculator" />
                    <Label>Formula</Label>
                    <Textarea
                      defaultValue="investment * (1 + rate / 100) * years"
                      rows={2}
                    />
                  </div>
                )}

                {widgetType === 'changelog' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Badge</Label>
                      <Switch defaultChecked />
                    </div>
                    <Label>Max Items</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowCode(!showCode)} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  {showCode ? 'Hide Code' : 'Show Code'}
                </Button>
                <Button onClick={copyCode} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>

              {/* Code Output */}
              {showCode && (
                <div className="space-y-2">
                  <Label>Embed Code</Label>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{generateCode()}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your widget will look in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 min-h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-700"
                style={{
                  '--preview-primary': primaryColor,
                  '--preview-radius': borderRadius,
                } as any}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Live Preview</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Your <strong>{widgetType}</strong> widget will appear here.
                        Click the button in the bottom-right to test it!
                      </p>
                    </div>
                    <Badge variant="secondary" className="mt-4">
                      Workspace: {workspaceId}
                    </Badge>
                  </div>
                </div>

                {/* Preview Widget (simplified representation) */}
                {widgetType === 'chat' && (
                  <button
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: borderRadius,
                    }}
                  >
                    <span className="text-2xl">💬</span>
                  </button>
                )}

                {widgetType === 'changelog' && (
                  <button
                    className="fixed bottom-8 left-8 bg-white dark:bg-gray-800 border shadow-lg px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-xl transition-shadow"
                  >
                    <span className="text-sm font-medium">What's New</span>
                    <Badge
                      className="rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      3
                    </Badge>
                  </button>
                )}
              </div>

              {/* Widget Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">144KB</div>
                  <div className="text-xs text-muted-foreground">Bundle Size</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">A+</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">WCAG AA</div>
                  <div className="text-xs text-muted-foreground">Accessible</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Smart responses, intent detection, and automated workflows powered by AI.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Under 150KB gzipped with lazy loading and edge caching for instant delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔒 Secure by Default
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                CORS validation, rate limiting, and encrypted data transmission.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
