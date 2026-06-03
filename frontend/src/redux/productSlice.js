import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: { reviews: [] },
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  totalProducts: 0,
  categories: [],
  brands: [],
  reviewSuccess: false,
  reviewLoading: false,
  reviewError: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.totalProducts = action.payload.totalProducts;
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
    },
    productFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    singleProductSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    reviewRequest: (state) => {
      state.reviewLoading = true;
      state.reviewSuccess = false;
      state.reviewError = null;
    },
    reviewSuccess: (state) => {
      state.reviewLoading = false;
      state.reviewSuccess = true;
    },
    reviewFail: (state, action) => {
      state.reviewLoading = false;
      state.reviewError = action.payload;
    },
    reviewReset: (state) => {
      state.reviewSuccess = false;
      state.reviewError = null;
    },
  },
});

export const {
  productRequest,
  productSuccess,
  productFail,
  singleProductSuccess,
  reviewRequest,
  reviewSuccess,
  reviewFail,
  reviewReset,
} = productSlice.actions;

export default productSlice.reducer;
