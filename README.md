# Data Marketplace adapter service

## Getting started

### Important note on environment variables

Although the common practice when dealing with environment variables in an Azure Functions app is to set them in `local.settings.json`, for the `scripts/start.js` script to correclty validate your enviroment variables locally, your enviroment variables need to be set in a `.env` file.

Please copy the `.env.example` file and make your necessary updates: `cp .env.example .env`

### 1. Clone the repository and install dependencies

```sh
git clone git@github.com:equinor/data-marketplace-adapter-service.git
cd data-marketplace-adapter-service
npm i
npm run dev
```

### 2. Create a new branch

Branch name should include your initials, an issue number if applicable and what your branch solves.

Example: `ah-123-some-feature`.

### 3. Create a pull request

Once you've committed your changes, create a pull request to the appropriate branch; more often than not, this will be `main`.
