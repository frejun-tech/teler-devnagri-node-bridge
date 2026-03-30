import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { StreamConnector } from '@frejun/teler';
import { StreamType }      from '@frejun/teler';
import { callStreamHandler, remoteStreamHandler } from './streamHandlers';
import { config } from '../core/config';

export const wss = new WebSocketServer({ noServer: true });

const connector = new StreamConnector(
    config.devnagriWsUrl,
    StreamType.BIDIRECTIONAL,
    callStreamHandler,
    remoteStreamHandler()
);

export let wsUrl: WebSocket | null;
wss.on('connection', async (callWs: WebSocket) => {
    console.log('Teler connected to WebSocket');
    wsUrl = await connector.bridgeStream(callWs as any);
    wsUrl.onopen = () => {
        console.log('WebSocket Connected');
    };
});

export const handleUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
    if (request.url === '/api/v1/media-stream') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws);
        });
    } else {
        socket.destroy();
    }
};