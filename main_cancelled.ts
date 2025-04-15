import { uploadBigFile } from "./index.ts";

// 模拟文件
const mockFile = Array.from({ length: 50 }, (_, i) => ({ index: i }));

// 模拟取消的场景
const simulateUploadCancel = () => {
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

    // 模拟取消操作
    setTimeout(() => {
        uploadInstance.cancel();
        console.log('Upload canceled');
    }, 1000); // 延迟一段时间后取消上传
};


// 运行模拟取消的场景
simulateUploadCancel();