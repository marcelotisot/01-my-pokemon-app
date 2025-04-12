import { validate } from "class-validator";
import { CreatePokemonDto } from "./create-pokemon.dto";

describe('CreatePokemonDto', () => {

  // Debe ser valido con los datos correctos
  it('should be valid with correct data', async () => {
    
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);

  });

  // Debe dar error si el nombre no esta presente
  it('should be invalid if name if not present', async () => {
    
    const dto = new CreatePokemonDto();

    //dto.name = 'Pikachu';
    dto.type = 'Electric';

    const errors = await validate(dto);

    // Tomar solo el name
    const nameError = errors.find(error => error.property === 'name');

    expect(nameError).toBeDefined();

  });

  // Debe dar error si el type no esta presente
  it('should be invalid if type if not present', async () => {
    
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    //dto.type = 'Electric';

    const errors = await validate(dto);

    // Tomar solo el name
    const typeError = errors.find(error => error.property === 'type');

    expect(typeError).toBeDefined();

  });

  // La propiedad hp debe ser un numero positivo
  it('should hp must be positive number', async () => {

    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.hp = -10;

    const errors = await validate(dto);
    const hpError = errors.find(error => error.property === 'hp');
    const constraints = hpError?.constraints;

    expect(hpError).toBeDefined();
    expect(constraints).toEqual({ min: 'hp must not be less than 0' })

  });

  // Lanza error si en la propiedad sprites no se mandan strings
  it('should be invalid with non-string sprites', async () => {
    
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.sprites = [123, 456] as unknown as string[];

    const errors = await validate(dto);

    // Tomar solo el name
    const spritesError = errors.find(error => error.property === 'sprites');

    expect(spritesError).toBeDefined();

  });

  // Si se manda strings en la propiedad sprites no debe lanzar ningun error
  it('should be valid with string sprites', async () => {
    
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.sprites = ['sprite1.png', 'sprite2.png'];

    const errors = await validate(dto);

    // Tomar solo el name
    const spritesError = errors.find(error => error.property === 'sprites');

    expect(spritesError).toBe(undefined);

  });

});
