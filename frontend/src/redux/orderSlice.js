import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  order: null,
  error: null,
  myOrders: [],
  orders: [],
  paySuccess: false,
  deliverSuccess: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderCreateReset: (state) => {
      state.success = false;
      state.order = null;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderPayRequest: (state) => {
      state.loading = true;
      state.paySuccess = false;
    },
    orderPaySuccess: (state) => {
      state.loading = false;
      state.paySuccess = true;
    },
    orderPayFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderPayReset: (state) => {
      state.paySuccess = false;
    },
    orderListMySuccess: (state, action) => {
      state.loading = false;
      state.myOrders = action.payload;
    },
    orderListSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderDeliverRequest: (state) => {
      state.loading = true;
      state.deliverSuccess = false;
    },
    orderDeliverSuccess: (state) => {
      state.loading = false;
      state.deliverSuccess = true;
    },
    orderDeliverFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDeliverReset: (state) => {
      state.deliverSuccess = false;
    },
  },
});

export const {
  orderRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
  orderDetailsSuccess,
  orderPayRequest,
  orderPaySuccess,
  orderPayFail,
  orderPayReset,
  orderListMySuccess,
  orderListSuccess,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
  orderDeliverReset,
} = orderSlice.actions;

export default orderSlice.reducer;
