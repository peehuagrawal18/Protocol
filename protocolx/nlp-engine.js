/**
 * PROTOCOL-X: Local-First NLP & Intelligence Engine
 * 100% Client-Side Processing - Zero Cloud Calls - Zero Data Leaks
 *
 * Implements:
 * 1. User Mention Detection
 * 2. Deadline & Temporal Marker Extraction
 * 3. Action Item & Task Discovery
 * 4. Key Decision Recognition
 * 5. Multi-factor Urgency & Relevance Scoring
 * 6. Tri-bucket Classification (Important, Not Required Now, Trash)
 * 7. Executive TL;DR Synthesis
 */

class LocalNLPEngine {
  constructor() {
    // High-urgency triggers
    this.urgentKeywords = [
      'urgent', 'urgently', 'critical', 'blocker', 'blocking', 'p0', 'p1', 
      'outage', 'down', 'deadlock', 'breach', 'emergency', 'asap', 'immediately',
      'fail', 'failed', '502', 'crash', 'broken', 'must complete', 'alert', 'error'
    ];

    // Low-urgency / FYI indicators
    this.fyiKeywords = [
      'fyi', 'for your information', 'heads up', 'update', 'status', 'progress',
      'review later', 'when you have time', 'non-urgent', 'draft', 'in review',
      'tested and working', 'all good', 'looking clean', 'tested'
    ];

    // Trash / noise triggers (chit-chat, greetings, fluff)
    this.noiseKeywords = [
      'good morning', 'morning', 'gm', 'hello', 'hey guys', 'coffee', 'lounge',
      'pizza', 'lunch', 'snacks', 'snack', 'cab', 'haha', 'lol', 'rofl', 'meme',
      'adapter', 'charger', 'usb', 'happy hour', 'beer', 'congrats', 'cheers',
      'thank you', 'thanks', 'found it', 'sweet', 'nevermind', '+1', '👍', '☕', '🍕'
    ];

    // Decision patterns
    this.decisionPatterns = [
      /decision:\s*(.+)/i,
      /we (?:have )?decided (?:to|that)\s+(.+)/i,
      /agreed (?:to|on|that)\s+(.+)/i,
      /(?:is|has been) approved(?:\s+by\s+.+)?/i,
      /concluded that\s+(.+)/i,
      /finalized(?:\s+that)?\s+(.+)/i
    ];

    // Task patterns
    this.taskPatterns = [
      /(?:action item|task|todo|to-do):\s*(.+)/i,
      /(?:please|kindly)\s+(deploy|update|fix|check|review|verify|test|send|submit|sign off|revert|run|trigger)\s+(.+)/i,
      /(?:need|needs|needed)\s+(?:you to|to)\s+(.+)/i,
      /must\s+(deploy|complete|finish|submit|fix|verify)\s+(.+)/i,
      /assigned to\s+@?(\w+)/i
    ];

    // Deadline and temporal patterns
    this.deadlinePatterns = [
      /(?:by|before|until|cutoff(?:\s+is)?|due(?:\s+at|\s+by)?|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)|\d{1,2}\s*(?:am|pm|AM|PM)|eod|EOD|noon|midnight)/i,
      /(?:by|before|on)\s+(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
      /(?:by|before)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/i,
      /in\s+(\d+\s*(?:minutes?|hours?|mins?|hrs?))/i,
      /(sla breach occurs at\s+\d{1,2}:\d{2})/i
    ];
  }

  /**
   * Main classification and analysis pipeline for a list of messages.
   * Runs in milliseconds locally without any remote API.
   */
  processChat(messages, userIdentifiers = 'prashant') {
    const aliases = this.normalizeAliases(userIdentifiers);
    const primaryHandle = aliases[0] || 'user';
    const analyzedMessages = [];

    const extractedDeadlines = [];
    const extractedTasks = [];
    const extractedDecisions = [];
    const mentionsFound = [];

    let noiseCount = 0;
    let urgentCount = 0;

    messages.forEach((msg) => {
      const analysis = this.analyzeSingleMessage(msg, aliases);
      analyzedMessages.push(analysis);

      if (analysis.isMention) {
        mentionsFound.push(analysis);
      }
      if (analysis.deadlines && analysis.deadlines.length > 0) {
        analysis.deadlines.forEach(dl => {
          extractedDeadlines.push({
            id: `dl-${msg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            messageId: msg.id,
            sender: msg.sender,
            text: dl.matchedText,
            context: msg.content,
            isUserDirect: analysis.isMention,
            time: msg.time,
            timestamp: Date.now()
          });
        });
      }
      if (analysis.tasks && analysis.tasks.length > 0) {
        analysis.tasks.forEach(t => {
          extractedTasks.push({
            id: `task-${msg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            messageId: msg.id,
            sender: msg.sender,
            taskText: t.taskText,
            completed: false,
            assignedToUser: analysis.isMention,
            priority: analysis.category === 'important' ? 'High' : 'Normal',
            deadline: analysis.deadlines.length ? analysis.deadlines[0].matchedText : null
          });
        });
      }
      if (analysis.decisions && analysis.decisions.length > 0) {
        analysis.decisions.forEach(d => {
          extractedDecisions.push({
            id: `dec-${msg.id}`,
            messageId: msg.id,
            sender: msg.sender,
            decisionText: d.text,
            time: msg.time
          });
        });
      }

      if (analysis.category === 'trash') noiseCount++;
      if (analysis.category === 'important') urgentCount++;
    });

    // Synthesize structured Executive Briefing
    const summary = this.generateExecutiveSummary(
      analyzedMessages, 
      primaryHandle, 
      extractedTasks, 
      extractedDeadlines, 
      extractedDecisions
    );

    return {
      totalMessages: messages.length,
      noiseFilteredPercent: Math.round((noiseCount / Math.max(messages.length, 1)) * 100),
      timeSavedMinutes: Math.max(1, Math.round(messages.length * 0.8)), // average 45s saved per message
      messages: analyzedMessages,
      summary: summary,
      stats: {
        total: messages.length,
        important: analyzedMessages.filter(m => m.category === 'important').length,
        later: analyzedMessages.filter(m => m.category === 'later').length,
        trash: noiseCount,
        mentions: mentionsFound.length,
        tasks: extractedTasks.length,
        deadlines: extractedDeadlines.length,
        decisions: extractedDecisions.length
      },
      deadlines: extractedDeadlines,
      tasks: extractedTasks,
      decisions: extractedDecisions
    };
  }

  /**
   * Helper to normalize user identifiers (USN, name, handle)
   */
  normalizeAliases(userIdentifiers) {
    let aliases = [];
    if (Array.isArray(userIdentifiers)) {
      aliases = [...userIdentifiers];
    } else if (typeof userIdentifiers === 'object' && userIdentifiers !== null) {
      if (userIdentifiers.handle) aliases.push(userIdentifiers.handle);
      if (userIdentifiers.usn) aliases.push(userIdentifiers.usn);
      if (userIdentifiers.name) {
        aliases.push(userIdentifiers.name);
        const parts = userIdentifiers.name.split(' ');
        if (parts.length > 1) aliases.push(parts[0]);
      }
    } else if (userIdentifiers) {
      aliases.push(String(userIdentifiers));
    }
    return aliases
      .filter(Boolean)
      .map(a => String(a).toLowerCase().replace(/^@/, '').trim())
      .filter(a => a.length >= 2);
  }

  /**
   * Analyzes an individual message and calculates urgency, category, and extracted entities.
   */
  analyzeSingleMessage(msg, userIdentifiers) {
    const aliases = this.normalizeAliases(userIdentifiers);
    const text = (msg.content || '').trim();
    const lower = text.toLowerCase();

    // 1. Mention Detection (Matches @USN, @Name, First Name, Handle)
    let isDirectMention = false;
    let matchedAlias = null;
    for (const alias of aliases) {
      const mentionRegex = new RegExp(`@?${this.escapeRegex(alias)}\\b`, 'i');
      if (mentionRegex.test(lower)) {
        isDirectMention = true;
        matchedAlias = alias;
        break;
      }
    }
    const isGroupMention = /@(channel|here|all|team|everyone)\b/i.test(lower);
    const isMention = isDirectMention || isGroupMention;

    // 2. Deadline Extraction
    const deadlines = [];
    for (const pattern of this.deadlinePatterns) {
      const match = text.match(pattern);
      if (match) {
        deadlines.push({
          rawMatch: match[0],
          matchedText: match[1] || match[0],
          index: match.index
        });
      }
    }

    // 3. Task / Action Item Extraction
    const tasks = [];
    for (const pattern of this.taskPatterns) {
      const match = text.match(pattern);
      if (match) {
        const extracted = match[2] ? `${match[1]} ${match[2]}` : (match[1] || match[0]);
        tasks.push({
          taskText: this.cleanTaskText(extracted)
        });
      }
    }

    // 4. Decision Extraction
    const decisions = [];
    for (const pattern of this.decisionPatterns) {
      const match = text.match(pattern);
      if (match) {
        decisions.push({
          text: match[1] || text
        });
      }
    }

    // 5. Score calculation
    let score = 30; // base score
    let reasons = [];

    // Mention influence
    if (isDirectMention) {
      score += 45;
      reasons.push('Direct @mention for you');
    } else if (isGroupMention) {
      score += 20;
      reasons.push('Broadcast mention (@here/@all)');
    }

    // Urgency keywords
    let urgentHits = [];
    this.urgentKeywords.forEach(k => {
      if (lower.includes(k)) {
        urgentHits.push(k);
      }
    });
    if (urgentHits.length > 0) {
      const boost = Math.min(urgentHits.length * 20, 40);
      score += boost;
      reasons.push(`Urgency keywords (${urgentHits.slice(0, 3).join(', ')})`);
    }

    // Deadlines
    if (deadlines.length > 0) {
      score += 25;
      reasons.push(`Time-sensitive (${deadlines[0].matchedText})`);
    }

    // Tasks
    if (tasks.length > 0) {
      score += 20;
      reasons.push('Contains action item');
    }

    // Decisions
    if (decisions.length > 0) {
      score += 15;
      reasons.push('Key decision recorded');
    }

    // Noise / Fluff reduction
    let noiseHits = [];
    this.noiseKeywords.forEach(k => {
      if (lower.includes(k)) {
        noiseHits.push(k);
      }
    });

    if (noiseHits.length > 0 && !isMention && urgentHits.length === 0) {
      const penalty = Math.min(noiseHits.length * 25, 55);
      score -= penalty;
      reasons.push(`Casual banter/noise (${noiseHits.slice(0, 2).join(', ')})`);
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine default category
    let category = 'later';
    if (score >= 60 || isDirectMention || urgentHits.length > 0) {
      category = 'important';
    } else if (score < 25) {
      category = 'trash';
    } else {
      category = 'later';
    }

    return {
      ...msg,
      category: category,
      urgencyScore: score,
      isMention: isMention,
      isDirectMention: isDirectMention,
      reasons: reasons,
      deadlines: deadlines,
      tasks: tasks,
      decisions: decisions,
      processedLocally: true
    };
  }

  /**
   * Generates a coherent executive brief from classified messages
   */
  generateExecutiveSummary(messages, userHandle, tasks, deadlines, decisions) {
    const important = messages.filter(m => m.category === 'important');
    const userDirectTasks = tasks.filter(t => t.assignedToUser);
    
    let tldr = '';
    const points = [];

    if (important.length === 0) {
      tldr = "Conversation is quiet with mostly informational updates or casual remarks. No immediate action required.";
    } else {
      tldr = `Identified ${important.length} high-priority message${important.length > 1 ? 's' : ''} requiring attention. `;
      if (userDirectTasks.length > 0) {
        tldr += `You have ${userDirectTasks.length} pending action item${userDirectTasks.length > 1 ? 's' : ''} specifically assigned to you. `;
      }
      if (deadlines.length > 0) {
        tldr += `Immediate cutoffs/deadlines detected: ${deadlines.map(d => d.text).slice(0, 2).join(', ')}.`;
      }
    }

    // Highlights
    if (userDirectTasks.length > 0) {
      points.push(`⚡ Action required by @${userHandle}: "${userDirectTasks[0].taskText}"`);
    }
    if (decisions.length > 0) {
      points.push(`🤝 Decision made: "${decisions[0].decisionText.slice(0, 80)}"`);
    }
    if (deadlines.length > 0) {
      points.push(`⏰ Next deadline: ${deadlines[0].text} (${deadlines[0].sender})`);
    }

    return {
      overview: tldr,
      highlights: points,
      actionCount: tasks.length,
      urgentCount: important.length,
      userActionCount: userDirectTasks.length
    };
  }

  cleanTaskText(text) {
    return text
      .replace(/^[:\s-]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Global instance
window.LocalNLPEngine = new LocalNLPEngine();
