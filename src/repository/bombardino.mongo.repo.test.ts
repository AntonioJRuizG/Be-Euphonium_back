import { BombardinosMongoRepo } from './bombardino.mongo.repo';
import { BombardinoModel } from './bombardino.mongo.model';

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
  });
});

/* S

import { GuitarStructure } from '../entities/guitar.model';
import { GuitarModel } from './guitars.mongo.model';
import { GuitarsMongoRepo } from './guitars.mongo.repo';

jest.mock('./guitars.mongo.model.js');

describe('Given the repository GuitarsMongoRepo', () => {
  const repo = new GuitarsMongoRepo();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    exec: jest.fn().mockResolvedValue(mockPopulateValue),
  });

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of GuitarsMongoRepo', () => {
      expect(repo).toBeInstanceOf(GuitarsMongoRepo);
    });
  });

  describe('When the read method is used', () => {
    test('Then it should return the mock result of the guitars', async () => {
      const mockPopulateValue = [{ id: '1' }, { id: '2' }];

      (GuitarModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.read();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When the readId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '1' };

      (GuitarModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.readId('1');
      expect(GuitarModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (GuitarModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.readId('')).rejects.toThrow();
    });
  });

  describe('When the create method is used', () => {
    test('Then if there is a mock object to create, it should return the created object', async () => {
      (GuitarModel.create as jest.Mock).mockResolvedValue({
        brand: 'test',
      });

      const result = await repo.create({ brand: 'test' });
      expect(result).toEqual({ brand: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockGuitar = {
      brand: 'test',
    } as Partial<GuitarStructure>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { brand: 'test' };

      (GuitarModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.update(mockGuitar);
      expect(result).toEqual({ brand: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (GuitarModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.update(mockGuitar)).rejects.toThrow();
    });
  });

  describe('When the erase method is used', () => {
    test('Then if it has an object to erase with its ID, the findByIdAndDelete function should be called', async () => {
      const mockPopulateValue = {};
      (GuitarModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      await repo.erase('1');
      expect(GuitarModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (GuitarModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      expect(async () => repo.erase('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      const mockPopulateValue = [{ id: '1' }];

      (GuitarModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });
}); */
