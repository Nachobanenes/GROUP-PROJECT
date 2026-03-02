import { supabase } from '../shared/scripts/supabase.js'

const loginContainer = document.getElementById('loginContainer');
const tabsContainer = document.getElementById('tabsContainer');
const dashboardContent = document.getElementById('dashboardContent');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  adminLogin(username, password)
});

// Function to switch tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tabs button[data-tab="${tabId}"]`).classList.add('active');
}

// Tab button listeners
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  if (error) alert("Access Denied: " + error.message)
  else {
    loginContainer.style.display = 'none';
    tabsContainer.style.display = 'block';
    dashboardContent.style.display = 'block';
    showTab('diagnostics')
  }
}
