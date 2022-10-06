import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import http from 'axios';
import { Icon } from '@syncit2.0/core/components';

const Home: NextPage = () => {
  const [calendarsList, setCalendarsList] = useState([]);

  const getCalendars = useCallback(async () => {
    const { data } = await http.get('/api/calendars/availableCalendars');
    setCalendarsList(data?.list);
  }, []);

  useEffect(() => {
    getCalendars();
  }, []);

  const authGoogle = useCallback(async () => {
    try {
      const res = await http.get('/api/integrations/google_calendar/add');
      window.location.href = res.data.url;
    } catch (e: any) {
      throw new Error('Something went wrong: ' + e.message);
    }
  }, []);

  const deleteCredential = useCallback(async (credId: number) => {
    await http.delete(`/api/integrations/google_calendar/delete/${credId}`);
    getCalendars();
  }, []);

  const calendarToggleChange = useCallback(
    async (
      integration: string,
      externalId: string,
      credId: number,
      checked: boolean
    ) => {
      if (checked) {
        await http.post('/api/calendars/availableCalendars', {
          integration,
          externalId,
          credId,
        });
      } else {
        await http.delete('/api/calendars/availableCalendars', {
          data: { integration, externalId, credId },
        });
      }
    },
    []
  );

  return (
    <>
      <div className="min-w-full p-10">
        <div className="flex justify-between">
          <h3 className="font-bold text-2xl">Calendars List</h3>
          <label
            htmlFor="add-modal"
            className="btn btn-sm modal-button btn-outline"
          >
            +
          </label>
        </div>
        <p className="pt-2 pb-5">Description will appear here</p>
        <div className="flex flex-col gap-5">
          {calendarsList.map((account: any) => (
            <div
              className="card shadow-xl bg-base-100"
              key={`account-card-${account.name}`}
            >
              <div className="card-body">
                <div className="card-title flex justify-between">
                  <h2 className="flex items-center gap-4">
                    <Icon name={account.type} width={40} height={40} />
                    {account.name}
                  </h2>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-xs"
                    onClick={() => deleteCredential(account.id)}
                  >
                    Disconnect
                  </button>
                </div>
                <div className="divider m-0" />
                <div>
                  {account.calendars.map((calendar: any) => (
                    <div
                      className="flex items-center gap-4 mb-3"
                      key={calendar.externalId}
                    >
                      <input
                        type="checkbox"
                        className="toggle"
                        defaultChecked={calendar.enabled}
                        onChange={(e) =>
                          calendarToggleChange(
                            account.type,
                            calendar.externalId,
                            account.id,
                            e.target.checked
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
      <input type="checkbox" id="add-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add integration</h3>
          <div
            className="py-4 flex items-center gap-5 cursor-pointer hover:text-primary hover:shadow-lg"
            onClick={authGoogle}
          >
            <Icon name="google_calendar" width={40} height={40} />
            Google Calendar
          </div>
          <div className="modal-action">
            <label htmlFor="add-modal" className="btn btn-sm btn-outline">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
