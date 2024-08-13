import axios from 'axios';
import pool from './db';
import { saveRepositoryInfo } from './repositoryService';
import { saveCommits } from './commitService';

interface RepositoryInfo {
    owner: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    url: string;
}

interface CommitInfo {
    sha: string;
    author: string;
    message: string;
    date: string;
    commit_url: string;
}


export async function fetchRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
    const apiToken = process.env.API_TOKEN;
    if (!apiToken) {
        throw new Error('API_TOKEN is not defined');
    }

    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { Authorization: `token ${apiToken}` }
        });
        const data = response.data;
        return {
            owner: data.owner.login,
            name: data.name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            url: data.html_url,
        };
    } catch (error:any) {
        if ( error.response.status === 404) {
            console.error(`Repository not found: ${error.response.data}`);
        } else {
            console.error('Unexpected error:', error);
        }
        throw new Error('Failed to fetch repository information');
    }
}
        


async function fetchCommits(owner: string, repo: string, page: number = 1, perPage: number = 30, startDate?: string, endDate?: string): Promise<CommitInfo[]> {
    let url = `https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`;

    if (startDate) {
        url += `&since=${startDate}`;
    }
    if (endDate) {
        url += `&until=${endDate}`;
    }

    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        throw new Error('API_TOKEN is not defined');
    }

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(url, { headers });
        const commits = response.data.map((commit: any) => ({
            sha: commit.sha,
            author: commit.commit.author.name,
            message: commit.commit.message,
            date: commit.commit.author.date,
            commit_url: commit.html_url,
        }));

        return commits;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to fetch commits:`, error.response?.data);
        } else {
            console.error(`Unexpected error:`, error);
        }
        throw error;
    }
}

async function checkForUpdates(startDate?: string, endDate?: string) {
    const client = await pool.connect();
    const batchSize = 100;
    const owner = 'chromium';
    const repo = 'chromium';
    const pageSize = 30;
    let page = 1;
    let commits: CommitInfo[];

    try {
        const repoInfo = await fetchRepositoryInfo(owner, repo);
        console.log('Repository Info:', repoInfo);

        await saveRepositoryInfo(client, repoInfo);

        const result = await client.query(`SELECT id FROM repository WHERE owner = $1 AND name = $2`, [owner, repo]);
        const repositoryId = result.rows[0].id;

        do {
            commits = await fetchCommits(owner, repo, page, pageSize, startDate, endDate);
            if (commits.length > 0) {

                const startFrom = new Date('2024-08-12T10:00:00Z');

                await saveCommits(client, commits, repositoryId, startFrom, batchSize);

                page++;
            }
        } while (commits.length > 0);

        console.log('Commits updated successfully.');
    } catch (error) {
        console.error('Error during update check:', error);
    } finally {
        client.release();
    }
}


const monitorInterval = 60000; // 60 seconds



function getOneHourAgoDate(): string {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    return date.toISOString();
}

setInterval(async () => {
    const startDate = getOneHourAgoDate();
    const endDate = new Date().toISOString();

    await checkForUpdates(startDate, endDate);
}, monitorInterval);


checkForUpdates(getOneHourAgoDate(), new Date().toISOString());
