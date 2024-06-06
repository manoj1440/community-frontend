import dayjs from "dayjs";

export const permissionmap = {
    ADMIN: [],
    STOCK_IN: [],
    STOCK_OUT: [],
    STOCK_IN_OUT: [],
    CASH_IN: [],
    CASH_OUT: [],
    // STOCK_IN: ['/stock-in', '/consignment', '/farmers', '/commodity', '/transporters'],
    // STOCK_OUT: ['/stock-out', '/customers', '/commodity'],
    // STOCK_IN_OUT: ['/stock-in', '/consignment', '/farmers', '/commodity', '/transporters', '/stock-out', '/customers'],
    // CASH_IN: ['/cash-in'],
    // CASH_OUT: ['/cash-out']
}

export const defaultRoutemap = {
    ADMIN: '/dashboard',
    STOCK_IN: '/consignment',
    STOCK_OUT: '/stock-out',
    STOCK_IN_OUT: '/consignment',
    CASH_IN: '/cash-in',
    CASH_OUT: '/cash-out'
}

// export const readableDate = (dateObject) => {
//     return dayjs(new Date(dateObject)).format('YYYY-MM-DD HH:mm:ss');
// }

export const readableDate = (dateObject) => {
  // Ensure the date object is in a format dayjs can understand (e.g., ISO 8601)
  const formattedDate = new Date(dateObject).toISOString();
  return dayjs(formattedDate).format('YYYY-MM-DD HH:mm:ss');
};