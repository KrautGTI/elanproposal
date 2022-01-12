import clsx from "clsx";
import React from "react";

import EmptyLayout from "../../components/layouts/EmptyLayout";

import type { DeckScreen } from "../../types";

const Notes: DeckScreen = () => {
  return (
    <EmptyLayout className="h-full">
      <p className={clsx("text-center text-4xl text-gray-700 opacity-40 -mt-8")}>Meeting notes</p>
    </EmptyLayout>
  );
};

export default Notes;
