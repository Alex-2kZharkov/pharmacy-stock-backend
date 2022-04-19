import { Test, TestingModule } from '@nestjs/testing';
import { MedicineSalesController } from './medicine-sales.controller';
import { MedicineSalesService } from './medicine-sales.service';

describe('MedicineSalesController', () => {
  let controller: MedicineSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineSalesController],
      providers: [MedicineSalesService],
    }).compile();

    controller = module.get<MedicineSalesController>(MedicineSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
