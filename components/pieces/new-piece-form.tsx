'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadComponent } from '@/app/components/camera';
import { uploadToS3 } from '@/lib/s3-upload';
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
  imageUrl: z.string().optional(),
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
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      glaze: '',
      imageUrl: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Form data being submitted:', data);
    setIsSubmitting(true);
    try {
      // Create the piece with the image URL
      const requestBody = {
        name: data.name,
        description: data.description,
        glaze: data.glaze,
        imageData: data.imageUrl, // Pass the S3 URL
      };
      console.log('Sending request with body:', requestBody);

      const response = await fetch('/api/pieces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create piece');
      }

      const result = await response.json();
      console.log('Received response:', result);

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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageUploadComponent
                    onCapture={(file, s3Url) => {
                      console.log('Image uploaded to S3:', s3Url);
                      field.onChange(s3Url);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Piece"}
        </Button>
      </form>
    </Form>
  );
} 