// Bug report utility for vocabulary items
import { VocabularyItem } from '../types';

export interface BugReportData {
  vocabularyItem: VocabularyItem;
  userAgent: string;
  timestamp: string;
  url: string;
  vocabularyType: 'hsk' | 'vietnamese' | 'regular';
}

export const generateBugReportEmail = (data: BugReportData): void => {
  const { vocabularyItem, userAgent, timestamp, url, vocabularyType } = data;
  
  // Email details
  const recipientEmail = 'takyin.alex@gmail.com'; // Your email address
  const subject = `Bug Report - ${vocabularyType.toUpperCase()} Vocabulary Item ${vocabularyItem.id}`;
  
  // Format vocabulary content
  const vocabularyContent = formatVocabularyContent(vocabularyItem, vocabularyType);
  
  // Create email body
  const emailBody = `
Bug Report for Vocabulary Item

=== VOCABULARY DETAILS ===
${vocabularyContent}

=== TECHNICAL INFORMATION ===
Vocabulary Type: ${vocabularyType.toUpperCase()}
Vocabulary ID: ${vocabularyItem.id}
Level: ${vocabularyItem.level}
Timestamp: ${timestamp}
URL: ${url}
User Agent: ${userAgent}

=== INSTRUCTIONS ===
Please describe the issue you encountered with this vocabulary item and submit this email.

Thank you for helping improve the Vietnamese-Chinese Learning Platform!
  `.trim();

  // Create mailto link
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  
  // Open email client in new tab/window
  window.open(mailtoLink, '_blank');
};

const formatVocabularyContent = (item: VocabularyItem, type: 'hsk' | 'vietnamese' | 'regular'): string => {
  let content = '';
  
  if (type === 'vietnamese') {
    content += `Vietnamese: ${item.vietnamese}\n`;
    content += `Chinese: ${item.chinese}\n`;
    content += `Pinyin: ${item.pinyin}\n`;
    if (item.english) content += `English: ${item.english}\n`;
    if (item.category) content += `Category: ${item.category}\n`;
  } else if (type === 'hsk') {
    if (item.simplified) content += `Simplified: ${item.simplified}\n`;
    if (item.traditional) content += `Traditional: ${item.traditional}\n`;
    if (!item.simplified && !item.traditional) content += `Chinese: ${item.chinese}\n`;
    content += `Pinyin: ${item.pinyin}\n`;
    content += `Vietnamese: ${item.vietnamese}\n`;
    if (item.english) content += `English: ${item.english}\n`;
    if (item.frequency) content += `Frequency: ${item.frequency}\n`;
    if (item.synonyms?.length) content += `Synonyms: ${item.synonyms.join(', ')}\n`;
    if (item.antonyms?.length) content += `Antonyms: ${item.antonyms.join(', ')}\n`;
  } else {
    // Regular vocabulary
    content += `Chinese: ${item.chinese}\n`;
    content += `Pinyin: ${item.pinyin}\n`;
    content += `Vietnamese: ${item.vietnamese}\n`;
    if (item.english) content += `English: ${item.english}\n`;
  }
  
  // Add examples if available
  if (item.examples?.length) {
    content += `\nExamples:\n`;
    item.examples.forEach((example, index) => {
      content += `${index + 1}. `;
      if (type === 'vietnamese') {
        content += `${example.vietnamese} → ${example.chinese}`;
        if (example.pinyin) content += ` (${example.pinyin})`;
      } else {
        content += `${example.chinese}`;
        if (example.pinyin) content += ` (${example.pinyin})`;
        content += ` → ${example.vietnamese}`;
      }
      content += `\n`;
    });
  }
  
  return content;
};

export const createBugReport = (
  vocabularyItem: VocabularyItem, 
  vocabularyType: 'hsk' | 'vietnamese' | 'regular'
): void => {
  const bugReportData: BugReportData = {
    vocabularyItem,
    vocabularyType,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
  
  generateBugReportEmail(bugReportData);
};