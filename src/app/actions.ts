"use server";

import sharp from "sharp";

export async function optimizeImage(formData: FormData) {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("No se ha proporcionado ningún archivo.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
        let pipeline = sharp(buffer);
        const metadata = await pipeline.metadata();

        if (!metadata.width) {
            throw new Error("No se pudo obtener el ancho de la imagen.");
        }

        // Resize if width > 1200
        if (metadata.width > 1200) {
            pipeline = pipeline.resize({ width: 1600 });
        }

        const format = metadata.format;
        let optimizedBuffer: Buffer;
        let mimeType = "image/jpeg"; // Default

        // Optimize based on original format to preserve extension
        switch (format) {
            case "png":
                optimizedBuffer = await pipeline
                    .png({ quality: 80, compressionLevel: 9, palette: true })
                    .toBuffer();
                mimeType = "image/png";
                break;
            case "webp":
                optimizedBuffer = await pipeline
                    .webp({ quality: 80, effort: 6 })
                    .toBuffer();
                mimeType = "image/webp";
                break;
            case "jpeg":
            case "jpg":
            default:
                optimizedBuffer = await pipeline
                    .jpeg({ quality: 80, mozjpeg: true })
                    .toBuffer();
                mimeType = "image/jpeg";
                break;
        }

        const base64 = `data:${mimeType};base64,${optimizedBuffer.toString("base64")}`;

        // Determine correct extension based on the output mime type
        let finalExtension = ".jpg";
        if (mimeType === "image/png") finalExtension = ".png";
        if (mimeType === "image/webp") finalExtension = ".webp";

        // Get original name without extension
        const originalName = file.name;
        const dotIndex = originalName.lastIndexOf(".");
        const nameWithoutExt = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;

        return {
            success: true,
            data: base64,
            originalSize: file.size,
            newSize: optimizedBuffer.length,
            filename: `${nameWithoutExt}_optimized${finalExtension}`,
        };
    } catch (error) {
        console.error("Error optimizing image:", error);
        return { success: false, error: "Error al optimizar la imagen." };
    }
}
