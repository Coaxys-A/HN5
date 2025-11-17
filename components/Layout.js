import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

const DEFAULT_DESCRIPTION = 'مدرسه هوشمند HN5 با برنامه‌های نوآورانه، آموزش متوازن و همراهی خانواده‌ها در مسیر رشد دانش‌آموزان.';

function Layout({ title, description, children }) {
  const pageTitle = title ? `${title} | مدرسه HN5` : 'مدرسه HN5';
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
