"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <section className="container notice" role="alert"><h1>دریافت اطلاعات ممکن نشد</h1><p>لطفاً کمی بعد دوباره تلاش کنید.</p><button onClick={reset}>تلاش دوباره</button></section>;
}
