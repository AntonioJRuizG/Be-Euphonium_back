import { BombardinosMongoRepo } from './bombardino.mongo.repo';
import { BombardinoModel } from './bombardino.mongo.model';

jest.mock('./bombardino.mongo.model');

describe('Given BombardinosMongoRepo', () => {
  const repo = BombardinosMongoRepo.getInstance();
  test('Then it should be instantiated', () => {
    expect(repo).toBeInstanceOf(BombardinosMongoRepo);
  });

  describe('When I use query', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.find as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await repo.query();
      expect(BombardinoModel.find).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When I use queryId', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findById as jest.Mock).mockResolvedValue('[]');
      const result = await repo.queryId('1');
      expect(BombardinoModel.findById).toHaveBeenCalled();
      expect(result).toEqual('[]');
    });
  });

  describe('When I use create', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.create as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "name": "test"}]'
      );
      const result = await repo.create({ id: '2', manufacturer: 'test-2' });
      expect(BombardinoModel.create).toHaveBeenCalled();
      expect(result).toEqual('[{ "id": "1", "name": "test"}]');
    });
  });

  describe('When I use update', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "name": "test"}]'
      );
      const result = await repo.update({
        id: '1',
        manufacturer: 'test-update',
      });
      expect(BombardinoModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual('[{ "id": "1", "name": "test"}]');
    });
  });

  describe('When I use destroy', () => {
    test('Then should return the data', async () => {
      (BombardinoModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        '[{ "id": 1, "name": "test"}]'
      );
      const result = await repo.remove('1');
      expect(BombardinoModel.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });
});
