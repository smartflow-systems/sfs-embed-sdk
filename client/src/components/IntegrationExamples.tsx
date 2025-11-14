import WidgetPreview from "./WidgetPreview";

export default function IntegrationExamples() {
  return (
    <section className="px-6 py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Live Widget Examples</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try out each widget type below. Click to launch and interact with them.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WidgetPreview 
            type="form" 
            title="Contact Form" 
            description="Collect user inquiries and feedback"
          />
          <WidgetPreview 
            type="calculator" 
            title="Calculator" 
            description="Interactive calculation widget"
          />
          <WidgetPreview 
            type="chat" 
            title="Chat Widget" 
            description="Real-time support chat"
          />
        </div>
      </div>
    </section>
  );
}
