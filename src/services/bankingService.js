
import api from './api.js';

export const bankingService = {
  register: (payload) =>
    api.post('/users/create', payload),

  login: (payload) =>
    api.post('/users/login', payload),

  balance: (accountNumber) =>
    api.get(
      `/users/user/balanceInquiry/${encodeURIComponent(accountNumber)}`
    ),

  name: (accountNumber) =>
    api.get(
      `/users/user/nameInquiry/${encodeURIComponent(accountNumber)}`
    ),

  deposit: (payload) =>
    api.post('/users/user/credit', payload),

  withdraw: (payload) =>
    api.post('/users/user/debit', payload),

  transfer: (payload) =>
    api.post('/users/user/transfer', payload),

  // Fetch transaction history without generating or emailing a PDF.
  transactions: (accountNumber) =>
    api.get('/transactions', {
      params: { accountNumber }
    }),

  // Generate and email a PDF statement only when explicitly requested.
  statement: (accountNumber, startDate, endDate) =>
    api.get(
      `/statements/${encodeURIComponent(accountNumber)}`,
      {
        params: { startDate, endDate }
      }
    )
};
