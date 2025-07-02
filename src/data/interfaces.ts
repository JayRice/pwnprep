export interface Note {
    id: string;
    title: string;
    content: {
        id: string
        content: string;
        type: string;
    }[];
    labels: string[];
    createdAt: Date;
    status: string;
}


export interface Label {
    id: string;
    name: string;
    parentLabel: string | null;
    childLabels: string[];
    depth: number;
}

export interface Message  {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
    type:string;
}

export interface Conversation {
    messages: Message[];     // full conversation
    updatedAt: string;

}

export interface CustomParam {
    name: string;
    placeholder: string;
    value: string;
    id: string;
}

export interface Certification  {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
}

export interface Subscription {
    status: string;
    subscription_id: string;
    start_date: number;
    current_period_end: number;
}
