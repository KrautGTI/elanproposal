import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import Notification from "./Notification";
import { destroyNotification, dismissNotification } from "./notifications.slice";

export default function NotificationContainer() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.queue);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      {createPortal(
        <div aria-live="assertive" className="notifications">
          <div className="notifications--stack">
            {notifications.map(notif => (
              <SlideInOut
                key={notif.id}
                show={!!notif.show}
                afterLeave={() => {
                  dispatch(destroyNotification(notif.id));
                }}
              >
                <Notification
                  title={notif.title}
                  body={notif.body}
                  icon={notif.icon}
                  onHide={() => {
                    dispatch(dismissNotification(notif.id));
                  }}
                />
              </SlideInOut>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function SlideInOut({ children, afterLeave, show }) {
  return (
    <Transition
      appear
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="opacity-0 translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-full"
      afterLeave={afterLeave}
    >
      {children}
    </Transition>
  );
}
