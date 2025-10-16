import React from "react";

// Sections

import Page from "../components/sections/Page";
import Header from "../components/sections/Header";
import Navigation from "../components/sections/Navigation";
import Hero from "../components/sections/Hero";
import Reviews from "../components/sections/Reviews";
import Main from "../components/sections/Main";
import Logos from "../components/sections/Logos";
import About from "../components/sections/About";
import HowItWorks from "../components/sections/HowItWorks";
import SystemPreview from "../components/sections/SystemPreview/SystemPreview";
import FAQs from "../components/sections/FAQs/FAQs";
import Footer from "../components/sections/Footer";

// Animations
import FadeInSection from "../components/animations/FadeInSection";


// Context & Modals
import Modal from "../components/sections/Modal/Modal";
import { ModalContextProvider } from "../contexts/ModalContext";

// Mobile Menu
import MobileMenu from "../components/sections/MobileMenu/MobileMenu";
import { MobileMenuContextProvider } from "../contexts/MobileMenuContext";



export default function LandingPage() {

  console.log("✅ LandingPage mounted"); // Debug log
  return (

    <ModalContextProvider>
      <MobileMenuContextProvider>
        <Page>
          {/* HEADER */}
          <Header>
            <Navigation />
            <Hero id="hero" />
            <FadeInSection>
              <Reviews />
            </FadeInSection>
          </Header>

          {/* MAIN */}
          <Main>
            <FadeInSection>
              <Logos />
            </FadeInSection>

            <FadeInSection>
              <About id="about" />
            </FadeInSection>

            <FadeInSection>
              <HowItWorks id="how-it-works" />
            </FadeInSection>

            <FadeInSection>
              <SystemPreview id="system-preview" />
            </FadeInSection>

            <FadeInSection>
              <FAQs id="faqs" />
            </FadeInSection>
          </Main>

          {/* FOOTER */}
          <Footer />

          {/* MODALS */}
          <Modal />

          {/* MOBILE MENU */}
          <MobileMenu />
        </Page>
      </MobileMenuContextProvider>
    </ModalContextProvider>
  );
}
