import {component$, Slot} from '@builder.io/qwik';
import Image from '~/media/cal-sync-logo.png?jsx';

export const Layout = component$(() => {
    return (
        <div class="h-screen container mx-5 lg:mx-auto flex flex-col justify-center items-center">
            <Image style={{ width: '250px'}}/>
            <Slot/>
        </div>
    );
});
export default Layout