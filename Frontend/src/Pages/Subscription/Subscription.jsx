import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Subscription.css';

const plans = [
  { title: 'اشتراک برنزی', duration: '1 ماه', price: '۵,۰۰۰ تومان', popular: false },
  { title: 'اشتراک نقره‌ای', duration: '3 ماه', price: '۱۳,۵۰۰ تومان', popular: true },
  { title: 'اشتراک طلایی', duration: '6 ماه', price: '۲۴,۰۰۰ تومان', popular: false },
];

export default function Subscription() {
  const navigate = useNavigate();
  const handleBuy = (plan) => {
    // Placeholder for payment integration
    alert(`خرید ${plan.title}`);
    // navigate('/') after purchase if needed
  };

  return (
    <div className="subscription-page">
      <h1 className="subscription-page__title">پلن‌های اشتراک</h1>
      <div className="subscription-cards">
        {plans.map((plan, idx) => (
          <div key={idx} className={`card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="badge">محبوب</div>}
            <h2 className="card__title">{plan.title}</h2>
            <p className="card__duration">{plan.duration}</p>
            <p className="card__price">{plan.price}</p>
            <button className="card__btn" onClick={() => handleBuy(plan)}>
              خرید اشتراک
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

