declare interface RequestHeader {
  key: string;
  value: string;
  type: string;
}

declare interface RequestBody {
  type: 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  form?: RequestBodyForm[];
  raw?: string;
}

declare interface RequestBodyForm {
  key: string;
  value: string;
  type: string;
}

declare interface ApiaryItem {
  name: string;
  request: {
    url: string;
    method: string;
    headers: RequestHeader[];
    body: any;
  }
  item?: ApiaryItem[]
}

declare interface ApiaryConfig {
  name: string;
  description?: string;
  item: ApiaryItem[]
}
