export interface Group {
    id: number,
    name: string,
    members: any[],
    expenses?: any[],
    settle?: any[]
    logs?: any[],
    netBalance?: {
        [memberId: number]: {
            name: string;
            youPaid: number;
            youShare: number;
            totalDiff: number;
        };
    };
}
