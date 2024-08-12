Objective
Build a service in TypeScript that fetches data from GitHub's public APIs to retrieve repository information and commits, saves the data in a persistent store, and continuously monitors the repository for changes. The service will ensure data consistency, avoid duplicate commits, and allow for configurable start dates and data resets.

Requirements
Fetching GitHub API Data
Commits:

Retrieve commit message, author, date, and URL for each commit.
Save the fetched data into a persistent storage (PostgreSQL).
Implement a mechanism to continuously monitor the repository for changes and fetch new data at short intervals (e.g., every hour).
Avoid pulling the same commit twice.
Ensure commits in the database mirror commits on GitHub.
Configurable date to start pulling commits since.
Make it possible to reset the collection to start from a point in time.
Auxiliary Table - Repository Table:

Store metadata about the repository.
Repository information includes:
Repository name
Description
URL
Language
Forks count
Stars count
Open issues count
Watchers count
Created and updated dates
Data Storage
Design and create necessary tables to store repository details and commit data.
Ensure efficient querying of data.
Setup
Clone the repository:

bash
Copy code
git clone <repository_url>
cd <repository_directory>
Install dependencies:

bash
Copy code
npm install
Configure environment variables:

Create a .env file in the root directory and add your GitHub API token:

makefile
Copy code
API_TOKEN=your_github_token
Database setup:

Configure your database settings in the config file or environment variables.

Usage
Run the service:

bash
Copy code
npm start
This will start the service, which will begin fetching data from GitHub and saving it to the database.

Reset the collection:

To reset the collection and start fetching from a specific point in time, use the provided endpoint or command line tool (if implemented).

Documentation
Data Retrieval Actions
Get the top N commit authors by commit counts:

Query the database to retrieve the top N authors based on the number of commits.

Example SQL query:

sql
Copy code
SELECT author, COUNT(*) as commit_count
FROM commits
GROUP BY author
ORDER BY commit_count DESC
LIMIT N;
Retrieve commits of a repository by repository name:

Query the database to retrieve all commits for a given repository.

Example SQL query:

sql
Copy code
SELECT * 
FROM commits 
WHERE repository_name = 'repository_name';
Development
Testing:

Ensure that you write tests for the data fetching and monitoring functionalities.

Contributing:

Contributions are welcome. Please follow the standard Git workflow and submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

