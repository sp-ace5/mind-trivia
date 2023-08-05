const registerUrl = '/api/register';

document.getElementById('registerBtn').addEventListener('click', async () => {
  const username = document.getElementById('loginUserName').value;
  const password = document.getElementById('loginUserPassword').value;
  const repeatPassword = document.getElementById('loginUserPassword2').value;

  if (password !== repeatPassword) {
    console.log('Password mismatch');
    return;
  }

  try {
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // Registration failed, handle error response
      const data = await response.json(); // Parse error response JSON, if any
      console.log('Registration failed:', data.message);
      // You can display the error message to the user or handle it as you like
      return;
    }

    // Registration successful
    const data = await response.json(); // Parse success response JSON, if any
    console.log('Registration successful:', data.message);
    // Redirect to the login page or display a success message
    // Example: window.location.href = '/login.html';
  } catch (error) {
    // Handle any network errors or other exceptions
    console.error('Error registering user:', error);
  }
});
