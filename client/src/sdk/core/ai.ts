/**
 * SFS Embed SDK - AI Assistant
 * Smart responses, intent detection, and automated workflows
 */

export interface AIConfig {
  enabled: boolean;
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface Intent {
  type: 'greeting' | 'question' | 'support' | 'sales' | 'complaint' | 'feedback' | 'unknown';
  confidence: number;
  entities?: Record<string, string>;
}

export interface SmartResponse {
  message: string;
  suggestions?: string[];
  intent: Intent;
  requiresHuman?: boolean;
}

export class AIAssistant {
  private config: AIConfig;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(config: AIConfig) {
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 150,
      systemPrompt: `You are a helpful customer support assistant. Be concise, friendly, and professional.
      If you cannot help with something, suggest contacting a human agent.`,
      ...config,
    };
  }

  /**
   * Detect user intent from message
   */
  public async detectIntent(message: string): Promise<Intent> {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based intent detection (can be enhanced with ML model)
    const intents: Array<{ type: Intent['type']; keywords: string[]; confidence: number }> = [
      {
        type: 'greeting',
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
        confidence: 0,
      },
      {
        type: 'question',
        keywords: ['how', 'what', 'when', 'where', 'why', 'can you', 'could you', '?'],
        confidence: 0,
      },
      {
        type: 'support',
        keywords: ['help', 'issue', 'problem', 'not working', 'broken', 'error', 'bug'],
        confidence: 0,
      },
      {
        type: 'sales',
        keywords: ['price', 'cost', 'buy', 'purchase', 'plan', 'upgrade', 'subscription'],
        confidence: 0,
      },
      {
        type: 'complaint',
        keywords: ['disappointed', 'frustrated', 'angry', 'terrible', 'worst', 'hate'],
        confidence: 0,
      },
      {
        type: 'feedback',
        keywords: ['suggest', 'feature', 'improve', 'feedback', 'recommendation'],
        confidence: 0,
      },
    ];

    // Calculate confidence scores
    for (const intent of intents) {
      const matches = intent.keywords.filter((keyword) => lowerMessage.includes(keyword));
      intent.confidence = matches.length / intent.keywords.length;
    }

    // Sort by confidence and get the highest
    intents.sort((a, b) => b.confidence - a.confidence);
    const topIntent = intents[0];

    return {
      type: topIntent.confidence > 0 ? topIntent.type : 'unknown',
      confidence: topIntent.confidence,
    };
  }

  /**
   * Generate smart response using AI
   */
  public async generateResponse(userMessage: string): Promise<SmartResponse> {
    const intent = await this.detectIntent(userMessage);

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Get AI response based on intent
    let aiMessage: string;
    let suggestions: string[] = [];
    let requiresHuman = false;

    switch (intent.type) {
      case 'greeting':
        aiMessage = this.getGreetingResponse();
        suggestions = ['I have a question', 'I need help', 'Tell me about pricing'];
        break;

      case 'support':
        aiMessage = this.getSupportResponse(userMessage);
        suggestions = ['Talk to a human', 'Check documentation', 'Try troubleshooting'];
        requiresHuman = true;
        break;

      case 'sales':
        aiMessage = this.getSalesResponse(userMessage);
        suggestions = ['See pricing', 'Compare plans', 'Schedule a demo'];
        break;

      case 'complaint':
        aiMessage = "I'm sorry to hear you're having a negative experience. Let me connect you with our support team right away.";
        requiresHuman = true;
        break;

      case 'feedback':
        aiMessage = "Thank you for your feedback! We really appreciate it. I'll make sure our product team sees your suggestion.";
        suggestions = ['Submit feature request', 'Join our community'];
        break;

      default:
        aiMessage = await this.callAIAPI(userMessage);
        suggestions = ['Can you clarify?', 'Talk to human', 'View help docs'];
        break;
    }

    // Add AI response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: aiMessage,
    });

    // Keep only last 10 messages for context
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }

    return {
      message: aiMessage,
      suggestions,
      intent,
      requiresHuman,
    };
  }

  /**
   * Get greeting response
   */
  private getGreetingResponse(): string {
    const greetings = [
      "Hi there! 👋 How can I help you today?",
      "Hello! Welcome to our support chat. What can I assist you with?",
      "Hey! Great to see you. What brings you here today?",
      "Hi! I'm here to help. What do you need assistance with?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Get support response
   */
  private getSupportResponse(message: string): string {
    return `I understand you're experiencing an issue. Let me help you with that. Could you provide more details about what's happening? In the meantime, I can connect you with a human agent for immediate assistance.`;
  }

  /**
   * Get sales response
   */
  private getSalesResponse(message: string): string {
    if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
      return `We offer flexible pricing plans starting at £19/mo for Pro and custom Enterprise plans. Would you like me to send you our detailed pricing page or connect you with our sales team?`;
    }
    return `I'd be happy to help you learn more about our products! Would you like to see pricing, schedule a demo, or talk to our sales team?`;
  }

  /**
   * Call AI API (OpenAI, Anthropic, etc.)
   */
  private async callAIAPI(message: string): Promise<string> {
    // In production, this would call the actual AI API
    // For now, return a simulated response

    try {
      // Simulated API call
      const response = await this.simulateAIResponse(message);
      return response;
    } catch (error) {
      console.error('AI API error:', error);
      return "I'm here to help! Could you rephrase your question or would you like to speak with a human agent?";
    }
  }

  /**
   * Simulate AI response (replace with actual API in production)
   */
  private async simulateAIResponse(message: string): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Rule-based fallback responses
    const responses = {
      how: "That's a great question! Let me explain...",
      what: "Let me clarify that for you...",
      why: "Good question! Here's why...",
      when: "Regarding timing...",
      where: "You can find that...",
      default: "I understand your question. Let me help you with that...",
    };

    const firstWord = message.toLowerCase().split(' ')[0];
    return responses[firstWord as keyof typeof responses] || responses.default;
  }

  /**
   * Get quick reply suggestions based on context
   */
  public getQuickReplies(intent: Intent): string[] {
    const suggestions: Record<Intent['type'], string[]> = {
      greeting: ['I have a question', 'I need help', 'Tell me about your product'],
      question: ['Yes, that helps', 'Can you explain more?', 'Talk to human'],
      support: ['Yes, that works', 'Still need help', 'Talk to agent'],
      sales: ['See pricing', 'Schedule demo', 'Compare plans'],
      complaint: ['Connect me to support', 'File a complaint', 'Request refund'],
      feedback: ['Submit suggestion', 'Join community', 'Vote on features'],
      unknown: ['Can you clarify?', 'Talk to human', 'View help docs'],
    };

    return suggestions[intent.type] || suggestions.unknown;
  }

  /**
   * Clear conversation history
   */
  public clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Export conversation
   */
  public exportConversation(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}

/**
 * Sentiment analysis (simple rule-based)
 */
export function analyzeSentiment(message: string): {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
} {
  const positiveWords = ['great', 'excellent', 'awesome', 'love', 'thanks', 'perfect', 'amazing'];
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'disappointed', 'angry', 'worst'];

  const lowerMessage = message.toLowerCase();
  let score = 0;

  positiveWords.forEach((word) => {
    if (lowerMessage.includes(word)) score += 1;
  });

  negativeWords.forEach((word) => {
    if (lowerMessage.includes(word)) score -= 1;
  });

  return {
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
    score,
  };
}

/**
 * Auto-suggest responses for agents
 */
export function getSuggestedResponses(userMessage: string, context: string): string[] {
  const suggestions: string[] = [];

  if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
    suggestions.push("Our Pro plan starts at £19/month. Would you like to see all pricing options?");
    suggestions.push("I can send you our pricing page. What features are you most interested in?");
  }

  if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('problem')) {
    suggestions.push("I'm here to help! Can you describe the issue you're experiencing?");
    suggestions.push("Let me connect you with our technical support team right away.");
  }

  if (userMessage.toLowerCase().includes('demo') || userMessage.toLowerCase().includes('trial')) {
    suggestions.push("I'd be happy to set up a demo! When would be a good time for you?");
    suggestions.push("You can start a free trial right now. Would you like me to send you the link?");
  }

  // Default suggestions if no specific match
  if (suggestions.length === 0) {
    suggestions.push("Thank you for reaching out! How can I assist you today?");
    suggestions.push("I'd be happy to help with that. Could you provide a bit more detail?");
    suggestions.push("Let me look into this for you. One moment please.");
  }

  return suggestions;
}
