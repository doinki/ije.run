import { Outlet } from 'react-router';

import { Footer } from '~/components/layout/footer';
import { Header } from '~/components/layout/header';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-4xl flex-1">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
