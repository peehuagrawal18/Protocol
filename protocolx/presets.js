/**
 * PROTOCOL-X: Pre-packaged realistic conversation datasets
 * Simulating real-world busy team chats with noise, fluff, urgent blockers, mentions, and deadlines.
 */

window.PRESET_DATASETS = {
  hackathon: {
    id: 'hackathon',
    name: 'Hackathon Organizing & Submissions (Team Chat)',
    description: 'High-stress hackathon committee channel with sponsor deadlines, server crashes, and noise.',
    userHandle: 'prashant',
    messages: [
      {
        id: 'msg-1',
        sender: 'Aarav (Lead Org)',
        time: '09:00 AM',
        content: 'Good morning everyone! Let\'s have an awesome final day of HackMatrix 2026! 🚀🔥',
        avatar: '👨‍💻'
      },
      {
        id: 'msg-2',
        sender: 'Sneha (Design)',
        time: '09:02 AM',
        content: 'Morning Aarav! Coffee is in the lounge if anyone needs it ☕',
        avatar: '👩‍🎨'
      },
      {
        id: 'msg-3',
        sender: 'Rohan (Logistics)',
        time: '09:05 AM',
        content: 'Thanks Sneha! Getting some now.',
        avatar: '📦'
      },
      {
        id: 'msg-4',
        sender: 'Aarav (Lead Org)',
        time: '09:12 AM',
        content: '⚠️ URGENT: @prashant the judging portal is throwing 502 Bad Gateway errors for track 2. The judges arrive at 11:30 AM sharp!',
        avatar: '👨‍💻'
      },
      {
        id: 'msg-5',
        sender: 'Sneha (Design)',
        time: '09:14 AM',
        content: 'Haha hope it\'s not DNS again 😂',
        avatar: '👩‍🎨'
      },
      {
        id: 'msg-6',
        sender: 'Pooja (Sponsors)',
        time: '09:20 AM',
        content: 'DECISION: Google and IEEE reps agreed to extend the AI track submission cutoff to 1:00 PM today.',
        avatar: '💼'
      },
      {
        id: 'msg-7',
        sender: 'Pooja (Sponsors)',
        time: '09:22 AM',
        content: '@prashant action item: please update the banner countdown on the main portal before 10:00 AM.',
        avatar: '💼'
      },
      {
        id: 'msg-8',
        sender: 'Vikram (AV Team)',
        time: '09:30 AM',
        content: 'Microphones in Audi-2 are tested and working.',
        avatar: '🎙️'
      },
      {
        id: 'msg-9',
        sender: 'Rohan (Logistics)',
        time: '09:35 AM',
        content: 'Lunch boxes will arrive around 1:30 PM. Veg and Non-veg are separated.',
        avatar: '📦'
      },
      {
        id: 'msg-10',
        sender: 'Aarav (Lead Org)',
        time: '09:42 AM',
        content: 'CRITICAL BLOCKER: @prashant we need the final score aggregation script tested by 12:00 PM or results will be delayed.',
        avatar: '👨‍💻'
      },
      {
        id: 'msg-11',
        sender: 'Sneha (Design)',
        time: '09:45 AM',
        content: 'Anyone have a spare USB-C adapter? Left mine in the cab.',
        avatar: '👩‍🎨'
      },
      {
        id: 'msg-12',
        sender: 'Rohan (Logistics)',
        time: '09:46 AM',
        content: 'Check the helpdesk desk, left one there.',
        avatar: '📦'
      },
      {
        id: 'msg-13',
        sender: 'Sneha (Design)',
        time: '09:47 AM',
        content: 'Found it, thank you!! ❤️',
        avatar: '👩‍🎨'
      },
      {
        id: 'msg-14',
        sender: 'Pooja (Sponsors)',
        time: '09:50 AM',
        content: 'FYI: The sponsor booth banners for Intel have been put up in Hall B.',
        avatar: '💼'
      },
      {
        id: 'msg-15',
        sender: 'Karan (Mentors)',
        time: '09:55 AM',
        content: 'Mentors are actively reviewing codebases for GitHub commit integrity. All looking clean.',
        avatar: '🧠'
      }
    ]
  },

  incident: {
    id: 'incident',
    name: 'Production Outage: Payment Gateway Down',
    description: 'Critical backend incident channel with high-severity bugs, database locks, and noisy comments.',
    userHandle: 'prashant',
    messages: [
      {
        id: 'msg-101',
        sender: 'DevOps Bot',
        time: '14:02',
        content: '🚨 ALERT [P0]: Stripe Webhook latency spike (> 8500ms) on prod-us-east-1.',
        avatar: '🤖'
      },
      {
        id: 'msg-102',
        sender: 'David (SRE)',
        time: '14:03',
        content: 'Looking into this now. Opening incident bridge.',
        avatar: '🛠️'
      },
      {
        id: 'msg-103',
        sender: 'Sarah (Frontend)',
        time: '14:04',
        content: 'Customers are reporting failed checkouts on Twitter and Discord.',
        avatar: '💻'
      },
      {
        id: 'msg-104',
        sender: 'Alex (Product)',
        time: '14:06',
        content: 'Is this affecting all regions or just US?',
        avatar: '📊'
      },
      {
        id: 'msg-105',
        sender: 'David (SRE)',
        time: '14:08',
        content: 'Just US-East. Database replica 3 has a deadlock on transaction table.',
        avatar: '🛠️'
      },
      {
        id: 'msg-106',
        sender: 'David (SRE)',
        time: '14:10',
        content: '@prashant URGENT: We need you to deploy the rollback migration script for schema v42 by 14:30. You have the root credentials.',
        avatar: '🛠️'
      },
      {
        id: 'msg-107',
        sender: 'Sarah (Frontend)',
        time: '14:12',
        content: 'I will put up the maintenance banner on the checkout page now.',
        avatar: '💻'
      },
      {
        id: 'msg-108',
        sender: 'Alex (Product)',
        time: '14:13',
        content: 'DECISION: We agreed to halt new signups until the payment reconciliation completes.',
        avatar: '📊'
      },
      {
        id: 'msg-109',
        sender: 'Ken (QA)',
        time: '14:18',
        content: 'Is anyone ordering pizza for the war room?',
        avatar: '🍕'
      },
      {
        id: 'msg-110',
        sender: 'Ken (QA)',
        time: '14:19',
        content: 'Nevermind, grabbed snacks from microkitchen.',
        avatar: '🍕'
      },
      {
        id: 'msg-111',
        sender: 'David (SRE)',
        time: '14:22',
        content: '@prashant deadline alert: Customer SLA breach occurs at 14:45. Please confirm as soon as migration is triggered.',
        avatar: '🛠️'
      },
      {
        id: 'msg-112',
        sender: 'Alex (Product)',
        time: '14:25',
        content: 'Drafting customer status page notice. Will review with legal later this afternoon.',
        avatar: '📊'
      }
    ]
  },

  productLaunch: {
    id: 'productLaunch',
    name: 'Q4 Product Launch & Marketing Sprint',
    description: 'Cross-functional chat with design deliverables, legal sign-offs, and casual team chat.',
    userHandle: 'prashant',
    messages: [
      {
        id: 'msg-201',
        sender: 'Elena (VP Product)',
        time: '10:00 AM',
        content: 'Welcome to launch week everyone! 3 days until public announcement.',
        avatar: '🚀'
      },
      {
        id: 'msg-202',
        sender: 'Carlos (Brand)',
        time: '10:04 AM',
        content: 'Love the energy! Check out the teaser animation on Instagram 🎬',
        avatar: '🎨'
      },
      {
        id: 'msg-203',
        sender: 'Elena (VP Product)',
        time: '10:15 AM',
        content: 'MUST COMPLETE: @prashant we need the final API documentation and security audit checklist signed off by 5:00 PM today.',
        avatar: '🚀'
      },
      {
        id: 'msg-204',
        sender: 'Marcus (Legal)',
        time: '10:20 AM',
        content: 'DECISION: Terms of Service clause 4.2 has been approved by external counsel.',
        avatar: '⚖️'
      },
      {
        id: 'msg-205',
        sender: 'Carlos (Brand)',
        time: '10:25 AM',
        content: 'Anyone know what time the team happy hour is on Friday?',
        avatar: '🎨'
      },
      {
        id: 'msg-206',
        sender: 'Maya (Content)',
        time: '10:26 AM',
        content: 'I think it is 6 PM at the rooftop bar!',
        avatar: '✍️'
      },
      {
        id: 'msg-207',
        sender: 'Carlos (Brand)',
        time: '10:27 AM',
        content: 'Sweet, see you there!',
        avatar: '🎨'
      },
      {
        id: 'msg-208',
        sender: 'Elena (VP Product)',
        time: '10:35 AM',
        content: '@prashant task for you: verify that all webhook endpoints have rate-limiting enabled before the press embargo lifts tomorrow at 9:00 AM.',
        avatar: '🚀'
      },
      {
        id: 'msg-209',
        sender: 'Maya (Content)',
        time: '10:45 AM',
        content: 'FYI: Blog post draft is 90% ready. Will share link for review tomorrow morning.',
        avatar: '✍️'
      }
    ]
  }
};
