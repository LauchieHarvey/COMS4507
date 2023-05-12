export const formatHashString = (hash: string | undefined) => {
    return hash ? `${hash.slice(0, 10)}...` : 'unknown';
}

export const formatTime = (timestamp: number | undefined) => {
    if (timestamp == undefined) {
        return 'unknown';
    }
    try {
        return (new Date(timestamp * 1000)).toLocaleDateString();
    } catch (err) {
        return 'unknown';
    }
}