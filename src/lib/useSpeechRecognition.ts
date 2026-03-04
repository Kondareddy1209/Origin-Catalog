"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SpeechOptions {
    onResult?: (text: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
    lang?: string;
}

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            if (recognitionRef.current) {
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
            }
        }
    }, []);

    const startListening = useCallback((options?: SpeechOptions) => {
        if (!recognitionRef.current) {
            const fallbackMsg = "Speech recognition is not supported in this browser. Please use Chrome or Edge.";
            setError(fallbackMsg);
            options?.onError?.(fallbackMsg);
            return;
        }

        if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
            const secureMsg = "Speech recognition requires a secure connection (HTTPS).";
            setError(secureMsg);
            options?.onError?.(secureMsg);
            return;
        }

        setError(null);
        setTranscript("");
        setIsListening(true);
        recognitionRef.current.lang = options?.lang || "en-IN";

        recognitionRef.current.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            options?.onResult?.(text);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error);
            const errMsg = event.error === 'not-allowed'
                ? "Microphone access denied. Please check your browser's site settings and ensure you have allowed microphone access for this site."
                : `Error: ${event.error}`;
            setError(errMsg);
            options?.onError?.(errMsg);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            options?.onEnd?.();
        };

        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error(e);
            setIsListening(false);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        isSupported
    };
}
