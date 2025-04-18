import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new pokemon', async () => {
    const data = { 
      name: 'Pikachu', 
      type: 'Electric' 
    };

    const result = await service.create(data);

    expect(result).toEqual({
      hp: 0,
      id: expect.any(Number),
      name: 'Pikachu',
      sprites: [],
      type: 'Electric'
    })
  });

  // Verificar el cache
  it('should throw an error if pokemon exists', async () => {
    const data = { name: 'Pikachu', type: 'Electric' };
    await service.create(data);

    try {
      await service.create(data);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(`Pokemon with name ${data.name} already exists`);
    }
    
    // Asegurarnos que se va a recibir un BadRequestException
    //await expect(service.create(data)).rejects.toThrow(BadRequestException);
  });

  // Verificar respuesta del metodo findOne
  it('should return pokemon if exists', async () => {

    const id = 4;
    const result = await service.findOne(id);

    // Datos esperados
    expect(result.name).toEqual('charmander');
    expect(result.type).toEqual('fire');
    expect(result.hp).toEqual(39);
  });

  // Verificar not found
  it('should return 404 if pokemon dont exists', async () => {
    const id = 400000;

    // Verificar que la respuesta lanze NotFoundException
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

    // Verificar el mensaje
    await expect(service.findOne(id)).rejects.toThrow(
      `Pokemon with id ${id} not found`
    );
  });

  it('should return a pokemon from cache', async () => {
    const cacheSpy = jest.spyOn(service.pokemonsCache, 'get');

    const id = 1;

    await service.findOne(id);
    await service.findOne(id);

    expect(cacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should check properties of the pokemon', async () => {

    const id = 4;
    const pokemon = await service.findOne(id);
    
    // Verificar que existan las propiedades en la respuesta
    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');

    // Verificar que la propiedad hp sea un numero
    expect(pokemon).toEqual(
      expect.objectContaining({
        id: id,
        hp: expect.any(Number), // Espera cualquier numero
      })
    );

  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });

    // Verifica que sea la instancia de un arreglo
    expect(pokemons).toBeInstanceOf(Array);

    // Verifica que vengan 10 registros
    expect(pokemons.length).toBe(10);
    
    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    //expect(service.paginatedPokemonsCache.has('10-1')).toBe(pokemons);
  });

  it('should return pokemons from cache', async () => {
    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get');
    const fetchSpy = jest.spyOn(global, 'fetch');

    await service.findAll({ limit: 10, page: 1 });
    await service.findAll({ limit: 10, page: 1 });

    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith('10-1');

    expect(fetchSpy).toHaveBeenCalledTimes(11);
  });


  it('should update pokemon', async () => {

    const id = 1;
    const dto: UpdatePokemonDto = { name: 'Charmander 2' };

    const updatedPokemon = await service.update(id, dto);

    expect(updatedPokemon).toEqual({
        id: 1,
        name: dto.name,
        type: 'grass',       
        hp: 45,
        sprites: [
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png'
        ]
    });

  });

  it('should not update pokemon if not exists', async () => {

    const id = 1_000_000;
    const dto: UpdatePokemonDto = { name: 'Charmander 2' };

    try {
      await service.update(id, dto);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Pokemon with id ${id} not found`)
    }
  
  });

  it('should remove pokemon from cache', async () => {

    const id = 1;
    await service.findOne(id);

    await service.remove(id);

    expect(service.pokemonsCache.get(id)).toBeUndefined();
  
  });

});
