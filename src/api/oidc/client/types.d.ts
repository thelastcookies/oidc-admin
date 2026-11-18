/** 客户端列表项 */
export interface ClientInfo {
  client_id: string;
  client_name: string;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  createdAt: string;
  updatedAt: string;
}

/** 创建客户端请求体 */
export interface CreateClientRequest {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  client_name?: string;
  post_logout_redirect_uris?: string[];
  grant_types?: string[];
  response_types?: string[];
  token_endpoint_auth_method?: string;
}

/** 更新客户端请求体 */
export interface UpdateClientRequest {
  client_name?: string;
  redirect_uris?: string[];
  post_logout_redirect_uris?: string[];
  grant_types?: string[];
  response_types?: string[];
}
