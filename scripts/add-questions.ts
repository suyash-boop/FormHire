import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function addQuestions() {
  // Find the Senior Frontend Developer job
  const frontendJob = await prisma.job.findFirst({
    where: { title: 'Senior Frontend Developer' }
  })

  if (frontendJob) {
    // Delete existing questions first
    await prisma.jobQuestion.deleteMany({
      where: { jobId: frontendJob.id }
    })

    // Add new questions
    await prisma.jobQuestion.createMany({
      data: [
        {
          jobId: frontendJob.id,
          question: 'How many years of React experience do you have?',
          type: 'SELECT',
          required: true,
          options: ['Less than 1 year', '1-2 years', '3-4 years', '5+ years'],
          order: 1,
        },
        {
          jobId: frontendJob.id,
          question: 'Which state management libraries have you used? (Select all that apply)',
          type: 'CHECKBOX',
          required: false,
          options: ['Redux', 'Zustand', 'Context API', 'MobX', 'Recoil'],
          order: 2,
        },
        {
          jobId: frontendJob.id,
          question: 'Tell us about a challenging frontend project you worked on.',
          type: 'TEXTAREA',
          required: true,
          placeholder: 'Describe the project, challenges faced, and how you solved them...',
          order: 3,
        },
        {
          jobId: frontendJob.id,
          question: 'Are you comfortable working in a remote-first environment?',
          type: 'RADIO',
          required: true,
          options: ['Yes, I prefer remote work', 'Yes, but I prefer hybrid', 'I prefer office work'],
          order: 4,
        },
      ],
    })

    // Also update the job to require resume
    await prisma.job.update({
      where: { id: frontendJob.id },
      data: { resumeRequired: true }
    })

    
  }

  // Find the UX Designer job and add questions
  const uxJob = await prisma.job.findFirst({
    where: { title: 'UX Designer' }
  })

  if (uxJob) {
    await prisma.jobQuestion.deleteMany({
      where: { jobId: uxJob.id }
    })

    await prisma.jobQuestion.createMany({
      data: [
        {
          jobId: uxJob.id,
          question: 'What is your name?',
          type: 'TEXT',
          required: true,
          placeholder: 'Enter your full name',
          order: 1,
        },
        {
          jobId: uxJob.id,
          question: 'What is your email address?',
          type: 'EMAIL',
          required: true,
          placeholder: 'your.email@example.com',
          order: 2,
        },
        {
          jobId: uxJob.id,
          question: 'Please share a link to your portfolio',
          type: 'TEXT',
          required: true,
          placeholder: 'https://your-portfolio.com',
          order: 3,
        },
        {
          jobId: uxJob.id,
          question: 'Which design tools do you use regularly?',
          type: 'CHECKBOX',
          required: true,
          options: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Framer'],
          order: 4,
        },
      ],
    })

    
  }

  await prisma.$disconnect()
}

addQuestions()
  .catch(console.error)