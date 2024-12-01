import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `<SystemPrompt>
    <Instructions>
        <Format>
            <Expectation>The model must return only JSON as the output in English.</Expectation>
        </Format>
        <Emphasis>
            <KeyPoints>
                <Point1>The model should never provide explanations, clarifications, or additional commentary outside of the JSON structure.</Point1>
                <Point2>Ensure the response adheres strictly to JSON formatting with no additional text or characters.</Point2>
            </KeyPoints>
        </Emphasis>
    </Instructions>
    <ClayTypes>
        <AllowedValues>
            <Type1>
                <Name>white</Name>
                <Definition>A fine, light-colored clay with a smooth texture, often used for creating clean, bright ceramic pieces.</Definition>
            </Type1>
            <Type2>
                <Name>brown_speckled</Name>
                <Definition>A medium-toned clay with natural speckles, giving a rustic and organic appearance to the ceramic piece.</Definition>
            </Type2>
            <Type3>
                <Name>dark_brown</Name>
                <Definition>A rich, deep brown clay with a bold, earthy appearance, suitable for adding warmth and depth to ceramics.</Definition>
            </Type3>
            <Type4>
                <Name>buff_speckled</Name>
                <Definition>A light tan or beige clay with natural speckling, often used for a balanced and neutral aesthetic.</Definition>
            </Type4>
        </AllowedValues>
    </ClayTypes>
    <Examples>
        <Example1>
            <Description>A ceramic bowl with a glossy glaze and blue undertones.</Description>
            <Output>
                {
                    "piece_name": "Glossy Blue Bowl",
                    "piece_type": "Bowl",
                    "clay_type": "white",
                    "color": "Light blue with white undertones"
                }
            </Output>
        </Example1>
        <Example2>
            <Description>A textured vase with a matte black finish and vertical ridges.</Description>
            <Output>
                {
                    "piece_name": "Textured Matte Vase",
                    "piece_type": "Vase",
                    "clay_type": "dark_brown",
                    "color": "Black"
                }
            </Output>
        </Example2>
        <Example3>
            <Description>A large platter with a speckled white surface and unglazed rim.</Description>
            <Output>
                {
                    "piece_name": "Speckled Serving Platter",
                    "piece_type": "Platter",
                    "clay_type": "buff_speckled",
                    "color": "White with dark speckles"
                }
            </Output>
        </Example3>
    </Examples>

    Return only JSON and do not use a code block.
</SystemPrompt>
`;

export async function POST(request: Request) {

  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { imageUrl } = await request.json();

    // Extract the key from the S3 URL
    const key = imageUrl.split('.amazonaws.com/')[1];
    if (!key) {
      throw new Error('Invalid S3 URL');
    }

    // Get presigned URL using existing API route
    console.log('Fetching presigned URL for key:', key);
    const presignedResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/s3-url?key=${encodeURIComponent(key)}`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',  // Forward the auth cookie
      }
    });
    
    // Debug logging
    console.log('Presigned URL response status:', presignedResponse.status);
    console.log('Presigned URL response headers:', Object.fromEntries(presignedResponse.headers));

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      console.error('Presigned URL error response:', errorText);
      throw new Error(`Failed to get presigned URL: ${presignedResponse.status} ${errorText}`);
    }

    const presignedData = await presignedResponse.json();
    console.log('Presigned URL response data:', presignedData);
    const { url: presignedUrl } = presignedData;

    console.log('Generated presigned URL:', presignedUrl);  // Debug log

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this ceramic piece and provide details in JSON format." },
            {
              type: "image_url",
              image_url: {
                url: presignedUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500,
    });

    // Log the entire response for debugging
    console.log('Raw OpenAI API response:', response);

    const metadata = response.choices[0]?.message?.content;

    // Check if the response is valid JSON
    let parsedMetadata = null;
    try {
      parsedMetadata = metadata ? JSON.parse(metadata) : null;
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError);
      throw new Error('Invalid JSON response from OpenAI API');
    }

    console.log('AI-generated metadata:', parsedMetadata);  // Debug log

    return NextResponse.json({ metadata: parsedMetadata });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
} 