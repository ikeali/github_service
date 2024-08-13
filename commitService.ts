import { url } from 'inspector';
import { PoolClient } from 'pg';
 

export async function saveCommits(client: PoolClient, commits: any[], repositoryId: number, startFrom: Date, batchSize: number = 100) {
    console.log(`Starting to save commits in batches...`);
    
    await client.query('BEGIN'); 
    
    try {
       
        await client.query(`
            DELETE FROM commit
            WHERE repository_id = $1 AND date <= $2
        `, [repositoryId, startFrom]);

        for (let i = 0; i < commits.length; i += batchSize) {
            const batch = commits.slice(i, i + batchSize);
            console.log(`Processing batch ${i / batchSize + 1} of size ${batch.length}`);
            
            const promises = batch.map(async commit => {
                const { sha, author, message, date, commit_url } = commit;

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
                 
                }
            });

            await Promise.all(promises); 
        }

        await client.query('COMMIT'); 
        console.log(`All commits saved successfully.`);
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error('Error processing commits:', (error as Error).message);
    }
}
