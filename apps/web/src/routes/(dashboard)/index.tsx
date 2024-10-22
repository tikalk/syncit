import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeAction$, routeLoader$, useNavigate } from '@builder.io/qwik-city';
import type { Calendar } from '@repo/db';
import { AuthContext, type IAuthContext } from '~/providers/auth';
import type { IToastContext } from '~/providers/toast';
import { ToastContext } from '~/providers/toast';

export const useCalendars = routeLoader$(async () => {
  const res = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/calendars/availableCalendars`);
  const calendars = await res.json();
  return calendars.list ?? [] as Calendar[];
});

export const useAuthGoogle = routeAction$(async () => {
  const res = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/integrations/google_calendar/add`);
  const { url } = await res.json();
  return url;
});

export const useDeleteCredential = routeAction$(async (value) => {
  await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/integrations/google_calendar/delete/${value.credId}`,
    { method: 'DELETE' });
  return { success: true };
});

export const useCalendarToggleChange = routeAction$(async (value) => {
  await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/integrations/google_calendar/delete/${value.credId}`,
    {
      method: value.checked ? 'POST' : 'DELETE', body: JSON.stringify({
        integration: value.integration,
        externalId: value.externalId,
        credId: value.credId,
      }),
    });
  return { success: true };
});

export default component$(() => {
  const { status } = useContext<IAuthContext>(AuthContext);
  const { toast } = useContext<IToastContext>(ToastContext);
  const nav = useNavigate();
  const calendars = useCalendars();
  const authGoogle = useAuthGoogle();
  const deleteCredential = useDeleteCredential();
  const calendarToggleChange = useCalendarToggleChange();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track, cleanup }) => {
    track(status);
    const timeoutId = setTimeout(async () => {
      if (status.value === "loggedOut") {
        await toast({
          msg: "You must be logged in to access this page.",
          type: "success",
          timeout: 5000,
        });
        await nav("/auth/login?redirectUri=/");
      }
    }, 500);
    cleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  return (
    <>
      <div class="min-w-full flex-1 p-10">
        <div class="flex justify-between">
          <h3 class="text-2xl font-bold">Calendars List</h3>
          <label
            for="add-modal"
            class="modal-button btn btn-outline btn-sm"
          >
            +
          </label>
        </div>
        <p class="pb-5 pt-2">Description will appear here</p>
        <div class="flex flex-col gap-5">
          {calendars.value.map((account: any) => (
            <div
              class="card bg-base-100 shadow-xl"
              key={`account-card-${account.name}`}
            >
              <div class="card-body">
                <div class="card-title flex justify-between">
                  <h2 class="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="186 38 76 76" width={40} height={40}>
                      <path fill="#fff" d="M244 56h-40v40h40V56z" />
                      <path fill="#EA4335" d="M244 114l18-18h-18v18z" />
                      <path fill="#FBBC04" d="M262 56h-18v40h18V56z" />
                      <path fill="#34A853" d="M244 96h-40v18h40V96z" />
                      <path fill="#188038" d="M186 96v12c0 3.315 2.685 6 6 6h12V96h-18z" />
                      <path fill="#1967D2" d="M262 56V44c0-3.315-2.685-6-6-6h-12v18h18z" />
                      <path fill="#4285F4" d="M244 38h-52c-3.315 0 -6 2.685-6 6v52h18V56h40V38z" />
                      <path fill="#4285F4"
                            d="M212.205 87.03c-1.495-1.01-2.53-2.485-3.095-4.435l3.47-1.43c.315 1.2.865 2.13 1.65 2.79.78.66 1.73.985 2.84.985 1.135 0 2.11-.345 2.925-1.035s1.225-1.57 1.225-2.635c0-1.09-.43-1.98-1.29-2.67-.86-.69-1.94-1.035-3.23-1.035h-2.005V74.13h1.8c1.11 0 2.045-.3 2.805-.9.76-.6 1.14-1.42 1.14-2.465 0 -.93-.34-1.67-1.02-2.225-.68-.555-1.54-.835-2.585-.835-1.02 0 -1.83.27-2.43.815a4.784 4.784 0 0 0 -1.31 2.005l-3.435-1.43c.455-1.29 1.29-2.43 2.515-3.415 1.225-.985 2.79-1.48 4.69-1.48 1.405 0 2.67.27 3.79.815 1.12.545 2 1.3 2.635 2.26.635.965.95 2.045.95 3.245 0 1.225-.295 2.26-.885 3.11-.59.85-1.315 1.5-2.175 1.955v.205a6.605 6.605 0 0 1 2.79 2.175c.725.975 1.09 2.14 1.09 3.5 0 1.36-.345 2.575-1.035 3.64s-1.645 1.905-2.855 2.515c-1.215.61-2.58.92-4.095.92-1.755.005-3.375-.5-4.87-1.51zM233.52 69.81l-3.81 2.755-1.905-2.89 6.835-4.93h2.62V88h-3.74V69.81z" />
                    </svg>
                    {account.name}
                  </h2>
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-xs"
                    onClick$={async () => {
                      await deleteCredential.submit({ credId: account.id });
                    }}
                  >
                    Disconnect
                  </button>
                </div>
                <div class="divider m-0" />
                <div>
                  {account.calendars.map((calendar: any) => (
                    <div
                      class="mb-3 flex items-center gap-4"
                      key={calendar.externalId}
                    >
                      <input
                        type="checkbox"
                        class="toggle"
                        defaultChecked={calendar.enabled}
                        onChange$={async (e) =>
                          await calendarToggleChange.submit(
                            {
                              integration: account.type,
                              externalId: calendar.externalId,
                              credId: account.id,
                              checked: (e.target as HTMLInputElement).checked,
                            },
                          )
                        }
                      />
                      {calendar.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <input type="checkbox" id="add-modal" class="modal-toggle" />
      <div class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Add integration</h3>
          <div
            class="flex cursor-pointer items-center gap-5 py-4 hover:text-primary hover:shadow-lg"
            onClick$={async () => {
              const { value: url } = await authGoogle.submit();
              // @ts-ignore
              window.location.href = url;
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="186 38 76 76" width={40} height={40}>
              <path fill="#fff" d="M244 56h-40v40h40V56z" />
              <path fill="#EA4335" d="M244 114l18-18h-18v18z" />
              <path fill="#FBBC04" d="M262 56h-18v40h18V56z" />
              <path fill="#34A853" d="M244 96h-40v18h40V96z" />
              <path fill="#188038" d="M186 96v12c0 3.315 2.685 6 6 6h12V96h-18z" />
              <path fill="#1967D2" d="M262 56V44c0-3.315-2.685-6-6-6h-12v18h18z" />
              <path fill="#4285F4" d="M244 38h-52c-3.315 0 -6 2.685-6 6v52h18V56h40V38z" />
              <path fill="#4285F4"
                    d="M212.205 87.03c-1.495-1.01-2.53-2.485-3.095-4.435l3.47-1.43c.315 1.2.865 2.13 1.65 2.79.78.66 1.73.985 2.84.985 1.135 0 2.11-.345 2.925-1.035s1.225-1.57 1.225-2.635c0-1.09-.43-1.98-1.29-2.67-.86-.69-1.94-1.035-3.23-1.035h-2.005V74.13h1.8c1.11 0 2.045-.3 2.805-.9.76-.6 1.14-1.42 1.14-2.465 0 -.93-.34-1.67-1.02-2.225-.68-.555-1.54-.835-2.585-.835-1.02 0 -1.83.27-2.43.815a4.784 4.784 0 0 0 -1.31 2.005l-3.435-1.43c.455-1.29 1.29-2.43 2.515-3.415 1.225-.985 2.79-1.48 4.69-1.48 1.405 0 2.67.27 3.79.815 1.12.545 2 1.3 2.635 2.26.635.965.95 2.045.95 3.245 0 1.225-.295 2.26-.885 3.11-.59.85-1.315 1.5-2.175 1.955v.205a6.605 6.605 0 0 1 2.79 2.175c.725.975 1.09 2.14 1.09 3.5 0 1.36-.345 2.575-1.035 3.64s-1.645 1.905-2.855 2.515c-1.215.61-2.58.92-4.095.92-1.755.005-3.375-.5-4.87-1.51zM233.52 69.81l-3.81 2.755-1.905-2.89 6.835-4.93h2.62V88h-3.74V69.81z" />
            </svg>
            Google Calendar
          </div>
          <div class="modal-action">
            <label for="add-modal" class="btn btn-outline btn-sm">
              Close
            </label>
          </div>
        </div>
      </div>
    </>)
})

export const head: DocumentHead = {
  title: "Welcome to Syncit",
  meta: [
    {
      name: "description",
      content: "We make it easy to sync your calendars in real time.",
    },
  ],
};
