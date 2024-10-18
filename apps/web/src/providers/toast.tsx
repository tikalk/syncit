import {
  $,
  component$,
  createContextId,
  type QRL,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";

export interface IToastContext {
  toast: QRL<
    ({
      msg,
      type,
      timeout,
    }: {
      msg: string;
      type?: "info" | "success" | "error" | "warning";
      timeout?: number;
    }) => void
  >;
}

export const ToastContext = createContextId<IToastContext>("toast-context");

export const ToastProvider = component$(() => {
  const alertType = useSignal<"info" | "success" | "error" | "warning">("info");
  const message = useSignal<
    Record<
      string,
      {
        msg?: string;
        type?: "info" | "success" | "error" | "warning";
        timeout?: number;
      }
    >
  >({});

  const toast = $(
    ({
      msg,
      type = "info",
      timeout = 3000,
    }: {
      msg: string;
      type?: "info" | "success" | "error" | "warning";
      timeout?: number;
    }) => {
      const id = (Math.random() * 1000).toString();
      message.value = { ...message.value, [id]: { msg, type, timeout } };
      alertType.value = type;

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = message.value;
        message.value = rest;
      }, timeout);
    },
  );

  useContextProvider(ToastContext, { toast });

  return (
    <>
      <Slot />
      <div class="toast toast-end">
        {Object.values(message.value)
          .filter(({ msg }) => !!msg)
          .map(({ msg, type = "info" }, index) => (
            <div
              key={`toast-${index}`}
              class={`alert 
                ${type === "info" && "alert-info"} 
                ${type === "success" && "alert-success"} 
                ${type === "error" && "alert-error"} 
                ${type === "warning" && "alert-warning"}
                `}
            >
              {type === "info" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="size-6 shrink-0 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}
              {type === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {type === "warning" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {type === "error" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span>{msg}</span>
            </div>
          ))}
      </div>
    </>
  );
});
