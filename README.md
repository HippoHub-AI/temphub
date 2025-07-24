# 🚀 React + TypeScript + Vite: Project Setup and Guide

This template sets up a minimal project with React and TypeScript using Vite, including Hot Module Replacement (HMR) and some basic ESLint rules.
Test
## 🛠️ Installation Steps

Follow these steps to get started with this project:

1. **🔗 Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **📦 Install Dependencies**
   Install all required dependencies by running:
   ```bash
   npm install
   ```

   If you encounter any conflicts or issues during installation, force the installation:
   ```bash
   npm install -f
   ```

3. **🔧 Environment Configuration**
   - Locate the `.env.sample` file in the root directory. This file contains example environment variables.
   - Create a `.env` file in the root directory and copy the contents of `.env.sample` into it.
   - Configure the following environment variables as required for your application:
     ```env
     VITE_REACT_APP_SERVER_URL=
     VITE_OPEN_AI_KEY=
     ```

### 🌐 Explanation of Environment Variables
1. **`VITE_REACT_APP_SERVER_URL`**
   - This specifies the base URL for the backend server.
   - For example: `http://localhost:5020/api/`.
   - Adjust this URL if your backend is running on a different host or port.

2. **`VITE_OPEN_AI_KEY`**
   - This is the API key for integrating OpenAI services.
   - Replace this placeholder key with your actual OpenAI API key to access OpenAI features such as GPT models.
   - 🔒 Keep this key secure and do not share it publicly.

4. **🚀 Run the Development Server**
   Start the development server:
   ```bash
   npm run dev
   ```

   This will launch the application and provide a local URL (e.g., `http://localhost:3000`) where you can access it in the browser.

5. **📂 Build the Application**
   For production builds, run:
   ```bash
   npm run build
   ```

   After building, the application can be served using a static server.

6. **✅ Run ESLint**
   Ensure the code adheres to linting standards:
   ```bash
   npm run lint
   ```

