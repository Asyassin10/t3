
import { Toaster } from '@/shadcnuicomponents/ui/toaster';
import { Outlet } from 'react-router-dom';

function AppLayout() {

    return (
        <>

            <Outlet />
            <Toaster />

        </>
    )
}

export default AppLayout
