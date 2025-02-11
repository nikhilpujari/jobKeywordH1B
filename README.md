# 🚀 AI-Powered H1B Insights  

An AI-driven tool that provides **H1B employer data insights** and **resume optimization suggestions** using AWS S3, Node.js, and OpenAI API.  

![Image 1](screenshots/image1.png)

![Image 2](screenshots/image2.png)


## 📌 Features  

✅ **H1B Status Insights** – Fetches **2024 H1B employer data** from AWS S3, cleans it, and makes it accessible via an API.  
✅ **Resume Optimization** – Generates **tailored** keywords for a given company + role (not generic lists!) to help job seekers align their resumes.  
✅ **Scalable Cloud Architecture** – Uses **AWS S3 & EC2** for data storage and API hosting.  
✅ **Secure API Deployment** – Implements **IAM roles, security groups, and best practices** to keep access credentials secure.  

---

## 🛠️ Tech Stack  

- **Backend:** Node.js, Express.js  
- **Cloud Services:** AWS S3, EC2, IAM, Security Groups  
- **AI Processing:** OpenAI API  
- **Data Handling:** CSV Parsing, API Integration  
- **Frontend:** React.js (if applicable)  

---


# 🛠 Project Setup  

## 🚀 Running Locally  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/yourusername/h1b-insights.git
cd h1b-insights
```


### **2️⃣ Install Dependencies**  
```bash
npm install
```


### **3️⃣ Set Up Environment Variables** 
Create a .env file in the root directory and add the following:
```bash
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
OPENAI_API_KEY=your_openai_key
```

### **4️⃣ Start the Servers** 

```bash
node server.js
```
The server will run on http://localhost:5001/.

# 🌍 Deploying on AWS EC2

This guide walks you through the steps to deploy your application on an AWS EC2 instance.

---

## 1️⃣ Launch an EC2 Instance

1. Choose **Amazon Linux 2023** or **Ubuntu** as your AMI.
2. Make sure your **security groups** allow inbound traffic on:
   - **Port 5001** for the API
   - **Port 3000** for the frontend

---

## 2️⃣ Connect to EC2 via SSH

1. Locate your `key.pem` file.
2. Connect using the following command (replace `ec2-user` with `ubuntu` if using Ubuntu):

```bash
ssh -i key.pem ec2-user@your-ec2-ip
```

## 3️⃣ Install Node.js & Git
```bash
sudo yum update -y
sudo yum install -y nodejs git
```

## 4️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/h1b-insights.git
cd h1b-insights
```

## 5️⃣ Install Dependencies
```bash
npm install
```

## 6️⃣ Start the Server
```bash
node server.js
```

Your API should now be running at:
http://your-ec2-ip:5001/