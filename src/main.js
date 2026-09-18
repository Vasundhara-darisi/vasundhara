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
      initAnimations();
    } else {
      console.log("No such document!");
      appContainer.innerHTML = `<div style="text-align:center; padding: 10rem 2rem; display:flex; flex-direction:column; align-items:center; gap:2rem;">
        <h2 style="font-size: 2.5rem; color: var(--text-primary);">No portfolio data found.</h2>
        <p style="color: var(--text-secondary); font-size: 1.1rem;">Please visit the <a href="/admin.html" style="color: var(--accent-cyan);">Admin Panel</a> to initialize data.</p>
      </div>`;
      appContainer.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    appContainer.innerHTML = `<div style="text-align:center; padding: 10rem 2rem; color:#f87171;">
      <h2>Error loading data</h2><p>${error.message}</p>
    </div>`;
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
      profileImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.name) + '&background=09090b&color=38bdf8&size=500';
    }

    const resumeBtn = document.getElementById('profile-resume');
    if (data.profile.pdfUrl) {
      resumeBtn.href = data.profile.pdfUrl;
      resumeBtn.classList.remove('hidden');
    }
  }

  // Skills Section
  const skillsContainer = document.getElementById('skills-container');
  if (data.skills) {
    Object.entries(data.skills).forEach(([category, skillsArray]) => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      
      const title = document.createElement('h3');
      title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      
      const tags = document.createElement('div');
      tags.className = 'skill-tags';
      
      skillsArray.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        tags.appendChild(span);
      });
      
      card.appendChild(title);
      card.appendChild(tags);
      skillsContainer.appendChild(card);
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
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;
      projectsContainer.appendChild(card);
    });
  }

  // Reveal UI and hide loader
  loader.classList.add('hidden');
  appContainer.classList.remove('hidden');
}

// Hover effect for mouse tracking on skill cards
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.skill-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Intersection Observer for scroll animations
function initAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchPortfolioData);
