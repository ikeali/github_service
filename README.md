  **Objective**

The goal of this project is to build a TypeScript service that interacts with GitHub's public APIs to retrieve detailed repository information and commit histories. This data will be stored in a PostgreSQL database and the service will continuously monitor repositories for updates. The system ensures data integrity by avoiding duplicate entries, supports configurable start dates for data collection, and allows for data resets as needed.

**Requirements**
Fetching GitHub API Data
**Commits:**

Retrieve essential commit details, including the message, author, date, and URL.
Persist the fetched commit data into a PostgreSQL database.
Implement continuous monitoring to detect and fetch new commits at regular intervals (e.g., hourly).
Ensure that each commit is fetched only once, preventing duplication.
Maintain consistency between the commits stored in the database and those on GitHub.
Allow configuration of the starting date from which commits should be fetched.
Provide the ability to reset the data collection, allowing a restart from a specific point in time.

**Repository Information:**
Retrieve and store the following repository details:
Name
Description
URL
Primary language
Forks count
Stars count
Open issues count
Watchers count
Creation date
Last updated date
**Data Storage**
Design and implement database tables to efficiently store repository and commit information.
Optimize for efficient querying, particularly to retrieve the top N authors based on commit counts.
Ensure the database schema supports all necessary relationships and indexing for fast data retrieval.
