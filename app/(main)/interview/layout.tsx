import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="px-5">

        <Suspense
          fallback={<BarLoader className="mt-4" color="gray" width={"100%"} />}
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default layout;