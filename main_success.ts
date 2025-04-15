import { uploadBigFile } from "./index.ts";

// 模拟文件
const mockFile = Array.from({ length: 50 }, (_, i) => ({ index: i }));

// 调用 uploadBigFile 方法
const uploadInstance = uploadBigFile({
    file: mockFile,
    maxConcurrent: 5,
    onProgress: (progress) => {
        console.log(`Upload progress: ${(progress * 100).toFixed(2)}%`);
    },
    onFail: (error) => {
        console.error('Upload failed:', error);
    },
    onSucceed: () => {
        console.log('Upload succeeded');
    },
    retryTimes: 2,
});

// 开始上传
uploadInstance.start();