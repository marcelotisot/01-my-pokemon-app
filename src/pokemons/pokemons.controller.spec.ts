import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from '../shared/dtos/pagination.dto';

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test metodo findAll
  it('should have called the service with correct parameters', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    // Espia: crea espia que este pendiente del servicio
    jest.spyOn(service, 'findAll');

    await controller.findAll(dto);

    // Verifica que findAll haya sido llamado
    expect(service.findAll).toHaveBeenCalled();
    // Verificar que haya sido llamado con la informacion del dto
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });
});
