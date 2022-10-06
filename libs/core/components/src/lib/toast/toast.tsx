/* eslint-disable-next-line */
import { useEffect, useState } from "react";
import Pubsub from "pubsub-js";

export interface ToastProps {
  color: "info" | "success" | "error" | "warning";
  text?: string;
}

const Icons = ({ color }: ToastProps) => {
  switch (color) {
    case "info":
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>;

    case "success":
      return <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                  viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>;
    case "warning":
      return <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                  viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>;
    case "error":
      return <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                  viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>;
    default:
      return null;
  }
};
const toastColor = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error"
};

export function Toast() {
  const [show, setShow] = useState(false);
  const [color, setColor] = useState<ToastProps["color"]>("warning");
  const [text, setText] = useState("");

  useEffect(() => {
    Pubsub.subscribe("TOAST", (_: any, toastData: any) => {
      setColor(toastData.color);
      setText(toastData.text);
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setText('');
      }, 5000);
    });
  }, []);

  return show ? (
    <div className={`alert ${toastColor[color]} shadow-lg absolute top-0 right-0 max-w-md`}>
      <div>
        <Icons color={color} />
        <span>{text}</span>
      </div>
    </div>
  ) : null;
}

export default Toast;
