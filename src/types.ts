export interface BoundingBox {
    top: number,
    right: number,
    bottom: number,
    left: number,
}

export interface Settings {
    width: string;
    height: string;
    maxTexts: number;
    maxAcceleration: number;
    marginTop: number;
    marginBottom: number;
    texts: string[];
    color: string;
    background: string;
    font: string;
    debug: boolean;
}
