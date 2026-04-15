exports.taskAssignedTemplate = ({ name, title }) => {
    return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
        
        <!-- Header -->
        <div style="background:#000; color:#fff; padding:15px; text-align:center;">
          <h2>Task Manager</h2>
        </div>
  
        <!-- Body -->
        <div style="padding:20px; color:#333;">
          <h3>Hello ${name},</h3>
  
          <p style="font-size:16px;">
            You have been assigned a new task:
          </p>
  
          <div style="background:#f1f1f1; padding:15px; border-radius:8px; margin:15px 0;">
            <strong>${title}</strong>
          </div>
  
          <p style="font-size:14px; color:#777;">
            Please login to your dashboard to view more details.
          </p>
  
          <!-- Button -->
          <div style="text-align:center; margin:20px 0;">
            <a href="http://localhost:3000/dashboard"
               style="background:#000; color:#fff; padding:10px 20px; border-radius:5px; text-decoration:none;">
              View Task
            </a>
          </div>
        </div>
  
        <!-- Footer -->
        <div style="background:#fafafa; padding:10px; text-align:center; font-size:12px; color:#999;">
          © ${new Date().getFullYear()} Task Manager
        </div>
  
      </div>
    </div>
    `;
  };