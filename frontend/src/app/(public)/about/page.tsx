import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Cable,
  HardDrive,
  ShieldCheck,
  Server,
  Wifi,
  Cpu,
  Network,
  MonitorSmartphone,
  Factory,
  Truck,
  Headset,
  Boxes,
  Eye,
  Target,
  BadgeCheck,
  Sparkles,
  Handshake,
  Check,
} from "lucide-react";

const milestones = [
  {
    year: "2009",
    title: "Foundation",
    description: "Uniworld Vision was established with the vision of delivering dependable security solutions backed by quality products and exceptional customer service.",
  },
  {
    year: "2012",
    title: "CP PLUS Partnership",
    description: "Expanded our surveillance portfolio by becoming a trusted distribution partner of CP PLUS.",
  },
  {
    year: "2014",
    title: "Dahua Technology",
    description: "Partnered with Dahua Technology to provide advanced surveillance solutions across Eastern India.",
  },
  {
    year: "2016",
    title: "Market Leadership",
    description: "Recognized as one of Bihar's leading CCTV distribution partners through continuous growth and customer trust.",
  },
  {
    year: "2019",
    title: "Hikvision Partnership",
    description: "Added Hikvision products to our portfolio, offering customers even more advanced and reliable security solutions.",
  },
  {
    year: "2020",
    title: "Jharkhand Expansion",
    description: "Opened our Jharkhand branch to improve product availability and technical support.",
  },
  {
    year: "2023",
    title: "Launch of UNIWORLD Brand",
    description: "Started manufacturing CCTV cameras, recorders, networking products, and surveillance accessories under our own UNIWORLD brand.",
  },
  {
    year: "2024",
    title: "Rapid Growth",
    description: "Became one of the fastest-growing CCTV companies across Bihar and Jharkhand while expanding throughout Eastern India.",
  },
];

const productRanges = [
  { icon: Camera, title: "IP CCTV Cameras" },
  { icon: MonitorSmartphone, title: "HD Analog Cameras" },
  { icon: Cpu, title: "AI Smart Cameras" },
  { icon: Wifi, title: "Wi-Fi Cameras" },
  { icon: Camera, title: "PTZ Cameras" },
  { icon: Camera, title: "4G Solar Cameras" },
  { icon: Server, title: "DVR & NVR" },
  { icon: Network, title: "PoE Switches" },
  { icon: Cable, title: "CAT6 Cables" },
  { icon: HardDrive, title: "Surveillance HDD" },
  { icon: Boxes, title: "Accessories" },
  { icon: ShieldCheck, title: "Security Products" },
];

const strengths = [
  { icon: Factory, title: "Manufacturing Excellence", description: "Products manufactured using modern technology with strict quality standards." },
  { icon: Boxes, title: "Complete Product Range", description: "Everything from CCTV cameras to networking equipment under one roof." },
  { icon: Truck, title: "Strong Distribution Network", description: "Reliable dealer network ensuring fast product availability across multiple states." },
  { icon: ShieldCheck, title: "Quality Assurance", description: "Every product is tested to deliver consistent performance and durability." },
  { icon: Cpu, title: "Innovation", description: "AI surveillance, cloud connectivity, smart monitoring, and future-ready solutions." },
  { icon: Headset, title: "Dedicated Support", description: "Professional technical guidance and responsive after-sales service for every customer." },
];

const mission = [
  "Manufacture high-quality surveillance products.",
  "Deliver reliable and affordable security solutions.",
  "Support dealers and business partners.",
  "Continuously innovate with emerging technologies.",
  "Help create safer homes, businesses, and communities.",
];

const values = [
  { icon: Handshake, title: "Integrity" },
  { icon: ShieldCheck, title: "Quality" },
  { icon: Sparkles, title: "Innovation" },
  { icon: BadgeCheck, title: "Customer Focus" },
  { icon: Target, title: "Reliability" },
];

const regions = ["Bihar", "Jharkhand", "West Bengal", "Odisha", "Nepal"];
const sectors = ["Residential", "Commercial", "Industrial", "Education", "Healthcare", "Banking", "Hospitality", "Retail", "Government"];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#17253d] px-5 py-7 text-white sm:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About us</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">About Uniworld Vision</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">Manufacturing, distribution and security expertise since 2009.</p>
        </div>
      </section>

      <section className="py-6 md:py-8">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#b94e00]">Our story</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#1b2a4a] sm:text-3xl">Building trust through intelligent security solutions</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">
              <p>Since <strong className="font-semibold text-[#1b2a4a]">2009</strong>, Uniworld Vision Pvt. Ltd. has been committed to reliable, innovative and cost-effective security solutions for homes, businesses, industries, institutions and public infrastructure.</p>
              <p>What started as a regional distributor has grown into a security technology company with a strong presence across Bihar, Jharkhand, West Bengal, Odisha, Nepal and other parts of Eastern India.</p>
              <p>Today, we manufacture CCTV cameras and surveillance products under the <strong className="font-semibold text-[#1b2a4a]">UNIWORLD</strong> brand while distributing products from globally recognized security brands.</p>
              <p>Our team works closely with dealers, distributors, system integrators and end users, combining product guidance with responsive technical and after-sales support.</p>
            </div>
          </div>
          <div>
            <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image src="/about/company.jpeg" alt="Group photo at a Uniworld Vision company event" width={447} height={447} priority sizes="(max-width: 1024px) 90vw, 500px" className="mx-auto h-auto w-full max-w-lg object-contain" />
              <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">Working with dealers, distributors and security professionals.</figcaption>
            </figure>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { number: "16+", title: "Years of experience" },
                { number: "5+", title: "Regions served" },
                { number: "100%", title: "Quality focus" },
                { number: "24/7", title: "Technical support" },
              ].map((stat) => (
                <div key={stat.title}>
                  <dt className="text-xs leading-5 text-slate-500">{stat.title}</dt>
                  <dd className="mt-1 text-2xl font-bold text-[#1b2a4a]">{stat.number}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-[#f7f9fc] py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b94e00]">Our journey</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">A legacy of growth &amp; innovation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">From regional distribution to our own surveillance brand, each milestone reflects our growth across Eastern India.</p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {milestones.map((item) => (
              <li key={item.year} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-full bg-[#fff4ec] px-3 py-1 text-xs font-bold text-[#b94e00]">{item.year}</span>
                  <h3 className="text-base font-bold text-[#1b2a4a]">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#b94e00]">Products &amp; presence</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">A complete security portfolio</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#b94e00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B00]">Explore products <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">We manufacture and distribute CCTV, networking and security products designed for long-term performance and reliability.</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {productRanges.map((product) => (
              <li key={product.title} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 sm:gap-3 sm:px-4">
                <product.icon size={20} className="shrink-0 text-[#b94e00]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[#1b2a4a]">{product.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="text-sm font-bold text-[#1b2a4a]">Where we work</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {regions.map((region) => <li key={region} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{region}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="text-sm font-bold text-[#1b2a4a]">Who we support</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sectors.map((sector) => <li key={sector} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{sector}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-[#f7f9fc] py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b94e00]">Why Uniworld</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">Products, partnerships and support</h2>
          <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {strengths.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <item.icon size={22} className="mt-1 shrink-0 text-[#b94e00]" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-bold text-[#1b2a4a]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Eye size={22} className="text-[#b94e00]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#1b2a4a]">Our vision</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">To become one of India's most trusted security technology brands by delivering innovative products, reliable solutions, and exceptional customer experiences.</p>
            </div>
            <div className="rounded-xl bg-[#1b2a4a] p-5 text-white sm:p-6">
              <div className="flex items-center gap-3">
                <Target size={22} className="text-[#ff9c54]" aria-hidden="true" />
                <h3 className="text-lg font-bold">Our mission</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {mission.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-200"><Check size={16} className="mt-1 shrink-0 text-[#ff9c54]" aria-hidden="true" /><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-bold text-[#1b2a4a]">Our values</h3>
            <ul className="flex flex-wrap gap-2">
              {values.map((value) => <li key={value.title} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"><value.icon size={15} className="text-[#b94e00]" aria-hidden="true" />{value.title}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 md:py-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-xl bg-[#1b2a4a] p-6 text-white sm:p-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff9c54]">Building a safer future</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Protect what matters most</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">From homes and businesses to institutions and communities, our team can help with product selection, project requirements and dealer enquiries.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <Link href="/products" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-5 text-sm font-bold text-white transition hover:bg-[#e95f00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explore products <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-bold transition hover:bg-white hover:text-[#1b2a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Contact our team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
