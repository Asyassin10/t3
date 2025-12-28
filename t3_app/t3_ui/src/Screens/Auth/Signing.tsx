
import { Card } from '@/shadcnuicomponents/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import { LogoauthT3 } from '@/shadcnuicomponents/Icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Signing() {
    const { t } = useTranslation()

    return (
        <>
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                    <div className='mb-4 flex items-center justify-center'>
                        <LogoauthT3 />
                    </div>
                    <Card className='p-6'>
                        <div className='mb-2 flex flex-col space-y-2  text-center'>
                            <h1 className='text-xl font-semibold tracking-tight'>
                                Se Connecter
                            </h1>

                        </div>
                        <UserAuthForm />
                        <p className=' px-8 text-center text-md font-bold'>
                            {t("dontYouHaveAnAccount")} ?{" "}
                            <Link to="/auth/register" className="underline">
                                {t("signUp")}
                            </Link>
                        </p>
                        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>

                            <a
                                href='/terms'
                                className='underline underline-offset-4 hover:text-primary'
                            >
                                Les Conditions générales
                            </a>{' '}
                            et {' '}
                            <a
                                href='/privacy'
                                className='underline underline-offset-4 hover:text-primary'
                            >
                                La Politique de confidentialité
                            </a>
                            .
                        </p>
                    </Card>
                </div>
            </div>


        </>
    )
}

export default Signing
