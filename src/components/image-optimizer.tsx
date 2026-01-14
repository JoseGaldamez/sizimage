"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, Image as ImageIcon, Loader2, X, CheckCircle2 } from "lucide-react";
import { optimizeImage } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function ImageOptimizer() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [result, setResult] = useState<{
        data: string;
        originalSize: number;
        newSize: number;
        filename: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
    });

    const handleOptimize = async () => {
        if (!file) return;

        setIsOptimizing(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await optimizeImage(formData);
            if (res.success && res.data) {
                setResult({
                    data: res.data,
                    originalSize: res.originalSize!,
                    newSize: res.newSize!,
                    filename: res.filename!,
                });
            } else {
                setError(res.error || "Error al optimizar la imagen.");
            }
        } catch (e) {
            setError("Error de conexión.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Optimizador de Imágenes
                    </h1>
                    <p className="text-zinc-400">
                        Reduce el peso de tus imágenes sin perder calidad.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Dropzone */}
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300",
                                        isDragActive
                                            ? "border-indigo-500 bg-indigo-500/10"
                                            : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    <div className="p-4 rounded-full bg-zinc-800 group-hover:scale-110 transition-transform duration-300 mb-4">
                                        <Upload className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <p className="text-lg font-medium text-zinc-200">
                                        Arrastra tu imagen o haz clic para seleccionar
                                    </p>
                                    <p className="text-sm text-zinc-500 mt-2">
                                        solo archivos .png, .jpg, .jpeg y .webp
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800"
                            >
                                <button
                                    onClick={reset}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Original Preview */}
                                    <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800">
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-4">
                                            {preview && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-zinc-400 mb-1">Original</p>
                                            <p className="text-lg font-semibold text-white">
                                                {formatBytes(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action / Result Area */}
                                    <div className="p-6 flex flex-col items-center justify-center bg-zinc-900/30">
                                        {!result ? (
                                            <div className="text-center space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        Lista para optimizar
                                                    </h3>
                                                    <p className="text-sm text-zinc-400">
                                                        Se redimensionará a máx 1200px
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleOptimize}
                                                    disabled={isOptimizing}
                                                    className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isOptimizing ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            Optimizando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="w-5 h-5" />
                                                            Optimizar Imagen
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-6 w-full">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-white mb-1">
                                                        ¡Optimización Completa!
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm font-medium">
                                                        <span>-{Math.round((1 - result.newSize / result.originalSize) * 100)}% de reducción</span>
                                                    </div>
                                                </div>

                                                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                                                    <p className="text-sm font-medium text-zinc-400 mb-1">Nuevo Peso</p>
                                                    <p className="text-2xl font-bold text-white">
                                                        {formatBytes(result.newSize)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        import("file-saver").then((module) => {
                                                            const saveAs = module.default;

                                                            // Convert base64 to blob
                                                            const byteString = atob(result.data.split(',')[1]);
                                                            const mimeString = result.data.split(',')[0].split(':')[1].split(';')[0];
                                                            const ab = new ArrayBuffer(byteString.length);
                                                            const ia = new Uint8Array(ab);
                                                            for (let i = 0; i < byteString.length; i++) {
                                                                ia[i] = byteString.charCodeAt(i);
                                                            }
                                                            const blob = new Blob([ab], { type: mimeString });

                                                            // Determine extension from mime if missing in filename
                                                            let filename = result.filename;
                                                            if (!filename || !filename.includes('.')) {
                                                                const ext = mimeString.split('/')[1] === 'jpeg' ? 'jpg' : mimeString.split('/')[1];
                                                                filename = `${filename || 'imagen_optimizada'}.${ext}`;
                                                            }

                                                            saveAs(blob, filename);
                                                        });
                                                    }}
                                                    className="w-full py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Descargar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
