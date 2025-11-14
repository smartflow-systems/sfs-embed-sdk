import WidgetPreview from '../WidgetPreview';

export default function WidgetPreviewExample() {
  return (
    <div className="p-6 space-y-6">
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
  );
}
