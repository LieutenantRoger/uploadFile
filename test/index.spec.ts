// import sinon from'sinon';
// import chai from 'chai';
// import { uploadBigFile, CancelError, uploadChunk } from '../index.ts';

// const expect = chai.expect;

// describe('uploadChunk function', () => {
//     it('should upload a chunk successfully', async () => {
//         const mockChunk = { index: 1 };
//         const onProgressStub = sinon.stub();
//         const result = await uploadChunk({ chunk: mockChunk, onProgress: onProgressStub });
//         expect(onProgressStub.callCount).to.be.greaterThan(0);
//         expect(result.uploadPromise).to.be.instanceOf(Promise);
//     });

//     it('should cancel the upload', async () => {
//         const mockChunk = { index: 1 };
//         const onProgressStub = sinon.stub();
//         const upload = uploadChunk({ chunk: mockChunk, onProgress: onProgressStub });
//         upload.cancel();
//         try {
//             await upload.uploadPromise;
//             expect.fail('Expected upload to be canceled and reject');
//         } catch (error) {
//             expect(error).to.be.instanceOf(CancelError);
//         }
//     });
// });

// describe('uploadBigFile function', () => {
//     let sandbox: sinon.SinonSandbox;

//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     it('should start uploading and call onProgress', () => {
//         const mockFile = [{ index: 1 }, { index: 2 }];
//         const onProgressStub = sandbox.stub();
//         const onFailStub = sandbox.stub();
//         const onSucceedStub = sandbox.stub();
//         const instance = uploadBigFile({
//             file: mockFile,
//             maxConcurrent: 1,
//             onProgress: onProgressStub,
//             onFail: onFailStub,
//             onSucceed: onSucceedStub,
//         });
//         instance.start();
//         expect(onProgressStub.called).to.be.true;
//     });

//     it('should stop uploading', () => {
//         const mockFile = [{ index: 1 }, { index: 2 }];
//         const onProgressStub = sandbox.stub();
//         const onFailStub = sandbox.stub();
//         const onSucceedStub = sandbox.stub();
//         const instance = uploadBigFile({
//             file: mockFile,
//             maxConcurrent: 1,
//             onProgress: onProgressStub,
//             onFail: onFailStub,
//             onSucceed: onSucceedStub,
//         });
//         instance.start();
//         instance.stop();
//         // 可以添加更多断言来验证上传是否真正停止
//     });

//     it('should continue uploading after stopping', () => {
//         const mockFile = [{ index: 1 }, { index: 2 }];
//         const onProgressStub = sandbox.stub();
//         const onFailStub = sandbox.stub();
//         const onSucceedStub = sandbox.stub();
//         const instance = uploadBigFile({
//             file: mockFile,
//             maxConcurrent: 1,
//             onProgress: onProgressStub,
//             onFail: onFailStub,
//             onSucceed: onSucceedStub,
//         });
//         instance.start();
//         instance.stop();
//         instance.continue();
//         expect(onProgressStub.called).to.be.true;
//     });

//     it('should cancel uploading', () => {
//         const mockFile = [{ index: 1 }, { index: 2 }];
//         const onProgressStub = sandbox.stub();
//         const onFailStub = sandbox.stub();
//         const onSucceedStub = sandbox.stub();
//         const instance = uploadBigFile({
//             file: mockFile,
//             maxConcurrent: 1,
//             onProgress: onProgressStub,
//             onFail: onFailStub,
//             onSucceed: onSucceedStub,
//         });
//         instance.start();
//         instance.cancel();
//         // 可以添加更多断言来验证所有的上传操作是否都被取消
//     });

//     it('should handle upload failure', async () => {
//         const mockFile = [{ index: 1 }, { index: 2 }];
//         const onProgressStub = sandbox.stub();
//         const onFailStub = sandbox.stub();
//         const onSucceedStub = sandbox.stub();
//         const instance = uploadBigFile({
//             file: mockFile,
//             maxConcurrent: 1,
//             onProgress: onProgressStub,
//             onFail: onFailStub,
//             onSucceed: onSucceedStub,
//             retryTimes: 0,
//         });

//         const fakeUploadChunk = {
//             uploadPromise: Promise.reject(new Error('Upload failed')),
//             cancel: sandbox.stub(),
//         };
//         sandbox.stub({ uploadChunk }, 'uploadChunk').returns(fakeUploadChunk);

//         instance.start();
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         expect(onFailStub.called).to.be.true;
//     });
// });
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Sample test', () => {
  it('should work', () => {
    expect(true).to.be.true;
  });
})