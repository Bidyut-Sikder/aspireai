import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="px-5">
        <div className="flex mb-5 justify-between items-center">
          <h2 className="text-6xl font-bold gradient-title">
            Industry Insights
          </h2>
        </div>
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
