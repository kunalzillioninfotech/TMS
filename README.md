⚙️ Backend Setup\

Follow these steps to run the backend server:\

cd backend\
npm install\
node server.js\
🔐 Environment Variables\

Create a .env file inside the backend/ folder and add the following:\

PORT=YOUR_PORT\
DB_HOST=YOUR_DB_HOST\
DB_USER=YOUR_DB_USER\
DB_PASSWORD=YOUR_DB_PASSWORD\
DB_NAME=YOUR_DB_NAME\
JWT_SECRET=YOUR_JWT_SECRET\
CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME\
CLOUD_API_KEY=YOUR_CLOUDINARY_CLOUD_API_KEY\
CLOUD_API_SECRET=YOUR_CLOUDINARY_CLOUD_API_SECRET\
EMAIL_USER=YOUR_EMAIL_USER_FOR_EMAIL_SERVICE\
EMAIL_PASS=YOUR_EMAIL_PASS_FOR_EMAIL_SERVICE\

⚠️ Important: Never share your .env file or commit it to GitHub.\

💻 Frontend Setup\

To run the frontend:\

cd frontend\
npm install\
npm start\
🌐 Features Overview\
🔐 Authentication using JWT\
☁️ Cloudinary integration for media uploads\
📧 Email service integration\
🗄️ Database connectivity\
⚡ Fast and responsive frontend\
🛡️ Security Best Practices\
Always keep .env files private\
Rotate secrets if they are exposed\
Use .gitignore to exclude sensitive files:\
node_modules/\
.env\
.env.*\
🚀 You're Ready!\

Once both servers are running:\

Backend → runs on your specified PORT\
Frontend → usually runs on http://localhost:3000\
