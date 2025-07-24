import nodemailer from 'nodemailer'

// Create transporter for real email service
const createTransport = () => {
  console.log('Creating email transporter...')
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

const transporter = createTransport()

// Test transporter connection
const testConnection = async () => {
  try {
    await transporter.verify()
    console.log('Email transporter is ready')
    return true
  } catch (error) {
    console.error('Email transporter verification failed:', error)
    return false
  }
}

// Email templates (keeping your existing ones)
export const emailTemplates = {
  welcomeEmail: (data: {
    userName: string
    userEmail: string
  }) => ({
    subject: 'Welcome to FormHire! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to FormHire</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .feature { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #6366f1; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to FormHire!</h1>
              <p style="margin: 0; opacity: 0.9;">Your journey to finding the perfect job starts here</p>
            </div>
            <div class="content">
              <h2>Hello ${data.userName}! 👋</h2>
              
              <p>Welcome to FormHire! We're excited to have you join our community of job seekers and employers.</p>
              
              <h3>What you can do with FormHire:</h3>
              
              <div class="feature">
                <h4>🔍 Discover Amazing Jobs</h4>
                <p>Browse through hundreds of job opportunities from top companies.</p>
              </div>
              
              <div class="feature">
                <h4>⚡ Easy Applications</h4>
                <p>Apply to jobs with just a few clicks using our streamlined application process.</p>
              </div>
              
              <div class="feature">
                <h4>📊 Track Your Progress</h4>
                <p>Monitor all your applications and their status in one place.</p>
              </div>
              
              <div class="feature">
                <h4>🎯 Smart Filtering</h4>
                <p>Find jobs that match your skills, location, and salary preferences.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/jobs" class="button">Start Job Hunting</a>
              </div>
              
              <h3>Need Help?</h3>
              <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:hello@formhire.com">hello@formhire.com</a>. We're here to help!</p>
              
              <p>Happy job hunting! 🚀</p>
              
              <p>Best regards,<br>The FormHire Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to FormHire!

Hello ${data.userName}!

Welcome to FormHire! We're excited to have you join our community.

What you can do:
- Discover amazing jobs
- Apply easily 
- Track your applications
- Use smart filtering

Start your job search at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/jobs

Need help? Contact us at hello@formhire.com

Best regards,
The FormHire Team
    `
  }),

  applicationConfirmation: (data: {
    applicantName: string
    jobTitle: string
    companyName: string
    applicationId: string
  }) => ({
    subject: `Application Confirmed - ${data.jobTitle} at ${data.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Submitted Successfully!</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.applicantName},</h2>
              <p>Thank you for applying to the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong>.</p>
              
              <p>We have received your application and our team will review it shortly. Here are the next steps:</p>
              
              <ul>
                <li>📋 Your application is now in our review queue</li>
                <li>👀 Our hiring team will review your qualifications</li>
                <li>📞 If you're a good fit, we'll contact you for next steps</li>
                <li>⏰ We typically respond within 5-7 business days</li>
              </ul>
              
              <p><strong>Application ID:</strong> ${data.applicationId}</p>
              
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/applications" class="button">View Your Applications</a>
              
              <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:hello@formhire.com">hello@formhire.com</a>.</p>
              
              <p>Best regards,<br>The FormHire Team</p>
            </div>
            <div class="footer">
              <p>This email was sent from FormHire. If you didn't apply for this job, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${data.applicantName},

Thank you for applying to the ${data.jobTitle} position at ${data.companyName}.

We have received your application and our team will review it shortly.

Application ID: ${data.applicationId}

Best regards,
The FormHire Team
    `
  }),

  adminNewApplication: (data: {
    jobTitle: string
    applicantName: string
    applicantEmail: string
    applicationId: string
    resumeUrl?: string
  }) => ({
    subject: `New Application - ${data.jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Job Application</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #6366f1; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button.secondary { background: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Job Application Received</h1>
            </div>
            <div class="content">
              <h2>New application for: ${data.jobTitle}</h2>
              
              <div class="info-box">
                <h3>Applicant Details:</h3>
                <p><strong>Name:</strong> ${data.applicantName}</p>
                <p><strong>Email:</strong> ${data.applicantEmail}</p>
                <p><strong>Application ID:</strong> ${data.applicationId}</p>
                <p><strong>Applied:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/applications/${data.applicationId}" class="button">
                  Review Application
                </a>
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/applications" class="button secondary">
                  All Applications
                </a>
              </div>
              
              ${data.resumeUrl ? `<p><strong>Resume:</strong> <a href="${data.resumeUrl}">Download Resume</a></p>` : ''}
              
              <p>Please review this application at your earliest convenience.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Job Application Received

Job: ${data.jobTitle}
Applicant: ${data.applicantName}
Email: ${data.applicantEmail}
Application ID: ${data.applicationId}

Please review this application in the admin panel.
    `
  }),

  applicationStatusUpdate: (data: {
    applicantName: string
    jobTitle: string
    companyName: string
    status: string
    message?: string
  }) => ({
    subject: `Application Update - ${data.jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .status-interview { background: #fef3c7; color: #92400e; }
            .status-hired { background: #d1fae5; color: #065f46; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-reviewed { background: #dbeafe; color: #1e40af; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📫 Application Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.applicantName},</h2>
              
              <p>We have an update regarding your application for the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong>.</p>
              
              <p>Your application status has been updated to:</p>
              <div class="status-badge status-${data.status.toLowerCase()}">
                ${data.status.toUpperCase()}
              </div>
              
              ${data.message ? `
                <h3>Message from the hiring team:</h3>
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #6366f1; margin: 15px 0;">
                  <p style="margin: 0;">${data.message}</p>
                </div>
              ` : ''}
              
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/applications" class="button">View All Applications</a>
              
              <p>Thank you for your interest in joining our team!</p>
              
              <p>Best regards,<br>The FormHire Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${data.applicantName},

Your application for ${data.jobTitle} at ${data.companyName} has been updated.

Status: ${data.status}
${data.message ? `Message: ${data.message}` : ''}

Best regards,
The FormHire Team
    `
  })
}

// Email sending functions
export const sendEmail = async (
  to: string | string[],
  template: { subject: string; html: string; text: string },
  from = 'FormHire <hello@demomailtrap.co>'
) => {
  try {
    console.log(`Attempting to send email to: ${Array.isArray(to) ? to.join(', ') : to}`)
    
    // Test connection first
    const connectionOk = await testConnection()
    if (!connectionOk) {
      throw new Error('Email service not available')
    }

    const recipients = Array.isArray(to) ? to : [to]
    
    const mailOptions = {
      from,
      to: recipients.join(', '),
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })

    const result = await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully:', result.messageId)
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Convenience functions for each email type
export const sendWelcomeEmail = async (
  userEmail: string,
  data: Parameters<typeof emailTemplates.welcomeEmail>[0]
) => {
  console.log('Preparing to send welcome email...')
  const template = emailTemplates.welcomeEmail(data)
  return sendEmail(userEmail, template)
}

export const sendApplicationConfirmation = async (
  applicantEmail: string,
  data: Parameters<typeof emailTemplates.applicationConfirmation>[0]
) => {
  const template = emailTemplates.applicationConfirmation(data)
  return sendEmail(applicantEmail, template)
}

export const sendAdminNewApplication = async (
  adminEmails: string[],
  data: Parameters<typeof emailTemplates.adminNewApplication>[0]
) => {
  const template = emailTemplates.adminNewApplication(data)
  return sendEmail(adminEmails, template)
}

export const sendApplicationStatusUpdate = async (
  applicantEmail: string,
  data: Parameters<typeof emailTemplates.applicationStatusUpdate>[0]
) => {
  const template = emailTemplates.applicationStatusUpdate(data)
  return sendEmail(applicantEmail, template)
}

// Get admin emails
export const getAdminEmails = () => {
  return [
   
    'suyashpadole715@gmail.com',
    'lakshay@infigon.app'
  ]
}