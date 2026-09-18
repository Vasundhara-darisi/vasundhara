import './style.css';
import { db, doc, setDoc } from './firebase.js';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/njvxmkax/image/upload";
const UPLOAD_PRESET = "timepass";

const form = document.getElementById('admin-form');
const statusMsg = document.getElementById('status-msg');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  statusMsg.textContent = '';
  statusMsg.style.color = '#cbd5e1';

  try {
    const fileInput = document.getElementById('profileImage');
    let imageUrl = ''; // Default or empty if no file uploaded

    // 1. Upload to Cloudinary if file exists
    if (fileInput.files.length > 0) {
      statusMsg.textContent = 'Uploading image to Cloudinary...';
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload image to Cloudinary.');
      }

      const data = await res.json();
      imageUrl = data.secure_url;
      statusMsg.textContent = 'Image uploaded successfully!';
    } else {
      statusMsg.textContent = 'No image selected. Skipping Cloudinary upload.';
    }

    // 2. Save data to Firebase
    statusMsg.textContent = 'Saving data to Firebase...';

    const portfolioData = {
      profile: {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('email').value,
        objective: document.getElementById('objective').value,
        imageUrl: imageUrl, // Includes the cloudinary URL
      },
      skills: {
        languages: ["C", "Python"],
        web: ["HTML", "CSS"],
        other: ["DBMS", "Data Structures"]
      },
      education: [
        {
          institution: "Aditya Degree College, Kakinada",
          degree: "B.Sc. Computer Science",
          year: "2023 - 2026",
          score: "CGPA: 8.5/10"
        },
        {
          institution: "Narayana Junior College, Kakinada",
          degree: "Class XII",
          year: "2022 - 2023",
          score: "Percentage: 90%"
        },
        {
          institution: "Narayana e-techno school",
          degree: "10th",
          year: "2021",
          score: "Grade: 93%"
        }
      ],
      certifications: [
        "Cloud computing Certification from NPTEL",
        "Python Essentials 1 & 2 – Cisco Networking Academy",
        "Devops Certification from hackathon",
        "AWS Cloud Careers – edX",
        "HTML5 -ADHOC NETWORK",
        "Programming in C and Electronics project"
      ],
      projects: [
        {
          title: "Automatic Door Opening System (Python & IR Sensor)",
          description: "Developed a smart door automation system using IR sensors and Python. Used for real-time detection and automatic access control. Designed for environments like malls, hospitals, and airports. Focused on sensor programming, hardware-software integration, and real-world IoT application."
        }
      ]
    };

    // Store in Firestore in 'portfolio/data' document
    await setDoc(doc(db, "portfolio", "data"), portfolioData);

    statusMsg.textContent = 'Success! Data initialized in Firebase. Go back to portfolio.';
    statusMsg.style.color = '#4ade80'; // Success green
  } catch (error) {
    console.error(error);
    statusMsg.textContent = `Error: ${error.message}`;
    statusMsg.style.color = '#f87171'; // Error red
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save to Cloudinary & Firebase';
  }
});
