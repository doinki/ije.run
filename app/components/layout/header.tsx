import { Link } from 'react-router';

import { Logo } from '../icons/logo';
import { ThemeSwitch } from '../ui/theme-switch';

export function Header() {
  return (
    <header className="sticky top-0 z-10 mx-auto flex max-w-4xl items-center justify-between border-b px-5 py-2 backdrop-blur-sm md:px-6 md:py-3">
      <Link aria-label="Go to homepage" to="/">
        <Logo />
      </Link>
      <ThemeSwitch className="-m-2 box-content size-6 cursor-pointer p-2" />
    </header>
  );
}
