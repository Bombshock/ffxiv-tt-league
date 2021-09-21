export type TTLeague = {
    uid: string;
    name: string;
    participants: string[];
    done?: boolean;
    active?: boolean;
    rules?: string;
    archived?: boolean;
    results: {
        player1: string;
        player2: string;
        player1points: number;
        player2points: number;
    }[]
}

export type TTLeagueResult = {
    name: string;
    win: number;
    loss: number;
    draw: number;
    points: number;
    games: number;
}
