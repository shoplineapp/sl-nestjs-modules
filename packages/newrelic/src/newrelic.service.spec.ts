import { of, throwError } from 'rxjs';
import { NEWRELIC } from './newrelic.constant';
import { NewrelicService } from './newrelic.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('NewrelicService', () => {
  let service: NewrelicService;

  const transactionMock = {
    end: jest.fn(),
  };

  const newrelicMock = {
    startWebTransaction: jest
      .fn()
      .mockImplementation((handlerName, handler) => {
        return handler();
      }),
    getTransaction: jest.fn().mockReturnValue(transactionMock),
    startBackgroundTransaction: jest
      .fn()
      .mockImplementation((handlerName, handler) => {
        return handler();
      }),
    noticeError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NEWRELIC,
          useValue: newrelicMock,
        },
        NewrelicService,
      ],
    }).compile();

    service = module.get<NewrelicService>(NewrelicService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('interceptWebTransaction', () => {
    test('should call newrelic correctly if no error', (done: any) => {
      const handler = jest.fn().mockImplementationOnce(() => {
        return of('result');
      });
      const observableResult = service.interceptWebTransaction(
        'testHandler',
        handler,
      );

      expect(newrelicMock.startWebTransaction).toHaveBeenCalledTimes(1);
      expect(newrelicMock.getTransaction).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledTimes(1);

      observableResult.subscribe({
        complete: () => {
          expect(transactionMock.end).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    test('should call newrelic correctly if error', (done: any) => {
      const handler = jest.fn().mockImplementationOnce(() => {
        return throwError(() => new Error('error'));
      });
      const observableResult = service.interceptWebTransaction(
        'testHandler',
        handler,
      );

      expect(newrelicMock.startWebTransaction).toHaveBeenCalledTimes(1);
      expect(newrelicMock.getTransaction).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledTimes(1);

      observableResult.subscribe({
        error: (err) => {
          expect(transactionMock.end).toHaveBeenCalledTimes(1);
          expect(newrelicMock.noticeError).toHaveBeenCalledWith(err);
          expect(newrelicMock.noticeError).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });

  describe('startBackgroundTransactionAsync', () => {
    test('should call newrelic correctly', async () => {
      const handler = jest.fn().mockResolvedValueOnce('result');
      await service.startBackgroundTransactionAsync('testHandler', handler);

      expect(newrelicMock.startBackgroundTransaction).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('should handle error', async () => {
      const handler = jest.fn().mockRejectedValueOnce('error');
      await expect(
        service.startBackgroundTransactionAsync('testHandler', handler),
      ).rejects.toEqual('error');

      expect(newrelicMock.startBackgroundTransaction).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
