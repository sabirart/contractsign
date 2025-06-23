document.addEventListener('DOMContentLoaded', () => {
  // Inject HTML for Job Save feature with unified modal
  const jsvHTML = `
    <div class="jsv-container">
      <!-- Saved Jobs Icon -->
      <div class="jsv-icon-wrapper" id="jsvTrigger">
        <img src="icon/savedjob.svg" alt="Saved Jobs Icon">
      </div>
      <div class="jsv-overlay" id="jsvOverlay"></div>
      <div class="jsv-modal" id="jsvModal">
        <div class="jsv-modal-header">
          <div class="jsv-tab-buttons">
            <button class="jsv-tab-btn jsv-active" id="jsvSavedTab" onclick="jsvSwitchTab('saved')">Saved Jobs</button>
            <button class="jsv-tab-btn" id="jsvAppliedTab" onclick="jsvSwitchTab('applied')">Applied Jobs</button>
          </div>
        </div>
        <div class="jsv-modal-content" id="jsvContent"></div>
        <div class="jsv-modal-actions">
          <button onclick="jsvCloseModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', jsvHTML);

  // Inject CSS for Job Save feature
  const style = document.createElement('style');
  style.textContent = `
/* Scope Job Save styles */
.jsv-container {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  user-select: none;
}

/* Job Save Icon */
.jsv-container .jsv-icon-wrapper {
  position: fixed;
  bottom: clamp(1.5rem, 3.5vw, 2rem);
  right: clamp(1.5rem, 3.5vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-secondary, #f9fafb);
  cursor: pointer;
  padding: clamp(0.4rem, 1vw, 0.5rem);
  border-radius: 50%;
  border: 1px solid var(--border-primary, #d1d5db);
  height: clamp(2rem, 5vw, 2.75rem);
  width: clamp(2rem, 5vw, 2.75rem);
  box-sizing: border-box;
  box-shadow: 0 2px 6px var(--shadow-subtle, rgba(0,0,0,0.08));
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  z-index: 200;
  will-change: transform, box-shadow;
}
body.dark .jsv-container .jsv-icon-wrapper {
  background: var(--background-secondary, #374151);
  border-color: var(--border-secondary, #4b5563);
}
.jsv-container .jsv-icon-wrapper:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px var(--shadow-medium, rgba(0,0,0,0.12));
  background: var(--button-hover, #f0f9ff);
  border-color: var(--border-hover, #9ca3af);
}
body.dark .jsv-container .jsv-icon-wrapper:hover {
  background: var(--button-hover, #4b5563);
  border-color: var(--border-hover, #6b7280);
}
.jsv-container .jsv-icon-wrapper:active {
  transform: scale(1);
  background: var(--background-primary, #ffffff);
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0,0,0,0.08));
}
body.dark .jsv-container .jsv-icon-wrapper:active {
  background: var(--button-active, #1f2937);
}
.jsv-container .jsv-icon-wrapper:focus {
  background: var(--button-hover, #f0f9ff);
}
body.dark .jsv-container .jsv-icon-wrapper:focus {
  background: var(--button-hover, #4b5563);
}
.jsv-container .jsv-icon-wrapper img {
  width: clamp(0.875rem, 2.5vw, 1rem);
  height: clamp(0.875rem, 2.5vw, 1rem);
  filter: var(--icon-filter, none);
  transition: filter 0.3s ease;
}
body.dark .jsv-container .jsv-icon-wrapper img {
  filter: var(--icon-filter, none);
}

/* Overlay */
.jsv-container .jsv-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 700;
  opacity: 0;
  transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
  pointer-events: none;
  will-change: opacity;
}
.jsv-container .jsv-overlay.jsv-active {
  display: block;
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}
.jsv-container .jsv-overlay.jsv-active ~ .profile-popup,
.jsv-container .jsv-overlay.jsv-active ~ .profile-page,
.jsv-container .jsv-overlay.jsv-active ~ #profilePage,
.jsv-container .jsv-overlay.jsv-active ~ #profileDialog,
.jsv-container .jsv-overlay.jsv-active ~ #logoutDialog,
.jsv-container .jsv-overlay.jsv-active ~ #actionDialog,
.jsv-container .jsv-overlay.jsv-active ~ #feedbackDialog,
.jsv-container .jsv-overlay.jsv-active ~ #helpDialog,
.jsv-container .jsv-overlay.jsv-active ~ #locationDialog {
  pointer-events: auto !important;
}

/* Modal */
.jsv-container .jsv-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-secondary, #f9fafb);
  border: none;
  border-radius: clamp(0.5rem, 2vw, 0.75rem);
  box-shadow: 0 4px 12px var(--shadow-elevated, rgba(0,0,0,0.1));
  width: clamp(20rem, 60vw, 36rem);
  height: clamp(24rem, 62vh, 32rem);
  padding: clamp(0.75rem, 2.5vw, 1rem);
  display: none;
  flex-direction: column;
  gap: clamp(0.3rem, 1vw, 0.55rem);
  z-index: 9999;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0.3s ease-out;
  scrollbar-width: thick;
  scrollbar-color: var(--text-tertiary, #9ca3af) var(--background-secondary, #f9fafb);
  will-change: transform, opacity;
}
.jsv-container .jsv-modal::-webkit-scrollbar {
  width: clamp(8px, 1.2vw, 8px);
}
.jsv-container .jsv-modal::-webkit-scrollbar-track {
  background: var(--background-secondary, #f9fafb);
}
.jsv-container .jsv-modal::-webkit-scrollbar-thumb {
  background: var(--text-tertiary, #9ca3af);
  border-radius: clamp(4px, 0.8vw, 4px);
}
.jsv-container .jsv-modal::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary, #6b7280);
}
body.dark .jsv-container .jsv-modal {
  background: var(--background-secondary, #374151);
}
.jsv-container .jsv-modal.jsv-active {
  display: flex;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  visibility: visible;
  animation: jsvFadeIn 0.3s ease-out forwards;
}
.jsv-container .jsv-modal:focus-within {
  background: var(--button-hover, #f0f9ff);
}
body.dark .jsv-container .jsv-modal:focus-within {
  background: var(--button-hover, #4b5563);
}
.jsv-container .jsv-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: clamp(3px, 0.8vw, 4px);
  background: var(--text-primary, #111827);
  border-top-left-radius: clamp(0.5rem, 2vw, 0.75rem);
  border-top-right-radius: clamp(0.5rem, 2vw, 0.75rem);
}
body.dark .jsv-container .jsv-modal::before {
  background: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: clamp(0.5rem, 1.5vw, 0.75rem) 0 clamp(0.25rem, 1vw, 0.375rem);
}
.jsv-container .jsv-tab-buttons {
  display: flex;
  gap: clamp(0.3rem, 1vw, 0.5rem);
  background: var(--background-tertiary, #e5e7eb);
  border-radius: clamp(0.3rem, 1vw, 0.5rem);
  padding: clamp(0.2rem, 0.5vw, 0.25rem);
}
body.dark .jsv-container .jsv-tab-buttons {
  background: var(--background-tertiary, #4b5563);
}
.jsv-container .jsv-tab-btn {
  padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem);
  border: none;
  border-radius: clamp(0.25rem, 0.8vw, 0.375rem);
  background: transparent;
  color: var(--text-secondary, #6b7280);
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
body.dark .jsv-container .jsv-tab-btn {
  color: var(--text-secondary, #9ca3af);
}
.jsv-container .jsv-tab-btn:hover {
  background: var(--button-hover, #f0f9ff);
  color: var(--text-primary, #111827);
  transform: scale(1.03);
}
body.dark .jsv-container .jsv-tab-btn:hover {
  background: var(--button-hover, #6b7280);
  color: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-tab-btn.jsv-active {
  background: var(--background-primary, #ffffff);
  color: var(--text-primary, #111827);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}
body.dark .jsv-container .jsv-tab-btn.jsv-active {
  background: var(--background-primary, #1f2937);
  color: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-tab-btn:focus {
  background: var(--button-hover, #f0f9ff);
}
body.dark .jsv-container .jsv-tab-btn:focus {
  background: var(--button-hover, #6b7280);
}
.jsv-container .jsv-modal-content {
  height: clamp(18rem, 45vh, 19rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(0.4rem, 1vw, 0.6rem);
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.jsv-container .jsv-modal-content.jsv-transition-out-left {
  opacity: 0;
  transform: translateX(-20px);
}
.jsv-container .jsv-modal-content.jsv-transition-in-left {
  opacity: 0;
  transform: translateX(20px);
}
.jsv-container .jsv-modal-content.jsv-transition-out-right {
  opacity: 0;
  transform: translateX(20px);
}
.jsv-container .jsv-modal-content.jsv-transition-in-right {
  opacity: 0;
  transform: translateX(-20px);
}
.jsv-container .jsv-job-item {
  border: 1px solid var(--border-primary, #d1d5db);
  border-radius: clamp(0.2rem, 0.6vw, 0.3rem);
  padding: clamp(0.4rem, 1.2vw, 0.65rem);
  background: var(--background-secondary, #f9fafb);
  color: var(--text-primary, #111827);
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
body.dark .jsv-container .jsv-job-item {
  background: var(--background-secondary, #374151);
  border-color: var(--border-secondary, #4b5563);
  color: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-job-item.jsv-expired {
  border-color: var(--accent-error, #ef4444);
}
.jsv-container .jsv-job-item.jsv-expired::after {
  content: 'Expired';
  display: block;
  color: var(--accent-error, #ef4444);
  font-size: clamp(0.6875rem, 1.8vw, 0.75rem);
  font-weight: 500;
  margin-top: clamp(0.25rem, 0.8vw, 0.375rem);
}
.jsv-container .jsv-job-item:hover {
  background: var(--button-hover, #f0f9ff);
  box-shadow: 0 2px 6px var(--shadow-subtle, rgba(0,0,0,0.08));
}
body.dark .jsv-container .jsv-job-item:hover {
  background: var(--button-hover, #4b5563);
}
.jsv-container .jsv-job-item h3 {
  margin: 0 0 clamp(0.25rem, 0.8vw, 0.375rem);
  font-size: clamp(0.875rem, 2.2vw, 1rem);
  font-weight: 600;
  color: var(--accent-primary, #3b82f6);
  letter-spacing: 0.015625rem;
}
.jsv-container .jsv-job-item h3 a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}
.jsv-container .jsv-job-item h3 a:hover {
  color: var(--accent-primary-hover, #2563eb);
}
body.dark .jsv-container .jsv-job-item h3 {
  color: var(--accent-primary, #60a5fa);
}
body.dark .jsv-container .jsv-job-item h3 a:hover {
  color: var(--accent-primary-hover, #3b82f6);
}
.jsv-container .jsv-job-item p {
  margin: clamp(0.2rem, 0.5vw, 0.25rem) 0;
  font-size: clamp(0.75rem, 1.8vw, 0.8125rem);
  color: var(--text-secondary, #6b7280);
  letter-spacing: 0.0125rem;
}
body.dark .jsv-container .jsv-job-item p {
  color: var(--text-secondary, #9ca3af);
}
.jsv-container .jsv-job-actions {
  display: flex;
  justify-content: space-between;
  gap: clamp(0.4rem, 1vw, 0.6rem);
  margin-top: clamp(0.25rem, 0.8vw, 0.375rem);
}
.jsv-container .jsv-btn-delete,
.jsv-container .jsv-btn-report {
  padding: clamp(0.4rem, 0.8vw, 0.65rem) clamp(0.6rem, 1.5vw, 0.875rem);
  border-radius: clamp(0.4rem, 0.8vw, 0.65rem);
  font-size: clamp(0.75rem, 1.8vw, 0.8125rem);
  font-weight: 500;
  cursor: pointer;
  min-width: clamp(2rem, 6vw, 2.75rem);
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.jsv-container .jsv-btn-delete {
  border: none;
  background: var(--accent-error, #ef4444);
  color: #ffffff;
}
.jsv-container .jsv-btn-delete:hover {
  background: var(--accent-error-hover, #dc2626);
  box-shadow: 0 2px 6px var(--shadow-subtle, rgba(0,0,0,0.08));
}
.jsv-container .jsv-btn-delete:focus {
  background: var(--accent-error-hover, #dc2626);
}
.jsv-container .jsv-btn-report {
  border: 1px solid var(--border-primary, #d1d5db);
  background: var(--background-secondary);
  color: var(--text-primary, #111827);
}
body.dark .jsv-container .jsv-btn-report {
  background: var(--background-secondary, #374151);
  border-color: var(--border-secondary, #4b5563);
  color: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-btn-report:hover {
  background: var(--button-hover, #f0f9ff);
  box-shadow: 0 2px 6px var(--shadow-subtle, rgba(0,0,0,0.08));
}
body.dark .jsv-container .jsv-btn-report:hover {
  background: var(--button-hover, #4b5563);
}
.jsv-container .jsv-btn-report:focus {
  background: var(--button-hover, #f0f9ff);
}
body.dark .jsv-container .jsv-btn-report:focus {
  background: var(--button-hover, #6b7280);
}
.jsv-container .jsv-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: clamp(0.4rem, 1vw, 0.6rem);
  margin-top: clamp(0.25rem, 0.8vw, 0.375rem);
}
.jsv-container .jsv-modal-actions button {
  padding: clamp(0.5rem, 1.2vw, 0.75rem) clamp(0.6rem, 1.5vw, 0.875rem);
  border-radius: clamp(0.5rem, 1.2vw, 0.75rem);
  font-size: clamp(0.75rem, 1.8vw, 0.8125rem);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-primary, #d1d5db);
  background: var(--background-secondary, #f9fafb);
  color: var(--text-primary, #111827);
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
body.dark .jsv-container .jsv-modal-actions button {
  background: var(--background-secondary, #374151);
  border-color: var(--border-secondary, #4b5563);
  color: var(--text-primary, #f3f4f6);
}
.jsv-container .jsv-modal-actions button:hover {
  background: var(--button-hover, #f0f9ff);
  transform: scale(1.02);
  box-shadow: 0 2px 6px var(--shadow-subtle, rgba(0,0,0,0.08));
}
body.dark .jsv-container .jsv-modal-actions button:hover {
  background: var(--button-hover, #4b5563);
}
.jsv-container .jsv-modal-actions button:focus {
  background: var(--button-hover, #f0f9ff);
}
body.dark .jsv-container .jsv-modal-actions button:focus {
  background: var(--button-hover, #6b7280);
}
.jsv-container .jsv-no-jobs {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  gap: clamp(0.4rem, 1vw, 0.6rem);
  color: var(--text-secondary, #6b7280);
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
}
body.dark .jsv-container .jsv-no-jobs {
  color: var(--text-secondary, #9ca3af);
}
.jsv-container .jsv-no-jobs img {
  width: clamp(1.75rem, 4vw, 2rem);
  height: clamp(1.75rem, 4vw, 2rem);
  filter: var(--icon-filter, none);
}
body.dark .jsv-container .jsv-no-jobs img {
  filter: var(--icon-filter, none);
}
@keyframes jsvFadeIn {
  from { opacity: 0; transform: translate(-50%, -50%); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes jsvFadeOut {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%); }
}
  `;
  document.head.appendChild(style);

  // Sample saved jobs data
  const sampleSavedJobs = [
    { id: 1, title: "Web Developer", description: "Build a responsive website.", applyDate: "2025-06-01", expireDate: "2025-06-20" },
    { id: 2, title: "Graphic Designer", description: "Design a logo.", applyDate: "2025-06-10", expireDate: "2025-06-25" }
  ];

  // Sample applied jobs data
  const sampleAppliedJobs = [
    { id: 1, title: "Frontend Engineer", description: "Develop UI components.", applyDate: "2025-06-05", uploadDate: "2025-05-30", expireDate: "2025-06-30", jobLink: "https://example.com/job/frontend-engineer" },
    { id: 2, title: "UX Designer", description: "Create user flows.", applyDate: "2025-06-12", uploadDate: "2025-06-01", expireDate: "2025-06-28", jobLink: "https://example.com/job/ux-designer" }
  ];

  // Initialize local storage for saved jobs
  if (!localStorage.getItem('jsvSavedJobs')) {
    localStorage.setItem('jsvSavedJobs', JSON.stringify(sampleSavedJobs));
  }

  // Initialize local storage for applied jobs
  if (!localStorage.getItem('jsvAppliedJobs')) {
    localStorage.setItem('jsvAppliedJobs', JSON.stringify(sampleAppliedJobs));
  }

  // Load saved jobs
  function loadSavedJobs() {
    const jobs = JSON.parse(localStorage.getItem('jsvSavedJobs')) || [];
    const jobList = document.getElementById('jsvContent');
    jobList.innerHTML = '';

    if (jobs.length === 0) {
      jobList.innerHTML = `<div class="jsv-no-jobs"><img src="icon/nosavedjobs.svg" alt="No Saved Jobs"></div>`;
      return;
    }

    const today = new Date();
    jobs.forEach(job => {
      const isExpired = new Date(job.expireDate) < today;
      const jobItem = document.createElement('div');
      jobItem.className = `jsv-job-item ${isExpired ? 'jsv-expired' : ''}`;
      jobItem.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.description}</p>
        <p>Applied: ${job.applyDate}</p>
        <p>Expires: ${job.expireDate}</p>
        <div class="jsv-job-actions">
          <button class="jsv-btn-delete" onclick="jsvDeleteJob(${job.id})">Delete</button>
          <button class="jsv-btn-report" onclick="jsvReportJob(${job.id})">Report</button>
        </div>
      `;
      jobList.appendChild(jobItem);
    });
  }

  // Load applied jobs
  function loadAppliedJobs() {
    const jobs = JSON.parse(localStorage.getItem('jsvAppliedJobs')) || [];
    const jobList = document.getElementById('jsvContent');
    jobList.innerHTML = '';

    if (jobs.length === 0) {
      jobList.innerHTML = `<div class="jsv-no-jobs"><img src="icon/noappliedjobs.svg" alt="No Applied Jobs"></div>`;
      return;
    }

    const today = new Date();
    jobs.forEach(job => {
      const isExpired = new Date(job.expireDate) < today;
      const jobItem = document.createElement('div');
      jobItem.className = `jsv-job-item ${isExpired ? 'jsv-expired' : ''}`;
      jobItem.innerHTML = `
        <h3><a href="${job.jobLink}" target="_blank" rel="noopener noreferrer">${job.title}</a></h3>
        <p>${job.description}</p>
        <p>Applied: ${job.applyDate}</p>
        <p>Uploaded: ${job.uploadDate}</p>
        <p>Expires: ${job.expireDate}</p>
        <div class="jsv-job-actions">
          <button class="jsv-btn-delete" onclick="jsvDeleteAppliedJob(${job.id})">Delete</button>
          <button class="jsv-btn-report" onclick="jsvReportAppliedJob(${job.id})">Report</button>
        </div>
      `;
      jobList.appendChild(jobItem);
    });
  }

  // Delete a saved job
  window.jsvDeleteJob = function(jobId) {
    let jobs = JSON.parse(localStorage.getItem('jsvSavedJobs')) || [];
    jobs = jobs.filter(job => job.id !== jobId);
    localStorage.setItem('jsvSavedJobs', JSON.stringify(jobs));
    loadSavedJobs();
  };

  // Delete an applied job
  window.jsvDeleteAppliedJob = function(jobId) {
    let jobs = JSON.parse(localStorage.getItem('jsvAppliedJobs')) || [];
    jobs = jobs.filter(job => job.id !== jobId);
    localStorage.setItem('jsvAppliedJobs', JSON.stringify(jobs));
    loadAppliedJobs();
  };

  // Report a saved job
  window.jsvReportJob = function(jobId) {
    alert(`Reported saved job ID: ${jobId}`);
  };

  // Report an applied job
  window.jsvReportAppliedJob = function(jobId) {
    alert(`Reported applied job ID: ${jobId}`);
  };

  // Switch between saved and applied jobs
  window.jsvSwitchTab = function(tab) {
    const savedTab = document.getElementById('jsvSavedTab');
    const appliedTab = document.getElementById('jsvAppliedTab');
    const content = document.getElementById('jsvContent');
    const isSavedToApplied = tab === 'applied' && savedTab.classList.contains('jsv-active');

    // Apply outgoing transition
    content.classList.add(isSavedToApplied ? 'jsv-transition-out-left' : 'jsv-transition-out-right');

    setTimeout(() => {
      // Update active tab and content
      if (tab === 'saved') {
        savedTab.classList.add('jsv-active');
        appliedTab.classList.remove('jsv-active');
        loadSavedJobs();
      } else {
        appliedTab.classList.add('jsv-active');
        savedTab.classList.remove('jsv-active');
        loadAppliedJobs();
      }
      // Apply incoming transition
      content.classList.remove('jsv-transition-out-left', 'jsv-transition-out-right');
      content.classList.add(isSavedToApplied ? 'jsv-transition-in-left' : 'jsv-transition-in-right');
      setTimeout(() => {
        content.classList.remove('jsv-transition-in-left', 'jsv-transition-in-right');
      }, 350);
    }, 350);
  };

  // Open modal
  window.jsvOpenModal = function(e) {
    e.stopPropagation();
    const overlay = document.getElementById('jsvOverlay');
    const modal = document.getElementById('jsvModal');
    // Close profile popup if open
    const profilePage = document.getElementById('profilePage');
    if (profilePage && profilePage.classList.contains('show')) {
      closeProfile();
    }
    overlay.classList.add('jsv-active');
    modal.classList.add('jsv-active');
    // Default to saved jobs tab
    jsvSwitchTab('saved');
  };

  // Close modal
  window.jsvCloseModal = function(e) {
    if (e) e.stopPropagation();
    const overlay = document.getElementById('jsvOverlay');
    const modal = document.getElementById('jsvModal');
    overlay.classList.remove('jsv-active');
    modal.classList.remove('jsv-active');
  };

  // Attach event listeners
  const trigger = document.getElementById('jsvTrigger');
  if (trigger) {
    trigger.addEventListener('click', jsvOpenModal);
  }
  const overlay = document.getElementById('jsvOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      const profileButton = document.querySelector('.profile-button');
      if (profileButton && profileButton.contains(e.target)) {
        return;
      }
      jsvCloseModal(e);
    });
  }

  // Ensure profile button remains clickable
  const profileButton = document.querySelector('.profile-button');
  if (profileButton) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleProfile();
    });
  }
});
