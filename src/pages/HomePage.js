import HeroSection from "../components/common/HeroSection";
import Cities from "../components/capitalCities/Cities";
import TabContent from "../components/description/TabContent";

const HomePage = () => {
  return (
    <div>
      <HeroSection
        title="Aktuální počasí"
        subtitle="Teploty ve světových městech"
      />
      <Cities />
      <TabContent />
    </div>
  );
};

export default HomePage;
