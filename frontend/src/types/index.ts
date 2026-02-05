export interface Medicine {
    id: string;
    name: string;
    price: number;
    pharmacy: string;
    url?: string | null;
  }
  
  export interface SearchState {
    query: string;
    loading: boolean;
    error: string | null;
    results: Medicine[];
    raw: boolean;
  }
  
