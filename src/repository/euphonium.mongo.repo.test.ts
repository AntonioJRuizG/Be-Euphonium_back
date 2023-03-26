import { EuphoniumsMongoRepo } from './euphonium.mongo.repo';
import { EuphoniumModel } from './euphonium.mongo.model';
import { Euphonium } from '../entities/euphonium';

jest.mock('./euphonium.mongo.model.js');

const mockPopulate = (mockPopulateParameter: unknown) => ({
  populate: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(mockPopulateParameter),
  })),
});

const mockPopulateWOExec = (mockPopulateParameter: unknown) => ({
  populate: jest.fn().mockResolvedValue(mockPopulateParameter),
});

const mockLimitSkipPopulateExec = (mockPopulateParameter: unknown) => ({
  limit: jest.fn().mockImplementation(() => ({
    skip: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockPopulateParameter),
      })),
    })),
  })),
});

describe('Given EuphoniumsMongoRepo', () => {
  const repo = EuphoniumsMongoRepo.getInstance();
  test('Then it should be instantiated', () => {
    expect(repo).toBeInstanceOf(EuphoniumsMongoRepo);
  });

  describe('When I use query', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockPopulate([{ id: '1' }, { id: '2' }])
      );
      const result = await repo.query();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When I use queryFiltered', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockLimitSkipPopulateExec([{ id: '1' }, { id: '2' }])
      );
      const result = await repo.queryFiltered('test-offset', 'test-value');
      expect(EuphoniumModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });

    test('Then it should throw error if no data returns', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockLimitSkipPopulateExec(null)
      );

      expect(async () => repo.queryFiltered('', '')).rejects.toThrow();
    });
  });

  describe('When I use queryPaginated', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockLimitSkipPopulateExec([{ id: '1' }, { id: '2' }])
      );
      const result = await repo.queryPaginated('test-offset');
      expect(EuphoniumModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });

    test('Then it should throw error if no data returns', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockLimitSkipPopulateExec(null)
      );

      expect(async () => repo.queryPaginated('')).rejects.toThrow();
    });
  });

  describe('When I use queryId', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulate({ id: '1' })
      );
      const result = await repo.queryId('1');
      expect(EuphoniumModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then it should throw error if no data returns', async () => {
      (EuphoniumModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulate(null)
      );

      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When I use search', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.find as jest.Mock).mockImplementation(() =>
        mockPopulate([{ id: '1' }])
      );
      const result = await repo.search({ key: 'test', value: 'test' });
      expect(EuphoniumModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When I use create', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.create as jest.Mock).mockImplementation(() =>
        mockPopulateWOExec({ id: '1' })
      );
      const result = await repo.create({ id: '1' });
      expect(EuphoniumModel.create).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When I use update', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulate({ id: '1' })
      );
      const result = await repo.update({ id: '1' });
      expect(EuphoniumModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then should throw error if return no data', async () => {
      const mockEuphonium = { id: 'test' } as Partial<Euphonium>;
      (EuphoniumModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulate(null)
      );
      expect(async () => repo.update(mockEuphonium)).rejects.toThrow();
    });
  });

  describe('When I use destroy', () => {
    test('Then should return the data', async () => {
      (EuphoniumModel.findByIdAndDelete as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);
      await repo.remove('1');
      expect(EuphoniumModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then should throw error if no data return', async () => {
      (EuphoniumModel.findByIdAndDelete as jest.Mock).mockImplementation(
        undefined
      );
      const result = repo.remove('1');
      await expect(result).rejects.toThrow();
    });
  });
});
