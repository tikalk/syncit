# Syncit 2.0 - We make it easy to sync your calendars in real time.

<p align="center">
<a href="https://github.com/tikalk/syncit/stargazers"><img src="https://img.shields.io/github/stars/tikalk/syncit?style=plastic"/></a>
<a href="https://github.com/tikalk/syncit/issues"><img src="https://img.shields.io/github/issues/tikalk/syncit?style=plastic"/></a>
<a href="https://github.com/tikalk/syncit/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/tikalk/syncit?style=plastic"/></a>
<a href="https://github.com/tikalk/syncit/pulse"><img src="https://img.shields.io/github/commit-activity/m/tikalk/syncit?style=plastic" alt="Commits-per-month"></a>
<a href="https://github.com/tikalk/syncit/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22"><img src="https://img.shields.io/badge/Help%20Wanted-Contribute-blue?style=plastic"></a>
</p>

<div align="center"><img src="https://github.com/tikalk/syncit/blob/main/apps/web/public/cal-sync-logo.png?raw=true"/></div>

<div align="center"><h1>This is an Open source project!</h1></div>

## Installation

1. Run `yarn` in order to install all dependencies
2. Run `docker-compose up -d` to run all infrastructure.
3. Update `.env` According the instruction appears there.
4. Run `prepare:db` in order to setup the DB
5. Now that everything is setup run `yarn start`

## Integrations

### Obtaining the Google API Credentials

1. Open [Google API Console](https://console.cloud.google.com/apis/dashboard). If you don't have a project in your
   Google Cloud subscription, you'll need to create one before proceeding further. Under Dashboard pane, select Enable
   APIS and Services.
2. In the search box, type calendar and select the Google Calendar API search result.
3. Enable the selected API.
4. Next, go to the [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) from the side pane.
   Select the app type (Internal or External) and enter the basic app details on the first page.
5. In the second page on Scopes, select Add or Remove Scopes. Search for Calendar.event and select the scope with scope
   value `.../auth/calendar.events`, `.../auth/calendar.readonly` and select Update.
6. In the third page (Test Users), add the Google account(s) you'll using. Make sure the details are correct on the last
   page of the wizard and your consent screen will be configured.
7. Now select [Credentials](https://console.cloud.google.com/apis/credentials) from the side pane and then select Create
   Credentials. Select the OAuth Client ID option.
8. Select Web Application as the Application Type.
9. Under Authorized redirect URI's, select Add URI and then add the
   URI `<Syncit URL>/api/integrations/googlecalendar/callback` replacing Syncit URL with the URI at which your
   application runs.
10. The key will be created and you will be redirected back to the Credentials page. Select the newly generated client
    ID under OAuth 2.0 Client IDs.
11. Select Download JSON. Copy the contents of this file and paste the entire JSON string in the .env file as the value
    for GOOGLE_API_CREDENTIALS key.

You will need to complete a few more steps to activate Google Calendar App.
Make sure to complete section "Obtaining the Google API Credentials". After the do the
following

1. Add extra redirect URL `<Syncit URL>/api/auth/callback/google`
2. Under 'OAuth concent screen', click "PUBLISH APP"

## Licence

Distributed under the MIT License. See [LICENSE](https://raw.githubusercontent.com/tikalk/syncit/main/LICENSE.md) for
more information.

## Contribute

Feel free to open us PR on anything you think can help this project. you also can check the
issues [here](https://github.com/tikalk/syncit/issues) and try to fix them.
Found some kind of problem [Let us know about it](https://github.com/tikalk/syncit/issues/new/choose)
> TBD

## Built With
- [TurboRepo](https://nx.dev/)
- [Qwik](https://qwik.dev/)
- [NestJS](https://nestjs.com/)
- [Tailwind](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com)
- [Prisma](https://prisma.io/)


# Happy coding....