export interface HelpTutorialStep {
    id: number;
    titulo: string;
    descripcion: string;
    imagen?: string;
    icono: string;
    recomendacion?: string;
}

export interface HelpTutorial {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    icono: string;
    duracion: string;
    tipo: 'INTERACTIVO' | 'TEXTO';
    pasos: HelpTutorialStep[];
}