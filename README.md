# Protocol Server v2

## Installation Procedure

### Prerequisites

- Node.js Version 16.18.0 or higher
- Docker Version 20.10.19 or higher

### Installation

1. Clone the repository
2. Go to the root directory of the project
3. Install the dependencies

```bash
npm install
```

4. Go to docker directory

```bash
cd docker
```

5. Run the docker-compose file

```bash
docker compose up
```

6. Go to the root directory of the project

7. Copy the appropriate config file from config/samples to config/default.yaml

8. Run the server in development mode

```bash
npm run dev
```

9. To run the application in Production mode, install pm2 globally

```bash
npm install pm2 -g
```

10. Build the application

```bash
npm run build
```

11. Start the application

```bash
pm2 start ecosystem.config.js
```
