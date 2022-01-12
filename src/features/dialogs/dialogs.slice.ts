import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RegisteredDialog, RegisteredDialogProps } from "../../dialog-registry";

type ModalState = {
  id: string;
  props?: Record<string, any>;
  show: boolean;
  parent: string | null;
};

type ConfirmationState = {
  headerText?: string;
  bodyText?: string;
  confirmButtonText?: string;
};

type ModalsState = {
  active: string | null;
  stack: ModalState[];
  confirmation: ConfirmationState;
};

export type ActionConfirmationPayoad = {
  headerText: string;
  bodyText: string;
  confirmButtonText: string;
};

const initialState = {
  active: null,
  confirmation: {},
  stack: [],
} as ModalsState;

const dialogsSlice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    open(state, action: PayloadAction<{ id: RegisteredDialog; props: any }>) {
      const matchIndex = state.stack.findIndex(m => m.id === action.payload.id);
      const copy = state.stack.slice();

      const newDialog: ModalState = { ...action.payload, parent: state.active, show: true };

      if (matchIndex >= 0 && newDialog.parent === action.payload.id) {
        newDialog.parent = state.stack[matchIndex].parent;
      }

      if (matchIndex > -1) {
        copy.splice(matchIndex, 1, newDialog);
      } else {
        copy.push(newDialog);
      }

      state.stack = copy;
      state.active = action.payload.id;
    },
    close(state, action: PayloadAction<RegisteredDialog>) {
      const matchIndex = state.stack.findIndex(m => m.id === action.payload);
      if (matchIndex < 0) return;

      const copy = state.stack.slice();
      copy.splice(matchIndex, 1, { ...copy[matchIndex], show: false });

      state.stack = copy;
      state.active = copy[copy.length - 1].parent;
    },
    destroy(state, action: PayloadAction<RegisteredDialog>) {
      state.stack = state.stack.filter(x => x.id !== action.payload);
    },
    promptConfirmation(state, action: PayloadAction<ActionConfirmationPayoad>) {
      state.confirmation.bodyText = action.payload.bodyText;
      state.confirmation.confirmButtonText = action.payload.confirmButtonText;
      state.confirmation.headerText = action.payload.headerText;
    },
    closeDesignPortal() {},
    confirm(state) {},
    cancel(state) {},
    resetConfirmationModal(state) {
      state.confirmation.bodyText = "";
      state.confirmation.confirmButtonText = "";
      state.confirmation.headerText = "";
    },
  },
});

export function openDialog<T extends RegisteredDialog>(id: T, props?: RegisteredDialogProps<T>) {
  return dialogsSlice.actions.open({ id, props: props ?? {} });
}

export const {
  close: closeDialog,
  destroy: destroyDialog,
  promptConfirmation,
  closeDesignPortal,
} = dialogsSlice.actions;

export default dialogsSlice;
