"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SoftAurora from '@/components/SoftAurora';
import { LeadRecord } from '@/lib/googleSheets';

export default function DashboardPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'opened' | 'clicked' | 'not_opened'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchLeads = useCallback(async (showRefreshingIndicator = false) => {
    if (showRefreshingIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    try {
      const response = await fetch('/api/dashboard/leads');
      if (response.status === 401) {
        router.push('/dashboard/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to retrieve leads from sheet');
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading leads.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Polling every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLeads(true);
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchLeads]);

  // Handle Search and Filtering
  useEffect(() => {
    let result = [...leads];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        lead =>
          lead.companyName.toLowerCase().includes(term) ||
          lead.contactName.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.services.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter === 'opened') {
      result = result.filter(lead => lead.emailOpens > 0);
    } else if (statusFilter === 'clicked') {
      result = result.filter(lead => lead.linkClicked);
    } else if (statusFilter === 'not_opened') {
      result = result.filter(lead => lead.emailOpens === 0);
    }

    // Sort by timestamp descending (newest first)
    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter]);

  const handleLogout = () => {
    document.cookie = 'dashboard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    router.refresh();
    router.push('/dashboard/login');
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Calculations for stats
  const totalLeads = leads.length;
  const openedLeads = leads.filter(l => l.emailOpens > 0).length;
  const clickedLeads = leads.filter(l => l.linkClicked).length;
  const openRate = totalLeads > 0 ? Math.round((openedLeads / totalLeads) * 100) : 0;
  const clickRate = totalLeads > 0 ? Math.round((clickedLeads / totalLeads) * 100) : 0;

  return (
    <main className="main-viewport-container dashboard-main">
      <SoftAurora
        speed={0.4}
        scale={1.5}
        brightness={0.8}
        color1="#3b82f6"
        color2="#a855f7"
        noiseFrequency={2.5}
        noiseAmplitude={1.0}
        bandHeight={0.5}
        bandSpread={1.0}
        octaveDecay={0.1}
        layerOffset={0.0}
        colorSpeed={1.0}
        enableMouseInteraction={true}
        mouseInfluence={0.15}
      />

      <div className="dashboard-content-wrapper">
        {/* Top Navbar */}
        <header className="dashboard-navbar glass-panel">
          <div className="nav-logo">
            <span className="logo-box" />
            <h2 className="logo-text">ADEMXO</h2>
            <span className="nav-divider">|</span>
            <span className="nav-subtitle">Growth Pipeline</span>
          </div>
          <div className="nav-actions">
            {isRefreshing && <span className="refresh-status">Syncing...</span>}
            <button 
              onClick={() => fetchLeads(true)} 
              className="btn btn-secondary btn-sm" 
              disabled={isRefreshing || isLoading}
            >
              Refresh
            </button>
            <button onClick={handleLogout} className="btn btn-primary btn-sm btn-logout">
              Sign Out
            </button>
          </div>
        </header>

        {/* Stats Cards Section */}
        <section className="stats-cards-grid">
          <div className="glass-panel stats-card">
            <div className="stats-info">
              <span className="stats-label">Total Submissions</span>
              <h2 className="stats-value">{isLoading ? '...' : totalLeads}</h2>
            </div>
            <div className="stats-icon-wrapper leads-icon">📊</div>
          </div>

          <div className="glass-panel stats-card">
            <div className="stats-info">
              <span className="stats-label">Email Open Rate</span>
              <h2 className="stats-value">{isLoading ? '...' : `${openRate}%`}</h2>
              <p className="stats-trend">{openedLeads} of {totalLeads} opened</p>
            </div>
            <div className="stats-icon-wrapper opens-icon">✉️</div>
          </div>

          <div className="glass-panel stats-card">
            <div className="stats-info">
              <span className="stats-label">CTR (CTA Click Rate)</span>
              <h2 className="stats-value">{isLoading ? '...' : `${clickRate}%`}</h2>
              <p className="stats-trend">{clickedLeads} of {totalLeads} clicked</p>
            </div>
            <div className="stats-icon-wrapper clicks-icon">🔗</div>
          </div>
        </section>

        {/* Filter Controls */}
        <div className="glass-panel controls-panel">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by company, contact, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-wrapper">
            <button
              onClick={() => setStatusFilter('all')}
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All Leads
            </button>
            <button
              onClick={() => setStatusFilter('opened')}
              className={`filter-tab ${statusFilter === 'opened' ? 'active' : ''}`}
            >
              Opened
            </button>
            <button
              onClick={() => setStatusFilter('clicked')}
              className={`filter-tab ${statusFilter === 'clicked' ? 'active' : ''}`}
            >
              Clicked
            </button>
            <button
              onClick={() => setStatusFilter('not_opened')}
              className={`filter-tab ${statusFilter === 'not_opened' ? 'active' : ''}`}
            >
              Not Opened
            </button>
          </div>
        </div>

        {/* Leads Table Container */}
        <div className="glass-panel table-panel">
          {isLoading && leads.length === 0 ? (
            <div className="table-loader-state">
              <div className="loader-spinner" />
              <p>Fetching Lead Generation data...</p>
            </div>
          ) : error ? (
            <div className="table-error-state">
              <p className="error-text">⚠️ {error}</p>
              <button onClick={() => fetchLeads()} className="btn btn-primary btn-sm">Try Again</button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="table-empty-state">
              <p>No leads match your current search criteria.</p>
            </div>
          ) : (
            <div className="table-responsive-container">
              <table className="leads-data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Date Logged</th>
                    <th>Email Status</th>
                    <th>CTA Link Click</th>
                    <th className="text-right">Specs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => {
                    const uniqueKey = lead.leadId && lead.leadId.trim() !== ''
                      ? lead.leadId
                      : `legacy-${lead.timestamp}-${index}`;
                    const isExpanded = expandedLeadId === lead.leadId;
                    return (
                      <React.Fragment key={uniqueKey}>
                        <tr className={`lead-table-row ${isExpanded ? 'expanded-parent' : ''}`}>
                          <td>
                            <div className="company-cell">
                              <span className="company-name">{lead.companyName}</span>
                              {lead.website && lead.website !== 'N/A' && (
                                <a 
                                  href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="company-link"
                                >
                                  {lead.website.replace(/^https?:\/\/(www\.)?/, '')} ↗
                                </a>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="contact-cell">
                              <span className="contact-name">{lead.contactName}</span>
                              <span className="contact-meta">{lead.email}</span>
                              <span className="contact-meta">{lead.phone}</span>
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <span>{formatDate(lead.timestamp)}</span>
                              <span className="industry-tag">{lead.industry}</span>
                            </div>
                          </td>
                          <td>
                            {lead.emailOpens > 0 ? (
                              <div className="status-badge badge-success" title={`Last opened: ${formatDate(lead.lastOpenedAt)}`}>
                                <span className="badge-dot" />
                                Opened ({lead.emailOpens})
                              </div>
                            ) : (
                              <div className="status-badge badge-warning">
                                <span className="badge-dot" />
                                Not Opened
                              </div>
                            )}
                          </td>
                          <td>
                            {lead.linkClicked ? (
                              <div className="status-badge badge-info" title={`Clicked: ${formatDate(lead.clickedAt)}`}>
                                <span className="badge-dot" />
                                Clicked CTA
                              </div>
                            ) : (
                              <div className="status-badge badge-secondary">
                                <span className="badge-dot" />
                                No Click
                              </div>
                            )}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => setExpandedLeadId(isExpanded ? null : lead.leadId)}
                              className="btn btn-secondary btn-xs expand-btn"
                            >
                              {isExpanded ? 'Hide Specs' : 'View Specs'}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="lead-expanded-row">
                            <td colSpan={6}>
                              <div className="expanded-details-card">
                                <div className="details-grid">
                                  <div className="detail-item">
                                    <span className="detail-label">Lead UUID</span>
                                    <code className="detail-value">{lead.leadId || 'Legacy Lead'}</code>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Company Size</span>
                                    <span className="detail-value">{lead.companySize} Employees</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Monthly Budget</span>
                                    <span className="detail-value text-accent">{lead.budget}</span>
                                  </div>
                                  <div className="detail-item col-span-2">
                                    <span className="detail-label">Services Selected</span>
                                    <span className="detail-value services-tags-row">
                                      {lead.services ? (
                                        lead.services.split(', ').map((srv) => (
                                          <span key={srv} className="service-tag">{srv}</span>
                                        ))
                                      ) : (
                                        <span className="service-tag">None Specified</span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="description-section">
                                  <span className="detail-label">Project Requirements</span>
                                  <p className="description-text">"{lead.description}"</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
