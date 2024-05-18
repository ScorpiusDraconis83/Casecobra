import { Suspense } from "react";
import ThankYou from "./thank-you";

const page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default page;
