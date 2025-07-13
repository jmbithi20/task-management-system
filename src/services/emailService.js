// Email notification service
// Note: In a real application, you would integrate with a service like SendGrid, Mailgun, or Firebase Functions
// For this demo, we'll simulate email notifications with a more realistic experience

export const sendTaskAssignmentEmail = async (userEmail, taskTitle, assignedBy, taskDetails = {}) => {
  try {
    // In a real application, this would call your email service
    // For now, we'll simulate the email sending process with enhanced details
    
    const emailContent = {
      to: userEmail,
      subject: `🎯 New Task Assigned: ${taskTitle}`,
      from: 'noreply@taskflow.com',
      body: `
Dear User,

You have been assigned a new task by ${assignedBy}.

📋 Task Details:
• Title: ${taskTitle}
• Priority: ${taskDetails.priority || 'Medium'}
• Deadline: ${taskDetails.deadline ? new Date(taskDetails.deadline).toLocaleDateString() : 'No deadline set'}
• Status: Pending

🔗 Action Required:
Please log in to your TaskFlow dashboard to view the complete task details and update the status.

Best regards,
TaskFlow Team
      `.trim()
    };
    
    console.log('=== EMAIL NOTIFICATION SENT ===');
    console.log(`📧 To: ${emailContent.to}`);
    console.log(`📬 Subject: ${emailContent.subject}`);
    console.log(`📤 From: ${emailContent.from}`);
    console.log(`📝 Body:\n${emailContent.body}`);
    console.log('================================');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, you would return the actual email service response
    return { 
      success: true, 
      message: 'Email notification sent successfully',
      emailId: `email_${Date.now()}`,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

// For development purposes, you can also log to console
export const logTaskAssignment = (userEmail, taskTitle, assignedBy) => {
  console.log('=== TASK ASSIGNMENT NOTIFICATION ===');
  console.log(`To: ${userEmail}`);
  console.log(`Subject: New Task Assigned - ${taskTitle}`);
  console.log(`From: ${assignedBy}`);
  console.log(`Message: You have been assigned a new task "${taskTitle}" by ${assignedBy}. Please log in to view the details.`);
  console.log('=====================================');
}; 