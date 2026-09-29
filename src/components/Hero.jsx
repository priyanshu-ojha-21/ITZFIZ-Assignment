import car from "../assets/car.png";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const topStats = [
  { value: "58%", label: "Increase in pick up point use", style: "bg-[#b6f34f] text-neutral-900" },
  { value: "27%", label: "Increase in pick up point use", style: "bg-neutral-800 text-white" },
];
const bottomStats = [
  { value: "23%", label: "Decreased in customer phone calls", style: "bg-[#4cc8ff] text-neutral-900" },
  { value: "40%", label: "Decreased in customer phone calls", style: "bg-[#ff7310] text-neutral-900" },
];

const Card = ({ s }) => (
  <div className={`stat w-[44vw] sm:w-[260px] rounded-xl p-3 sm:p-6 ${s.style}`}>
    <p className="text-2xl sm:text-5xl font-bold">
      <span className="count" data-target={parseInt(s.value)}>0</span>%
    </p>
    <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm">{s.label}</p>
  </div>
);

export default function Hero() {
  const root = useRef();

  useGSAP(() => {
    gsap.set(".car", { yPercent: -50 });

    // 1. Load animation (headline + car)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".headline", { y: 40, opacity: 0, duration: 1 })
      .from(".car", { opacity: 0, duration: 1 }, "-=0.5");

    // 2. Scroll animation
    const scrollTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
      },
    });

    scrollTl
      .fromTo(".car", { x: "0vw" }, { x: "100vw", duration: 1 }, 0)
      .fromTo(
        ".band-bg",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1 },
        0
    )
    .fromTo(
        ".bottom-stats .stat",
        { y: -40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.15, stagger: 0.08 },
        0.3
        )
        .fromTo(
        ".top-stats .stat",
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.15, stagger: 0.08 },
        0.4
    )
    gsap.utils.toArray(".count").forEach((el) => {
        const obj = { v: 0 };
        scrollTl.to(obj, {
            v: Number(el.dataset.target),
            duration: 0.3,
            onUpdate: () => (el.textContent = Math.round(obj.v)),
        }, 0.4);
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative h-screen overflow-hidden bg-neutral-300">
      {/* Top cards */}
      <div className="top-stats absolute left-[4%] sm:left-[45%] bottom-[calc(50%+120px)] flex gap-2">
        {topStats.map((s) => <Card key={s.value} s={s} />)}
      </div>

      {/* Center band */}
      <div className="absolute inset-x-0 top-1/2 h-[200px] -translate-y-1/2">
        <div className="absolute inset-0 bg-neutral-900" />
        <div className="band-bg absolute inset-0 bg-[#00dc9a]" />
        <h1 className="headline relative z-10 flex h-full items-center px-6 md:px-16 text-4xl md:text-8xl font-black tracking-[0.1em] md:tracking-[0.15em] text-neutral-900">
          WELCOME ITZFIZ
        </h1>
        <img src={car} alt="car" className="car absolute left-0 top-1/2 z-20 h-[160px] md:h-[260px] w-auto" />
      </div>

      {/* Bottom cards */}
      <div className="bottom-stats absolute left-[4%] sm:left-[35%] top-[calc(50%+120px)] flex gap-2">
        {bottomStats.map((s) => <Card key={s.value} s={s} />)}
      </div>
    </section>
  );
}