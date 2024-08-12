import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

export default pool;

export async function initializeDB() {
    console.log('Initializing database...');
    const client = await pool.connect();
    try {
        console.log('Creating tables if not exist...');
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS repository (
                id SERIAL PRIMARY KEY,
                owner VARCHAR(255),
                name VARCHAR(255),
                description TEXT,
                stars INTEGER,
                forks INTEGER,
                url TEXT,
                CONSTRAINT unique_owner_name UNIQUE(owner, name) -- Explicit unique constraint

            );
        `);
        console.log('Repository table created.');

        await client.query(`
            CREATE TABLE commit (
            id SERIAL PRIMARY KEY,
            sha VARCHAR(255) UNIQUE,
            author VARCHAR(255),
            message TEXT,
            date TIMESTAMP,
            repository_id INT,
            FOREIGN KEY (repository_id) REFERENCES repository(id)

            );
        `);
        console.log('Commit table created.');
    } catch (err) {
        console.error('Error during table creation:', err);
    } finally {
        client.release();
        console.log('Client released.');
    }
    return pool;
}
