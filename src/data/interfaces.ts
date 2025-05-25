

export interface Note {
    id: string;
    title: string;
    content: string;
    labels: string[];
    codeBlocks: string[];
    createdAt: Date;
    status: string;
}


export interface Label {
    id: string;
    name: string;
}

