// 请求头
declare interface RequestHeader {
  key: string;
  value: string;
  type: string;
}

// 请求体表单
declare interface RequestBodyForm {
  key: string;
  value: string;
  type: string;
}

// 请求体
declare interface RequestBody {
  type: 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  form?: RequestBodyForm[];
  raw?: string;
}

// 请求配置
declare interface RequestConfig {
  method: string;
  url: string;
  headers: RequestHeader[];
  body: RequestBody;
}

// 请求
declare interface ApiaryRequest {
  name: string;
  request: RequestConfig
  response: any[]
}

// 组
declare interface ApiaryGroup {
  name: string;
  children: Array<ApiaryGroup | ApiaryRequest>
}

// 配置
declare interface ApiaryConfig {
  name: string;
  description?: string;
  children: Array<ApiaryGroup | ApiaryRequest>
}
