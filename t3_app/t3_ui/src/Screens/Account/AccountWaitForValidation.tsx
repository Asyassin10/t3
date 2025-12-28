import { Button } from '@/shadcnuicomponents/ui/button'
import { IconPlanet } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

function AccountWaitForValidation() {
    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <IconPlanet size={72} />
                <h1 className='text-4xl font-bold leading-tight'>We did receive your request successfully</h1>
                <p className='text-center text-muted-foreground'>
                    This page has not been created yet. <br />
                    Stay tuned though!
                </p>
                <Link to={"/"}>
                    <Button>
                        Back
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default AccountWaitForValidation
