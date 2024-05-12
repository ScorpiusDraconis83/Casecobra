import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./design-configurator";

interface DesignPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const DesignPage = async ({ searchParams }: DesignPageProps) => {
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

  const { imageUrl, height, width } = configuration;
  return (
    <DesignConfigurator
      imageDimesions={{ height, width }}
      imageUrl={imageUrl}
      configId={configuration.id}
    />
  );
};

export default DesignPage;
