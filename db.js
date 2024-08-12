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
exports.initializeDB = initializeDB;
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config();
var pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
exports.default = pool;
function initializeDB() {
    return __awaiter(this, void 0, void 0, function () {
        var client, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Initializing database...');
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 7]);
                    console.log('Creating tables if not exist...');
                    // Create tables if they don't exist
                    return [4 /*yield*/, client.query("\n            CREATE TABLE IF NOT EXISTS repository (\n                id SERIAL PRIMARY KEY,\n                owner VARCHAR(255),\n                name VARCHAR(255),\n                description TEXT,\n                stars INTEGER,\n                forks INTEGER,\n                url TEXT,\n                CONSTRAINT unique_owner_name UNIQUE(owner, name) -- Explicit unique constraint\n\n            );\n        ")];
                case 3:
                    // Create tables if they don't exist
                    _a.sent();
                    console.log('Repository table created.');
                    return [4 /*yield*/, client.query("\n            CREATE TABLE commit (\n            id SERIAL PRIMARY KEY,\n            sha VARCHAR(255) UNIQUE,\n            author VARCHAR(255),\n            message TEXT,\n            date TIMESTAMP,\n            repository_id INT,\n            FOREIGN KEY (repository_id) REFERENCES repository(id)\n\n            );\n        ")];
                case 4:
                    _a.sent();
                    console.log('Commit table created.');
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    console.error('Error during table creation:', err_1);
                    return [3 /*break*/, 7];
                case 6:
                    client.release();
                    console.log('Client released.');
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/, pool];
            }
        });
    });
}
