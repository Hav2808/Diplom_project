   // src/mocks/axiosMock.js

   import axios from 'axios';
   import MockAdapter from 'axios-mock-adapter';

   // Создайте экземпляр MockAdapter и передайте axios
   const mock = new MockAdapter(axios);

   // Настройка мока для определенного маршрута
   mock.onGet('/api/v1/admin/users/').reply(200, [
     { id: 1, username: 'John', email: 'john@example.com' },
     { id: 2, username: 'Jane', email: 'jane@example.com' }
   ]);

   export default mock;