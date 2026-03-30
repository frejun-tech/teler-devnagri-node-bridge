import { StreamHandlerResult, StreamOP } from "@frejun/teler";
import { wsUrl } from "./wsServer";
import { numberInfo } from "../api/endpoints/calls";
import { config } from "../core/config";

export const callStreamHandler = async (message: string): Promise<StreamHandlerResult> => {
    try {
        const data = JSON.parse(message);
        if(data["type"] === "start") {
            const configMessage = {
                event: "start",
                start: {
                    call_sid: data["call_id"],
                    stream_sid: data["stream_id"],
                    from: numberInfo.from,
                    to: numberInfo.to,
                    media_format: {
                        encoding: "base64",
                        sample_rate: 8000,
                        bit_rate: "128kbps"
                    }
                }
            };
            const payload: string = JSON.stringify(configMessage);
            console.log('Configuration sent.');
            return [payload, StreamOP.RELAY];
        }
        else if(data["type"] === "audio") {
            const wsPayload = {
                event: "media",
                stream_sid: data["stream_id"],
                media: {
                    payload: data["data"]["audio_b64"]
                }
            };
            const payload: string = JSON.stringify(wsPayload);
            return [payload, StreamOP.RELAY];
        }

        return ['', StreamOP.PASS];
    } catch(err) {
        console.log("Error in call stream handler", err);
        return ['', StreamOP.PASS];
    }
}

export const remoteStreamHandler = () => {
    let chunk_id = 1
    let messageBuffer: Buffer[] = [];

    const handler = async(message: string): Promise<StreamHandlerResult> => {
        try {
            const data = JSON.parse(message);
            if (data["event"] == "media") {
                // Receiving Audio
                const audio_b64 = data["media"]["payload"];
                messageBuffer.push(Buffer.from(audio_b64, 'base64'));
                if( messageBuffer.length >= config.bufferSize ) {
                    const audio = Buffer.concat(messageBuffer);
                    const payload = JSON.stringify({
                        "type": "audio",
                        "audio_b64": audio.toString('base64'),
                        "chunk_id": chunk_id++,
                    })

                
                    console.log("Relaying to Teler...");
                    messageBuffer.length = 0; // Clear the buffer
                    
                    console.log("Sending Mark event to devnagri...")
                    const markResponse = wsUrl?.send(JSON.stringify({
                        event: "mark",
                        stream_sid: chunk_id,
                        mark: {
                            name: "responsePart"
                        }
                    }));
                    console.log("Mark event sent", markResponse);
                    
                    return [payload, StreamOP.RELAY];

                }
                return ['', StreamOP.PASS];
            } else if (data["event"] == "clear") {
                const payload = JSON.stringify({"type": "clear"});
                return [payload, StreamOP.RELAY];
            } 

            return ['', StreamOP.PASS];
        } catch (err) {
            console.log("Error in remote stream handler", err);
            return ['', StreamOP.PASS];
        }
    }

    return handler;
}
