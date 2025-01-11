import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../api/Api';

const api = new Api();

interface CashbackService {
  service_id: number;
  category: string;
  image_url: string;
  total_spent: number;
}

interface MonthlyCashbacksState {
  cashbackServices: CashbackService[];
  loading: boolean;
  error: string | null;
  selectedMonth: string;
}

const initialState: MonthlyCashbacksState = {
  cashbackServices: [],  // Начальное состояние - пустой массив
  loading: false,
  error: null,
  selectedMonth: '',
};

export const fetchMonthlyCashbacks = createAsyncThunk(
  'cashbacks/fetchMonthlyCashbacks',
  async (draftOrderId: string, { rejectWithValue }) => {
    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      return rejectWithValue('Не удалось получить session_id из куков');
    }

    try {
      const response = await api.cashbackOrders.cashbackOrdersRead(draftOrderId, {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });
      return response.data.services || [];  // Возвращаем пустой массив, если нет данных
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

export const updateTotalSpent = createAsyncThunk(
  'cashbacks/updateTotalSpent',
  async (
    { draftOrderId, serviceId, newTotalSpent }: { draftOrderId: string; serviceId: number; newTotalSpent: number },
    { rejectWithValue }
  ) => {
    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      return rejectWithValue('Не удалось получить session_id');
    }

    try {
      const updatedService = { total_spent: newTotalSpent };
      await api.cashbacksOrders.cashbacksOrdersServicesUpdateUpdate(draftOrderId, String(serviceId), updatedService, {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });
      return { serviceId, newTotalSpent };
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении общей суммы трат');
    }
  }
);

export const deleteService = createAsyncThunk(
  'cashbacks/deleteService',
  async ({ draftOrderId, serviceId }: { draftOrderId: string; serviceId: number }, { rejectWithValue }) => {
    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      return rejectWithValue('Не удалось получить session_id');
    }

    try {
      await api.cashbacksOrders.cashbacksOrdersServicesDeleteDelete(draftOrderId, String(serviceId), {
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
        },
      });
      return serviceId;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении услуги');
    }
  }
);

export const clearAllServices = createAsyncThunk(
  'cashbacks/clearAllServices',
  async (draftOrderId: string, { rejectWithValue, getState }) => {
    const sessionId = getSessionIdFromCookies();
    if (!sessionId) {
      return rejectWithValue('Не удалось получить session_id');
    }

    const state = getState() as { cashbacks: MonthlyCashbacksState };
    const servicesToDelete = state.cashbacks.cashbackServices;

    try {
      for (const service of servicesToDelete) {
        await api.cashbacksOrders.cashbacksOrdersServicesDeleteDelete(draftOrderId, String(service.service_id), {
          headers: {
            'Content-Type': 'application/json',
            'Session-ID': sessionId,
          },
        });
      }
      return [];
    } catch (error) {
      return rejectWithValue('Ошибка при удалении всех услуг');
    }
  }
);

const monthlyCashbacksSlice = createSlice({
  name: 'cashbacks',
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyCashbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyCashbacks.fulfilled, (state, action) => {
        state.cashbackServices = action.payload;
        state.loading = false;
      })
      .addCase(fetchMonthlyCashbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTotalSpent.fulfilled, (state, action) => {
        const { serviceId, newTotalSpent } = action.payload;
        state.cashbackServices = state.cashbackServices.map((service) =>
          service.service_id === serviceId ? { ...service, total_spent: newTotalSpent } : service
        );
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        const serviceId = action.payload;
        state.cashbackServices = state.cashbackServices.filter((service) => service.service_id !== serviceId);
      })
      .addCase(clearAllServices.fulfilled, (state) => {
        state.cashbackServices = [];
      });
  },
});

export const { setSelectedMonth } = monthlyCashbacksSlice.actions;

export default monthlyCashbacksSlice.reducer;

function getSessionIdFromCookies(): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'session_id') {
      return value;
    }
  }
  console.warn('Session-ID не найден в куках');
  return null;
}
