"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationPicker } from "./location-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CameraComponent } from "@/app/components/camera";
import { sendNotification } from "@/lib/actions/notifications";

interface BatchUpdateProps {
  className?: string;
  selectedPieces: string[];
  onUpdateComplete?: () => void;
}

export function BatchUpdate({ className, selectedPieces, onUpdateComplete }: BatchUpdateProps) {
  const [status, setStatus] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [showCamera, setShowCamera] = useState(false);
  const [finalPhoto, setFinalPhoto] = useState<string>();
  const [sendPickupNotification, setSendPickupNotification] = useState(false);

  const handleUpdate = async () => {
    try {
      // Update pieces with new status and location
      // TODO: Implement actual batch update

      if (status === "completed" && sendPickupNotification) {
        // Send pickup notifications
        await Promise.all(
          selectedPieces.map((pieceId) =>
            sendNotification({
              userId: "student-id", // TODO: Get actual student ID
              title: "Piece Ready for Pickup",
              message: "Your piece is completed and ready for pickup!",
            })
          )
        );
      }

      onUpdateComplete?.();
    } catch (error) {
      console.error("Error updating pieces:", error);
    }
  };

  const handlePhotoCapture = (imageData: string) => {
    setFinalPhoto(imageData);
    setShowCamera(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={className}
          disabled={selectedPieces.length === 0}
        >
          Update {selectedPieces.length} Selected
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update {selectedPieces.length} Pieces</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greenware">Greenware</SelectItem>
                <SelectItem value="bisqued">Bisqued</SelectItem>
                <SelectItem value="glazed">Glazed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <LocationPicker
              currentLocation={location}
              onLocationChange={setLocation}
            />
          </div>

          {status === "completed" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Final Photo</label>
                {!showCamera && !finalPhoto ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCamera(true)}
                    className="w-full"
                  >
                    Take Photo
                  </Button>
                ) : showCamera ? (
                  <CameraComponent onCapture={handlePhotoCapture} />
                ) : (
                  <div className="relative aspect-video">
                    <img 
                      src={finalPhoto} 
                      alt="Final piece" 
                      className="rounded-lg object-cover"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setShowCamera(true)}
                    >
                      Retake
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify"
                  checked={sendPickupNotification}
                  onCheckedChange={(checked) => 
                    setSendPickupNotification(checked as boolean)
                  }
                />
                <label 
                  htmlFor="notify" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Send pickup notification to student
                </label>
              </div>
            </>
          )}

          <Button 
            onClick={handleUpdate} 
            className="w-full"
            disabled={!status && !location}
          >
            Update Pieces
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}