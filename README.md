# Teler-Devnagri-Node-Bridge

A reference integration between Teler and Devnagri in Node, based on [Media Streaming Bridge](https://frejun.ai/docs/category/media-streaming/) over WebSockets.

## What is Teler?

Teler is a programmable voice API by FreJun. It handles carriers, phone numbers, and real-time audio streaming so you can connect AI models directly to phone calls. → [frejun.ai](https://frejun.ai)

## Setup

1. **Clone and configure:**

   ```bash
   git clone https://github.com/frejun-tech/teler-devnagri-node-bridge.git
   cd teler-devnagri-node-bridge
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Run with Docker:**
   ```bash
   docker compose up -d --build
   ```

## Environment Variables

| Variable          | Description            | Default  |
| ----------------- | ---------------------- | -------- |
| `DEVNAGRI_WS_URL` | Devnagri WebSocket URL | Required |
| `TELER_API_KEY`   | Teler API key          | Required |
| `NGROK_AUTHTOKEN` | ngrok auth token       | Required |

## API Endpoints

- `GET /` - Health check with server domain
- `GET /health` - Service status
- `GET /ngrok-status` - Current ngrok status and URL
- `POST /api/v1/calls/initiate-call` - Start a new call with dynamic phone numbers
- `POST /api/v1/calls/flow` - Get call flow configuration
- `WebSocket /api/v1/calls/media-stream` - Audio streaming
- `POST /api/v1/webhooks/receiver` - Teler webhook receiver

### Call Initiation Example

```bash
curl -X POST "https://your_ngrok_domain/api/v1/calls/initiate-call" \
  -H "Content-Type: application/json" \
  -d '{
    "from_number": "+918064xxx",
    "to_number": "+919967xxx"
  }'
```

## Features

- **Bi-directional media streaming** - Bridges audio between Teler and Devnagri (Voice API) over WebSockets.
- **Real-time audio handling** - Receives live audio chunks from Teler, processes them, and forwards to Devnagri; streams responses back to Teler.
- **Dockerized setup** - Comes with Dockerfile and docker-compose.yaml for easy local development and deployment.
- **Dynamic ngrok URL detection** - Automatically detects current ngrok domain
