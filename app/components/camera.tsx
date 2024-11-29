"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal } from "lucide-react";

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
}

export function CameraComponent({ onCapture }: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopCamera]);

  return (
    <div className="relative">
      {!stream ? (
        <Button onClick={startCamera} className="w-full">
          <Camera className="mr-2 h-4 w-4" />
          Start Camera
        </Button>
      ) : (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="flex gap-2">
            <Button onClick={capturePhoto} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
            <Button variant="outline" onClick={toggleCamera}>
              <FlipHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}