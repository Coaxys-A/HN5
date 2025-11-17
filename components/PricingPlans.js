import Link from 'next/link';

function PricingPlans({ plans }) {
  return (
    <div className="pricing-grid">
      {plans.map((plan) => (
        <article key={plan.id} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
          <p className="badge">{plan.title}</p>
          <h3>{plan.price}</h3>
          <p>{plan.description}</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <Link href="/contact" className="btn btn-primary">
            درخواست مشاوره
          </Link>
        </article>
      ))}
    </div>
  );
}

export default PricingPlans;
