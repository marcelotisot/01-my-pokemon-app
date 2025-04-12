import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';

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

  it('should create new pokemon', () => {
    const data = { 
      name: 'Pikachu', 
      type: 'Electric' 
    };

    const result = service.create(data);

    expect(result).toBe(`This action adds a ${ data.name }`)
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

});
