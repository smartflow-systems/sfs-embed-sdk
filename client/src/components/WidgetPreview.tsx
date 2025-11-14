import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, MessageCircle, Calculator, FileText, X } from "lucide-react";

interface WidgetPreviewProps {
  type: 'form' | 'calculator' | 'chat';
  title: string;
  description: string;
}

type Message = {
  text: string;
  sender: 'bot' | 'user';
};

export default function WidgetPreview({ type, title, description }: WidgetPreviewProps) {
  const [showWidget, setShowWidget] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you today?", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleCalcButton = (value: string) => {
    if (value === "C") {
      setCalcDisplay("0");
    } else if (value === "=") {
      try {
        setCalcDisplay(eval(calcDisplay).toString());
      } catch {
        setCalcDisplay("Error");
      }
    } else {
      setCalcDisplay(calcDisplay === "0" ? value : calcDisplay + value);
    }
    console.log('Calculator button clicked:', value);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { text: chatInput, sender: 'user' }]);
      setChatInput("");
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for your message! This is a demo response.", sender: 'bot' }]);
      }, 1000);
      console.log('Message sent:', chatInput);
    }
  };

  const renderWidget = () => {
    switch (type) {
      case 'form':
        return (
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Contact Us</CardTitle>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowWidget(false)}
                  data-testid="button-close-widget"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">We'll get back to you soon</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="h-10"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  className="h-10"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help?" 
                  className="resize-none"
                  rows={3}
                  data-testid="input-message"
                />
              </div>
              <Button 
                className="w-full h-10" 
                onClick={() => console.log('Form submitted')}
                data-testid="button-submit-form"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        );
      
      case 'calculator':
        return (
          <Card className="w-full max-w-[320px] shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calculator</CardTitle>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowWidget(false)}
                  data-testid="button-close-widget"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted h-16 rounded-lg flex items-center justify-end px-4">
                <span className="text-2xl font-mono" data-testid="text-calc-display">{calcDisplay}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                  <Button
                    key={btn}
                    variant={['/', '*', '-', '+', '='].includes(btn) ? 'default' : 'secondary'}
                    className={`h-12 ${btn === '=' ? 'col-span-2' : ''}`}
                    onClick={() => handleCalcButton(btn)}
                    data-testid={`button-calc-${btn}`}
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      case 'chat':
        return (
          <Card className="w-full max-w-[360px] h-[500px] shadow-2xl flex flex-col">
            <CardHeader className="h-14 flex flex-row items-center justify-between space-y-0 border-b border-card-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <CardTitle className="text-base">Support Chat</CardTitle>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setShowWidget(false)}
                data-testid="button-close-widget"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm ml-auto' 
                        : 'bg-muted text-muted-foreground rounded-bl-sm mr-auto'
                    }`}
                    data-testid={`message-${idx}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="h-14 border-t border-card-border flex items-center px-3 gap-2">
              <Input 
                placeholder="Type a message..." 
                className="flex-1 h-10 rounded-full"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                data-testid="input-chat-message"
              />
              <Button 
                size="icon" 
                className="w-10 h-10 rounded-full"
                onClick={handleSendMessage}
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        );
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'form': return <FileText className="w-5 h-5" />;
      case 'calculator': return <Calculator className="w-5 h-5" />;
      case 'chat': return <MessageCircle className="w-5 h-5" />;
    }
  };

  const codeSnippet = `<script src="https://cdn.example.com/widget-sdk.js"></script>
<script>
  WidgetSDK.init({
    ${type}: {
      ${type === 'chat' ? "position: 'bottom-right'" : `target: '#my-${type}'`}
    }
  });
</script>`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle>{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
            <TabsTrigger value="code" data-testid="tab-code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-6">
              {showWidget ? (
                renderWidget()
              ) : (
                <Button 
                  onClick={() => setShowWidget(true)}
                  data-testid={`button-launch-${type}`}
                >
                  Launch {title}
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <pre className="bg-card border border-card-border rounded-lg p-4 overflow-x-auto">
                <code className="text-xs font-mono text-card-foreground">
                  {codeSnippet}
                </code>
              </pre>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 right-2"
                onClick={() => console.log('Code copied')}
                data-testid="button-copy-snippet"
              >
                Copy
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
