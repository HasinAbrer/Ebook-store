import { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const MagicLinkLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const emailInputRef = useRef(null);

  // Configuration - Update these to match your backend
  const API_BASE_URL = 'http://localhost:/api';
  const SEND_MAGIC_LINK_ENDPOINT = '/send-magic-link';

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}${SEND_MAGIC_LINK_ENDPOINT}`,
        { email }
      );

      if (response.status === 200) {
        setEmailSent(true);
        setResendCooldown(60); // 60 seconds cooldown
        toast.success('Login link sent successfully!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error('No account found with this email address');
        } else if (error.response?.status === 429) {
          toast.error('Too many requests. Please wait before requesting another link');
        } else {
          toast.error(error.response?.data?.message || 'Failed to send login link');
        }
      } else {
        toast.error('Network error. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmail = async () => {
    if (resendCooldown > 0) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}${SEND_MAGIC_LINK_ENDPOINT}`,
        { email }
      );

      if (response.status === 200) {
        setResendCooldown(60);
        toast.success('New login link sent successfully!');
      }
    } catch (error) {
      toast.error('Failed to resend login link');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardBody className="p-6">
            {!emailSent ? (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                  <p className="text-gray-600 mt-1">Enter your email to receive a login link</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isRequired
                      autoComplete="email"
                      ref={emailInputRef}
                    />
                  </div>

                  <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700">
                      📧 We'll send you a secure login link via email. No password required!
                    </p>
                  </div>

                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isLoading}
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    {isLoading ? 'Sending...' : 'Send Login Link'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a login link to <span className="font-medium">{email}</span>.
                  Click the link to sign in securely.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Didn't receive the email? Check your spam folder.
                </p>

                <Button
                  variant="light"
                  onPress={resendEmail}
                  isDisabled={resendCooldown > 0}
                  className="mb-2"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend login link'}
                </Button>

                <Button
                  variant="light"
                  size="sm"
                  onPress={() => setEmailSent(false)}
                  className="text-gray-600"
                >
                  ← Back to login
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default MagicLinkLogin;