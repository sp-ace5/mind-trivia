const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

// Add an event listener to the "Submit" button
loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Login failed, handle error response
      console.log('Login failed:', response.statusText);
      return;
    }

    // Login successful
    console.log('Login successful');

    // Redirect to the dashboard page or any other page
    window.location.href = '/index.html';
  } catch (error) {
    // Handle any network errors or other exceptions
    console.error('Error logging in user:', error);
  }
});
