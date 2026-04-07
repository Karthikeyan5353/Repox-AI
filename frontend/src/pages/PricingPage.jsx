import { useState } from 'react';
import { pricingFaqs, pricingTiers } from '../data/mockData';

function PricingPage({ navigate }) {
  const [billingMode, setBillingMode] = useState('monthly');
  const [openQuestion, setOpenQuestion] = useState(pricingFaqs[0]?.question ?? '');

  return (
    <div className="page-stack">
      <section className="panel pricing-hero">
        <p className="section-label">Pricing</p>
        <h2 className="section-title">Choose a RepoX plan that matches your review volume</h2>
        <p className="panel-copy">
          Start free for open-source and lightweight usage, then move into team workflows with unlimited reviews,
          integrations, and analytics when you are ready.
        </p>

        <div className="billing-toggle">
          <button
            className={`billing-toggle-button ${billingMode === 'monthly' ? 'billing-toggle-button-active' : ''}`}
            type="button"
            onClick={() => setBillingMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`billing-toggle-button ${billingMode === 'annual' ? 'billing-toggle-button-active' : ''}`}
            type="button"
            onClick={() => setBillingMode('annual')}
          >
            Annual
            <span className="billing-save-pill">Save 20%</span>
          </button>
        </div>
      </section>

      <section className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article className={`panel pricing-card ${tier.badge ? 'pricing-card-featured' : ''}`} key={tier.name}>
            <div className="card-topline">
              <h3 className="feature-title">{tier.name}</h3>
              {tier.badge ? <span className="status-pill status-pill-live">{tier.badge}</span> : null}
            </div>
            <div className="pricing-price-row">
              <strong className="pricing-price">{billingMode === 'annual' ? tier.annualPrice : tier.monthlyPrice}</strong>
              <span className="pricing-period">{tier.monthlyPrice === 'Custom' ? 'contact us' : '/seat/month'}</span>
            </div>
            <p className="feature-copy">{tier.description}</p>
            <button className={`button ${tier.badge ? 'button-primary' : 'button-secondary'}`} type="button" onClick={() => navigate('/integrations')}>
              {tier.cta}
            </button>

            <ul className="pricing-feature-list">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Feature Comparison</p>
            <h2 className="section-title">What changes as your team grows</h2>
          </div>
        </div>

        <div className="comparison-table">
          <div className="comparison-row comparison-row-head">
            <span>Feature</span>
            <span>Free</span>
            <span>Pro</span>
            <span>Enterprise</span>
          </div>
          <div className="comparison-row">
            <span>Repositories</span>
            <span>Up to 3</span>
            <span>Unlimited</span>
            <span>Unlimited</span>
          </div>
          <div className="comparison-row">
            <span>AI Pull Request Reviews</span>
            <span>Basic</span>
            <span>Unlimited</span>
            <span>Unlimited</span>
          </div>
          <div className="comparison-row">
            <span>Custom Review Rules</span>
            <span>-</span>
            <span>Included</span>
            <span>Included</span>
          </div>
          <div className="comparison-row">
            <span>IDE Extension Workflow</span>
            <span>-</span>
            <span>Included</span>
            <span>Included</span>
          </div>
          <div className="comparison-row">
            <span>SSO and Advanced Roles</span>
            <span>-</span>
            <span>-</span>
            <span>Included</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Questions teams usually ask before rollout</h2>
          </div>
        </div>

        <div className="faq-list">
          {pricingFaqs.map((faq) => (
            <article className="faq-item" key={faq.question}>
              <button
                className="faq-trigger"
                type="button"
                onClick={() => setOpenQuestion((current) => (current === faq.question ? '' : faq.question))}
              >
                <span className="feature-title">{faq.question}</span>
                <span className="faq-symbol">{openQuestion === faq.question ? '-' : '+'}</span>
              </button>
              {openQuestion === faq.question ? <p className="feature-copy">{faq.answer}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
