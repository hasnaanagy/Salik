import ServiceData from '../Service.json';
import { AZURE_API_ENDPOINT, AI_API_KEY } from '@env';

// Function to format the AI response for better readability
const formatResponse = (rawContent) => {
  // Add RTL marker for Arabic text
  return `\u200F${rawContent}`;
};

// Main function to get response from GPT-4
export const getGPT4Response = async (userMessage) => {
  try {
    const response = await fetch(
      AZURE_API_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": AI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          messages: [
            { 
              role: "system", 
              content: "أنت مساعد ذكي لتطبيق سالك للخدمات السيارات. تقدم معلومات عن خدمات مشاركة الركوب، الميكانيكي، وتوصيل البنزين. أجب بشكل مختصر ومفيد باللغة العربية. استخدم معلومات من ملف Service.json إذا كان السؤال متعلق بالخدمات المتاحة." 
            },
            { role: "user", content: userMessage }
          ],
          max_tokens: 250,
          temperature: 0.7,
          stream: false
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }
    const rawContent = data.choices[0].message.content;
    return formatResponse(rawContent);
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Keeping the existing functions as primary response mechanism
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .trim();
};

const matchesPattern = (question, patterns) => {
  const normalizedQuestion = normalizeText(question);
  return patterns.some(pattern => {
    const normalizedPattern = normalizeText(pattern);
    return normalizedQuestion === normalizedPattern ||
      normalizedQuestion.includes(normalizedPattern) ||
      normalizedPattern.includes(normalizedQuestion);
  });
};

// Function to find matching service from Service.json
const findMatchingService = (userMessage) => {
  try {
    const message = normalizeText(userMessage);

    // First check general responses
    if (ServiceData.general) {
      for (const [category, data] of Object.entries(ServiceData.general)) {
        if (data.questions && matchesPattern(message, data.questions)) {
          return {
            type: 'general',
            category: category,
            response: data.response,
            hasMatch: true
          };
        }
      }
    }

    // Then check specific services
    for (const [serviceName, serviceData] of Object.entries(ServiceData)) {
      if (serviceName === 'general') continue;

      // Check customer questions
      if (serviceData.customer && serviceData.customer.question) {
        if (matchesPattern(message, serviceData.customer.question)) {
          return {
            type: 'customer',
            service: serviceName,
            response: serviceData.customer.response,
            hasMatch: true
          };
        }
      }

      // Check provider questions
      if (serviceData.provider && serviceData.provider.question) {
        if (matchesPattern(message, serviceData.provider.question)) {
          return {
            type: 'provider',
            service: serviceName,
            response: serviceData.provider.response,
            hasMatch: true
          };
        }
      }

      // Check if the service name itself is mentioned
      if (message.includes(normalizeText(serviceName))) {
        return {
          type: 'customer',
          service: serviceName,
          response: serviceData.customer.response,
          hasMatch: true
        };
      }
    }

    // No match found, indicate this in the return value
    return {
      type: 'unknown',
      hasMatch: false
    };
  } catch (error) {
    console.error('Error in findMatchingService:', error);
    return {
      type: 'error',
      hasMatch: false
    };
  }
};

const generateStaticResponse = (match) => {
  try {
    if (match.type === 'general') {
      return `\u200F${match.response}`;
    }

    // For service responses, format each item with proper spacing
    if (Array.isArray(match.response)) {
      const formattedResponses = match.response.map((item, index) => {
        if (typeof item === 'string') {
          return `\u200F${index + 1}. ${item}`;
        }
        return `\u200F${item}`;
      });
      return formattedResponses.join('\n\n');
    }
    return `\u200F${match.response}`;
  } catch (error) {
    console.error('Error in generateStaticResponse:', error);
    return 'عذرًا، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى!';
  }
};

// Main export function that first checks for static responses, then uses GPT-4 for dynamic responses
export const getChatResponse = async (userMessage) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      return 'عذرًا، لم أفهم رسالتك. يرجى إعادة المحاولة.';
    }

    // Split message into individual questions
    const questions = userMessage.split(/[؟\.]/).filter(q => q.trim().length > 0);

    if (questions.length === 0) {
      return 'عذرًا، لم أفهم رسالتك. يرجى إعادة المحاولة.';
    }

    // First try to find a static response
    const match = findMatchingService(questions[0]);
    
    // If we have a static match, return it
    if (match.hasMatch) {
      return generateStaticResponse(match);
    }
    
    // If no static match is found, use GPT-4 for a dynamic response
    console.log('No static response found, using GPT-4 for:', userMessage);
    return await getGPT4Response(userMessage);
    
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    return 'عذرًا، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى!';
  }
};