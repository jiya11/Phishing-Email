# Phishing Email Detector 📧

Phishing Reel is a web application that uses a neural network to analyze Gmail inboxes for potential phishing emails. By utilizing natural language processing (NLP) techniques, the application identifies suspicious messages and alerts users, enhancing email security without compromising privacy.

## ⚒️ How It Works
1. Data Preprocessing: Utilized a dataset from Kaggle to train the model. Preprocessing steps included:
   - Removing unreadable characters.
   - Eliminating stop words to focus on significant terms like "free," "credit card," and "prince."
   - Tokenizing emails and mapping them into 128-dimensional vectors to to identify synonyms or similar words.

2. Model Training: Designed a neural network architecture tailored for NLP tasks. Training was conducted using Google Colab, and the model's performance was evaluated with a testing loop to ensure accuracy.

3. Web Application Development:
   - Frontend: Built with React to provide an interactive user interface.
   - Backend: Developed using Flask to handle API requests and model inference.
   - Email Analysis: Integrated the Gmail API to fetch emails and analyze their content using the trained model.

Watch the Demo:
[![Watch the demo](https://github.com/user-attachments/assets/eeb916a1-8072-4329-beaa-6df337dfedcb)](https://youtu.be/jGb8torM8W4?feature=shared)
