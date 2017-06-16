import { TypeTestPage } from './app.po';

describe('type-test App', () => {
  let page: TypeTestPage;

  beforeEach(() => {
    page = new TypeTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
