import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PokemonsModule } from "./pokemons/pokemons.module";
import { AppModule } from "./app.module";

// Asegurar que app.module este configurado de la manera esperada
describe('AppModule', () => {

  // Preparacion
  let appController: AppController;
  let appService: AppService;
  let pokemonsModule: PokemonsModule;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController  = moduleRef.get<AppController>(AppController);
    appService     = moduleRef.get<AppService>(AppService);
    pokemonsModule = moduleRef.get<PokemonsModule>(PokemonsModule);
  });

  // Asegurarse de que cada componente este definido
  it('should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(pokemonsModule).toBeDefined();
  });

});
