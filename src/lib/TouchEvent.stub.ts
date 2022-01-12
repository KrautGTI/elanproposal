export const stubTouchEvent = () => {
  if (typeof window === "undefined" || typeof window.TouchEvent !== "undefined") return;

  // @ts-ignore
  window.TouchEvent = TouchEventStub;
};

class TouchEventStub {}
