'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import { AccessiblePortfolioNav } from "./components/common/AccessiblePortfolioNav";
import ScrollWrapper from "./components/common/ScrollWrapper";
import { CertificateOverlay } from "./components/experience/certificates";
import { PortalChrome } from "./components/experience/PortalChrome";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
  return (
    <>
    <AccessiblePortfolioNav />
    <CanvasLoader>
      <ScrollWrapper>
        <Hero/>
        <Experience/>
        <Footer/>
      </ScrollWrapper>
    </CanvasLoader>
    <CertificateOverlay />
    <PortalChrome />
    </>
  );
};
export default Home;
