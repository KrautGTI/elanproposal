import debounce from "lodash/debounce";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createSelector } from "@reduxjs/toolkit";

import { getRegisteredDialog, RegisteredDialog } from "../../dialog-registry";
import { getDeckReady, getDialogStack, getProposal } from "../../lib/selectors";
import { closeDialog, destroyDialog } from "./dialogs.slice";

const selectIsReady = createSelector([getProposal, getDeckReady], (proposal, deckReady) => !!proposal && !!deckReady);

function ConnectedDialog({ children, id, open, component: Component, ...customProps }) {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeDialog(id));
  }, [dispatch, id]);

  const handleDestroy = useMemo(
    () =>
      debounce(() => {
        dispatch(destroyDialog(id));
      }, 50),
    [dispatch, id]
  );

  if (!Component) {
    console.log(`"${id}" dialog not registered.`);
    return null;
  }

  return (
    <Component key={id} {...customProps} open={open} onClose={handleClose} afterLeave={handleDestroy}>
      {children}
    </Component>
  );
}

function renderDialog(dialog, children) {
  if (!dialog) return null;

  return (
    <ConnectedDialog
      key={dialog.id}
      {...dialog.props}
      id={dialog.id}
      open={dialog.show}
      component={getRegisteredDialog(dialog.id as RegisteredDialog)?.component}
    >
      {children}
    </ConnectedDialog>
  );
}

function DialogManager() {
  const isReady = useSelector(selectIsReady);
  const stack = useSelector(getDialogStack);

  if (!isReady) return null;

  return (
    <>
      {stack
        .filter(x => x.parent === null)
        .map(dialog => renderDialog(dialog, stack.filter(x => x.parent === dialog.id).map(renderDialog)))}
    </>
  );
}

export default DialogManager;
