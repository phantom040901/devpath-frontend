import { useModalContext } from "../../contexts/ModalContext";
import ArrowRight from "../icons/ArrowRight";
import ArrowRightLine from "../icons/ArrowRightLine";
import HeroRight from "../../assets/graphics/HeroRight.png";

export default function Hero({ id }) {
  const { setActiveModal } = useModalContext();

  return (
    <section id={id} className="relative w-full overflow-x-hidden">
      <div
        className="m-auto max-w-[90rem] grid grid-cols-[1fr_1fr] items-center gap-x-12 px-24 py-40
          max-xl:grid-cols-2 max-xl:px-16 max-xl:py-32
          max-lg:grid-cols-1 max-lg:gap-y-16 max-lg:px-8 max-lg:py-24 
          max-md:px-6 max-sm:px-4"
      >
        {/* --- Left content --- */}
        {/* --- Left content --- */}
<div className="max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
  {/* Headline */}
  <h1
    className="mb-6 text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]
      max-xl:text-5xl max-lg:text-4xl max-sm:text-3xl"
  >
    Discover Your <br /> Tech Career Path
  </h1>

  {/* Subheadline */}
  <p
    className="mb-10 text-xl leading-relaxed text-gray-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]
      max-xl:text-lg max-lg:mb-8"
  >
    DevPath helps students and aspiring tech professionals discover their ideal career in technology—from software development to data analytics, networking & security, quality assurance, IT management, technical support, and specialized IT roles. Match your skills to the right path and get personalized guidance to accelerate your career growth.
  </p>

  {/* CTA Button */}
  <button
    className="group flex items-center gap-x-3 rounded-full
      bg-primary-500 px-10 py-5 text-xl font-semibold text-primary-1300
      shadow-[0_0_25px_rgba(0,255,200,0.6)]
      transition-all hover:bg-primary-50 hover:shadow-[0_0_40px_rgba(0,255,200,0.8)]"
    onClick={() => setActiveModal("sign-up")}
  >
    <span>Get Started</span>
    <div className="w-6">
      <ArrowRightLine
        alt="Arrow right line"
        className="stroke-primary-1300 -mr-3 inline w-0 opacity-0 transition-all group-hover:w-3 group-hover:opacity-100"
        width={3}
      />
      <ArrowRight
        alt="Arrow right icon"
        className="stroke-primary-1300 inline w-6"
        width={2.5}
      />
    </div>
  </button>
</div>


        {/* --- Right-side Graphic + Reviews --- */}
        <div className="relative flex flex-col items-center">
          {/* Blurred circle toned down on mobile */}
          <div className="absolute bottom-0 h-72 w-72 rounded-full bg-primary-500/20 blur-[100px] max-sm:opacity-40" />

          <img
            src={HeroRight}
            alt="Hero graphic for DevPath"
            className="relative object-contain
              scale-110 max-lg:scale-100 max-md:scale-90
              max-sm:w-full max-sm:scale-95 max-sm:opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
