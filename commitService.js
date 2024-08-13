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
exports.saveCommits = saveCommits;
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
function saveCommits(client_1, commits_1, repositoryId_1, startFrom_1) {
    return __awaiter(this, arguments, void 0, function (client, commits, repositoryId, startFrom, batchSize) {
        var i, batch, promises, error_1;
        var _this = this;
        if (batchSize === void 0) { batchSize = 100; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting to save commits in batches...");
                    return [4 /*yield*/, client.query('BEGIN')];
                case 1:
                    _a.sent(); // Start transaction
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, , 11]);
                    // Optional: Remove old commits up to the start point
                    return [4 /*yield*/, client.query("\n            DELETE FROM commit\n            WHERE repository_id = $1 AND date <= $2\n        ", [repositoryId, startFrom])];
                case 3:
                    // Optional: Remove old commits up to the start point
                    _a.sent();
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < commits.length)) return [3 /*break*/, 7];
                    batch = commits.slice(i, i + batchSize);
                    console.log("Processing batch ".concat(i / batchSize + 1, " of size ").concat(batch.length));
                    promises = batch.map(function (commit) { return __awaiter(_this, void 0, void 0, function () {
                        var sha, author, message, date, commit_url, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sha = commit.sha, author = commit.author, message = commit.message, date = commit.date, commit_url = commit.commit_url;
                                    // Only process commits newer than the start point
                                    if (new Date(date) <= startFrom) {
                                        console.log("Skipping commit ".concat(sha, " as it is before the start point."));
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, client.query("\n                        INSERT INTO commit (sha, author, message, date, commit_url, repository_id)\n                        VALUES ($1, $2, $3, $4, $5, $6)\n                        ON CONFLICT (sha) DO NOTHING\n                    ", [sha, author, message, date, commit_url, repositoryId])];
                                case 2:
                                    _a.sent();
                                    console.log("Commit ".concat(sha, " information saved successfully."));
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    console.error("Error saving commit ".concat(sha, ": ").concat(error_2.message));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 5:
                    _a.sent(); // Wait for all promises in the current batch to complete
                    _a.label = 6;
                case 6:
                    i += batchSize;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, client.query('COMMIT')];
                case 8:
                    _a.sent(); // Commit transaction if all batches are successful
                    console.log("All commits saved successfully.");
                    return [3 /*break*/, 11];
                case 9:
                    error_1 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 10:
                    _a.sent(); // Rollback transaction if any batch fails
                    console.error('Error processing commits:', error_1.message);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
