import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';  // Убедитесь, что RootState корректно импортирован
import { Api } from '../api/Api';
const api = new Api();

interface CashbackService {
  id: number;
  category: string;
  image_url: string;
  cashback_percentage_text: string;
  full_description: string;
  details: string;
}

interface CashbackServiceDetail {
  id: number;
  category: string;
  image_url: string;
  cashback_percentage_text: string;
  full_description: string;
  details: string;
}

interface CashbackOrder {
  id: number;
  status: string;
  creation_date: string;
  formation_date: string | null;
  completion_date: string | null;
  month: string;
  total_spent_month: number;
  creator: number;
  moderator: number;
}

interface CashbackState {
  searchTerm: string;
  services: CashbackService[];
  serviceDetails: CashbackServiceDetail | null;
  draftOrderId: number | null;
  cashbacksCount: number;
  orders: CashbackOrder[];  // Новый массив для заказов
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CashbackState = {
  searchTerm: '',
  services: [],
  serviceDetails: null,
  draftOrderId: null,
  cashbacksCount: 0,
  orders: [],  // Инициализация пустым массивом
  loading: 'idle',
  error: null,
};

// Асинхронный thunk для получения кешбэк-услуг
export const fetchCashbackServices = createAsyncThunk<
  { services: CashbackService[]; draftOrderId: number | null; cashbacksCount: number },
  string,
  { rejectValue: string }
>('cashback/fetchCashbackServices', async (searchTerm, { rejectWithValue }) => {
  try {
    const response = await axios.get('/cashback_services', {
      params: { search: searchTerm },
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    const data = response.data;

    const draftOrder = data.find((item: any) => item.draft_order_id);
    return {
      services: data.filter((item: any) => item.id) || [],
      draftOrderId: draftOrder ? draftOrder.draft_order_id : null,
      cashbacksCount: draftOrder ? draftOrder.cashbacks_count : 0,
    };
  } catch (error) {
    return rejectWithValue('Не удалось загрузить кешбэк-услуги.');
  }
});

// Асинхронный thunk для получения подробностей кешбэк-услуги
export const fetchCashbackServiceDetail = createAsyncThunk<
  CashbackServiceDetail,
  string,
  { rejectValue: string }
>('cashback/fetchCashbackServiceDetail', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/cashback_services/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue('Не удалось загрузить детали кешбэк-услуги.');
  }
});

// Асинхронный thunk для получения списка заказов кешбэков
export const fetchCashbackOrders = createAsyncThunk<
  CashbackOrder[],  // Ожидаемый тип данных (CashbackOrder[])
  void,  // Параметры функции (в данном случае нет параметров)
  { rejectValue: string }  // Тип ошибки
>(
  'cashback/fetchCashbackOrders',
  async (_, { rejectWithValue, getState }) => {
    const sessionId = (getState() as RootState).auth.sessionId;  // Получаем sessionId из состояния

    if (!sessionId) {
      // Если sessionId не найден, отклоняем с ошибкой
      return rejectWithValue('Не удалось найти sessionId.');
    }

    try {
      const response = await api.cashbackOrders.cashbackOrdersList({
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,  // Используем sessionId из состояния
        },
        withCredentials: true,  // Передаем куки с запросом
      });

      // Возвращаем данные (список заказов), которые должны быть типа CashbackOrder[]
      return response.data as CashbackOrder[];
    } catch (error) {
      // В случае ошибки отклоняем с сообщением
      return rejectWithValue('Не удалось загрузить заказы кешбэков.');
    }
  }
);



const cashbackSlice = createSlice({
  name: 'cashback',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка кешбэк-услуг
      .addCase(fetchCashbackServices.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCashbackServices.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.services = action.payload.services;
        state.draftOrderId = action.payload.draftOrderId;
        state.cashbacksCount = action.payload.cashbacksCount;
      })
      .addCase(fetchCashbackServices.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Ошибка загрузки кешбэк-услуг.';
      })

      // Загрузка подробностей кешбэк-услуги
      .addCase(fetchCashbackServiceDetail.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCashbackServiceDetail.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.serviceDetails = action.payload;
      })
      .addCase(fetchCashbackServiceDetail.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Ошибка загрузки деталей кешбэк-услуги.';
      })

      // Загрузка заказов кешбэков
      .addCase(fetchCashbackOrders.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCashbackOrders.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.orders = action.payload;  // Сохраняем список заказов
      })
      .addCase(fetchCashbackOrders.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Ошибка загрузки заказов кешбэков.';
      });
  },
});

export const { setSearchTerm } = cashbackSlice.actions;

export default cashbackSlice.reducer;




// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface CashbackService {
//   id: number;
//   category: string;
//   image_url: string;
//   cashback_percentage_text: string;
//   full_description: string;
//   details: string;
// }

// interface CashbackServiceDetail {
//   id: number;
//   category: string;
//   image_url: string;
//   cashback_percentage_text: string;
//   full_description: string;
//   details: string;
// }

// interface CashbackState {
//   searchTerm: string;
//   services: CashbackService[];
//   serviceDetails: CashbackServiceDetail | null;
//   draftOrderId: number | null;
//   cashbacksCount: number;
//   loading: 'idle' | 'pending' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: CashbackState = {
//   searchTerm: '',
//   services: [],
//   serviceDetails: null,
//   draftOrderId: null,
//   cashbacksCount: 0,
//   loading: 'idle',
//   error: null,
// };

// // Асинхронный thunk для получения кешбэк-услуг
// export const fetchCashbackServices = createAsyncThunk<
//   { services: CashbackService[]; draftOrderId: number | null; cashbacksCount: number },
//   string,
//   { rejectValue: string }
// >('cashback/fetchCashbackServices', async (searchTerm, { rejectWithValue }) => {
//   try {
//     const response = await axios.get('/cashback_services', {
//       params: { search: searchTerm },
//       headers: { 'Content-Type': 'application/json' },
//       withCredentials: true,
//     });
//     const data = response.data;

//     const draftOrder = data.find((item: any) => item.draft_order_id);
//     return {
//       services: data.filter((item: any) => item.id) || [],
//       draftOrderId: draftOrder ? draftOrder.draft_order_id : null,
//       cashbacksCount: draftOrder ? draftOrder.cashbacks_count : 0,
//     };
//   } catch (error) {
//     return rejectWithValue('Не удалось загрузить кешбэк-услуги.');
//   }
// });

// // Асинхронный thunk для получения подробностей кешбэк-услуги
// export const fetchCashbackServiceDetail = createAsyncThunk<
//   CashbackServiceDetail,
//   string,
//   { rejectValue: string }
// >('cashback/fetchCashbackServiceDetail', async (id, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`/cashback_services/${id}`, {
//       headers: { 'Content-Type': 'application/json' },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     return rejectWithValue('Не удалось загрузить детали кешбэк-услуги.');
//   }
// });

// const cashbackSlice = createSlice({
//   name: 'cashback',
//   initialState,
//   reducers: {
//     setSearchTerm(state, action: PayloadAction<string>) {
//       state.searchTerm = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCashbackServices.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//       })
//       .addCase(fetchCashbackServices.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.services = action.payload.services;
//         state.draftOrderId = action.payload.draftOrderId;
//         state.cashbacksCount = action.payload.cashbacksCount;
//       })
//       .addCase(fetchCashbackServices.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload || 'Ошибка загрузки кешбэк-услуг.';
//       })
//       .addCase(fetchCashbackServiceDetail.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//       })
//       .addCase(fetchCashbackServiceDetail.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.serviceDetails = action.payload;
//       })
//       .addCase(fetchCashbackServiceDetail.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload || 'Ошибка загрузки деталей кешбэк-услуги.';
//       });
//   },
// });

// export const { setSearchTerm } = cashbackSlice.actions;

// export default cashbackSlice.reducer;


