import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  channelName: z.string().min(1, "Channel name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ChannelSearchFormProps {
  onAnalysisComplete: (channelId: string) => void;
  onAnalysisStart: () => void;
}

const ChannelSearchForm = ({ onAnalysisComplete, onAnalysisStart }: ChannelSearchFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
    },
  });

  const analyzeChannel = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/analyze-channel", {
        channelName: values.channelName,
      });
      return res.json();
    },
    onMutate: () => {
      onAnalysisStart();
    },
    onSuccess: (data) => {
      if (data.success && data.channelId) {
        onAnalysisComplete(data.channelId);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to analyze channel. Please try again.",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze channel. Please try again.",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    analyzeChannel.mutate(values);
  };

  return (
    <section className="mb-12 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">YouTube Channel Analyzer</h2>
        <p className="text-youtube-gray text-lg">Enter your channel name to get content insights and video ideas</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-youtube-gray">Channel Name or URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Marques Brownlee or youtube.com/mkbhd"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-youtube-blue focus:border-youtube-blue"
                      />
                    </FormControl>
                    <p className="mt-1 text-sm text-youtube-gray">We'll use this to analyze your channel content</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={analyzeChannel.isPending}
                className="w-full md:w-auto px-6 py-3 bg-youtube-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                {analyzeChannel.isPending ? "Analyzing..." : "Analyze Channel"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ChannelSearchForm;
