"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThumbnail = exports.generateThumbnail = void 0;
const Thumbnail_js_1 = __importDefault(require("../models/Thumbnail.js"));
const genai_1 = require("@google/genai");
const ai_js_1 = __importDefault(require("../configs/ai.js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
};
const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
};
const generateThumbnail = async (req, res) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;
        const thumbnail = await Thumbnail_js_1.default.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        });
        const model = "gemini-3-pro-image-preview";
        const generationConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1K'
            },
            safetySettings: [
                { category: genai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: genai_1.HarmBlockThreshold.OFF },
                { category: genai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: genai_1.HarmBlockThreshold.OFF },
                { category: genai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: genai_1.HarmBlockThreshold.OFF },
                { category: genai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: genai_1.HarmBlockThreshold.OFF },
            ]
        };
        let prompt = `Create a ${stylePrompts[style]} for: "${title}".`;
        if (color_scheme) {
            prompt += ` Use a ${colorSchemeDescriptions[color_scheme]} color scheme.`;
        }
        if (user_prompt) {
            prompt += ` Additional details: ${user_prompt}.`;
        }
        prompt += ` The thumbnail should be ${aspect_ratio || '16:9'}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;
        // Generate the image using the ai model
        const response = await ai_js_1.default.models.generateContent({
            model,
            contents: [prompt],
            config: generationConfig
        });
        if (!response?.candidates?.[0]?.content?.parts) {
            throw new Error('Unexpected response');
        }
        const parts = response.candidates[0].content.parts;
        let finalBuffer = null;
        for (const part of parts) {
            if (part.inlineData) {
                finalBuffer = Buffer.from(part.inlineData.data, 'base64');
            }
        }
        if (!finalBuffer) {
            throw new Error('No image data found in response parts');
        }
        const filename = `final-output-${Date.now()}.png`;
        const filePath = path_1.default.join('images', filename);
        // Create the images directory if it doesn't exist
        fs_1.default.mkdirSync('images', { recursive: true });
        // Write the final image to the file
        fs_1.default.writeFileSync(filePath, finalBuffer);
        let imageUrl = '';
        try {
            const uploadResult = await cloudinary_1.v2.uploader.upload(filePath, { resource_type: 'image' });
            imageUrl = uploadResult.url;
            // remove image file from disk only on successful upload
            fs_1.default.unlinkSync(filePath);
        }
        catch (uploadError) {
            console.error("Cloudinary upload failed, falling back to local serving:", uploadError.message);
            const host = req.get('host') || 'localhost:3000';
            const protocol = req.protocol || 'http';
            imageUrl = `${protocol}://${host}/images/${filename}`;
        }
        thumbnail.image_url = imageUrl;
        thumbnail.isGenerating = false;
        await thumbnail.save();
        res.json({ message: 'Thumbnail Generated', thumbnail });
    }
    catch (error) {
        console.log("FULL ERROR:");
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};
exports.generateThumbnail = generateThumbnail;
const deleteThumbnail = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;
        await Thumbnail_js_1.default.findByIdAndDelete({ _id: id, userId });
        res.json({ message: 'Thumbnail deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.deleteThumbnail = deleteThumbnail;
