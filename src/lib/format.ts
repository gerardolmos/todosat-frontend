export function formatLabel(value?: string | null) {
    if (!value) return "";

    const labels: Record<string, string> = {
        guia: "Guía",
        review: "Review",
        noticia: "Noticia",
        comparativa: "Comparativa",
        espanol: "Español",
        ingles: "Inglés",
        catalan: "Catalán",
    };

    return labels[value] || value;
}