'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadComponent } from '@/app/components/camera';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  glaze: z.string().min(1, 'Glaze preference is required'),
  imageData: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const glazeTypes = [
  'Clear',
  'White',
  'Blue Celadon',
  'Tenmoku',
  'Shino',
  'Custom Mix',
] as const;

export function NewPieceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      glaze: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/pieces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create piece');
      }

      const result = await response.json();

      toast({
        title: 'Success!',
        description: 'Your piece has been created.',
      });

      // Wait a moment for the toast to be visible
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/student');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create piece. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapture = (imageData: string) => {
    form.setValue('imageData', imageData);
    setShowCamera(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piece Name</FormLabel>
              <FormControl>
                <Input placeholder="My Beautiful Bowl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A brief description of your piece" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="glaze"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Glaze Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select glaze type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {glazeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Photo</FormLabel>
          {showCamera ? (
            <div className="space-y-4">
              <FormControl>
                <ImageUploadComponent
                  onCapture={(imageData) => {
                    form.setValue('imageData', imageData);
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : form.watch('imageData') ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={form.watch('imageData')}
                alt="Piece preview"
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => form.setValue('imageData', '')}
              >
                Remove Photo
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCamera(true)}
              className="w-full"
            >
              Take Photo
            </Button>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Piece"}
        </Button>
      </form>
    </Form>
  );
} 