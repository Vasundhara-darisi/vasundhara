import './style.css';
import { db, doc, getDoc } from './firebase.js';

const appContainer = document.getElementById('app-container');
const loader = document.getElementById('loader');

async function fetchPortfolioData() {
  try {
    const docRef = doc(db, "portfolio", "data");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      populateUI(data);
    } else {
      console.log("No such document!");
      // If data is missing, we could redirect to admin or show a message
      appContainer.innerHTML = `<div style="text-align:center; padding: 5rem;"><h2>No portfolio data found.</h2><p>Please visit the <a href="/admin.html">Admin Panel</a> to initialize data.</p></div>`;
      appContainer.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    appContainer.innerHTML = `<div style="text-align:center; padding: 5rem; color:#f87171;"><h2>Error loading data</h2><p>${error.message}</p></div>`;
    appContainer.classList.remove('hidden');
    loader.classList.add('hidden');
  }
}

function populateUI(data) {
  // Profile Section
  if (data.profile) {
    document.getElementById('profile-name').textContent = data.profile.name;
    document.getElementById('profile-email').textContent = data.profile.email;
    document.getElementById('profile-email').href = `mailto:${data.profile.email}`;
    document.getElementById('profile-phone').textContent = data.profile.contact;
    document.getElementById('profile-objective').textContent = data.profile.objective;
    
    const profileImg = document.getElementById('profile-img');
    if (data.profile.imageUrl) {
      profileImg.src = data.profile.imageUrl;
    } else {
      // Fallback image if none uploaded
      profileImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.name) + '&background=random&size=150';
    }
  }

  // Skills Section
  const skillsContainer = document.getElementById('skills-container');
  if (data.skills) {
    Object.entries(data.skills).forEach(([category, skillsArray]) => {
      const div = document.createElement('div');
      div.className = 'skill-category';
      
      const title = document.createElement('h3');
      title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      
      const tags = document.createElement('div');
      tags.className = 'tags';
      
      skillsArray.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill;
        tags.appendChild(span);
      });
      
      div.appendChild(title);
      div.appendChild(tags);
      skillsContainer.appendChild(div);
    });
  }

  // Education Section
  const educationContainer = document.getElementById('education-container');
  if (data.education && data.education.length > 0) {
    data.education.forEach(edu => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <h3>${edu.degree}</h3>
        <div class="subtitle">${edu.institution} | ${edu.year}</div>
        <p>${edu.score}</p>
      `;
      educationContainer.appendChild(item);
    });
  }

  // Certifications Section
  const certsContainer = document.getElementById('certifications-container');
  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach(cert => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `<h3>${cert}</h3>`;
      certsContainer.appendChild(item);
    });
  }

  // Projects Section
  const projectsContainer = document.getElementById('projects-container');
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(project => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;
      projectsContainer.appendChild(item);
    });
  }

  // Reveal UI and hide loader
  loader.classList.add('hidden');
  appContainer.classList.remove('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchPortfolioData);
