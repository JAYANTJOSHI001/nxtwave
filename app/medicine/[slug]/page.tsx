import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMedicineFormulationsBySlug } from "@/lib/openfda";
import MedicineDetailView from "@/components/MedicineDetailView";

interface MedicinePageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({
  params,
}: MedicinePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const formulations = await getMedicineFormulationsBySlug(resolvedParams.slug);
  const drug = formulations[0];

  if (!drug) {
    return {
      title: "Medicine Not Found — Medicine Directory",
      description:
        "The requested medicine label could not be found in the US FDA database.",
    };
  }

  const brandName = drug.openfda?.brand_name?.[0]?.trim() || "Medicine";
  const title = `${brandName} - Uses, Dosage & Warnings`;

  // Meta description summarizing purpose under 155 characters, with fallback if missing
  const rawPurpose = drug.purpose?.[0]?.replace(/\s+/g, " ")?.trim();
  let metaDescription: string;

  if (rawPurpose && rawPurpose.length > 0) {
    const fullText = `${brandName}: ${rawPurpose}`;
    metaDescription =
      fullText.length <= 155 ? fullText : fullText.slice(0, 152) + "...";
  } else {
    metaDescription =
      `Official US FDA drug label information for ${brandName}, including indications, dosage guidelines, active ingredients, and safety warnings.`.slice(
        0,
        155
      );
  }

  const canonicalUrl = `/medicine/${resolvedParams.slug}`;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "Medicine Directory",
    },
  };
}

export default async function MedicineDetailPage({
  params,
}: MedicinePageProps) {
  const resolvedParams = await params;
  const formulations = await getMedicineFormulationsBySlug(resolvedParams.slug);

  if (!formulations || formulations.length === 0) {
    notFound();
  }

  const drug = formulations[0];
  const brandName = drug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";

  // Schema.org Drug JSON-LD for server-side SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: brandName,
    nonProprietaryName: drug.openfda?.generic_name?.[0] || undefined,
    activeIngredient:
      drug.active_ingredient?.[0] || drug.openfda?.substance_name?.[0] || undefined,
    manufacturer: drug.openfda?.manufacturer_name?.[0]
      ? {
          "@type": "Organization",
          name: drug.openfda.manufacturer_name[0],
        }
      : undefined,
    dosageForm: drug.openfda?.product_type?.[0] || undefined,
    administrationRoute: drug.openfda?.route?.[0] || undefined,
    warning: drug.warnings?.[0] || undefined,
    description:
      drug.purpose?.[0] || drug.indications_and_usage?.[0] || undefined,
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 sm:py-12">
      {/* JSON-LD for SEO injected on the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MedicineDetailView formulations={formulations} />
    </main>
  );
}
