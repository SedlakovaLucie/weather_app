import FormComponent from "../components/form/FormComponent";
import HeroSection from "../components/common/HeroSection";

const Form = () => {
  return (
    <div>
      <HeroSection
        title="Aktuální počasí"
        subtitle="Zadejte název města a zjistěte aktuální počasí kdekoliv na světě"
      />
      <FormComponent />
    </div>
  );
};

export default Form;
