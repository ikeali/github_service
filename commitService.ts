import { url } from 'inspector';
import { PoolClient } from 'pg';
 

// export async function saveCommitInfo(client: PoolClient, commitInfo: any, repositoryId: number) {
//     const { sha, author, message, date, commit_url } = commitInfo;

//     await client.query(`
//         INSERT INTO commit (sha, author, message, date, commit_url, repository_id)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         ON CONFLICT (sha) DO NOTHING
//     `, [sha, author, message, date, commit_url, repositoryId]);

//     console.log('Commit information saved successfully.');
// }

// export async function saveCommitInfo(client: PoolClient, commitInfo: any, repositoryId: number) {
//     const { sha, author, message, date, commit_url } = commitInfo;

//     console.log(`Saving commit ${sha}...`);
    
//     try {
//         await client.query(`
//             INSERT INTO commit (sha, author, message, date, commit_url, repository_id)
//             VALUES ($1, $2, $3, $4, $5, $6)
//             ON CONFLICT (sha) DO NOTHING
//         `, [sha, author, message, date, commit_url, repositoryId]);

//         console.log(`Commit ${sha} information saved successfully.`);
//     } catch (error) {
//         console.error(`Error saving commit ${sha}: ${(error as Error).message}`);
//     }
// }


// export async function saveCommitsInBatches(client: PoolClient, commits: any[], repositoryId: number, batchSize: number = 10) {
//     for (let i = 0; i < commits.length; i += batchSize) {
//         const batch = commits.slice(i, i + batchSize);
//         const promises = batch.map(commit => saveCommitInfo(client, commit, repositoryId));
//         await Promise.all(promises);
//     }
// }



export async function saveCommits(client: PoolClient, commits: any[], repositoryId: number, startFrom: Date, batchSize: number = 100) {
    console.log(`Starting to save commits in batches...`);
    
    await client.query('BEGIN'); // Start transaction
    
    try {
        // Optional: Remove old commits up to the start point
        await client.query(`
            DELETE FROM commit
            WHERE repository_id = $1 AND date <= $2
        `, [repositoryId, startFrom]);

        for (let i = 0; i < commits.length; i += batchSize) {
            const batch = commits.slice(i, i + batchSize);
            console.log(`Processing batch ${i / batchSize + 1} of size ${batch.length}`);
            
            const promises = batch.map(async commit => {
                const { sha, author, message, date, commit_url } = commit;

                // Only process commits newer than the start point
                if (new Date(date) <= startFrom) {
                    console.log(`Skipping commit ${sha} as it is before the start point.`);
                    return;
                }

                try {
                    await client.query(`
                        INSERT INTO commit (sha, author, message, date, commit_url, repository_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (sha) DO NOTHING
                    `, [sha, author, message, date, commit_url, repositoryId]);
                    
                    console.log(`Commit ${sha} information saved successfully.`);
                } catch (error) {
                    console.error(`Error saving commit ${sha}: ${(error as Error).message}`);
                    // Optionally: Collect errors and report them later
                }
            });

            await Promise.all(promises); // Wait for all promises in the current batch to complete
        }

        await client.query('COMMIT'); // Commit transaction if all batches are successful
        console.log(`All commits saved successfully.`);
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction if any batch fails
        console.error('Error processing commits:', (error as Error).message);
    }
}
