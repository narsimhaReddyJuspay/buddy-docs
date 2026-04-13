export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  icon?: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Architecture', href: '/docs/architecture' },
      { title: 'Quick Start', href: '/docs/quickstart' }
    ]
  },
  {
    title: 'Daily WebRTC',
    items: [
      { title: 'Overview', href: '/docs/daily/overview' },
      { title: 'Web SDK Setup', href: '/docs/daily/web-sdk', badge: 'Guide' },
      { title: 'RTVI Events', href: '/docs/daily/rtvi-events' },
      { title: 'Recording', href: '/docs/daily/recording' }
    ]
  },
  {
    title: 'Telephony',
    items: [
      { title: 'Overview', href: '/docs/telephony/overview' },
      { title: 'Twilio', href: '/docs/telephony/twilio' },
      { title: 'Plivo', href: '/docs/telephony/plivo' },
      { title: 'Exotel', href: '/docs/telephony/exotel' },
      { title: 'Inbound Calls', href: '/docs/telephony/inbound' },
      { title: 'Warm Transfer', href: '/docs/telephony/warm-transfer' }
    ]
  },
  {
    title: 'Templates',
    items: [
      { title: 'Template System', href: '/docs/templates/overview' },
      { title: 'Flow Nodes', href: '/docs/templates/flow-nodes', badge: 'Core' },
      { title: 'Functions & Hooks', href: '/docs/templates/functions-hooks', badge: 'Core' },
      { title: 'Global Functions', href: '/docs/templates/global-functions' },
      { title: 'Variables', href: '/docs/templates/variables' }
    ]
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Template Config', href: '/docs/config/template' },
      { title: 'STT Providers', href: '/docs/config/stt' },
      { title: 'TTS Providers', href: '/docs/config/tts' },
      { title: 'VAD & Turn Detection', href: '/docs/config/vad' },
      { title: 'Interruption', href: '/docs/config/interruption' },
      { title: 'LLM Config', href: '/docs/config/llm' },
      { title: 'Audio & Background', href: '/docs/config/audio' },
      { title: 'User Idle', href: '/docs/config/user-idle' },
      { title: 'Call Execution', href: '/docs/config/call-execution' }
    ]
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Authentication', href: '/docs/api/auth' },
      { title: 'Templates API', href: '/docs/api/templates' },
      { title: 'Leads API', href: '/docs/api/leads' },
      { title: 'Daily Connect', href: '/docs/api/daily' },
      { title: 'Configurations', href: '/docs/api/configurations' },
      { title: 'Numbers', href: '/docs/api/numbers' },
      { title: 'Analytics', href: '/docs/api/analytics' },
      { title: 'Webhooks', href: '/docs/api/webhooks' }
    ]
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Voice Pipeline', href: '/docs/advanced/pipeline' },
      { title: 'Pre-Checks', href: '/docs/advanced/pre-checks' },
      { title: 'Input Collection', href: '/docs/advanced/input-collection' },
      { title: 'IVR Routing', href: '/docs/advanced/ivr' },
      { title: 'Observability', href: '/docs/advanced/observability' }
    ]
  }
];
