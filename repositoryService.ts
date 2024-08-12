import { PoolClient } from 'pg';

interface RepositoryInfo {
    owner: string;
    name: string;
    description: string;
    stars: number;
    forks: number;
    url: string;
}

export async function saveRepositoryInfo(client: PoolClient, repoInfo: RepositoryInfo) {
    const query = `
        INSERT INTO repository (owner, name, description, stars, forks, url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (owner, name) DO UPDATE
        SET description = EXCLUDED.description,
            stars = EXCLUDED.stars,
            forks = EXCLUDED.forks,
            url = EXCLUDED.url;
    `;

    try {
        await client.query(query, [
            repoInfo.owner,
            repoInfo.name,
            repoInfo.description,
            repoInfo.stars,
            repoInfo.forks,
            repoInfo.url
        ]);
    } catch (error) {
        console.error('Error saving repository info:', error);
        throw error;
    }
}