import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      '--announcement-height',
      isScrolled ? '0px' : '40px',
    );
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;

      const currentScrollY = window.scrollY;

      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  return (
    <div
      className={`fixed w-full z-40 transition-transform duration-500 ease-in-out
      ${
        !isScrollingUp && isScrolled && asideType === 'closed'
          ? '-translate-y-full'
          : 'translate-y-0'
      }`}
    >
      {/* Announcement Bar */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-brand-navy text-white ${
          isScrolled ? 'max-h-0' : 'max-h-12'
        }`}
      >
        <div className="container mx-auto text-center py-2.5 px-4">
          <p className="font-source text-[13px] leading-tight sm:text-sm">
            Complimentary Shipping on Orders Above $500
          </p>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`transition-all duration-500 ease-in-out border-b ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-sm border-transparent'
            : 'bg-white border-gray-100'
        }`}
      >
        <div className="container mx-auto">
          {/* Mobile Logo (550px and below) */}
          <div
            className={`hidden max-[550px]:block text-center border-br border-gray-100 transition-all duration-300 ease-in-out ${
              isScrolled ? 'py-1' : 'py-2'
            }`}
          >
            <NavLink
              prefetch="intent"
              to="/"
              className="font-playfair text-2l tracking-normal inline-block"
            >
              <h1 className="font-medium my-0">CADENCE</h1>
            </NavLink>
          </div>

          {/* Header Content */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-in-out ${
              isScrolled ? 'py-3 sm:py-4' : ''
            }`}
          >
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <HeaderMenuMobileToggle />
            </div>

            {/* Logo Above*/}
            <NavLink
              prefetch="intent"
              to="/"
              className={`font-playfair tracking-wider text-center max-[550px]:hidden left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out ${
                isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[28px]'
              }`}
            >
              <h1 className="font-medium">CADENCE</h1>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:block flex-1-px-12">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const baseClassName =
    "transition-all duration-200 hover:text-brand-gold font-source relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full";

  const desktopClassname =
    'flex items-center justify-center space-x-12 text-sm uppercase tracking-wider';

  const mobileClassName = 'flex flex-col px-6';

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassname : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && <></>}

      {viewport === 'desktop' &&
        menu?.items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) || // cadence.com/collections
            item.url.includes(primaryDomainUrl) // store.cadence.com/collections
              ? new URL(item.url).pathname // --> /collections
              : item.url; // google.com

          return (
            <NavLink
              className={({isActive}) =>
                `${baseClassName} ${
                  isActive ? 'text-brand-gold' : 'text-brand-navy'
                }`
              }
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2 hover:text-brand-gold transition-colors duration-200"
      onClick={() => open('mobile')}
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
