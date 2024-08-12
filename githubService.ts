import axios from 'axios';
import pool from './db';
import { saveRepositoryInfo } from './repositoryService';
import { saveCommitsInBatches } from './commitService';

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
}

async function fetchRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
    const url = `https://api.github.com/repos/${owner}/${repo}`;

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
        const data = response.data;
        return {
            owner: data.owner.login,
            name: data.name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            url: data.html_url,
        };
    } catch (error) {
        console.error(`Failed to fetch repository info: ${(error as Error).message}`);
        throw error;
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

    try {
        const response = await axios.get(url);
        const commits = response.data.map((commit: any) => ({
            sha: commit.sha,
            author: commit.commit.author.name,
            message: commit.commit.message,
            date: commit.commit.author.date,
        }));

        return commits;
    } catch (error) {
        console.error(`Failed to fetch commits: ${(error as Error).message}`);
        throw error;
    }
}

async function checkForUpdates(startDate?: string, endDate?: string) {
    const client = await pool.connect();
    const batchSize = 10;
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
                await saveCommitsInBatches(client, commits, repositoryId, batchSize);
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

function getOneYearAgoDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString();
}

const monitorInterval = 60000; // 60 seconds

setInterval(async () => {
    const startDate = getOneYearAgoDate();
    const endDate = new Date().toISOString();

    await checkForUpdates(startDate, endDate);
}, monitorInterval);

checkForUpdates(getOneYearAgoDate(), new Date().toISOString());
