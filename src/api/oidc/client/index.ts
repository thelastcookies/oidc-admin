import type { OidcResponseBody } from '@/api/oidc/types';
import type {
  ClientInfo,
  ClientDetail,
  CreateClientRequest,
  UpdateClientRequest,
} from './types';

/** 获取客户端列表 */
export const getClientList = () => {
  return useGet<OidcResponseBody<ClientInfo[]>>(
    `${OIDC_URL}/client`,
    undefined,
    { token: true },
  );
};

/** 获取客户端详情 */
export const getClient = (clientId: string) => {
  return useGet<OidcResponseBody<ClientDetail>>(
    `${OIDC_URL}/client/${clientId}`,
    undefined,
    { token: true },
  );
};

/** 创建客户端 */
export const createClient = (data: CreateClientRequest) => {
  return usePost<OidcResponseBody<ClientInfo>, CreateClientRequest>(
    `${OIDC_URL}/client`,
    data,
    { token: true },
  );
};

/** 更新客户端 */
export const updateClient = (clientId: string, data: UpdateClientRequest) => {
  return usePut<OidcResponseBody<ClientInfo>, UpdateClientRequest>(
    `${OIDC_URL}/client/${clientId}`,
    data,
    { token: true },
  );
};

/** 删除客户端 */
export const deleteClient = (clientId: string) => {
  return useDelete<OidcResponseBody<{ msg: string }>>(
    `${OIDC_URL}/client/${clientId}`,
    undefined,
    { token: true },
  );
};
