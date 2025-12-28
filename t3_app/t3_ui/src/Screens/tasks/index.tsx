/* import { Search } from '@/shadcnuicomponents/search'
import ThemeSwitch from '@/shadcnuicomponents/theme-switch'
import { UserNav } from '@/shadcnuicomponents/user-nav' */
import { Layout, LayoutBody, LayoutHeader } from '@/shadcnuicomponents/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { tasks } from './data/tasks'
import { Search } from '@/shadcnuicomponents/dashboardComponents/search'
import ThemeSwitch from '@/shadcnuicomponents/dashboardComponents/theme-switch'
import { UserNav } from '@/shadcnuicomponents/dashboardComponents/user-nav'

export default function Tasks() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </LayoutBody>
    </Layout>
  )
}
