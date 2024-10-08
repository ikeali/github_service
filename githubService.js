"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRepositoryInfo = fetchRepositoryInfo;
var axios_1 = require("axios");
var db_1 = require("./db");
var repositoryService_1 = require("./repositoryService");
// import { saveCommitsInBatches } from './commitService';
var commitService_1 = require("./commitService");
// export async function fetchRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
//     const url = `https://api.github.com/repos/${owner}/${repo}`;
//     const apiToken = process.env.API_TOKEN;
//     if (!apiToken) {
//         throw new Error('API_TOKEN is not defined');
//     }
//     const headers = {
//         'Authorization': `Bearer ${apiToken}`,
//         'Content-Type': 'application/json',
//     };
//     try {
//         const response = await axios.get(url, { headers });
//         const data = response.data;
//         return {
//             owner: data.owner.login,
//             name: data.name,
//             description: data.description,
//             stars: data.stargazers_count,
//             forks: data.forks_count,
//             url: data.html_url,
//         };
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Error fetching repository info:', error.response?.data);
//         } else {
//             console.error('Unexpected error:', error);
//         }
//         throw error;
//     }
// }
function fetchRepositoryInfo(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var apiToken, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiToken = process.env.API_TOKEN;
                    if (!apiToken) {
                        throw new Error('API_TOKEN is not defined');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("https://api.github.com/repos/".concat(owner, "/").concat(repo), {
                            headers: { Authorization: "token ".concat(apiToken) }
                        })];
                case 2:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, {
                            owner: data.owner.login,
                            name: data.name,
                            description: data.description,
                            stars: data.stargazers_count,
                            forks: data.forks_count,
                            url: data.html_url,
                        }];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.response.status === 404) {
                        console.error("Repository not found: ".concat(error_1.response.data));
                    }
                    else {
                        console.error('Unexpected error:', error_1);
                    }
                    throw new Error('Failed to fetch repository information');
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchCommits(owner_1, repo_1) {
    return __awaiter(this, arguments, void 0, function (owner, repo, page, perPage, startDate, endDate) {
        var url, apiToken, headers, response, commits, error_2;
        var _a;
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 30; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "https://api.github.com/repos/".concat(owner, "/").concat(repo, "/commits?page=").concat(page, "&per_page=").concat(perPage);
                    if (startDate) {
                        url += "&since=".concat(startDate);
                    }
                    if (endDate) {
                        url += "&until=".concat(endDate);
                    }
                    apiToken = process.env.API_TOKEN;
                    if (!apiToken) {
                        throw new Error('API_TOKEN is not defined');
                    }
                    headers = {
                        'Authorization': "Bearer ".concat(apiToken),
                        'Content-Type': 'application/json',
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                case 2:
                    response = _b.sent();
                    commits = response.data.map(function (commit) { return ({
                        sha: commit.sha,
                        author: commit.commit.author.name,
                        message: commit.commit.message,
                        date: commit.commit.author.date,
                        commit_url: commit.html_url,
                    }); });
                    return [2 /*return*/, commits];
                case 3:
                    error_2 = _b.sent();
                    if (axios_1.default.isAxiosError(error_2)) {
                        console.error("Failed to fetch commits:", (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                    }
                    else {
                        console.error("Unexpected error:", error_2);
                    }
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkForUpdates(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var client, batchSize, owner, repo, pageSize, page, commits, repoInfo, result, repositoryId, startFrom, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.connect()];
                case 1:
                    client = _a.sent();
                    batchSize = 100;
                    owner = 'chromium';
                    repo = 'chromium';
                    pageSize = 30;
                    page = 1;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 11, 12, 13]);
                    return [4 /*yield*/, fetchRepositoryInfo(owner, repo)];
                case 3:
                    repoInfo = _a.sent();
                    console.log('Repository Info:', repoInfo);
                    return [4 /*yield*/, (0, repositoryService_1.saveRepositoryInfo)(client, repoInfo)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM repository WHERE owner = $1 AND name = $2", [owner, repo])];
                case 5:
                    result = _a.sent();
                    repositoryId = result.rows[0].id;
                    _a.label = 6;
                case 6: return [4 /*yield*/, fetchCommits(owner, repo, page, pageSize, startDate, endDate)];
                case 7:
                    commits = _a.sent();
                    if (!(commits.length > 0)) return [3 /*break*/, 9];
                    startFrom = new Date('2024-08-12T10:00:00Z');
                    return [4 /*yield*/, (0, commitService_1.saveCommits)(client, commits, repositoryId, startFrom, batchSize)];
                case 8:
                    _a.sent();
                    // await saveCommits(client, commits, repositoryId, batchSize);
                    page++;
                    _a.label = 9;
                case 9:
                    if (commits.length > 0) return [3 /*break*/, 6];
                    _a.label = 10;
                case 10:
                    console.log('Commits updated successfully.');
                    return [3 /*break*/, 13];
                case 11:
                    error_3 = _a.sent();
                    console.error('Error during update check:', error_3);
                    return [3 /*break*/, 13];
                case 12:
                    client.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// function getOneYearAgoDate(): string {
//     const date = new Date();
//     date.setFullYear(date.getFullYear() - 1);
//     return date.toISOString();
// }
var monitorInterval = 60000; // 60 seconds
// setInterval(async () => {
//     const startDate = getOneYearAgoDate();
//     const endDate = new Date().toISOString();
//     await checkForUpdates(startDate, endDate);
// }, monitorInterval);
function getOneHourAgoDate() {
    var date = new Date();
    date.setHours(date.getHours() - 1);
    return date.toISOString();
}
setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
    var startDate, endDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startDate = getOneHourAgoDate();
                endDate = new Date().toISOString();
                return [4 /*yield*/, checkForUpdates(startDate, endDate)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, monitorInterval);
// checkForUpdates(getOneYearAgoDate(), new Date().toISOString());
checkForUpdates(getOneHourAgoDate(), new Date().toISOString());
