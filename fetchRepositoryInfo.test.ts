import axios from 'axios';
import { fetchRepositoryInfo } from './githubService';


jest.mock('axios');

describe('fetchRepositoryInfo', () => {
    const mockRepoData = {
        owner: { login: 'chromium' },
        name: 'chromium',
        description: 'The Chromium Project',
        stargazers_count: 10000,
        forks_count: 2000,
        html_url: 'https://github.com/chromium/chromium',
    };

    it('should return repository information when API call is successful', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: mockRepoData });

        const repoInfo = await fetchRepositoryInfo('chromium', 'chromium');

        expect(repoInfo).toEqual({
            owner: 'chromium',
            name: 'chromium',
            description: 'The Chromium Project',
            stars: 10000,
            forks: 2000,
            url: 'https://github.com/chromium/chromium',
        });
    });

    it('should throw an error when API_TOKEN is not defined', async () => {
        const originalEnv = process.env.API_TOKEN;
        delete process.env.API_TOKEN;

        await expect(fetchRepositoryInfo('chromium', 'chromium')).rejects.toThrow('API_TOKEN is not defined');

        process.env.API_TOKEN = originalEnv; // Restore original env variable
    });

    it('should handle errors from the API', async () => {
        (axios.get as jest.Mock).mockRejectedValue({
            response: {
                data: 'Not Found',
                status: 404,
            },
        });

        await expect(fetchRepositoryInfo('chromium', 'chromium')).rejects.toThrow();
    });
});
