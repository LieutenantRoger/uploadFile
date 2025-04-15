import sinon from'sinon';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { uploadBigFile, CancelError, uploadChunk } from '../index.ts';

describe('uploadChunk function', () => {
    it('should upload a chunk successfully', async () => {
        const mockChunk = { index: 1 };
        const onProgressStub = sinon.stub();
        const result = await uploadChunk({ chunk: mockChunk, onProgress: onProgressStub }).uploadPromise;
        expect(onProgressStub.callCount).to.be.greaterThan(0);
    });

    it('should cancel the upload', async () => {
        const mockChunk = { index: 1 };
        const onProgressStub = sinon.stub();
        const upload = uploadChunk({ chunk: mockChunk, onProgress: onProgressStub });
        upload.cancel();
        try {
            await upload.uploadPromise;
            expect.fail('Expected upload to be canceled and reject');
        } catch (error) {
            expect(error).to.be.instanceOf(CancelError);
        }
    });
});

describe('uploadBigFile function', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should start uploading and call onProgress', async () => {
        const mockFile = [1, 2];
        const onProgressStub = sandbox.stub();
        const onFailStub = sandbox.stub();
        const onSucceedStub = sandbox.stub();
        const instance = uploadBigFile({
            file: mockFile,
            maxConcurrent: 2,
            onProgress: onProgressStub,
            onFail: onFailStub,
            onSucceed: onSucceedStub,
        });
        instance.start();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(onProgressStub.called).to.be.true;
    });

    it('should stop uploading', () => {
        const mockFile = [1, 2];
        const onProgressStub = sandbox.stub();
        const onFailStub = sandbox.stub();
        const onSucceedStub = sandbox.stub();
        const instance = uploadBigFile({
            file: mockFile,
            maxConcurrent: 1,
            onProgress: onProgressStub,
            onFail: onFailStub,
            onSucceed: onSucceedStub,
        });
        instance.start();
        instance.stop();
        // 可以添加更多断言来验证上传是否真正停止
    });

    it('should continue uploading after stopping', async () => {
      const mockFile = [1, 2];
      const onProgressStub = sandbox.stub();
        const onFailStub = sandbox.stub();
        const onSucceedStub = sandbox.stub();
        const instance = uploadBigFile({
            file: mockFile,
            maxConcurrent: 1,
            onProgress: onProgressStub,
            onFail: onFailStub,
            onSucceed: onSucceedStub,
        });
        instance.start();
        instance.stop();
        instance.continue();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(onProgressStub.called).to.be.true;
    });

    it('should cancel uploading', async () => {
      const mockFile = [1, 2];
      const onProgressStub = sandbox.stub();
        const onFailStub = sandbox.stub();
        const onSucceedStub = sandbox.stub();
        const instance = uploadBigFile({
            file: mockFile,
            maxConcurrent: 1,
            onProgress: onProgressStub,
            onFail: onFailStub,
            onSucceed: onSucceedStub,
        });
        instance.start();
        await new Promise((resolve) => setTimeout(resolve, 500));

        instance.cancel();
        expect(onProgressStub.called).to.be.true;
        expect(onSucceedStub.called).to.be.false;
    });
});