'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CameraComponent } from '@/app/components/camera';
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
  classType: z.string().min(1, 'Class type is required'),
  glaze: z.string().min(1, 'Glaze preference is required'),
  imageData: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const classTypes = [
  'ONE_TIME',
  'GLAZING',
] as const;

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
      classType: '',
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
        throw new Error('Failed to create piece');
      }

      toast({
        title: 'Success!',
        description: 'Your piece has been created.',
      });

      router.push('/student');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to create piece. Please try again.',
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
          name="classType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <FormField
          control={form.control}
          name="imageData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value ? (
                    <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={field.value}
                        alt="Piece preview"
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                        onClick={() => {
                          field.onChange('');
                          setShowCamera(false);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : showCamera ? (
                    <CameraComponent onCapture={handleCapture} />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowCamera(true)}
                    >
                      Take Photo
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Piece'}
        </Button>
      </form>
    </Form>
  );
} 