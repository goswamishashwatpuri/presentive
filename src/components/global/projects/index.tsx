"use client"
import React from 'react'
import { Project } from '@prisma/client'
import { motion } from 'framer-motion'
import ProjectCard from './project-card'
import { containerVariants } from '@/lib/constants'

type Props = {
  allProjects: Project[]
}

function Projects({ allProjects }: Props) {
  console.log(allProjects)
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
    >
      {allProjects?.map((project) => (
        <ProjectCard
          key={project?.id}
          projectId={project?.id}
          title={project?.title}
          isDelete={project?.isDeleted}
          createdAt={project?.createdAt as unknown as string}
          slideData={project?.slides}
          themeName={project?.themeName}
        />
      ))}
    </motion.div>
  )
}

export default Projects;