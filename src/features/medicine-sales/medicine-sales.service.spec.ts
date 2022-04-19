import { Test, TestingModule } from '@nestjs/testing';
import { MedicineSalesService } from './medicine-sales.service';

describe('MedicineSalesService', () => {
  let service: MedicineSalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineSalesService],
    }).compile();

    service = module.get<MedicineSalesService>(MedicineSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
