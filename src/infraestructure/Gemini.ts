'use server';

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getPlaceDetails(cityName: string) {
   try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Proporciona información sobre la ciudad de ${cityName} en español.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              descripcion: {
                type: Type.STRING,
                description: "Una breve descripción de la ciudad.",
              },
              sitiosInteres: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Una lista de sitios de interés.",
              },
            },
            required: ["descripcion", "sitiosInteres"],
          },
        },
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        return data;
      } else {
        throw new Error("No se recibió respuesta del modelo.");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Error al obtener detalles del lugar.");
    }
}