# Finance UC - Front End components

## Disclaimer
* This is PoC quality code not meant to be deployed as-is in Production
* Clearly it can be improved

## PreRequisites

Make sure you have Node.js v18 or higher installed

   ```bash
   # code tested with node v23.10.0
   brew install node@23
   ```

## Getting Started


1. Open a Terminal window and install the client-side dependencies from the **frontend** folder

   ```bash
    # Make sure you are in the **frontend** folder
    npm install
   ```

2. From the **server** folder, install server-side dependencies and return to the **frontend** folder

    ```bash
    cd server
    npm install
    cd ..
    ```

3. You should already have MongoDb running from the backend. The frontend will leverage the same DB to store authentication and application data


4. Review the `.env.example` file. This file has environment variables that are already configured to leverage the backend MongoDB. You should not need to change it. Create the `.env` environment variables file from the example

    ```bash
    cp .env.example .env
    ```

5. Start the web server by running the command below

    ```bash
    npm run dev
    ```

6. The app will be available at `http://localhost:5173`

## Frontend Project Structure

```
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── server.js        # Server entry point
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── AuthProvider.jsx # Authentication
│   ├── main.jsx         
│   ├── index.html         
└── package.json
```

## Authentication Flow

1. User signs up/logs in through the frontend
2. Backend validates credentials and creates a session
3. Session ID is stored in an HTTP-only cookie
4. Frontend can check auth status via the `/api/auth/me` endpoint
5. Protected routes/resources check for valid session


