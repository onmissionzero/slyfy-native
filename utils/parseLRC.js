export const parseLRC = (lyrics) => {
    const lines = lyrics.split('\n');
    const parsedLyrics = lines.map(line => {
        const match = line.match(/\[(\d+):(\d+(\.\d+)?)\](.+)/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const timestamp = minutes * 60 + seconds;
            return { timestamp, text: match[4] };
        }
        return null;
    }).filter(Boolean);
    return parsedLyrics;
};
