import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simple mock client to prevent crashes when Supabase is not configured
const createMockClient = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase is not configured. Using mock client.');
  }
  
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    containedBy: () => mockQueryBuilder,
    rangeGt: () => mockQueryBuilder,
    rangeLt: () => mockQueryBuilder,
    rangeGte: () => mockQueryBuilder,
    rangeLte: () => mockQueryBuilder,
    rangeAdjacent: () => mockQueryBuilder,
    overlaps: () => mockQueryBuilder,
    textSearch: () => mockQueryBuilder,
    match: () => mockQueryBuilder,
    not: () => mockQueryBuilder,
    or: () => mockQueryBuilder,
    filter: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    offset: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    csv: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };

  return {
    from: () => mockQueryBuilder,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock auth') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient();
