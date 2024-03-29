import { LoaderIcon } from "lucide-react";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default Loading;
