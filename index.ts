// 自定义取消错误类
export class CancelError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CancelError';
    }
}

// 判断是否为取消错误
const isCancelError = (error: any): boolean => error instanceof CancelError;

// 上传单个分片
const uploadChunk = ({ chunk, onProgress }: { chunk: any; onProgress: (progress: number) => void }) => {
    let isCanceled = false;
    let counter = 0;
    const maxCounter = 100;
    const uploadPromise = new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            if (isCanceled) {
                clearInterval(timer);
                reject(new CancelError('Upload canceled'));
                return;
            }
            counter += 20;
            const progress = Math.min((counter / maxCounter) * 100, 100);
            onProgress((progress / 100));
            if (progress >= 100) {
                clearInterval(timer);
                // To test the failed scenario - comment out line#32, and uncomment line#33
                // resolve(`Chunk ${chunk.index} uploaded`);
                reject(`Chunk ${chunk.index} upload failed`);
            }
        }, 200);
    });

    return {
        uploadPromise,
        cancel: () => {
            isCanceled = true;
        },
    };
};

interface UploadBigFile {
    (payload: {
        file: any[];
        maxConcurrent: number;
        onProgress: (progress: number) => void;
        onFail: (error: Error) => void;
        onSucceed: () => void;
        retryTimes?: number;
    }): {
        start: () => void;
        stop: () => void;
        continue: () => void;
        cancel: () => void;
    };
}

const uploadBigFile: UploadBigFile = ({
    file,
    maxConcurrent,
    onProgress,
    onFail,
    onSucceed,
    retryTimes = 3
}) => {
    let current = 0;
    let concurrentRequest = 0;
    let stopped = false;
    let canceled = false;
    let failed = false;
    let completedChunks = 0;
    const chunkPromises: { promise: Promise<any>; cancel: () => void }[] = [];
    const chunkProgresses: number[] = new Array(file.length).fill(0);

    const uploadSingleChunk = async (chunkIndex: number) => {
        const chunk = file[chunkIndex];
        let attempts = 0;
        while (attempts < retryTimes) {
            const chunkUpload = uploadChunk({
                chunk,
                onProgress: (chunkProgress) => {
                    chunkProgresses[chunkIndex] = chunkProgress / 100;
                    const totalProgress = chunkProgresses.reduce((sum, progress) => sum + progress, completedChunks);
                    const overallProgress = totalProgress / file.length;
                    onProgress(overallProgress);
                }
            });
            chunkPromises.push({
                promise: chunkUpload.uploadPromise,
                cancel: chunkUpload.cancel,
            });

            try {
                await chunkUpload.uploadPromise;
                completedChunks++;
                break;
            } catch (error) {
                chunkProgresses[chunkIndex] = 0;
                if (isCancelError(error)) {
                    return;
                }
                attempts++;
                if (attempts === retryTimes) {
                    failed = true;
                    onFail(error as Error);
                    return;
                }
            }
        }
    };

    const startUpload = () => {
        if (canceled || failed) return;
        while (concurrentRequest < maxConcurrent && current < file.length && !stopped) {
            const currentChunkIndex = current;
            uploadSingleChunk(currentChunkIndex).finally(() => {
                concurrentRequest--;
                if (completedChunks === file.length && concurrentRequest === 0 && !failed) {
                    onProgress(1);
                    onSucceed();
                }
                startUpload();
            });
            current++;
            concurrentRequest++;
        }
    };

    return {
        start: () => {
            stopped = false;
            startUpload();
        },
        stop: () => {
            stopped = true;
        },
        continue: () => {
            stopped = false;
            startUpload();
        },
        cancel: () => {
            canceled = true;
            chunkPromises.forEach(({ cancel }) => cancel());
        },
    };
};

export { uploadBigFile, uploadChunk }
