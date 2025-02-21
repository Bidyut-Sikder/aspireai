import React from "react";

interface Params {
  id: string;
}

const page = async({ params }: { params: Params }) => {
    const dd=await params
  return <div>id :{dd.id}</div>;
};

export default page;
