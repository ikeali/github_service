"use strict";
// import { Pool } from 'pg';
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
exports.saveCommitInfo = saveCommitInfo;
exports.saveCommitsInBatches = saveCommitsInBatches;
function saveCommitInfo(client, commitInfo, repositoryId) {
    return __awaiter(this, void 0, void 0, function () {
        var sha, author, message, date;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sha = commitInfo.sha, author = commitInfo.author, message = commitInfo.message, date = commitInfo.date;
                    return [4 /*yield*/, client.query("\n        INSERT INTO commit (sha, author, message, date, repository_id)\n        VALUES ($1, $2, $3, $4, $5)\n        ON CONFLICT (sha) DO NOTHING\n    ", [sha, author, message, date, repositoryId])];
                case 1:
                    _a.sent();
                    console.log('Commit information saved successfully.');
                    return [2 /*return*/];
            }
        });
    });
}
function saveCommitsInBatches(client_1, commits_1, repositoryId_1) {
    return __awaiter(this, arguments, void 0, function (client, commits, repositoryId, batchSize) {
        var i, batch, promises;
        if (batchSize === void 0) { batchSize = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < commits.length)) return [3 /*break*/, 4];
                    batch = commits.slice(i, i + batchSize);
                    promises = batch.map(function (commit) { return saveCommitInfo(client, commit, repositoryId); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += batchSize;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
