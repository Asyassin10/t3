import { IconPlanet } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

function UnauthorizedPage() {
    const { t } = useTranslation()
    return (
        <div className='h-svh bg-red-50 w-full '>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <IconPlanet size={72} />
                <h1 className='text-4xl font-bold leading-tight'>{t("unauthorized")} 👀</h1>
                <p className='text-center text-muted-foreground'>
                    {t("cannot_access_page")}
                </p>
            </div>
        </div>
    )
}

export default UnauthorizedPage
