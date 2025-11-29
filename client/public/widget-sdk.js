/**
 * Widget SDK - Embeddable widgets for any website
 * Version: 1.0.0
 */
(function(window) {
  'use strict';

  // Utility to generate unique IDs
  function generateId() {
    return 'widget-' + Math.random().toString(36).substr(2, 9);
  }

  // Get API base URL from script tag or default to current origin
  function getApiBaseUrl() {
    const scriptTag = document.querySelector('script[src*="widget-sdk.js"]');
    if (scriptTag && scriptTag.dataset.apiUrl) {
      return scriptTag.dataset.apiUrl;
    }
    return window.location.origin;
  }

  const API_BASE = getApiBaseUrl();

  // Form Widget
  function createFormWidget(config) {
    const target = document.querySelector(config.target);
    if (!target) {
      console.error('Form widget target not found:', config.target);
      return;
    }

    const formId = generateId();
    const styles = `
      .widget-form-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 400px;
        margin: 0 auto;
      }
      .widget-form {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .widget-form h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }
      .widget-form p {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #666;
      }
      .widget-form-group {
        margin-bottom: 16px;
      }
      .widget-form label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #333;
      }
      .widget-form input,
      .widget-form textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }
      .widget-form input:focus,
      .widget-form textarea:focus {
        outline: none;
        border-color: #1d4ed8;
      }
      .widget-form textarea {
        resize: vertical;
        min-height: 80px;
      }
      .widget-form button {
        width: 100%;
        padding: 10px;
        background: #1d4ed8;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .widget-form button:hover {
        background: #1e40af;
      }
      .widget-form button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      .widget-form-success {
        padding: 12px;
        background: #d1fae5;
        color: #065f46;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 16px;
      }
      .widget-form-error {
        padding: 12px;
        background: #fee2e2;
        color: #991b1b;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 16px;
      }
    `;

    const html = `
      <style>${styles}</style>
      <div class="widget-form-container">
        <div class="widget-form">
          <h3>Contact Us</h3>
          <p>We'll get back to you soon</p>
          <div id="${formId}-message"></div>
          <form id="${formId}">
            <div class="widget-form-group">
              <label for="${formId}-name">Name</label>
              <input type="text" id="${formId}-name" name="name" required>
            </div>
            <div class="widget-form-group">
              <label for="${formId}-email">Email</label>
              <input type="email" id="${formId}-email" name="email" required>
            </div>
            <div class="widget-form-group">
              <label for="${formId}-message">Message</label>
              <textarea id="${formId}-message" name="message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    `;

    target.innerHTML = html;

    const form = document.getElementById(formId);
    const messageDiv = document.getElementById(formId + '-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        const response = await fetch(API_BASE + '/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          messageDiv.innerHTML = '<div class="widget-form-success">Message sent successfully!</div>';
          form.reset();
          if (config.onSubmit) {
            config.onSubmit(result.submission);
          }
        } else {
          messageDiv.innerHTML = '<div class="widget-form-error">Failed to send message. Please try again.</div>';
        }
      } catch (error) {
        messageDiv.innerHTML = '<div class="widget-form-error">Network error. Please try again.</div>';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }

  // Calculator Widget
  function createCalculatorWidget(config) {
    const target = document.querySelector(config.target);
    if (!target) {
      console.error('Calculator widget target not found:', config.target);
      return;
    }

    const calcId = generateId();
    let display = '0';

    const styles = `
      .widget-calculator {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 320px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .widget-calculator h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }
      .widget-calc-display {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
        text-align: right;
        font-size: 24px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        margin-bottom: 12px;
        min-height: 40px;
        color: #1a1a1a;
      }
      .widget-calc-buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .widget-calc-button {
        padding: 16px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        background: #e5e7eb;
        color: #1a1a1a;
      }
      .widget-calc-button:hover {
        background: #d1d5db;
      }
      .widget-calc-button:active {
        transform: scale(0.95);
      }
      .widget-calc-button.operator {
        background: #1d4ed8;
        color: white;
      }
      .widget-calc-button.operator:hover {
        background: #1e40af;
      }
      .widget-calc-button.equals {
        grid-column: span 2;
        background: #1d4ed8;
        color: white;
      }
      .widget-calc-button.equals:hover {
        background: #1e40af;
      }
    `;

    const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'];
    const buttonHtml = buttons.map(btn => {
      const className = ['/', '*', '-', '+', '='].includes(btn) ? 
        `widget-calc-button ${btn === '=' ? 'equals' : 'operator'}` : 
        'widget-calc-button';
      return `<button class="${className}" data-value="${btn}">${btn}</button>`;
    }).join('');

    const html = `
      <style>${styles}</style>
      <div class="widget-calculator">
        <h3>Calculator</h3>
        <div class="widget-calc-display" id="${calcId}-display">0</div>
        <div class="widget-calc-buttons" id="${calcId}-buttons">
          ${buttonHtml}
        </div>
      </div>
    `;

    target.innerHTML = html;

    const displayEl = document.getElementById(calcId + '-display');
    const buttonsContainer = document.getElementById(calcId + '-buttons');

    function updateDisplay(value) {
      display = value;
      displayEl.textContent = value;
    }

    buttonsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('widget-calc-button')) {
        const value = e.target.dataset.value;

        if (value === 'C') {
          updateDisplay('0');
        } else if (value === '=') {
          try {
            const result = eval(display);
            updateDisplay(result.toString());
          } catch {
            updateDisplay('Error');
          }
        } else {
          if (display === '0' || display === 'Error') {
            updateDisplay(value);
          } else {
            updateDisplay(display + value);
          }
        }
      }
    });
  }

  // Chat Widget
  function createChatWidget(config) {
    const sessionId = generateId();
    const chatId = generateId();
    const position = config.position || 'bottom-right';
    let isOpen = false;
    let messages = [{ text: "Hi! How can I help you today?", sender: 'bot' }];

    const positionStyles = {
      'bottom-right': 'bottom: 24px; right: 24px;',
      'bottom-left': 'bottom: 24px; left: 24px;',
      'top-right': 'top: 24px; right: 24px;',
      'top-left': 'top: 24px; left: 24px;'
    };

    const styles = `
      .widget-chat-trigger {
        position: fixed;
        ${positionStyles[position]}
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #1d4ed8;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 10000;
        transition: transform 0.2s;
      }
      .widget-chat-trigger:hover {
        transform: scale(1.05);
      }
      .widget-chat-container {
        position: fixed;
        ${positionStyles[position]}
        width: 360px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: none;
        flex-direction: column;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .widget-chat-container.open {
        display: flex;
      }
      .widget-chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
      }
      .widget-chat-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #1a1a1a;
      }
      .widget-chat-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #1d4ed8;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
      .widget-chat-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #6b7280;
        padding: 4px;
      }
      .widget-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .widget-chat-message {
        display: flex;
        max-width: 80%;
      }
      .widget-chat-message.user {
        margin-left: auto;
      }
      .widget-chat-bubble {
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.4;
      }
      .widget-chat-message.bot .widget-chat-bubble {
        background: #f3f4f6;
        color: #1a1a1a;
        border-bottom-left-radius: 4px;
      }
      .widget-chat-message.user .widget-chat-bubble {
        background: #1d4ed8;
        color: white;
        border-bottom-right-radius: 4px;
      }
      .widget-chat-input-area {
        border-top: 1px solid #e5e7eb;
        padding: 12px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .widget-chat-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
      }
      .widget-chat-input:focus {
        border-color: #1d4ed8;
      }
      .widget-chat-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #1d4ed8;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .widget-chat-send:hover {
        background: #1e40af;
      }
      @media (max-width: 768px) {
        .widget-chat-container {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          left: 0;
          top: 0;
          border-radius: 0;
        }
      }
    `;

    const html = `
      <style>${styles}</style>
      <button class="widget-chat-trigger" id="${chatId}-trigger">💬</button>
      <div class="widget-chat-container" id="${chatId}-container">
        <div class="widget-chat-header">
          <div class="widget-chat-header-title">
            <div class="widget-chat-avatar">💬</div>
            <span>Support Chat</span>
          </div>
          <button class="widget-chat-close" id="${chatId}-close">✕</button>
        </div>
        <div class="widget-chat-messages" id="${chatId}-messages"></div>
        <div class="widget-chat-input-area">
          <input type="text" class="widget-chat-input" id="${chatId}-input" placeholder="Type a message...">
          <button class="widget-chat-send" id="${chatId}-send">→</button>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const trigger = document.getElementById(chatId + '-trigger');
    const chatContainer = document.getElementById(chatId + '-container');
    const closeBtn = document.getElementById(chatId + '-close');
    const messagesContainer = document.getElementById(chatId + '-messages');
    const input = document.getElementById(chatId + '-input');
    const sendBtn = document.getElementById(chatId + '-send');

    function renderMessages() {
      messagesContainer.innerHTML = messages.map(msg => `
        <div class="widget-chat-message ${msg.sender}">
          <div class="widget-chat-bubble">${msg.text}</div>
        </div>
      `).join('');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function toggleChat() {
      isOpen = !isOpen;
      chatContainer.classList.toggle('open', isOpen);
      if (isOpen) {
        input.focus();
      }
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      messages.push({ text, sender: 'user' });
      renderMessages();
      input.value = '';

      try {
        const response = await fetch(API_BASE + '/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, text, sender: 'user' })
        });

        const result = await response.json();
        if (result.success && result.botResponse) {
          messages.push({ text: result.botResponse.text, sender: 'bot' });
          renderMessages();
          if (config.onMessage) {
            config.onMessage(result);
          }
        }
      } catch (error) {
        console.error('Chat error:', error);
      }
    }

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    renderMessages();
  }

  // Main SDK object
  const WidgetSDK = {
    init: function(config) {
      if (config.form) {
        createFormWidget(config.form);
      }
      if (config.calculator) {
        createCalculatorWidget(config.calculator);
      }
      if (config.chat) {
        createChatWidget(config.chat);
      }
    }
  };

  // Expose to window
  window.WidgetSDK = WidgetSDK;

})(window);
