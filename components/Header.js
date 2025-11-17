import { useState } from 'react';
import Link from 'next/link';

const links = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره مدرسه' },
  { href: '/courses', label: 'دوره‌ها' },
  { href: '/teachers', label: 'کادر آموزشی' },
  { href: '/blog', label: 'بلاگ' },
  { href: '/contact', label: 'ارتباط با ما' },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          HN5
        </Link>
        <button type="button" className="nav-toggle" aria-label="باز کردن منو" onClick={() => setOpen((value) => !value)}>
          {open ? 'بستن' : 'منو'}
        </button>
        <nav className={`site-nav${open ? ' is-open' : ''}`}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
