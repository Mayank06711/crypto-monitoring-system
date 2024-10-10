# Crypto Monitoring System

A Node.js-based API that monitors and calculates the deviation of cryptocurrency prices (Bitcoin, Matic, and Ethereum) with data fetched every 2 hours using cron jobs. The application is built with production-ready best practices, error handling, and clean code principles.

## Features

- **Cryptocurrency Deviation Calculation**: Calculates standard deviation for the last 100 price records of Bitcoin, Matic, and Ethereum.
- **Cron Job for Data Updates**: A scheduled cron job updates the deviation data every 2 hours.
- **API Caching**: Pre-calculated deviations are cached and stored to optimize performance for repeated requests within a 2-hour window.
- **Error Handling and Logging**: Implements robust error handling and logging to track issues and ensure smooth operation.

## API Endpoints

- **GET /api/v1/coins/deviation?coin=bitcoin**:
- Returns the standard deviation of the last 100 price points for the specified coin.
- **GET /api/v1/coins/statts?coin=bitcoin**:
- Returns the standard current stats of the specified coin.
Example:(GET REQ)
```bash
 43.205.50.66:3003/api/v1/coins/deviation?coin=bitcoin
 43.205.50.66:3003/api/v1/coins/stats?coin=bitcoin
```
## Clone the repository
```bash
git clone -b master https://github.com/your-username/your-repo-name.git
```
## Install dependencies:
```bash
cd crypto-monitoring-system
npm install
```
## Configure environment variables:
Create a .env file in the root directory and add your MongoDB connection string and other necessary variables:
```bash
MONGODB_URI=<your-mongodb-uri>
PORT=3003
COINGECKO_API_URL=your url
```
Run the project
```bash
npm run dev
```
