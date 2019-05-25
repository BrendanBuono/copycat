
const asyncForEach = async <T, E>(array: Array<T>, callback: (argo0: T) => Promise<E>) => {
    for (const data of array) {
        await callback(data);
    }
}

export default asyncForEach;