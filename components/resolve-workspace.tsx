'use client';

import { useEffect, useMemo, useState } from 'react';

type ViewKey =
  | 'inbox'
  | 'conversation'
  | 'agents'
  | 'rules'
  | 'tools'
  | 'knowledge'
  | 'runs'
  | 'analytics'
  | 'settings';

type ApprovalState = 'pending' | 'approved' | 'rejected';

type WorkspacePage = {
  title: string;
  eyebrow: string;
  description: string;
  rows: readonly string[];
};

type Ticket = {
  id: string;
  title: string;
  preview: string;
  age: string;
  channel: 'Email' | 'Chat';
  unread?: boolean;
};

const navGroups: ReadonlyArray<{
  label: string;
  items: ReadonlyArray<{ view: ViewKey; icon: string; label: string; count?: number }>;
}> = [
  {
    label: 'WORKSPACE',
    items: [
      { view: 'inbox', icon: '□', label: 'Inbox', count: 12 },
      { view: 'conversation', icon: '◌', label: 'Conversation' },
    ],
  },
  {
    label: 'AUTOMATION',
    items: [
      { view: 'agents', icon: '✦', label: 'Agents' },
      { view: 'rules', icon: '≡', label: 'Rules' },
      { view: 'tools', icon: '⊞', label: 'Tools' },
    ],
  },
  {
    label: 'KNOWLEDGE',
    items: [
      { view: 'knowledge', icon: '▤', label: 'Knowledge' },
      { view: 'runs', icon: '↗', label: 'Runs' },
      { view: 'analytics', icon: '◒', label: 'Analytics' },
      { view: 'settings', icon: '○', label: 'Settings' },
    ],
  },
];

const pages: Record<Exclude<ViewKey, 'inbox' | 'conversation'>, WorkspacePage> = {
  agents: {
    title: 'Agents',
    eyebrow: 'AUTOMATION',
    description: 'Deploy and supervise agents with clear permissions, tools, and escalation paths.',
    rows: ['Resolve Support Agent', 'Billing Triage Agent', 'Technical Escalation Agent'],
  },
  rules: {
    title: 'Rules',
    eyebrow: 'AUTOMATION',
    description: 'Set guardrails for what agents can do automatically and when humans must review.',
    rows: ['Refunds over $250', 'Account ownership changes', 'Sensitive data requests'],
  },
  tools: {
    title: 'Tools',
    eyebrow: 'AUTOMATION',
    description: 'Manage the tools your agents can call and the permissions they require.',
    rows: ['Orders API', 'Refunds API', 'Customer profile'],
  },
  knowledge: {
    title: 'Knowledge',
    eyebrow: 'KNOWLEDGE',
    description: 'Keep the evidence behind every answer current, scoped, and reviewable.',
    rows: ['Refund policy · v3.4', 'Product documentation · v2.8', 'Security FAQ · v1.9'],
  },
  runs: {
    title: 'Runs',
    eyebrow: 'OBSERVABILITY',
    description: 'Inspect agent runs by status, evidence, reviewer, and outcome.',
    rows: ['Refund request · #4821', 'Invoice not received', 'Export workspace data'],
  },
  analytics: {
    title: 'Analytics',
    eyebrow: 'OBSERVABILITY',
    description: 'Measure resolution quality, handoff rate, and human oversight—not just deflection.',
    rows: ['Resolution quality', 'Approval rate', 'Handoff reasons'],
  },
  settings: {
    title: 'Settings',
    eyebrow: 'WORKSPACE',
    description: 'Control roles, permissions, integrations, and data boundaries for the workspace.',
    rows: ['Team roles', 'Integrations', 'Data handling'],
  },
};

const tickets: readonly Ticket[] = [
  {
    id: '4821',
    title: 'Refund request · #4821',
    preview: 'Can I get a refund for my annual plan?',
    age: '2m',
    channel: 'Email',
    unread: true,
  },
  {
    id: 'invoice',
    title: 'Invoice not received',
    preview: 'Our finance team needs the invoice from July.',
    age: '18m',
    channel: 'Chat',
  },
  {
    id: 'export',
    title: 'Export workspace data',
    preview: 'Where can I find our workspace export?',
    age: '34m',
    channel: 'Email',
    unread: true,
  },
  {
    id: 'rate-limit',
    title: 'API rate limit question',
    preview: 'We are hitting a 429 on the events endpoint.',
    age: '1h',
    channel: 'Chat',
  },
  {
    id: 'billing-owner',
    title: 'Change billing owner',
    preview: 'Need to update the billing contact for our org.',
    age: '2h',
    channel: 'Email',
  },
];

function GenericWorkspace({
  page,
  notify,
}: {
  page: WorkspacePage;
  notify: (message: string) => void;
}) {
  return (
    <div className="view">
      <div className="heading">
        <div>
          <div className="eyebrow">
            {page.eyebrow} <span>•</span> RESOLVE WORKSPACE
          </div>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={() => notify('Search opened')}>
            ⌕ <span>Search</span>
          </button>
          <button className="btn primary" type="button" onClick={() => notify('Draft created and ready for review')}>
            + <span>{page.title === 'Knowledge' ? 'Add source' : page.title === 'Settings' ? 'Invite teammate' : `Create ${page.title.replace(/s$/, '')}`}</span>
          </button>
        </div>
      </div>

      <div className="section-title">
        <div>
          <h2>{page.title} workspace</h2>
          <p>Built for transparent operations, clear ownership, and recoverable actions.</p>
        </div>
        <button className="btn" type="button" onClick={() => notify('Filter options opened')}>
          ≡ Filters
        </button>
      </div>

      <div className="list-card">
        <div className="table-toolbar">
          <div className="search">
            ⌕ <input aria-label={`Search ${page.title}`} placeholder={`Search ${page.title.toLowerCase()}...`} />
          </div>
          <button className="btn" type="button" onClick={() => notify('Saved views opened')}>
            Saved views
          </button>
          <button className="btn" type="button" onClick={() => notify('Column settings opened')}>
            Columns
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="simple-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>STATUS</th>
                <th>OWNER</th>
                <th>LAST UPDATED</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row, index) => (
                <tr key={row}>
                  <td>{row}</td>
                  <td>
                    <span className={`state-dot ${index === 2 ? 'warn' : ''}`}>{index === 2 ? 'Needs review' : 'Active'}</span>
                  </td>
                  <td>{index === 0 ? 'Alex Kim' : index === 1 ? 'Support team' : 'Resolve AI'}</td>
                  <td>{index === 0 ? '8 min ago' : index === 1 ? 'Yesterday' : 'Sep 12'}</td>
                  <td>
                    <button className="ghost-btn" type="button" aria-label={`More actions for ${row}`} onClick={() => notify('More actions opened')}>
                      ···
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="empty-page">
        <div className="empty-symbol">✦</div>
        <h2>Governance stays visible</h2>
        <p>Every configuration change, tool call, and human decision appears with its source, permission, and reviewer.</p>
        <button className="btn primary" type="button" onClick={() => notify('Audit view opened')}>
          View action ledger →
        </button>
      </div>
    </div>
  );
}

function InboxWorkspace({ notify }: { notify: (message: string) => void }) {
  const [selectedTicket, setSelectedTicket] = useState('4821');
  const [approval, setApproval] = useState<ApprovalState>('pending');

  const approvalCopy = useMemo(() => {
    if (approval === 'approved') return 'Approved';
    if (approval === 'rejected') return 'Rejected';
    return 'Review required before action';
  }, [approval]);

  const reviewApproval = () => {
    document.getElementById('approvalBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="view">
      <div className="heading">
        <div>
          <div className="eyebrow">
            SUPPORT OPERATIONS <span>•</span> WED, SEP 16, 2026
          </div>
          <h1>Inbox</h1>
          <p>Resolve customer issues with AI that stays accountable to your team.</p>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={() => notify('Search opened')}>
            ⌕ <span>Search</span>
          </button>
          <button className="btn primary" type="button" onClick={() => notify('New conversation draft created')}>
            + <span>New conversation</span>
          </button>
        </div>
      </div>

      <div className="inbox-layout">
        <section className="panel inbox-panel" aria-label="Conversation list">
          <div className="panel-head">
            <h2>Conversations</h2>
            <small>12 OPEN</small>
          </div>
          <div className="inbox-tabs" role="tablist" aria-label="Conversation status">
            <button className="selected" type="button" role="tab" aria-selected="true">
              Open <b>12</b>
            </button>
            <button type="button" role="tab" aria-selected="false">
              Waiting <b>4</b>
            </button>
            <button type="button" role="tab" aria-selected="false">
              Closed
            </button>
          </div>
          <div className="conversation-list">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`ticket ${selectedTicket === ticket.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTicket(ticket.id);
                  notify('Conversation loaded');
                }}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <span className="ticket-top">
                  <strong>{ticket.title}</strong>
                  <time>{ticket.age}</time>
                </span>
                <p>{ticket.preview}</p>
                <span className="ticket-bottom">
                  <span className="channel">{ticket.channel}</span>
                  {ticket.unread ? <span className="unread" aria-label="Unread" /> : null}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel conversation" aria-label="Selected conversation">
          <div className="panel-head">
            <div className="customer">
              <div className="customer-avatar">JM</div>
              <div>
                <strong>Jamie Morgan</strong>
                <small>jamie@orbit-studio.com · Orbit Studio</small>
              </div>
            </div>
            <div className="conversation-tools">
              <button className="ghost-btn" type="button" aria-label="Conversation tags" onClick={() => notify('Tags opened')}>
                ⌗
              </button>
              <button className="ghost-btn" type="button" aria-label="Conversation actions" onClick={() => notify('Conversation actions opened')}>
                ···
              </button>
            </div>
          </div>

          <div className="messages">
            <div className="message customer">
              <div className="message-avatar">JM</div>
              <div className="bubble">
                <strong>Jamie Morgan</strong>
                <p>Hi! We were charged for the annual Pro plan, but we meant to cancel last week. Can I get a refund for the $480 charge?</p>
                <span className="message-meta">10:42 AM · Email</span>
              </div>
            </div>
            <div className="message agent">
              <div className="bubble">
                <strong>Resolve AI · draft</strong>
                <p>I can help with that. I’m checking your order and our refund policy now.</p>
                <span className="message-meta">Draft · not sent</span>
              </div>
              <div className="message-avatar">R</div>
            </div>
          </div>

          <div className="agent-plan">
            <div className="plan-head">
              <span className="plan-status">✓</span>
              <strong>AI plan · Refund eligibility</strong>
              <span className="status-pill">Approval required</span>
            </div>
            <div className="plan-body">
              <div className="plan-row">
                <span className="plan-step">01</span>
                <div>
                  <strong>Retrieved order #OR-92814</strong>
                  <span>Annual Pro plan · $480.00 · charged Sep 14</span>
                </div>
              </div>
              <div className="plan-row">
                <span className="plan-step">02</span>
                <div>
                  <strong>Matched policy: Annual plan refunds</strong>
                  <span>Refunds allowed within 14 days when no usage threshold is exceeded</span>
                </div>
              </div>
              <div className="plan-row">
                <span className="plan-step">03</span>
                <div>
                  <strong>Proposed action: issue full refund</strong>
                  <span>Risk policy requires a Team Lead approval for refunds over $250</span>
                </div>
              </div>
            </div>
          </div>

          <div className="draft-bar">
            <div className="draft-copy">
              <strong>Draft response ready</strong>
              <span>AI will send only after the refund is approved.</span>
            </div>
            <div className="draft-actions">
              <button className="btn small" type="button" onClick={() => notify('Draft opened for editing')}>
                Edit draft
              </button>
              <button className="btn small primary" type="button" onClick={reviewApproval}>
                Review approval <span>→</span>
              </button>
            </div>
          </div>
        </section>

        <aside className="panel ledger" aria-label="Action Ledger">
          <div className="panel-head">
            <h2>Action Ledger</h2>
            <small>RUN #7842</small>
          </div>
          <div className="ledger-body">
            <p className="ledger-intro">Every AI action includes its source, permission, status, and reviewer. No hidden reasoning.</p>
            <div className="confidence">
              <div className="confidence-ring">94</div>
              <div>
                <strong>High confidence</strong>
                <span>Evidence supports the proposed action</span>
              </div>
            </div>

            <div className="ledger-item">
              <div className="ledger-top">
                <span className="ledger-icon">⌕</span>
                <strong>Retrieved order</strong>
                <span className="ledger-state state-source">SOURCE</span>
              </div>
              <p>Order #OR-92814 · $480 · Sep 14, 2026</p>
              <div className="ledger-source">↗ Orders API <span>permission: read_orders</span></div>
            </div>

            <div className="ledger-item">
              <div className="ledger-top">
                <span className="ledger-icon">▤</span>
                <strong>Checked policy</strong>
                <span className="ledger-state state-source">SOURCE</span>
              </div>
              <p>Annual plan refunds · v3.4 · updated Aug 12</p>
              <div className="ledger-source">↗ Refund policy <span>source: knowledge</span></div>
            </div>

            <div className="ledger-item">
              <div className="ledger-top">
                <span className="ledger-icon">→</span>
                <strong>Proposed refund</strong>
                <span className={`ledger-state ${approval === 'approved' ? 'state-approved' : 'state-proposed'}`}>
                  {approval === 'approved' ? 'APPROVED' : approval === 'rejected' ? 'REJECTED' : 'PROPOSED'}
                </span>
              </div>
              <p>Issue $480.00 refund to original payment method.</p>
              <div className="ledger-source">↗ Refunds API <span>permission: issue_refund</span></div>
            </div>

            <div className={`approval-box ${approval === 'approved' ? 'approved' : ''}`} id="approvalBox">
              <div className="label">HUMAN APPROVAL GATE</div>
              <strong>{approvalCopy}</strong>
              <p>Refund exceeds the $250 auto-approval threshold. A human can approve or reject the proposal before any simulated tool action runs.</p>
              {approval === 'pending' ? (
                <div className="actions">
                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => {
                      setApproval('approved');
                      notify('Refund approved · simulated Refunds API action recorded');
                    }}
                  >
                    Approve refund
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setApproval('rejected');
                      notify('Proposal rejected · reviewer decision recorded');
                    }}
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
            <div className="ledger-footer">Reviewer actions are represented as prototype state; no real refund API is connected.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ResolveWorkspace() {
  const [view, setView] = useState<ViewKey>('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const currentLabel = view === 'inbox' || view === 'conversation' ? 'Inbox' : pages[view].title;
  const notify = (message: string) => setToastMessage(message);

  const navigate = (nextView: ViewKey) => {
    setView(nextView);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><i /><i /><i /></div>
          <strong>RESOLVE</strong>
          <span>AI</span>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">N</div>
          <div>
            <b>Northstar Labs</b>
            <small>Support workspace</small>
          </div>
          <button type="button" aria-label="Switch workspace" onClick={() => notify('Workspace switcher opened')}>⌄</button>
        </div>

        <nav aria-label="Product navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.view}
                  type="button"
                  className={`nav-item ${view === item.view || (item.view === 'inbox' && view === 'conversation') ? 'active' : ''}`}
                  onClick={() => navigate(item.view)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.count ? <em>{item.count}</em> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="agent-status">
            <span className="status-live" />
            <div>
              <b>Resolve agent</b>
              <small>Available · 96.8% confidence</small>
            </div>
            <button type="button" aria-label="Agent actions" onClick={() => notify('Agent actions opened')}>···</button>
          </div>
          <div className="profile">
            <div className="profile-avatar">AK</div>
            <div>
              <b>Alex Kim</b>
              <small>Team lead</small>
            </div>
            <button type="button" aria-label="Profile actions" onClick={() => notify('Profile actions opened')}>···</button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>
            ☰
          </button>
          <div className="crumb">
            <span>Northstar Labs</span>
            <b>/</b>
            <strong>{currentLabel}</strong>
          </div>
          <div className="top-actions">
            <button className="top-icon" type="button" aria-label="Search" onClick={() => notify('Search opened')}>⌕</button>
            <button className="top-icon has-dot" type="button" aria-label="Notifications" onClick={() => notify('Notifications opened')}>◔</button>
            <button className="top-avatar" type="button" aria-label="Account" onClick={() => notify('Account menu opened')}>AK</button>
          </div>
        </header>

        {view === 'inbox' || view === 'conversation' ? (
          <InboxWorkspace notify={notify} />
        ) : (
          <GenericWorkspace page={pages[view]} notify={notify} />
        )}
      </main>

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status" aria-live="polite">
        <span>✓</span>
        <b>{toastMessage || 'Action completed'}</b>
      </div>
    </div>
  );
}
