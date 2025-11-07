import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ResultsGallery } from "@/components/ResultsGallery";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!modelImage || !clothingImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both a model photo and a clothing item.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-tryon', {
        body: { modelImage, clothingImage }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      toast({
        title: "Success!",
        description: "Your AI-generated images are ready.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in-50 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">AI-Powered Virtual Try-On</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-[var(--gradient-hero)] bg-clip-text text-transparent">
            Virtual Fashion Studio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a model and clothing item to see AI-generated professional photos
          </p>
        </div>

        {/* Upload Section */}
        {!results && (
          <div className="max-w-4xl mx-auto animate-in fade-in-50 duration-700 slide-in-from-bottom-4">
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ImageUpload
                  label="Model Photo"
                  description="Upload a photo of the model"
                  onImageSelect={setModelImage}
                  image={modelImage}
                />
                <ImageUpload
                  label="Clothing Item"
                  description="Upload a photo of the clothing"
                  onImageSelect={setClothingImage}
                  image={clothingImage}
                />
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={!modelImage || !clothingImage || isGenerating}
                className="w-full h-14 text-lg font-semibold shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-lift)] transition-all duration-300"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating AI Images...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Photos
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            <ResultsGallery results={results} />
            <div className="text-center">
              <Button
                onClick={() => {
                  setResults(null);
                  setModelImage(null);
                  setClothingImage(null);
                }}
                variant="outline"
                size="lg"
                className="shadow-[var(--shadow-elegant)]"
              >
                Try Another Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
