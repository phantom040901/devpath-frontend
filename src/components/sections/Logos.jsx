import FadeInSection from "../animations/FadeInSection";
import umLogo from "../../assets/logos/um.png";
import pwcLogo from "../../assets/logos/pwc.png";

export default function Logos() {
  return (
    <section className="bg-gradient-to-top">
      <div className="m-auto max-w-[90rem] px-24 py-28 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        {/* Heading */}
        <FadeInSection>
          <p className="text-primary-50 m-auto mb-20 text-center text-xl max-xl:text-lg/8 max-sm:mb-16">
            Organizations powered by{" "}
            <span className="font-bold tracking-tight">DevPath</span>
          </p>
        </FadeInSection>

        {/* Logos Grid */}
        <FadeInSection>
          <div className="flex flex-wrap items-center justify-center gap-16 max-md:gap-12">
            {/* University of Mindanao */}
            <img
              src={umLogo}
              alt="University of Mindanao Logo"
              className="h-48 max-xl:h-40 max-lg:h-36 max-md:h-32 object-contain 
                         drop-shadow-[0_0_25px_rgba(0,255,150,0.6)] 
                         transition-transform duration-500 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_35px_rgba(0,255,150,0.9)]"
            />

            {/* PwC Logo */}
            <img
              src={pwcLogo}
              alt="PwC Logo"
              className="h-48 max-xl:h-40 max-lg:h-36 max-md:h-32 object-contain 
                         drop-shadow-[0_0_25px_rgba(0,255,150,0.6)] 
                         transition-transform duration-500 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_35px_rgba(0,255,150,0.9)]"
            />
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
