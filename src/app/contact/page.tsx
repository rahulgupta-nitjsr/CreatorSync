'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, you would send the form data to your backend
      console.log({ name, email, subject, message });
      
      setSuccess(true);
      setLoading(false);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-500 text-center">
            Have questions or need help? Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          <div className="mt-12">
            <Card>
              {success ? (
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg 
                      className="h-6 w-6 text-green-600" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Thank you for contacting us!</h3>
                  <p className="mt-2 text-gray-500">
                    We've received your message and will get back to you as soon as possible.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setSuccess(false)}
                      variant="outline"
                    >
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}
                  
                  <div>
                    <Input
                      id="name"
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="email"
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="subject"
                      label="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      isLoading={loading}
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                <i className="fas fa-envelope text-blue-600"></i>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-gray-500">
                <a href="mailto:support@creatorsync.com" className="text-blue-600 hover:text-blue-500">
                  support@creatorsync.com
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                <i className="fas fa-comment-dots text-blue-600"></i>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Live Chat</h3>
              <p className="mt-2 text-gray-500">
                Available Monday to Friday<br />
                9AM - 5PM ET
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto">
                <i className="fas fa-phone text-blue-600"></i>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-2 text-gray-500">
                +1 (555) 123-4567<br />
                Mon-Fri 9AM - 5PM ET
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">How quickly will you respond to my inquiry?</h3>
                <p className="mt-2 text-gray-500">
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat for the fastest response.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Do you offer phone support?</h3>
                <p className="mt-2 text-gray-500">
                  Yes, phone support is available for all users on our Pro and Business plans. Free users can access email support and our knowledge base.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">I'm interested in enterprise solutions. Who should I contact?</h3>
                <p className="mt-2 text-gray-500">
                  For enterprise inquiries, please email <a href="mailto:enterprise@creatorsync.com" className="text-blue-600 hover:text-blue-500">enterprise@creatorsync.com</a> or use the contact form above and select "Enterprise" as the subject.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 