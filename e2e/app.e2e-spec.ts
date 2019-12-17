import { DuneServerMonitorPage } from './app.po';

describe('dune-server-monitor App', () => {
  let page: DuneServerMonitorPage;

  beforeEach(() => {
    page = new DuneServerMonitorPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
