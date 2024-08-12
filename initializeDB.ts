import { initializeDB } from './db';

async function init() {
    await initializeDB();
    console.log('Database initialized successfully.');
}

init();
