import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesignPreview from "./design-preview";

interface PageProps {
  searchParams: {
    [key: string]: string | string[];
  };
}

const PreviewPage = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  if (!id || typeof id !== "string") {
    return notFound();
  }
  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });
  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
};

export default PreviewPage;
