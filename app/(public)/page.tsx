import { HeroSlider } from "@/components/home/HeroSlider";
import { Differentiators } from "@/components/home/Differentiators";
import { Categories } from "@/components/home/Categories";
import { PromoSection } from "@/components/home/PromoSection";
import { StoresPreview } from "@/components/home/StoresPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBand } from "@/components/home/CtaBand";
import { getPromoActiva } from "@/lib/panel/promos";

// Revalida la home cada 5 min; al cambiar la promo se invalida al instante
// (revalidatePath("/") en la server action).
export const revalidate = 300;

export default async function HomePage() {
  const promo = await getPromoActiva();

  return (
    <>
      <HeroSlider promo={promo} />
      <Differentiators />
      <PromoSection promo={promo} />
      <StoresPreview />
      <Categories />
      <HowItWorks />
      <CtaBand />
    </>
  );
}
