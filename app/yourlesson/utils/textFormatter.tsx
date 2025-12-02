// 🧠 FILE PURPOSE
// This utility converts markdown-style formatting to React elements.
// Supports *bold*, **bold**, 'quoted terms', and ''emphasized terms'' formatting.

import React from 'react';

// Step 1: Format text with bold, quoted terms, and emphasized terms
export function formatText(text: string): React.ReactNode {
  if (!text) return text;

  // Replace:
  // - **text** or *text* with <strong> tags (bold)
  // - ''text'' with highlighted/emphasized style (double single quotes)
  // - 'text' with italic style (single quotes)

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Combined regex to match all formatting patterns
  // Group 1: **bold** or *bold*
  // Group 2: ''emphasized''
  // Group 3: 'quoted'
  const formatRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)|('')([^']+)('')|('([^']+)')/g;

  let match;

  while ((match = formatRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Check which pattern matched
    if (match[1]) {
      // Bold: **text** or *text*
      const boldText = match[2] || match[3];
      parts.push(<strong key={key++} className="font-bold">{boldText}</strong>);
    } else if (match[4] && match[5] && match[6]) {
      // Double single quotes: ''text''
      const emphasizedText = match[5];
      parts.push(
        <span key={key++} className="bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/30">
          {emphasizedText}
        </span>
      );
    } else if (match[7] && match[8]) {
      // Single quotes: 'text'
      const quotedText = match[8];
      parts.push(<em key={key++} className="italic text-blue-200">{quotedText}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Step 2: Format text for display in React components
export function FormattedText({ text }: { text: string }) {
  return <>{formatText(text)}</>;
}

// ✅ In this utility we achieved:
// Automatic conversion of *text* and **text** to bold formatting.
// Single quotes 'text' render as italic blue text.
// Double single quotes ''text'' render as highlighted purple badges.
// React component wrapper for easy use in any component.
