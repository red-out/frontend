/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 120
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

export interface CashbackService {
  /** ID */
  id?: number;
  /**
   * Image url
   * @minLength 1
   */
  image_url?: string;
  /**
   * Category
   * @minLength 1
   * @maxLength 255
   */
  category?: string;
  /**
   * Cashback percentage text
   * @minLength 1
   * @maxLength 255
   */
  cashback_percentage_text?: string;
  /**
   * Full description
   * @minLength 1
   */
  full_description?: string;
  /**
   * Details
   * @minLength 1
   */
  details?: string;
  /** Status */
  status?: "active" | "deleted";
}

export interface CashbackOrder {
  /** ID */
  id?: number;
  services?: CashbackService[];
  /** Status */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Formation date
   * @format date-time
   */
  formation_date?: string | null;
  /**
   * Completion date
   * @format date-time
   */
  completion_date?: string | null;
  /**
   * Month
   * @minLength 1
   * @maxLength 20
   */
  month?: string;
  /**
   * Total spent month
   * @min 0
   * @max 2147483647
   */
  total_spent_month?: number | null;
  /** Creator */
  creator?: number;
  /** Moderator */
  moderator?: number | null;
}

export interface CompleteOrRejectOrder {
  /** Action */
  action: "complete" | "reject";
}

export interface CashbackOrderService {
  /**
   * Total spent
   * @min 0
   * @max 2147483647
   */
  total_spent?: number;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserList
     * @request GET:/api/user/
     * @secure
     */
    apiUserList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/api/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Функция регистрации новых пользователей Если пользователя c указанным в request email ещё нет, в БД будет добавлен новый пользователь.
     *
     * @tags api
     * @name ApiUserCreate
     * @request POST:/api/user/
     * @secure
     */
    apiUserCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserRead
     * @request GET:/api/user/{id}/
     * @secure
     */
    apiUserRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserUpdate
     * @request PUT:/api/user/{id}/
     * @secure
     */
    apiUserUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserPartialUpdate
     * @request PATCH:/api/user/{id}/
     * @secure
     */
    apiUserPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserDelete
     * @request DELETE:/api/user/{id}/
     * @secure
     */
    apiUserDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  cashbackOrders = {
    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersList
     * @request GET:/cashback_orders/
     * @secure
     */
    cashbackOrdersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_orders/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersRead
     * @request GET:/cashback_orders/{id}/
     * @secure
     */
    cashbackOrdersRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_orders/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersUpdate
     * @request PUT:/cashback_orders/{id}/
     * @secure
     */
    cashbackOrdersUpdate: (id: string, data: CashbackOrder, params: RequestParams = {}) =>
      this.request<CashbackOrder, any>({
        path: `/cashback_orders/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersCompleteOrRejectUpdate
     * @request PUT:/cashback_orders/{id}/complete_or_reject/
     * @secure
     */
    cashbackOrdersCompleteOrRejectUpdate: (id: string, data: CompleteOrRejectOrder, params: RequestParams = {}) =>
      this.request<CompleteOrRejectOrder, any>({
        path: `/cashback_orders/${id}/complete_or_reject/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersCreateUpdate
     * @request PUT:/cashback_orders/{id}/create/
     * @secure
     */
    cashbackOrdersCreateUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_orders/${id}/create/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersDeleteList
     * @request GET:/cashback_orders/{id}/delete/
     * @secure
     */
    cashbackOrdersDeleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_orders/${id}/delete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersDeleteUpdate
     * @request PUT:/cashback_orders/{id}/delete/
     * @secure
     */
    cashbackOrdersDeleteUpdate: (id: string, data: CashbackOrder, params: RequestParams = {}) =>
      this.request<CashbackOrder, any>({
        path: `/cashback_orders/${id}/delete/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersUpdateList
     * @request GET:/cashback_orders/{id}/update/
     * @secure
     */
    cashbackOrdersUpdateList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_orders/${id}/update/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_orders
     * @name CashbackOrdersUpdateUpdate
     * @request PUT:/cashback_orders/{id}/update/
     * @secure
     */
    cashbackOrdersUpdateUpdate: (id: string, data: CashbackOrder, params: RequestParams = {}) =>
      this.request<CashbackOrder, any>({
        path: `/cashback_orders/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  cashbackServices = {
    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesList
     * @request GET:/cashback_services/
     * @secure
     */
    cashbackServicesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesCreate
     * @request POST:/cashback_services/
     * @secure
     */
    cashbackServicesCreate: (data: CashbackService, params: RequestParams = {}) =>
      this.request<CashbackService, any>({
        path: `/cashback_services/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesAddList
     * @request GET:/cashback_services/add/
     * @secure
     */
    cashbackServicesAddList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/add/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesAddCreate
     * @request POST:/cashback_services/add/
     * @secure
     */
    cashbackServicesAddCreate: (data: CashbackService, params: RequestParams = {}) =>
      this.request<CashbackService, any>({
        path: `/cashback_services/add/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesRead
     * @request GET:/cashback_services/{id}/
     * @secure
     */
    cashbackServicesRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesUpdate
     * @request PUT:/cashback_services/{id}/
     * @secure
     */
    cashbackServicesUpdate: (id: string, data: CashbackService, params: RequestParams = {}) =>
      this.request<CashbackService, any>({
        path: `/cashback_services/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesDelete
     * @request DELETE:/cashback_services/{id}/
     * @secure
     */
    cashbackServicesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesAddImageCreate
     * @request POST:/cashback_services/{id}/add_image/
     * @secure
     */
    cashbackServicesAddImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/add_image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesAddToDraftCreate
     * @request POST:/cashback_services/{id}/add_to_draft/
     * @secure
     */
    cashbackServicesAddToDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/add_to_draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesDeleteList
     * @request GET:/cashback_services/{id}/delete/
     * @secure
     */
    cashbackServicesDeleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/delete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesDeleteUpdate
     * @request PUT:/cashback_services/{id}/delete/
     * @secure
     */
    cashbackServicesDeleteUpdate: (id: string, data: CashbackService, params: RequestParams = {}) =>
      this.request<CashbackService, any>({
        path: `/cashback_services/${id}/delete/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesDeleteDelete
     * @request DELETE:/cashback_services/{id}/delete/
     * @secure
     */
    cashbackServicesDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesUpdateList
     * @request GET:/cashback_services/{id}/update/
     * @secure
     */
    cashbackServicesUpdateList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/update/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesUpdateUpdate
     * @request PUT:/cashback_services/{id}/update/
     * @secure
     */
    cashbackServicesUpdateUpdate: (id: string, data: CashbackService, params: RequestParams = {}) =>
      this.request<CashbackService, any>({
        path: `/cashback_services/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashback_services
     * @name CashbackServicesUpdateDelete
     * @request DELETE:/cashback_services/{id}/update/
     * @secure
     */
    cashbackServicesUpdateDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashback_services/${id}/update/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  cashbacksOrders = {
    /**
     * No description
     *
     * @tags cashbacks_orders
     * @name CashbacksOrdersServicesDeleteUpdate
     * @request PUT:/cashbacks_orders/{order_id}/services/{service_id}/delete/
     * @secure
     */
    cashbacksOrdersServicesDeleteUpdate: (
      orderId: string,
      serviceId: string,
      data: CashbackOrderService,
      params: RequestParams = {},
    ) =>
      this.request<CashbackOrderService, any>({
        path: `/cashbacks_orders/${orderId}/services/${serviceId}/delete/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashbacks_orders
     * @name CashbacksOrdersServicesDeleteDelete
     * @request DELETE:/cashbacks_orders/{order_id}/services/{service_id}/delete/
     * @secure
     */
    cashbacksOrdersServicesDeleteDelete: (orderId: string, serviceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashbacks_orders/${orderId}/services/${serviceId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashbacks_orders
     * @name CashbacksOrdersServicesUpdateUpdate
     * @request PUT:/cashbacks_orders/{order_id}/services/{service_id}/update/
     * @secure
     */
    cashbacksOrdersServicesUpdateUpdate: (
      orderId: string,
      serviceId: string,
      data: CashbackOrderService,
      params: RequestParams = {},
    ) =>
      this.request<CashbackOrderService, any>({
        path: `/cashbacks_orders/${orderId}/services/${serviceId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags cashbacks_orders
     * @name CashbacksOrdersServicesUpdateDelete
     * @request DELETE:/cashbacks_orders/{order_id}/services/{service_id}/update/
     * @secure
     */
    cashbacksOrdersServicesUpdateDelete: (orderId: string, serviceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/cashbacks_orders/${orderId}/services/${serviceId}/update/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<{ status: string; session_id?: string }, void>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags logout
     * @name LogoutCreate
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * @description Метод для частичного обновления данных пользователя.
     *
     * @tags user
     * @name UserUpdatePartialUpdate
     * @request PATCH:/user/{id}/update/
     * @secure
     */
    userUpdatePartialUpdate: (id: string, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/update/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
