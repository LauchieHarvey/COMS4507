export const formatHashString = (hash: string | undefined) => {
    return hash ? `${hash.slice(0, 10)}...` : 'unknown';
}