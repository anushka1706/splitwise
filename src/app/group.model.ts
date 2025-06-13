export interface Group {
    id: number,
    name: string,
    members: any[],
    expenses?: { [key: string]: any },
    settle?: any[]
}
