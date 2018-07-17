import { CapitalizeFirstModule } from './capitalize-first.module';

describe('CapitalizeFirstModule', () => {
  let capitalizeFirstModule: CapitalizeFirstModule;

  beforeEach(() => {
    capitalizeFirstModule = new CapitalizeFirstModule();
  });

  it('should create an instance', () => {
    expect(capitalizeFirstModule).toBeTruthy();
  });
});
