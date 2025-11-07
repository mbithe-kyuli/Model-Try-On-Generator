import { Card, CardContent } from "@/components/ui/card";

interface ResultsGalleryProps {
  results: {
    enhancedProduct: string;
    modelWearingFront: string;
    productBack: string;
    modelWearingBack: string;
  };
}

export const ResultsGallery = ({ results }: ResultsGalleryProps) => {
  const images = [
    { src: results.enhancedProduct, label: "Enhanced Product" },
    { src: results.modelWearingFront, label: "Model Wearing (Front)" },
    { src: results.productBack, label: "Product (Back)" },
    { src: results.modelWearingBack, label: "Model Wearing (Back)" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in-50 duration-700">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Your AI-Generated Results
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-2 hover:shadow-[var(--shadow-lift)] transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={image.src} 
                  alt={image.label}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {image.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
