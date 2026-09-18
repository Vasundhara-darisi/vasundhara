import './style.css';
import { db, doc, setDoc } from './firebase.js';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/njvxmkax/upload";
const UPLOAD_PRESET = "timepass";

const form = document.getElementById('admin-form');
const statusMsg = document.getElementById('status-msg');
const submitBtn = document.getElementById('submit-btn');

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload file to Cloudinary.');
  }

  const data = await res.json();
  return data.secure_url;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  statusMsg.textContent = '';
  statusMsg.style.color = '#a1a1aa';

  try {
    const imageInput = document.getElementById('profileImage');
    const pdfInput = document.getElementById('resumePdf');
    
    let imageUrl = '';
    let pdfUrl = '';

    // 1. Upload Image
    if (imageInput.files.length > 0) {
      statusMsg.textContent = 'Uploading image to Cloudinary...';
      imageUrl = await uploadToCloudinary(imageInput.files[0]);
    }

    // 2. Upload PDF
    if (pdfInput.files.length > 0) {
      statusMsg.textContent = 'Uploading PDF to Cloudinary...';
      pdfUrl = await uploadToCloudinary(pdfInput.files[0]);
    }

    // 3. Save data to Firebase
    statusMsg.textContent = 'Saving data to Firebase...';

    const portfolioData = {
      profile: {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('email').value,
        objective: document.getElementById('objective').value,
        imageUrl: imageUrl, 
        pdfUrl: pdfUrl 
      },
      skills: {
        languages: ["C", "Java", "Python"],
        web: ["HTML", "CSS"],
        other: ["DBMS", "Data Structures"]
      },
      education: [
        {
          institution: "Aditya Degree College, Kakinada",
          degree: "B.Sc. Computer Science",
          year: "2023",
          score: "CGPA: 8.5"
        },
        {
          institution: "Narayana Junior College, Kakinada",
          degree: "Class XII",
          year: "2020 - 2022",
          score: "Percentage: 89.6%"
        }
      ],
      certifications: [
        "CLOUD COMPUTING - NPTEL",
        "Python Essentials 1 & 2 – Cisco Networking Academy",
        "Data Analytics – IBM",
        "HTML5 -ADHOC NETWORK",
        "Programming in C and Electronics project"
      ],
      projects: [
        {
          title: "Automatic Door Opening System (Python & IR Sensor)",
          description: "Developed a smart door automation system used for real-time detection and automatic access control. Designed for environments like malls, hospitals, and airports"
        },
        {
          title: "short-term Internship",
          description: "MERN Stack Intern – ADHOC Network Company"
        },
        {
          title: "INTERNSHIP",
          description: "Data Analytics using Python"
        }
      ]
    };

    // Store in Firestore in 'portfolio/data' document
    await setDoc(doc(db, "portfolio", "data"), portfolioData);

    statusMsg.textContent = 'Success! Data initialized. Go back to portfolio.';
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
