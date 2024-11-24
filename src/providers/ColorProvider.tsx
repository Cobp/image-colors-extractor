"use client";
import React, { createContext, useContext, useState } from "react";

// Definir tipos para color, provider, y contexto
interface Color {
    rgb: string;
    hex: string;
    luminosity: number;
}
interface Notification {
    message: string;
    status: number;
}

interface ColorContextType {
    colors: Color[];
    setColors: React.Dispatch<React.SetStateAction<Color[]>>;
    file: string | null;
    setFile: React.Dispatch<React.SetStateAction<string | null>>
    nameImage: string | null;
    setNameImage: React.Dispatch<React.SetStateAction<string | null>>
    notification: Notification[];
    setNotification: React.Dispatch<React.SetStateAction<Notification[]>>
    processImageFile: (file: File) => void;
    updateColor: (index: number, newColor: Color) => void;
    clearColorsAndFile: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

// Hook para acceder al contexto de ColorProvider
export const useColorProvider = (): ColorContextType => {
    const context = useContext(ColorContext);
    if (!context) {
        throw new Error("useColorProvider must be used within a ColorProvider");
    }
    return context;
};

export const ColorProvider = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    const [colors, setColors] = useState<Color[]>([]);
    const [file, setFile] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification[]>([])
    const [nameImage, setNameImage] = useState<string | null>(null);


    const processImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                setFile(result);
                extractColors(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const extractColors = (src: string) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const maxDimension = 100;
            const scale = Math.min(maxDimension / image.width, maxDimension / image.height);
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            if (imageData) {
                const pixels = [];
                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    pixels.push([r, g, b]);
                }

                const topColors = getTopColors(pixels, 5);
                const colorData = topColors
                    .map((color) => ({
                        rgb: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                        hex: rgbToHex(color[0], color[1], color[2]),
                        luminosity: getLuminosity(color[0], color[1], color[2]),
                    }))
                    .sort((a, b) => a.luminosity - b.luminosity);

                setColors(colorData);
            }
        };
    };

    const getTopColors = (pixels: number[][], k: number) => {
        const centroids = initializeCentroids(pixels, k);
        const maxIterations = 10;
        let clusters;

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            clusters = assignPixelsToClusters(pixels, centroids);
            const newCentroids = recomputeCentroids(clusters);
            if (areCentroidsEqual(centroids, newCentroids)) break;
            centroids.length = 0;
            centroids.push(...newCentroids);
        }
        return centroids;
    };
    const initializeCentroids = (pixels: number[][], k: number) => {
        const centroids = [];
        const uniquePixels = Array.from(new Set(pixels.map((p) => p.join(","))), (p) =>
            p.split(",").map(Number)
        );

        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * uniquePixels.length);
            centroids.push(uniquePixels[randomIndex]);
        }
        return centroids;
    };

    const assignPixelsToClusters = (pixels: number[][], centroids: number[][]) => {
        const clusters: number[][][] = Array.from({ length: centroids.length }, () => []);

        pixels.forEach((pixel) => {
            const distances = centroids.map((centroid) => euclideanDistance(pixel, centroid));
            const nearestCentroidIndex = distances.indexOf(Math.min(...distances));
            clusters[nearestCentroidIndex].push(pixel);
        });
        return clusters;
    };

    const recomputeCentroids = (clusters: number[][][]) => {
        return clusters.map((cluster) => {
            const centroid = [0, 0, 0];
            cluster.forEach((pixel) => {
                centroid[0] += pixel[0];
                centroid[1] += pixel[1];
                centroid[2] += pixel[2];
            });
            centroid[0] = Math.round(centroid[0] / cluster.length);
            centroid[1] = Math.round(centroid[1] / cluster.length);
            centroid[2] = Math.round(centroid[2] / cluster.length);
            return centroid;
        });
    };

    const areCentroidsEqual = (centroids1: number[][], centroids2: number[][]) => {
        return centroids1.every(
            (c, i) =>
                c[0] === centroids2[i][0] && c[1] === centroids2[i][1] && c[2] === centroids2[i][2]
        );
    };

    const euclideanDistance = (pixel1: number[], pixel2: number[]) => {
        return Math.sqrt(
            Math.pow(pixel1[0] - pixel2[0], 2) +
            Math.pow(pixel1[1] - pixel2[1], 2) +
            Math.pow(pixel1[2] - pixel2[2], 2)
        );
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const getLuminosity = (r: number, g: number, b: number) => {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const updateColor = (index: number, newColor: Color) => {
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[index] = newColor;
            return updatedColors;
        });
    };

    const clearColorsAndFile = () => {
        setColors([]);
        setFile(null);
    };

    return (
        <ColorContext.Provider value={{
            colors,
            setColors,
            file,
            setFile,
            processImageFile,
            nameImage,
            setNameImage,
            notification,
            setNotification,
            updateColor,
            clearColorsAndFile,
        }
        }>
            {children}
        </ColorContext.Provider>
    );
};
