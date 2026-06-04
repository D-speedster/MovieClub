import React from 'react';
import GlobalHeader from '../GlobalHeader/GlobalHeader';

/**
 * Layout wrapper — همه صفحات (جز ادمین) را می‌پوشاند.
 *
 * props:
 *   transparentHeader  — true  → هدر شفاف روی HeroSection (صفحه اصلی)
 *                        false → هدر جامد سیاه (پیش‌فرض)
 */
const Layout = ({ children, transparentHeader = false }) => (
  <>
    <GlobalHeader transparent={transparentHeader} />
    <main style={{ paddingTop: transparentHeader ? 0 : '72px' }}>
      {children}
    </main>
  </>
);

export default Layout;
