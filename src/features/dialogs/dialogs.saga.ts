import { takeLatest, put, take, delay, select } from "redux-saga/effects";
import { closeDialog, openDialog } from ".";
import { getShowAuroraHasChangesWarning } from "../../lib/selectors";
import dialogsSlice, { ActionConfirmationPayoad, promptConfirmation } from "./dialogs.slice";

function* confirmationSaga(payload: ActionConfirmationPayoad) {
  yield put(promptConfirmation(payload));
  yield put(openDialog("CONFIRM_ACTION"));

  const nextAction = yield take([dialogsSlice.actions.confirm, dialogsSlice.actions.cancel]);

  if (nextAction.type === dialogsSlice.actions.confirm.type) {
    return true;
  }
  return false;
}

function* closeConfirmationSaga() {
  yield put(closeDialog("CONFIRM_ACTION"));
  yield delay(400);
  yield put(dialogsSlice.actions.resetConfirmationModal());
}

function* closeDesignPortalSaga() {
  const showAuroraChangesWarning = yield select(state => getShowAuroraHasChangesWarning(state));

  if (!showAuroraChangesWarning) {
    yield put(closeDialog("DESIGN_PORTAL"));
  } else {
    const confirmed = yield confirmationSaga({
      headerText: "You Have Unsaved Changes",
      bodyText:
        "Your Aurora design is not saved. If you continue your changes will not be reflected in the proposal and will be discarded.",
      confirmButtonText: "Continue & Discard Changes",
    });
    if (confirmed) {
      yield closeConfirmationSaga();
      yield put(closeDialog("DESIGN_PORTAL"));
    } else {
      yield closeConfirmationSaga();
    }
  }
}

export function* dialogsSaga() {
  yield takeLatest(dialogsSlice.actions.closeDesignPortal, closeDesignPortalSaga);
}
