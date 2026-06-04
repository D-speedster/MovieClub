import React, { useEffect } from "react";
import "./Plans.css";
import Title_Admin from "../TitleAdmin/TitleAdmin";
import { FiCheck } from "react-icons/fi";

export default function Plans() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tiers = [
    {
      name: "Free",
      price: "۰ تومان / ماهانه",
      features: ["محدود بودن تعداد فیلم ها", "عدم پخش آنلاین", "عدم دسترسی به بخش فولدر"],
      badge: null,
    },
    {
      name: "Special",
      price: "۲۵۰۰۰ تومان / ماهانه",
      features: ["محدود بودن تعداد فیلم ها", "پخش آنلاین", "دسترسی به فولدر ویژه"],
      badge: "gold",
    },
    {
      name: "Professional",
      price: "۵۰۰۰۰ تومان / ماهانه",
      features: ["بدون محدودیت فیلم", "پخش آنلاین HD", "دسترسی به فولدر حرفه‌ای", "پشتیبانی ۲۴/۷"],
      badge: "gold",
    },
    {
      name: "Online",
      price: "۷۵۰۰۰ تومان / ماهانه",
      features: ["دسترسی کامل به کتابخانه", "پخش آنلاین 4K", "دسترسی به همه فولدرها", "پشتیبانی ویژه"],
      badge: null,
    },
  ];

  return (
    <section className="plans-grid">
      {tiers.map((tier) => (
        <article key={tier.name} className={`plan-card ${tier.badge ? "plan-badge-" + tier.badge : ""}`}>
          {tier.badge && <div className="plan-badge">{tier.name}</div>}
          <h3 className="plan-title">{tier.name}</h3>
          <p className="plan-price">{tier.price}</p>
          <ul className="plan-features">
            {tier.features.map((f, i) => (
              <li key={i}>
                <FiCheck className="check-icon" /> {f}
              </li>
            ))}
          </ul>
          <button className="plan-action">ویرایش پلان</button>
        </article>
      ))}
    </section>
  );
}
