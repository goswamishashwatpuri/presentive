import React from 'react'
import { getAllProjects } from '@/actions/project'
import NotFound from '@/components/global/not-found'
import Projects from '@/components/global/projects/index'

async function Dashboard() {
  const allProjects = await getAllProjects()

  return (
    <div className='w-full flex-col gap-6 relative'>
      <div className='mb-6 flex flex-col reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex flex-col items-start'>
          <h1 className='text-2xl font-semibold dark:text-primary backdrop-blur-sm backdrop-blur-lg'>Projects</h1>
          <p className='text-base font-normal text-muted-foreground'>All of your work in one place</p>
        </div>
      </div>

      {/* Projects */}
      {allProjects.data && allProjects.data.length > 0 ? (
        <Projects allProjects={allProjects.data} />
      ) : (
        <NotFound />
      )}
    </div>
  )
}

export default Dashboard