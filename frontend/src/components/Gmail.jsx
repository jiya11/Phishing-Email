import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

// Import the environment variables
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const SCOPES = import.meta.env.VITE_SCOPES;
const MAX_EMAILS = parseInt(import.meta.env.VITE_MAX_EMAILS, 10) || 10; // Default to 10 if not set

// Sets up the Gmail client
function Gmail({ onEmailsReceived, onError }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      }).catch(error => {
        if (onError) onError(error);
      });
    };

    gapi.load('client:auth2', initClient);
  }, [onError]);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEmails([]);
    if (onEmailsReceived) onEmailsReceived([]);
  };

  // Gets the emails list
  const fetchEmails = async () => {
    if (isSignedIn) {
      try {
        const response = await gapi.client.gmail.users.messages.list({
          userId: 'me',
          maxResults: MAX_EMAILS,
          format: "full",
        });

        const messages = await Promise.all(
          response.result.messages.map(async (msg) => {
            const msgDetails = await gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: msg.id,
            });

            const headers = msgDetails.result.payload.headers;
            const senderInfo = headers.find(header => header.name === 'From');
            const subject = headers.find(header => header.name === 'Subject');
            const date = headers.find(header => header.name === 'Date');

            return {
              id: msg.id,
              snippet: msgDetails.result.snippet,
              sender: senderInfo ? senderInfo.value : 'Unknown',
              subject: subject ? subject.value : 'No subject',
              date: date ? date.value : 'Unknown date',
            };
          })
        );

        setEmails(messages);
        if (onEmailsReceived) onEmailsReceived(messages);
      } catch (error) {
        if (onError) onError(error);
      }
    }
  };

  // Main component that renders everything
  return (
    <div className="p-4">
      {isSignedIn ? (
        <div className="space-y-4">
          <div className="flex justify-end gap-4"> {/* Aligns buttons to the right */}
            <button 
              onClick={handleSignOut}
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
            >
              Sign Out
            </button>
            <button 
              onClick={fetchEmails}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Fetch Emails
            </button>
          </div>
          <div className="space-y-4">
            {/* Your email display code can go here */}
            {/* {emails.map((email, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p><strong>Sender:</strong> {email.sender}</p>
                <p><strong>Subject:</strong> {email.subject}</p>
                <p><strong>Date:</strong> {email.date}</p>
                <p><strong>Preview:</strong> {email.snippet}</p>
              </div>
            ))} */}
          </div>
        </div>
      ) : (
        <div className="flex justify-end"> {/* Align the Sign In button to the right */}
          <button 
            onClick={handleSignIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default Gmail;
