# Data Marketplace adapter service

## Getting started

### 1. Clone the repository and install dependencies

```sh
git clone git@github.com:equinor/data-marketplace-adapter-service.git
cd data-marketplace-adapter-service
npm i
```

### 2. Add environment variables

Add your environment variables to `local.settings.json`. Use `local.settings.template.json` as a guide. Pay
attention to that the environment variables are defined inside the `Values` object!

Remember that new environment variables need to be added to the pipeline, so please notify the team about when adding new environment variables.

### 3. Start the application

```sh
npm run dev
```

### 4. Create a new branch

Branch name should include your initials, an issue number if applicable and what your branch solves.

Example: `ah-123-some-feature`.

### 5. Create a pull request

Once you've committed your changes, create a pull request to the appropriate branch; more often than not, this will be `main`.
