import React from "react";

import EmptyLayout from "../../components/layouts/EmptyLayout";

import type { DeckScreen } from "../../types";

const CustomImage: DeckScreen<{ url: string }> = ({ url }) => {
  if (!url) return null;

  return (
    <EmptyLayout className="text-left">
      <div className="w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${url})` }} />
    </EmptyLayout>
  );
};

export default CustomImage;
