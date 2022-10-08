import * as short from 'short-uuid';
import { v5 as uuidv5 } from 'uuid';
import { CalendarEvent, Person } from '../../../../../types/google_calendar';

export const WEBAPP_URL =
  process.env['NEXT_PUBLIC_WEBAPP_URL'] ||
  `https://${process.env['VERCEL_URL']}`;
const translator = short();

export const getWhat = (calEvent: CalendarEvent) => `
${calEvent.organizer.language.translate('what')}:
${calEvent.type}
  `;

export const getWhen = (calEvent: CalendarEvent) => `
${calEvent.organizer.language.translate('invitee_timezone')}:
${calEvent.attendees[0].timeZone}
  `;

export const getWho = (calEvent: CalendarEvent) => {
  const attendees = calEvent.attendees
    .map(
      (attendee: any) => `
${attendee?.name || calEvent.organizer.language.translate('guest')}
${attendee.email}
      `
    )
    .join('');

  const organizer = `
${calEvent.organizer.name} - ${calEvent.organizer.language.translate(
    'organizer'
  )}
${calEvent.organizer.email}
  `;

  return `
${calEvent.organizer.language.translate('who')}:
${organizer + attendees}
  `;
};

export const getAdditionalNotes = (calEvent: CalendarEvent) => {
  if (!calEvent.additionalNotes) {
    return '';
  }
  return `
${calEvent.organizer.language.translate('additional_notes')}:
${calEvent.additionalNotes}
  `;
};

export const getCustomInputs = (calEvent: CalendarEvent) => {
  if (!calEvent.customInputs) {
    return '';
  }

  const customInputsString = Object.keys(calEvent.customInputs)
    .map((key) => {
      if (!calEvent.customInputs) return '';
      if (calEvent.customInputs[key] !== '') {
        return `
${key}:
${calEvent.customInputs[key]}
  `;
      }
      return '';
    })
    .join('');

  return customInputsString;
};

export const getDescription = (calEvent: CalendarEvent) => {
  if (!calEvent.description) {
    return '';
  }
  return `\n${calEvent.attendees[0].language.translate('description')}
    ${calEvent.description}
    `;
};
export const getLocation = (calEvent: CalendarEvent) => {
  let providerName = '';

  if (calEvent.location && calEvent.location.includes('integrations:')) {
    const location = calEvent.location.split(':')[1];
    providerName = location[0].toUpperCase() + location.slice(1);
  }

  if (calEvent.videoCallData) {
    return calEvent.videoCallData.url;
  }

  if (calEvent.additionInformation?.hangoutLink) {
    return calEvent.additionInformation.hangoutLink;
  }

  return providerName || calEvent.location || '';
};

export const getUid = (calEvent: CalendarEvent): string =>
  calEvent.uid ??
  translator.fromUUID(uuidv5(JSON.stringify(calEvent), uuidv5.URL));
export const getCancelLink = (calEvent: CalendarEvent): string =>
  `${WEBAPP_URL}/cancel/${getUid(calEvent)}`;
export const getManageLink = (calEvent: CalendarEvent) => `
${calEvent.organizer.language.translate('need_to_reschedule_or_cancel')}
${getCancelLink(calEvent)}
  `;

export const getRichDescription = (
  calEvent: CalendarEvent,
  attendee?: Person
) => {
  // Only the original attendee can make changes to the event
  // Guests cannot

  if (attendee && attendee === calEvent.attendees[0]) {
    return `
${getWhat(calEvent)}
${getWhen(calEvent)}
${getWho(calEvent)}
${calEvent.organizer.language.translate('where')}:
${getLocation(calEvent)}
${getDescription(calEvent)}
${getAdditionalNotes(calEvent)}
${getCustomInputs(calEvent)}
  `.trim();
  }

  return `
${getWhat(calEvent)}
${getWhen(calEvent)}
${getWho(calEvent)}
${calEvent.organizer.language.translate('where')}:
${getLocation(calEvent)}
${getDescription(calEvent)}
${getAdditionalNotes(calEvent)}
${getCustomInputs(calEvent)}
${getManageLink(calEvent)}
  `.trim();
};
