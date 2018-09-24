import { FlipModule } from "./flip.module";

describe("FlipModule", () => {
    let flipModule: FlipModule;

    beforeEach(() => {
        flipModule = new FlipModule();
    });

    it("should create an instance", () => {
        expect(flipModule).toBeTruthy();
    });
});
