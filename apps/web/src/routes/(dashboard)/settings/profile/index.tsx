import { component$ } from '@builder.io/qwik';
import { useSession } from '~/routes/plugin@auth';
import { AccountSettings } from './account-settings';

export const Index = component$(() => {
  const session = useSession();
  const size = 80;
  const userImageUrl = `https://www.gravatar.com/avatar/?s=${size}&d=identicon`;

  return (
    <div class="mx-auto grid grid-cols-12 gap-10 self-start rounded-lg p-4">
      <div class="col-span-3 flex flex-col items-center justify-start">
        <div class="avatar my-12">
          <div class="w-64 rounded-full">
            <img
              width={120}
              height={120}
              alt={session.value?.name ?? 'User image'}
              src={userImageUrl}
            />
          </div>
        </div>
        <div class="text-3xl">{session.value?.name}</div>
        <div class="text-2xl">{session.value?.email}</div>
      </div>
      <div class="col-span-9">
        <AccountSettings />
      </div>
    </div>
  );
});

export default Index;