import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { useRecoilValue } from 'recoil';
import { userDataState } from '@syncit2.0/core/store';

export function LeftBar() {
  const userData: any = useRecoilValue(userDataState);
  return userData?.name ? (
    <div className="drawer-side w-60 shadow-lg  p-4 bg-base-100">
      <div className="flex flex-col overflow-y-auto justify-between">
        <div>
          <h3 className="text-3xl font-bold mb-2">
            <Link href="/">Syncit</Link>
          </h3>
          <ul className="menu pt-3">
            <li>
              <Link href="/settings/calendars">
                <div className="flex px-0">
                  <CalendarIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  Calendars List
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center cursor-pointer">
          <div className="bg-gray-400 rounded-full w-10 h-10 flex justify-center items-center font-bold">
            <div>
              {userData.name?.split(' ')[0][0]}
              {userData.name?.split(' ')[1][0]}
            </div>
          </div>
          <div className="ml-2">
            {userData.name}
            <Link href="/auth/logout">
              <p className="text-xs truncate text-ellipsis">
                {`${process.env.NEXT_PUBLIC_WEBAPP_URL}/${
                  userData.email.split('@')[0]
                }`}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default LeftBar;
