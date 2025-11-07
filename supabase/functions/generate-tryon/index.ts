import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modelImage, clothingImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting AI image generation process...");

    // Generate enhanced product photo
    console.log("Generating enhanced product photo...");
    const enhancedProductResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Create a professional product photo: remove wrinkles, enhance colors, add a clean white studio background, and make it look premium and ready for e-commerce. Keep the garment exactly as shown."
              },
              {
                type: "image_url",
                image_url: { url: clothingImage }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!enhancedProductResponse.ok) {
      const errorText = await enhancedProductResponse.text();
      console.error("Enhanced product error:", enhancedProductResponse.status, errorText);
      throw new Error(`Failed to generate enhanced product: ${errorText}`);
    }

    const enhancedProductData = await enhancedProductResponse.json();
    const enhancedProduct = enhancedProductData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // Generate model wearing clothing - front view
    console.log("Generating model wearing clothing (front view)...");
    const modelFrontResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Create a realistic photo of this model wearing this clothing item. The model should be in the same pose and setting, but wearing the garment shown in the second image. Make it look natural and professional, like a real fashion photograph."
              },
              {
                type: "image_url",
                image_url: { url: modelImage }
              },
              {
                type: "image_url",
                image_url: { url: clothingImage }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!modelFrontResponse.ok) {
      const errorText = await modelFrontResponse.text();
      console.error("Model front error:", modelFrontResponse.status, errorText);
      throw new Error(`Failed to generate model wearing clothing: ${errorText}`);
    }

    const modelFrontData = await modelFrontResponse.json();
    const modelWearingFront = modelFrontData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // Generate back view of product
    console.log("Generating product back view...");
    const productBackResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Create a professional back view of this garment. Show the back side of the clothing item on a clean white studio background, maintaining the same style and quality as a premium e-commerce product photo."
              },
              {
                type: "image_url",
                image_url: { url: clothingImage }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!productBackResponse.ok) {
      const errorText = await productBackResponse.text();
      console.error("Product back error:", productBackResponse.status, errorText);
      throw new Error(`Failed to generate product back view: ${errorText}`);
    }

    const productBackData = await productBackResponse.json();
    const productBack = productBackData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // Generate model wearing clothing - back view
    console.log("Generating model wearing clothing (back view)...");
    const modelBackResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Create a realistic back view photo of this model wearing this clothing item. Show the model from behind in a natural pose, wearing the garment. Make it look professional and natural, like a real fashion photograph."
              },
              {
                type: "image_url",
                image_url: { url: modelImage }
              },
              {
                type: "image_url",
                image_url: { url: clothingImage }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!modelBackResponse.ok) {
      const errorText = await modelBackResponse.text();
      console.error("Model back error:", modelBackResponse.status, errorText);
      throw new Error(`Failed to generate model back view: ${errorText}`);
    }

    const modelBackData = await modelBackResponse.json();
    const modelWearingBack = modelBackData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    console.log("All images generated successfully");

    return new Response(
      JSON.stringify({
        enhancedProduct,
        modelWearingFront,
        productBack,
        modelWearingBack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-tryon function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
