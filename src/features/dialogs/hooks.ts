import { useMemo } from "react";
import { useSelector } from "react-redux";

import { createSelector } from "@reduxjs/toolkit";

import { getDialogStack } from "../../lib/selectors";

import type { RegisteredDialog } from "../../dialog-registry";

const selectOpenDialogIds = createSelector([getDialogStack], stack => stack.filter(x => x.show).map(x => x.id));

export function useDialogOpen(id: RegisteredDialog) {
  const openDialogIds = useSelector(selectOpenDialogIds);

  return useMemo(() => openDialogIds.includes(id), [openDialogIds, id]);
}
