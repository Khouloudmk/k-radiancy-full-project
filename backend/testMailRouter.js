import express from 'express'; // Import express for creating the router
import { sendResetEmail } from './controllers/userController'; // Import the sendResetEmail function from userController
const router = express.Router(); // Create a new router instance

// Define a POST route for testing email sending
router.post('/test-email', async (req, res) => {
  try {
    // Extract name and email from the request body
    const { name, email } = req.body;
    // Create a fake user object with the provided name and email
    const fakeUser = { name, email };
    // Create a fake token for testing purposes
    const fakeToken = 'test-token-123';

    // Log to indicate the test email function is called
    console.log('📩 testSendEmail called');

    // Call the sendResetEmail function with the fake user and token
    await sendResetEmail(fakeUser, fakeToken);

    // Respond with a success message if email is sent
    res.send({ message: 'Test email sent successfully' });
  } catch (err) {
    // Log and handle errors if email sending fails
    console.error('❌ Error sending test email:', err);
    res.status(500).send({ message: 'Failed to send test email' });
  }
});

// Export the router to be used in the main app
export default router;