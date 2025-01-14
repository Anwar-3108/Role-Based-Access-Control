# Role-Based-Access-Control


Role-Based-Access-Control/
│
├── config/
│   └── db.js                    # Database connection logic
│
├── controllers/
│   └── authControllers.js       # Handles signup and signin logic
│
├── logs/
|   ├──actions.js
│   └── logger.js                # Logging logic and configurations
│
├── middlewares/
│   ├── authMiddleware.js        # Verifies JWT tokens
│   └── roleMiddleware.js        # Handles role-based access control
│
├── models/
│   └── userModels.js            # User schema and model
│
├── routes/
│   ├── authRoutes.js            # Authentication-related routes
│   └── userRoutes.js            # User and role-based routes
│
├── .env                         # Environment variables
├── .gitignore                   # Ignored files for Git
├── package.json                 # Node.js dependencies and scripts
├── package-lock.json            # Dependency lockfile
├── server.js                    # Main entry point of the server
└── README.md                    # Project documentation
