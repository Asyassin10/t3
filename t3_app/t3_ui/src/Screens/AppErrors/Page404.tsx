import { Button } from '@/shadcnuicomponents/custom/button'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

function Page404() {
    const navigate = useNavigate()
    const handleGoBack = () => {
        // If user has navigation history → go back
        navigate(-1)
    }
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
                <Button onClick={handleGoBack}>
                    Go back
                </Button>
            </div>
        </div>
    )
}
export default Page404
