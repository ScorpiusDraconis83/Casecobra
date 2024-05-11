import MaxWidthWrapper from "@/components/max-width-wrapper";
import Steps from "@/components/steps";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className="flex flex-1 flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
};

export default layout;
