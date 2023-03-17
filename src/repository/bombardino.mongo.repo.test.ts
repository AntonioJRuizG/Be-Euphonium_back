import { BombardinosMongoRepo } from './bombardino.mongo.repo';
import { BombardinoModel } from './bombardino.mongo.model';
import { Bombardino } from '../entities/bombardino';

jest.mock('./bombardino.mongo.model.js');

const mockPopulate = (mockPopulateParameter: unknown) => ({
  populate: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(mockPopulateParameter),
  })),
});

describe('Given BombardinosMongoRepo', () => {
  const repo = BombardinosMongoRepo.getInstance();
  test('Then it should be instantiated', () => {
    expect(repo).toBeInstanceOf(BombardinosMongoRepo);
  });

  describe('When I use query', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.find as jest.Mock).mockImplementation(() =>
        mockPopulate([{ id: '1' }, { id: '2' }])
      );
      const result = await repo.query();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When I use queryId', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulate({ id: '1' })
      );
      const result = await repo.queryId('1');
      expect(BombardinoModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then it should throw error if no date returns', async () => {
      (BombardinoModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulate(null)
      );

      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When I use search', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.find as jest.Mock).mockImplementation(() =>
        mockPopulate([{ id: '1' }])
      );
      const result = await repo.search({ key: 'test', value: 'test' });
      expect(BombardinoModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When I use create', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.create as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await repo.create({ id: '1' });
      expect(BombardinoModel.create).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When I use update', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulate({ id: '1' })
      );
      const result = await repo.update({ id: '1' });
      expect(BombardinoModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then should throw error if return no data', async () => {
      const mockBombardino = { id: 'test' } as Partial<Bombardino>;
      (BombardinoModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulate(null)
      );
      expect(async () => repo.update(mockBombardino)).rejects.toThrow();
    });
  });

  describe('When I use destroy', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findByIdAndDelete as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);
      await repo.remove('1');
      expect(BombardinoModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then should throw error if no data return', async () => {
      (BombardinoModel.findByIdAndDelete as jest.Mock).mockImplementation(
        undefined
      );
      const result = repo.remove('1');
      await expect(result).rejects.toThrow();
    });
  });
});
