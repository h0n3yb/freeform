import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  status: z.enum(['in-progress', 'glazing', 'firing', 'complete', 'picked-up']).optional(),
  shelfLocation: z.string().optional(),
  notes: z.string().optional(),
  sendNotification: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface BatchUpdateDialogProps {
  selectedPieceIds: string[];
  onUpdate: () => void;
}

export function BatchUpdateDialog({ selectedPieceIds, onUpdate }: BatchUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sendNotification: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (selectedPieceIds.length === 0) {
      toast({
        title: 'No pieces selected',
        description: 'Please select at least one piece to update.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/pieces/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pieceIds: selectedPieceIds,
          updates: {
            status: data.status,
            shelfLocation: data.shelfLocation,
            notes: data.notes,
          },
          sendNotification: data.sendNotification,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      toast({
        title: 'Success',
        description: `Updated ${selectedPieceIds.length} pieces`,
      });
      
      onUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update pieces. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={selectedPieceIds.length === 0}>
          Update {selectedPieceIds.length} Pieces
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {selectedPieceIds.length} Pieces</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="glazing">Glazing</SelectItem>
                      <SelectItem value="firing">Firing</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="picked-up">Picked Up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shelfLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A1-B3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Add any notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendNotification"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Send notification to students
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Pieces'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 