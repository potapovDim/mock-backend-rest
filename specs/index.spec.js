const { expect } = require('chai');
const fetch = require("node-fetch");
const FakeServer = require('../lib');


describe('FakeServer', () => {
  describe('REST', () => {
    let server = null;
    before(() => {
      server = new FakeServer(3535)
      server.get({ path: '/lol', response: { LOL: 'LOL' } });
      server.put({ path: '/lol', response: { lol1: 'lol1' } });
      server.get({ path: 'https://lol.com', response: { LOL_COM: 'LOL_COM' } });
      server.get({ path: '/html', response: '<div></div>' });
      server.post({
        path: '/xxx',
        response: { LOLXXX: 'LOLXX' },
        errorResponse: { error: 'SUPER CUSTOM ERROR' },
        assertQuery: true,
        assertRequestBody: true,
        assertQuery: true,
        queryRequest: 'a=b&c=d',
        responseQuery: { query: 'query' },
        requestBody: { a: 'a' }
      });
      server.post({ path: '/ggg', response: { LOLGGG: 'LOLGGG' } });
      server.post({ path: '/new', response: { LOLNEW: 'LOLNEW' } });
      server.del({ path: '/nnn', response: { NNN: 'NNN' } });
      server.start();
      expect(server.runned).to.eql(true);
    });
    after(() => {
      server.restore();
      expect(server.runned).to.eql(false);
    });
    it('github', async () => {
      const resp_http = await fetch('https://lol.com');
      const resp1 = await fetch('https://github.com');
      expect(resp_http.status).to.eql(200);
      expect(await resp_http.json()).to.eql({ LOL_COM: 'LOL_COM' });
      expect(resp1.status).to.eql(200)
    });
    it('get', async () => {
      const result = await fetch('http://localhost:3535/lol');
      expect(result.status).to.eql(200);
      expect(await result.json()).to.eql({ LOL: 'LOL' });
      const callResult = server.getGetResult('/lol');
      expect(callResult.called).to.eql(true)
      expect(callResult.callCount).to.eql(1)
      expect(callResult.calledArgs).to.eql([])
      expect(callResult.method).to.eql('GET')
    });
    it('get negative', async () => {
      {
        const result = await fetch('http://localhost:3535/aaaaa');
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535');
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
    });
    it('put ', async () => {
      {
        const result = await fetch('http://localhost:3535/lol?dsadas=dsadas', { method: 'PUT', body: JSON.stringify({ a: 'a' }) });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ lol1: 'lol1' });
        const callResult = server.getPutResult('/lol');
        expect(callResult.called).to.eql(true)
        expect(callResult.callCount).to.eql(1)
        expect(callResult.calledArgs).to.eql([{ a: 'a' }])
        expect(callResult.method).to.eql('PUT');
        expect(callResult.calledWithArgs({ a: 'a' })).to.eql(true)
      }
    });
    it('put negative', async () => {
      {
        const result = await fetch('http://localhost:3535/aaaaa', { method: 'PUT' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535', { method: 'PUT' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
    });
    it('post ', async () => {
      {
        const result = await fetch('http://localhost:3535/ggg', { method: 'POST' });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ LOLGGG: 'LOLGGG' });
      }
      {
        const result = await fetch('http://localhost:3535/xxx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        }); //headers["Content-Type"] = "application/json";
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ LOLXXX: 'LOLXX' });
      }
    });
    it('post negative', async () => {
      {
        const result = await fetch('http://localhost:3535/xxx', { method: 'POST' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'SUPER CUSTOM ERROR' });
      }
      {
        const result = await fetch('http://localhost:3535', { method: 'POST' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
    });
    it('del', async () => {
      {
        const result = await fetch('http://localhost:3535/nnn', { method: 'DELETE' });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ NNN: 'NNN' });
      }
      {
        const result = await fetch('http://localhost:3535/nnn', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'test' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ NNN: 'NNN' });
      }
    });
    it('del negative', async () => {
      const result = await fetch('http://localhost:3535', { method: 'DELETE' });
      expect(result.status).to.eql(400);
      expect(await result.json()).to.eql({ error: 'api.notfound' });
    });
  });
  describe('query', () => {
    let server = null;
    before(() => {
      server = new FakeServer(3535)
      server.post({
        path: '/xxx',
        successStatus: 200,
        errorStatus: 401,
        errorResponse: { error: 'SUPER CUSTOM ERROR' },
        queryAndBodyResponse: { main: 'main' },
        assertQueryAndBody: true,
        requestQuery: 'a=b&c=d',
        requestBody: { a: 'a' }
      });
      server.get({
        path: '/foo',
        successStatus: 204,
        errorStatus: 403,
        response: { success: 1 },
        assertQuery: true,
        requestQuery: 'a=b&&c=d'
      });
      server.put({
        path: 'bar',
        assertRequestBody: true,
        requestBody: { test: 'test' },
        response: { success: 1 }
      });
      server.del({
        path: 'foobar',
        assertQuery: true,
        assertRequestBody: true,
        requestQuery: 'a=b&c=d',
        response: { success: 1 },
        requestBody: { a: 'a' }
      })
      server.start();

      expect(server.runned).to.eql(true);
    });
    after(() => {
      server.restore();
      expect(server.runned).to.eql(false);
    });
    it('get', async () => {
      {
        const result = await fetch('http://localhost:3535/foo');
        expect(result.status).to.eql(403);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535/foo?a=b&&c=d');
        expect(result.status).to.eql(202);
        expect(await result.json()).to.eql({ success: 1 });
      }
    });
    it('put', async () => {
      {
        const result = await fetch('http://localhost:3535/bar', { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
        expect(result.status).to.eql(400);
      }
      {
        const result = await fetch('http://localhost:3535/bar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'test' })
        })
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
      {
        const result = await fetch('http://localhost:3535/bar?a=b', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535/bar?a=b', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'test' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
    });
    it('del', async () => {
      {
        const result = await fetch('http://localhost:3535/foobar', { method: 'DELETE' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535/foobar/?a=b', { method: 'DELETE' });
        expect(result.status).to.eql(400);
        expect(await result.json()).to.eql({ error: 'api.notfound' });
      }
      {
        const result = await fetch('http://localhost:3535/foobar?a=b&c=d', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
      {
        const result = await fetch('http://localhost:3535/foobar?a=b&c=d', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
      {
        const result = await fetch('http://localhost:3535/foobar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
      {
        const result = await fetch('http://localhost:3535/foobar?a=1', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
      {
        const result = await fetch('http://localhost:3535/foobar?a=b&c=d', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ b: 'b' })
        });
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ success: 1 });
      }
    });
    it('post ', async () => {
      {
        const result = await fetch('http://localhost:3535/xxx', { method: 'POST' });
        expect(result.status).to.eql(401);
      }
      {
        const result = await fetch('http://localhost:3535/xxx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        });
        expect(result.status).to.eql(401);
      }
      {
        const result = await fetch('http://localhost:3535/xxx?a=b&c=d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'a' })
        }); //headers["Content-Type"] = "application/json";
        expect(result.status).to.eql(200);
        expect(await result.json()).to.eql({ main: 'main' });
      }
    });
  });
});
