import { Button } from '@/shadcnuicomponents/ui/button'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
/* import { IconPlanet } from '@tabler/icons-react'
 */
function SubscriptionEnded() {
    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                {/*  <IconPlanet size={72} /> */}
                <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
                <h1 className='text-4xl font-bold leading-tight'>Ooops , Page not found 👀</h1>
                <p className='text-center text-muted-foreground'>
                    This page does not exists , <br />
                    pleace contact the support
                </p>
                <Button>
                    support
                </Button>
                {/* <p className='text-center text-muted-foreground'>
                    This page has not been created yet. <br />
                    Stay tuned though!
                </p> */}
            </div>
        </div>
    )
}

export default SubscriptionEnded



