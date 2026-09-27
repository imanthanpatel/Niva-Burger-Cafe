import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, Clock3,
  ExternalLink, Flame, MapPin, Menu as MenuIcon, MessageCircle, Phone, Search,
  ShoppingBag, Star, Utensils,
  X, Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

const restaurant = {
  name: 'Niva Burger & Cafe',
  shortName: 'Niva',
  category: 'Cafe / Burger Restaurant',
  city: 'Anand, Gujarat, India',
  address: 'Second Floor, Shaan Mall, Shop No. 16, Shaan Food Court, Anand, Gujarat 388120',
  phone: '063562 45355',
  tel: 'tel:06356245355',
  rating: '5.0',
  reviews: 24,
  maps: 'https://www.google.com/maps/search/?api=1&query=Second+Floor%2C+Shaan+Mall%2C+Shop+No.+16%2C+Shaan+Food+Court%2C+Anand%2C+Gujarat+388120',
  swiggy: 'https://www.swiggy.com/search?query=Niva%20Burger%20%26%20Cafe%20Anand',
  eazydiner: 'https://www.eazydiner.com/anand/restaurants',
};

type Category = 'All' | 'Burgers' | 'Snacks' | 'Beverages' | 'Cafe';
type MenuItem = { id: string; name: string; category: Exclude<Category, 'All'>; description: string; price: string; image: string; popular?: boolean };

const menuItems: MenuItem[] = [
  { id: 'niva-classic', name: 'Niva Classic', category: 'Burgers', description: 'Toasted bun, fresh vegetables and a mouthwatering patty.', price: 'Sample price', image: '/images/hero-burger.jpg', popular: true },
  { id: 'crisp-stack', name: 'Crisp Stack', category: 'Burgers', description: 'A deliciously crispy burger with layered texture in every bite.', price: 'Sample price', image: '/images/burger-detail.jpg' },
  { id: 'garden-crunch', name: 'Garden Crunch', category: 'Burgers', description: 'Fresh vegetables and a generous crunchy patty in a warm bun.', price: 'Sample price', image: '/images/cafe-table.jpg' },
  { id: 'golden-bites', name: 'Golden Bites', category: 'Snacks', description: 'Crispy, golden bites made for sharing and dipping.', price: 'Sample price', image: '/images/coffee-bites.jpg', popular: true },
  { id: 'loaded-fries', name: 'Loaded Fries', category: 'Snacks', description: 'Golden fries with a generous, indulgent finish.', price: 'Sample price', image: '/images/cafe-table.jpg' },
  { id: 'cold-coffee', name: 'Cold Coffee', category: 'Beverages', description: 'A chilled cafe favourite for a slow, easy afternoon.', price: 'Sample price', image: '/images/coffee-bites.jpg' },
  { id: 'fresh-fizz', name: 'Fresh Fizz', category: 'Beverages', description: 'Bright, refreshing and made for burger-time.', price: 'Sample price', image: '/images/cafe-table.jpg' },
  { id: 'cafe-pour', name: 'Cafe Pour', category: 'Cafe', description: 'A warm, comforting cup to round out the table.', price: 'Sample price', image: '/images/coffee-bites.jpg' },
];

const gallery = [
  { src: '/images/hero-burger.jpg', alt: 'Niva burger with melted cheese and golden fries', label: 'The main event' },
  { src: '/images/cafe-table.jpg', alt: 'Burger, fries, iced coffee and crispy bites on a cafe table', label: 'Pull up a chair' },
  { src: '/images/burger-detail.jpg', alt: 'Close-up of a stacked cheeseburger with fresh vegetables', label: 'Built to bite' },
  { src: '/images/coffee-bites.jpg', alt: 'Iced coffee beside golden crispy bites and dipping sauce', label: 'Sip & crunch' },
];

const reviews = [
  { id: 'review-1', quote: 'The bun is soft, the vegetables are fresh, and the patty is mouthwatering.', source: 'Customer review' },
  { id: 'review-2', quote: 'A delicious burger with a properly crispy finish.', source: 'Customer review' },
];

const hours = [
  ['Monday', '10:30 AM – 10:30 PM'],
  ['Tuesday', 'Hours to be confirmed'],
  ['Wednesday', 'Hours to be confirmed'],
  ['Thursday', 'Hours to be confirmed'],
  ['Friday', 'Hours to be confirmed'],
  ['Saturday', 'Hours to be confirmed'],
  ['Sunday', 'Hours to be confirmed'],
];

const navItems = [
  ['Home', 'home'], ['About', 'about'], ['Menu', 'menu'], ['Gallery', 'gallery'], ['Reviews', 'reviews'], ['Contact', 'contact'],
];

function ExternalAction({ href, children, variant = 'primary', className = '' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'light' | 'outline'; className?: string }) {
  const styles = variant === 'primary'
    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--foreground))]'
    : variant === 'light'
      ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]'
      : 'border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]';
  return <a data-testid="link-external-action" href={href} target="_blank" rel="noreferrer" className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${styles} ${className}`}>{children}<ArrowUpRight size={16} /></a>;
}

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#home" className={`focus-ring flex items-center gap-2.5 rounded-lg ${light ? 'text-[hsl(var(--card))]' : 'text-[hsl(var(--foreground))]'}`} aria-label="Niva Burger & Cafe home">
    <span className="grid size-10 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Utensils size={19} strokeWidth={2.5} /></span>
    <span className="font-display text-lg font-bold leading-none">Niva<br /><small className="font-sans text-[.55rem] font-semibold uppercase tracking-[.2em] opacity-70">Burger & Cafe</small></span>
  </a>;
}

function Navbar({ active, onMenu }: { active: string; onMenu: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return <header className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? 'bg-[hsl(var(--background)/.88)] shadow-[0_8px_30px_rgba(60,38,23,.08)] backdrop-blur-xl' : 'bg-transparent'}`}>
    <nav className="container-niva flex h-[76px] items-center justify-between">
      <Logo />
      <div className="hidden items-center gap-7 lg:flex">
        {navItems.map(([label, id]) => <button data-testid={`button-nav-${id}`} key={id} onClick={() => jump(id)} className={`focus-ring relative rounded-md px-1 py-2 text-[.78rem] font-bold transition-colors ${active === id ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground)/.68)] hover:text-[hsl(var(--foreground))]'}`}>{label}{active === id && <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[hsl(var(--primary))]" />}</button>)}
      </div>
      <div className="flex items-center gap-3">
        <ExternalAction href={restaurant.swiggy} className="hidden px-4 py-2.5 sm:inline-flex">Order online</ExternalAction>
        <button data-testid="button-open-mobile-menu" onClick={onMenu} className="focus-ring grid size-11 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] lg:hidden" aria-label="Open navigation menu"><MenuIcon size={21} /></button>
      </div>
    </nav>
  </header>;
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const jump = (id: string) => { onClose(); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150); };
  return <div className={`fixed inset-0 z-50 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
    <button data-testid="button-close-drawer-overlay" onClick={onClose} className={`absolute inset-0 bg-[hsl(var(--foreground)/.36)] transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} aria-label="Close navigation menu" />
    <aside className={`absolute right-0 top-0 h-full w-[min(86vw,360px)] bg-[hsl(var(--background))] p-6 shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`} aria-label="Mobile navigation">
      <div className="flex items-center justify-between"><Logo /><button data-testid="button-close-mobile-menu" onClick={onClose} className="focus-ring grid size-10 place-items-center rounded-full border border-[hsl(var(--border))]" aria-label="Close navigation menu"><X size={20} /></button></div>
      <div className="mt-16 grid gap-2">{navItems.map(([label, id], index) => <button data-testid={`button-mobile-nav-${id}`} key={id} onClick={() => jump(id)} className="focus-ring flex items-center justify-between border-b border-[hsl(var(--border))] py-4 text-left font-display text-2xl font-bold">{label}<span className="text-[hsl(var(--primary))]">0{index + 1}</span></button>)}</div>
      <ExternalAction href={restaurant.swiggy} className="mt-10 w-full">Order online</ExternalAction>
      <p className="mt-7 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Good food, easy company, Shaan Food Court in Anand.</p>
    </aside>
  </div>;
}

function Hero() {
  return <section id="home" className="relative min-h-[680px] overflow-hidden bg-[hsl(var(--accent))] pt-28 text-[hsl(var(--card))] lg:min-h-[780px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(236,179,74,.22),transparent_30%),linear-gradient(110deg,hsl(var(--accent))_28%,hsl(var(--accent)/.73)_68%,transparent)]" />
    <div className="container-niva relative grid min-h-[600px] items-center gap-8 pb-16 lg:grid-cols-[.85fr_1.15fr] lg:pb-0">
      <div className="reveal relative z-10 max-w-xl">
        <div className="eyebrow mb-7 flex items-center gap-3 text-[hsl(var(--secondary))]"><span className="h-px w-8 bg-[hsl(var(--secondary))]" />Niva Burger & Cafe</div>
        <h1 className="font-display text-[clamp(3.5rem,8vw,7.8rem)] font-bold leading-[.9] tracking-[-.065em]">Good Food.<br /><span className="text-[hsl(var(--secondary))]">Great Mood.</span></h1>
        <p className="mt-7 max-w-md text-base leading-7 text-[hsl(var(--card)/.72)] sm:text-lg">Burgers, bites and cafe favourites for easy afternoons, quick cravings and good company in Anand.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a data-testid="link-hero-menu" href="#menu" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--foreground))] transition-transform hover:-translate-y-1">View the menu <ArrowDown size={17} /></a>
          <ExternalAction href={restaurant.swiggy} variant="light" className="bg-[hsl(var(--card)/.1)] text-[hsl(var(--card))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--foreground))]">Order online</ExternalAction>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="flex items-center gap-1 text-[hsl(var(--secondary))]" aria-label="5 out of 5 stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div>
          <span className="h-4 w-px bg-[hsl(var(--card)/.25)]" /><span className="text-sm font-bold">5.0</span><span className="text-sm text-[hsl(var(--card)/.62)]">from 24 reviews</span>
        </div>
      </div>
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="absolute right-0 top-1/2 size-[min(74vw,620px)] -translate-y-1/2 rounded-full border border-[hsl(var(--secondary)/.2)]" />
        <div className="absolute right-[5%] top-1/2 size-[min(61vw,500px)] -translate-y-1/2 rounded-full border border-dashed border-[hsl(var(--secondary)/.25)]" />
        <div className="hero-image relative w-[min(93vw,630px)] rotate-[-3deg] overflow-hidden rounded-[2.5rem] border-8 border-[hsl(var(--card)/.12)] shadow-2xl">
          <img src="/images/hero-burger.jpg" alt="Juicy Niva-style burger with melted cheese and golden fries" className="aspect-[1.08] w-full object-cover" />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-[hsl(var(--foreground)/.82)] px-4 py-3 backdrop-blur-md"><p className="eyebrow text-[hsl(var(--secondary))]">Made for</p><p className="mt-1 font-display text-lg font-bold">the craving</p></div>
        </div>
      </div>
    </div>
    <a data-testid="link-scroll-about" href="#about" className="focus-ring absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[.65rem] font-bold uppercase tracking-[.2em] text-[hsl(var(--card)/.6)]"><span>Scroll to explore</span><ArrowDown size={15} className="pulse-soft" /></a>
  </section>;
}

function QuickInfo() {
  const items = [[<Star key="star" size={18} fill="currentColor" />, '5.0 rating', '24 reviews'], [<Utensils key="utensils" size={18} />, 'Cafe & burgers', 'Casual dining'], [<MapPin key="pin" size={18} />, 'Anand, Gujarat', 'Shaan Mall'], [<Clock3 key="clock" size={18} />, 'Open until 11:30 PM', 'Check daily hours']];
  return <section aria-label="Quick restaurant information" className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]"><div className="container-niva grid divide-y divide-[hsl(var(--border))] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{items.map(([icon, title, sub], index) => <div data-testid={`info-card-${index}`} key={index} className="flex items-center gap-4 px-1 py-6 sm:px-6"><span className="text-[hsl(var(--primary))]">{icon}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{sub}</p></div></div>)}</div></section>;
}

function SectionIntro({ eyebrow, title, copy, dark = false }: { eyebrow: string; title: string; copy?: string; dark?: boolean }) {
  return <div className="max-w-2xl"><p className={`eyebrow flex items-center gap-3 ${dark ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--primary))]'}`}><span className="h-px w-8 bg-current" />{eyebrow}</p><h2 className={`mt-4 font-display text-[clamp(2.6rem,5vw,5rem)] font-bold leading-[.98] tracking-[-.06em] ${dark ? 'text-[hsl(var(--card))]' : ''}`}>{title}</h2>{copy && <p className={`mt-6 max-w-xl text-base leading-7 ${dark ? 'text-[hsl(var(--card)/.66)]' : 'text-[hsl(var(--muted-foreground))]'}`}>{copy}</p>}</div>;
}

function About() {
  return <section id="about" className="section-pad overflow-hidden bg-[hsl(var(--background))]"><div className="container-niva grid items-center gap-14 lg:grid-cols-[.85fr_1.15fr]"><div className="reveal relative"><div className="absolute -left-12 -top-10 size-48 rounded-full bg-[hsl(var(--secondary)/.3)] blur-3xl" /><div className="relative overflow-hidden rounded-[2rem]"><img src="/images/cafe-table.jpg" alt="Casual cafe table with burgers, coffee and crispy bites" className="aspect-[.9] w-full object-cover sm:aspect-[1.08]" /><div className="absolute bottom-5 left-5 max-w-[190px] rounded-2xl bg-[hsl(var(--card)/.9)] p-4 shadow-lg backdrop-blur-md"><p className="eyebrow text-[hsl(var(--primary))]">Find us in</p><p className="mt-2 font-display text-xl font-bold">Shaan Food Court</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Second floor, Shaan Mall</p></div></div></div><div className="reveal"><SectionIntro eyebrow="A little about Niva" title="A place for burgers, bites & coffee" copy="Niva Burger & Cafe is a casual cafe stop in Anand for a satisfying burger, a plate of crispy bites, or a coffee that lets the conversation linger." /><div className="mt-9 flex flex-wrap items-center gap-5 border-t border-[hsl(var(--border))] pt-6"><div><p className="font-display text-xl font-bold">Niva Burger & Cafe</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Anand, Gujarat</p></div><a data-testid="link-about-directions" href={restaurant.maps} target="_blank" rel="noreferrer" className="focus-ring ml-auto inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-3 text-sm font-bold text-[hsl(var(--card))] hover:bg-[hsl(var(--primary))]">Get directions <ArrowUpRight size={16} /></a></div></div></div></section>;
}

function MenuSection() {
  const [category, setCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const categories: Category[] = ['All', 'Burgers', 'Snacks', 'Beverages', 'Cafe'];
  const results = useMemo(() => menuItems.filter((item) => (category === 'All' || item.category === category) && `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  return <section id="menu" className="section-pad bg-[hsl(var(--card))]"><div className="container-niva"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><SectionIntro eyebrow="The good stuff" title="Our menu" copy="Something delicious for every kind of craving. Exact prices are being updated — sample labels below are ready to replace." /><div className="relative w-full max-w-sm"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-menu-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu..." className="focus-ring h-12 w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-11 pr-5 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]" /></div></div><div className="menu-scroll mt-12 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button data-testid={`button-filter-${item.toLowerCase()}`} key={item} onClick={() => setCategory(item)} className={`focus-ring whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${category === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{item}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{results.map((item) => <article data-testid={`card-menu-${item.id}`} key={item.id} className="lift group overflow-hidden rounded-[1.45rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))]"><div className="relative overflow-hidden"><img src={item.image} alt={item.name} loading="lazy" className="aspect-[1.15] w-full object-cover transition-transform duration-500 group-hover:scale-105" />{item.popular && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 text-[.65rem] font-bold text-[hsl(var(--foreground))]"><Flame size={12} /> Popular</span>}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl font-bold">{item.name}</h3><span className="mt-1 whitespace-nowrap rounded-full bg-[hsl(var(--muted))] px-2 py-1 text-[.58rem] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Sample</span></div><p className="mt-2 min-h-12 text-sm leading-5 text-[hsl(var(--muted-foreground))]">{item.description}</p><div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4"><span className="eyebrow text-[hsl(var(--primary))]">{item.category}</span><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{item.price}</span></div></div></article>)}</div>{!results.length && <div className="mt-8 rounded-3xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-16 text-center"><Search className="mx-auto text-[hsl(var(--primary))]" /><h3 className="mt-4 font-display text-2xl font-bold">No items found.</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try another search or browse all cravings.</p><button data-testid="button-clear-menu-search" onClick={() => { setSearch(''); setCategory('All'); }} className="focus-ring mt-5 rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--card))]">Clear filters</button></div>}{results.length > 0 && <p className="mt-7 text-xs text-[hsl(var(--muted-foreground))]">Sample menu labels are placeholders because exact menu prices were not supplied.</p>}</div></section>;
}

function Cravings() {
  const cards = [{ title: 'Signature burgers', kicker: 'Stacked & saucy', image: '/images/burger-detail.jpg', category: 'Burgers' }, { title: 'Crispy bites', kicker: 'Golden hour', image: '/images/coffee-bites.jpg', category: 'Snacks' }, { title: 'Cafe favourites', kicker: 'Take it slow', image: '/images/cafe-table.jpg', category: 'Cafe' }];
  return <section className="section-pad bg-[hsl(var(--accent))] text-[hsl(var(--card))]"><div className="container-niva"><SectionIntro dark eyebrow="Follow the craving" title="What are you craving?" copy="Start with what sounds good. Stay for the easy mood." /><div className="mt-12 grid gap-4 md:grid-cols-3">{cards.map((card, index) => <a data-testid={`link-craving-${index}`} href="#menu" key={card.title} className="group relative min-h-[340px] overflow-hidden rounded-[1.7rem]"><img src={card.image} alt={card.title} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/.9)] via-[hsl(var(--foreground)/.1)] to-transparent" /><div className="absolute inset-x-5 bottom-5"><p className="eyebrow text-[hsl(var(--secondary))]">{card.kicker}</p><div className="mt-2 flex items-end justify-between gap-3"><h3 className="font-display text-2xl font-bold">{card.title}</h3><span className="grid size-10 place-items-center rounded-full bg-[hsl(var(--card)/.15)] backdrop-blur-sm transition-colors group-hover:bg-[hsl(var(--secondary))] group-hover:text-[hsl(var(--foreground))]"><ArrowUpRight size={17} /></span></div></div></a>)}</div></div></section>;
}

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const move = (direction: number) => setSelected((current) => current === null ? 0 : (current + direction + gallery.length) % gallery.length);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (selected === null) return; if (e.key === 'Escape') setSelected(null); if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  return <section id="gallery" className="section-pad bg-[hsl(var(--background))]"><div className="container-niva"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionIntro eyebrow="A taste of Niva" title="Come hungry." copy="A few frames from the kind of table we like to set." /><span className="eyebrow pb-2 text-[hsl(var(--muted-foreground))]">Tap to expand</span></div><div className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-5 lg:grid-cols-4">{gallery.map((image, index) => <button data-testid={`button-gallery-${index}`} key={image.src} onClick={() => setSelected(index)} className={`focus-ring group relative overflow-hidden rounded-[1.4rem] text-left ${index === 0 ? 'col-span-2 row-span-2' : index === 3 ? 'col-span-2 lg:col-span-1' : ''}`}><img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/.65)] to-transparent opacity-70" /><div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[hsl(var(--card))]"><span className="font-display font-bold">{image.label}</span><span className="grid size-8 place-items-center rounded-full bg-[hsl(var(--card)/.2)] backdrop-blur-sm"><ExternalLink size={14} /></span></div></button>)}</div></div>{selected !== null && <div role="dialog" aria-modal="true" aria-label="Gallery lightbox" className="fixed inset-0 z-[60] grid place-items-center bg-[hsl(var(--foreground)/.94)] p-4"><button data-testid="button-lightbox-close" onClick={() => setSelected(null)} className="focus-ring absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-[hsl(var(--card)/.12)] text-[hsl(var(--card))]" aria-label="Close gallery"><X /></button><button data-testid="button-lightbox-previous" onClick={() => move(-1)} className="focus-ring absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[hsl(var(--card)/.12)] text-[hsl(var(--card))] sm:left-8" aria-label="Previous image"><ArrowLeft /></button><div className="max-w-5xl text-center"><img src={gallery[selected].src} alt={gallery[selected].alt} className="max-h-[76vh] max-w-full rounded-2xl object-contain shadow-2xl" /><p className="mt-4 font-display text-lg font-bold text-[hsl(var(--card))]">{gallery[selected].label}</p><p className="mt-1 text-xs text-[hsl(var(--card)/.6)]">{selected + 1} / {gallery.length}</p></div><button data-testid="button-lightbox-next" onClick={() => move(1)} className="focus-ring absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[hsl(var(--card)/.12)] text-[hsl(var(--card))] sm:right-8" aria-label="Next image"><ArrowRight /></button></div>}</section>;
}

function Reviews() {
  return <section id="reviews" className="section-pad bg-[hsl(var(--secondary))]"><div className="container-niva grid gap-12 lg:grid-cols-[.6fr_1.4fr] lg:items-center"><div><p className="eyebrow flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-8 bg-current" />From the table</p><p className="mt-5 font-display text-[clamp(5rem,10vw,9rem)] font-bold leading-[.8] tracking-[-.08em] text-[hsl(var(--accent))]">5.0</p><div className="mt-7 flex items-center gap-2 text-[hsl(var(--primary))]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill="currentColor" />)}<span className="ml-2 text-sm font-bold text-[hsl(var(--accent)/.72)]">24 reviews</span></div><a data-testid="link-more-reviews" href="https://www.google.com/maps/search/?api=1&query=Niva+Burger+%26+Cafe+Anand" target="_blank" rel="noreferrer" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent)/.25)] px-5 py-3 text-sm font-bold text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--card))]">View more reviews <ArrowUpRight size={16} /></a></div><div><SectionIntro eyebrow="What customers notice" title="Good food speaks for itself." copy="A small selection of source-supported review themes from Niva's 5.0 rating." /><div className="mt-9 grid gap-4 sm:grid-cols-2">{reviews.map((review) => <article data-testid={`card-review-${review.id}`} key={review.id} className="rounded-[1.5rem] bg-[hsl(var(--card)/.82)] p-6 shadow-sm"><MessageCircle className="text-[hsl(var(--primary))]" size={24} /><p className="mt-7 font-display text-xl font-bold leading-7">“{review.quote}”</p><div className="mt-8 flex items-center justify-between border-t border-[hsl(var(--accent)/.14)] pt-4"><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{review.source}</span><div className="flex text-[hsl(var(--primary))]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill="currentColor" />)}</div></div></article>)}</div></div></div></section>;
}

function Visit() {
  return <section className="section-pad bg-[hsl(var(--background))]"><div className="container-niva grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><div className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#d7c8a8] p-7 sm:p-10"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#856f52 1px, transparent 1px), linear-gradient(90deg, #856f52 1px, transparent 1px)', backgroundSize: '44px 44px' }} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_38%,rgba(247,191,76,.32),transparent_22%),radial-gradient(circle_at_82%_72%,rgba(31,75,60,.3),transparent_28%)]" /><div className="relative flex h-full flex-col justify-between"><div><p className="eyebrow text-[hsl(var(--accent))]">Easy to find</p><h2 className="mt-4 max-w-sm font-display text-5xl font-bold leading-[.95] tracking-[-.06em] text-[hsl(var(--accent))]">Meet us at Shaan Mall.</h2></div><div className="flex items-end justify-between"><div className="rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-xs font-bold text-[hsl(var(--card))]">ANAND · GUJARAT</div><div className="grid size-16 place-items-center rounded-full border-4 border-[hsl(var(--primary))] bg-[hsl(var(--card)/.85)] text-[hsl(var(--primary))] shadow-lg"><MapPin size={27} fill="currentColor" /></div></div></div></div><div className="rounded-[2rem] bg-[hsl(var(--accent))] p-7 text-[hsl(var(--card))] sm:p-10"><SectionIntro dark eyebrow="Make a plan" title="Visit us" copy="Find Niva Burger & Cafe on the second floor of Shaan Mall, inside the Shaan Food Court." /><div className="mt-9 space-y-5 border-t border-[hsl(var(--card)/.16)] pt-6"><div className="flex gap-4"><MapPin className="mt-1 shrink-0 text-[hsl(var(--secondary))]" size={19} /><p className="text-sm leading-6 text-[hsl(var(--card)/.78)]">{restaurant.address}</p></div><div className="flex gap-4"><Phone className="mt-1 shrink-0 text-[hsl(var(--secondary))]" size={19} /><a data-testid="link-visit-phone" href={restaurant.tel} className="focus-ring text-sm font-bold">{restaurant.phone}</a></div></div><div className="mt-9 flex flex-wrap gap-3"><a data-testid="link-visit-directions" href={restaurant.maps} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-5 py-3 text-sm font-bold text-[hsl(var(--foreground))]">Get directions <ArrowUpRight size={16} /></a><a data-testid="link-visit-call" href={restaurant.tel} className="focus-ring inline-flex items-center gap-2 rounded-full border border-[hsl(var(--card)/.25)] px-5 py-3 text-sm font-bold text-[hsl(var(--card))] hover:bg-[hsl(var(--card)/.1)]"><Phone size={15} /> Call now</a></div></div></div></section>;
}

function OrderAndHours() {
  return <section className="section-pad border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]"><div className="container-niva grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="overflow-hidden rounded-[2rem] bg-[hsl(var(--primary))] p-8 text-[hsl(var(--primary-foreground))] sm:p-12"><div className="max-w-lg"><Zap className="text-[hsl(var(--secondary))]" fill="currentColor" /><h2 className="mt-8 font-display text-[clamp(3rem,6vw,5.7rem)] font-bold leading-[.9] tracking-[-.07em]">Hungry already?</h2><p className="mt-6 text-lg leading-7 text-[hsl(var(--primary-foreground)/.78)]">Order your favourites from Niva Burger & Cafe through our external partners.</p><div className="mt-9 flex flex-wrap gap-3"><ExternalAction href={restaurant.swiggy} variant="light">Order on Swiggy</ExternalAction><ExternalAction href={restaurant.eazydiner} variant="outline" className="border-[hsl(var(--primary-foreground)/.35)] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary))]">Reserve via EazyDiner</ExternalAction></div><p className="mt-5 text-xs text-[hsl(var(--primary-foreground)/.58)]">You’ll continue to the partner website in a new tab.</p></div></div><div className="rounded-[2rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-7 sm:p-9"><div className="flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">Plan your visit</p><h2 className="mt-3 font-display text-3xl font-bold">Opening hours</h2></div><Clock3 className="text-[hsl(var(--primary))]" /></div><div className="mt-8 space-y-1">{hours.map(([day, time]) => <div key={day} className="flex items-center justify-between border-b border-[hsl(var(--border))] py-3 text-sm"><span className="font-bold">{day}</span><span className={day === 'Monday' ? 'font-bold text-[hsl(var(--primary))]' : 'text-right text-xs text-[hsl(var(--muted-foreground))]'}>{time}</span></div>)}</div><p className="mt-5 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Monday’s hours are confirmed. Other day timings are kept update-ready rather than guessed.</p></div></div></section>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { setError('Please fill in the required fields so we can receive your message.'); form.reportValidity(); return; }
    setError(''); setSent(true); form.reset();
  };
  return <section id="contact" className="section-pad bg-[hsl(var(--background))]"><div className="container-niva grid gap-14 lg:grid-cols-[.85fr_1.15fr]"><div><SectionIntro eyebrow="Say hello" title="Have a question?" copy="For directions, hours or a simple hello, leave us a note. This form is a front-end message capture and does not send an email yet." /><div className="mt-10 space-y-5"><a data-testid="link-contact-phone" href={restaurant.tel} className="focus-ring flex items-center gap-4"><span className="grid size-11 place-items-center rounded-full bg-[hsl(var(--secondary))]"><Phone size={18} /></span><span><span className="eyebrow block text-[hsl(var(--muted-foreground))]">Call us</span><span className="mt-1 block font-bold">{restaurant.phone}</span></span></a><a data-testid="link-contact-map" href={restaurant.maps} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-4"><span className="grid size-11 place-items-center rounded-full bg-[hsl(var(--secondary))]"><MapPin size={18} /></span><span><span className="eyebrow block text-[hsl(var(--muted-foreground))]">Find us</span><span className="mt-1 block max-w-xs text-sm font-bold leading-5">{restaurant.address}</span></span></a></div></div><div className="rounded-[2rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-9">{sent ? <div className="flex min-h-[380px] flex-col items-center justify-center text-center"><span className="grid size-16 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--accent))]"><Check size={28} /></span><h3 className="mt-7 font-display text-3xl font-bold">Message received.</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Thank you for reaching out. This note is saved in the page for now — connect a backend when you’re ready to receive messages.</p><button data-testid="button-send-another-message" onClick={() => setSent(false)} className="focus-ring mt-7 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-bold">Send another message</button></div> : <form onSubmit={submit} noValidate><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Name<input data-testid="input-contact-name" name="name" required className="focus-ring mt-2 h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 font-normal outline-none" placeholder="Your name" /></label><label className="text-sm font-bold">Email<input data-testid="input-contact-email" name="email" required type="email" className="focus-ring mt-2 h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 font-normal outline-none" placeholder="you@example.com" /></label></div><label className="mt-5 block text-sm font-bold">Phone <span className="font-normal text-[hsl(var(--muted-foreground))]">(optional)</span><input data-testid="input-contact-phone" name="phone" type="tel" className="focus-ring mt-2 h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 font-normal outline-none" placeholder="Your number" /></label><label className="mt-5 block text-sm font-bold">Message<textarea data-testid="input-contact-message" name="message" required minLength={10} className="focus-ring mt-2 min-h-32 w-full resize-y rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 font-normal outline-none" placeholder="What can we help with?" /></label>{error && <p data-testid="status-contact-error" className="mt-4 text-sm font-bold text-[hsl(var(--destructive))]">{error}</p>}<button data-testid="button-submit-contact" type="submit" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--card))] hover:bg-[hsl(var(--primary))]">Send message <ArrowUpRight size={16} /></button></form>}</div></div></section>;
}

function Footer() {
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return <footer className="bg-[hsl(var(--accent))] pb-24 pt-16 text-[hsl(var(--card))] sm:pb-10"><div className="container-niva"><div className="grid gap-12 border-b border-[hsl(var(--card)/.16)] pb-12 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><Logo light /><p className="mt-6 max-w-xs text-sm leading-6 text-[hsl(var(--card)/.62)]">Burgers, bites and cafe favourites in the heart of Anand.</p></div><div><p className="eyebrow text-[hsl(var(--secondary))]">Explore</p><div className="mt-5 grid gap-3">{navItems.map(([label, id]) => <button data-testid={`button-footer-${id}`} key={id} onClick={() => jump(id)} className="focus-ring w-fit text-sm text-[hsl(var(--card)/.68)] hover:text-[hsl(var(--card))]">{label}</button>)}</div></div><div><p className="eyebrow text-[hsl(var(--secondary))]">Quick actions</p><div className="mt-5 grid gap-3 text-sm"><a data-testid="link-footer-call" href={restaurant.tel} className="focus-ring w-fit text-[hsl(var(--card)/.68)] hover:text-[hsl(var(--card))]">Call Niva</a><a data-testid="link-footer-directions" href={restaurant.maps} target="_blank" rel="noreferrer" className="focus-ring w-fit text-[hsl(var(--card)/.68)] hover:text-[hsl(var(--card))]">Get directions</a><a data-testid="link-footer-order" href={restaurant.swiggy} target="_blank" rel="noreferrer" className="focus-ring w-fit text-[hsl(var(--card)/.68)] hover:text-[hsl(var(--card))]">Order online</a></div></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-[hsl(var(--card)/.46)] sm:flex-row"><p>© 2026 Niva Burger & Cafe. All rights reserved.</p><p>Anand, Gujarat · Shaan Food Court</p></div></div></footer>;
}

function FloatingActions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 520); window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); return () => window.removeEventListener('scroll', onScroll); }, []);
  return <div className={`fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] p-1.5 shadow-xl backdrop-blur-xl transition-all sm:bottom-6 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}><a data-testid="floating-call" href={restaurant.tel} className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold hover:bg-[hsl(var(--muted))]"><Phone size={14} /> <span className="hidden xs:inline">Call</span></a><a data-testid="floating-directions" href={restaurant.maps} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold hover:bg-[hsl(var(--muted))]"><MapPin size={14} /> <span className="hidden xs:inline">Directions</span></a><a data-testid="floating-order" href={restaurant.swiggy} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))] px-3.5 py-2 text-xs font-bold text-[hsl(var(--primary-foreground))]"><ShoppingBag size={14} /> Order</a></div>;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 680); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  return <button data-testid="button-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className={`focus-ring fixed bottom-5 right-4 z-30 grid size-11 place-items-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--card))] shadow-lg transition-all sm:bottom-6 sm:right-7 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}><ArrowUp size={17} /></button>;
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    document.title = 'Niva Burger & Cafe | Burgers & Cafe in Anand, Gujarat';
    const description = 'Visit Niva Burger & Cafe in Anand, Gujarat for burgers, cafe favorites and delicious bites. View the menu, explore photos, read reviews and order online.';
    let meta = document.querySelector('meta[name="description"]'); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); } meta.setAttribute('content', description);
    ['og:title', 'og:description', 'og:type'].forEach((property) => { let tag = document.querySelector(`meta[property="${property}"]`); if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); } tag.setAttribute('content', property === 'og:title' ? document.title : property === 'og:type' ? 'restaurant' : description); });
    const schema = { '@context': 'https://schema.org', '@type': 'Restaurant', name: restaurant.name, servesCuisine: 'Cafe / Burger Restaurant', address: { '@type': 'PostalAddress', streetAddress: restaurant.address, addressLocality: 'Anand', addressRegion: 'Gujarat', postalCode: '388120', addressCountry: 'IN' }, telephone: restaurant.phone, aggregateRating: { '@type': 'AggregateRating', ratingValue: restaurant.rating, reviewCount: restaurant.reviews } };
    const existingSchema = document.getElementById('niva-schema');
    const json = existingSchema ?? document.createElement('script');
    json.id = 'niva-schema';
    json.setAttribute('type', 'application/ld+json');
    if (!existingSchema) document.head.appendChild(json);
    json.textContent = JSON.stringify(schema);
  }, []);
  useEffect(() => {
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => observer.observe(section)); return () => observer.disconnect();
  }, []);
  return <div className="noise min-h-[100dvh] overflow-x-hidden"><Navbar active={active} onMenu={() => setMobileOpen(true)} /><MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} /><main><Hero /><QuickInfo /><About /><MenuSection /><Cravings /><Gallery /><Reviews /><Visit /><OrderAndHours /><Contact /></main><Footer /><FloatingActions /><BackToTop /></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;