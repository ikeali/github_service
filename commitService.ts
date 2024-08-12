import { PoolClient } from 'pg';

export async function saveCommitInfo(client: PoolClient, commitInfo: any, repositoryId: number) {
    const { sha, author, message, date } = commitInfo;

    await client.query(`
        INSERT INTO commit (sha, author, message, date, repository_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (sha) DO NOTHING
    `, [sha, author, message, date, repositoryId]);

    console.log('Commit information saved successfully.');
}

export async function saveCommitsInBatches(client: PoolClient, commits: any[], repositoryId: number, batchSize: number = 10) {
    for (let i = 0; i < commits.length; i += batchSize) {
        const batch = commits.slice(i, i + batchSize);
        const promises = batch.map(commit => saveCommitInfo(client, commit, repositoryId));
        await Promise.all(promises);
    }
}
