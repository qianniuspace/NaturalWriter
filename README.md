# 妙笔生花 (NaturalWriter) - AI Text Rewriter

![App Screenshot](https://storage.googleapis.com/aistudio-hosting/docs/images/b489d79a7852b719.png)

An application that rewrites text to sound more human and natural, powered by the Google Gemini API. It allows users to fine-tune the output by specifying length, format, tone, and language, making it a versatile tool for content creators.

## ✨ Features

- **Advanced Rewriting**: Leverages the Gemini API to rewrite text, making it sound more authentic and human-written.
- **Granular Control**: Customize the output with options for:
  - **Length**: Auto, Short, Medium, Long
  - **Format**: Email, Blog Post, Twitter, Voiceover Script, and many more.
  - **Tone**: Friendly, Professional, Witty, Formal, etc.
  - **Language**: Output in Chinese or English.
- **Modern UI**: A clean, responsive two-panel layout for an intuitive user experience.
- **Efficient Workflow**: Includes a "Retry" button and a `⌘+Enter` / `Ctrl+Enter` keyboard shortcut for fast content generation.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/natural-writer.git
    cd natural-writer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    You need a Google Gemini API key to run this application.
    - Sign up and get your API key from [Google AI Studio](https://aistudio.google.com/).
    - This project is configured to use an environment variable named `API_KEY` which is set up in the execution environment. You must configure this variable before running the application.

4.  **Run the development server:**
    The project is set up to work with a standard development server like `vite`.
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or your server's address) to view it in the browser.

## 📂 Project Structure

The codebase is organized into a modular structure for better maintainability and scalability.

```
/
├── public/
├── src/
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks (e.g., for business logic)
│   ├── services/        # API interaction layer (Gemini)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component (layout)
│   └── index.tsx        # Application entry point
├── index.html
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/natural-writer/issues).

## 📄 License

This project is licensed under the MIT License.
