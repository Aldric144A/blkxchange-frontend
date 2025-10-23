export interface AdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  expiresAt: string | null;
}

export function getAdminAuth(): AdminAuthState {
  const localToken = localStorage.getItem('admin_token');
  const localEmail = localStorage.getItem('admin_email');
  const localExpiry = localStorage.getItem('admin_token_expiry');

  if (localToken && localExpiry) {
    const expiryDate = new Date(localExpiry);
    if (expiryDate > new Date()) {
      return {
        isAuthenticated: true,
        token: localToken,
        email: localEmail,
        expiresAt: localExpiry,
      };
    } else {
      clearAdminAuth();
    }
  }

  const sessionToken = sessionStorage.getItem('admin_token');
  const sessionEmail = sessionStorage.getItem('admin_email');

  if (sessionToken) {
    return {
      isAuthenticated: true,
      token: sessionToken,
      email: sessionEmail,
      expiresAt: null, // Session expires on browser close
    };
  }

  return {
    isAuthenticated: false,
    token: null,
    email: null,
    expiresAt: null,
  };
}

export function setAdminAuth(token: string, email: string, rememberMe: boolean) {
  if (rememberMe) {
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_token_expiry', expiryDate.toISOString());
  } else {
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_email', email);
  }
}

export function clearAdminAuth() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_token_expiry');
  sessionStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_email');
  
  localStorage.removeItem('admin_secret');
}

export function getAdminToken(): string | null {
  const auth = getAdminAuth();
  return auth.token;
}

export function isAdminAuthenticated(): boolean {
  const auth = getAdminAuth();
  return auth.isAuthenticated;
}

export function getAdminHeaders(): HeadersInit {
  const auth = getAdminAuth();
  
  if (auth.isAuthenticated && auth.token) {
    // Use JWT token (new method)
    return {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };
  }
  
  // Fall back to old admin_secret method for backward compatibility
  const oldSecret = localStorage.getItem('admin_secret');
  if (oldSecret) {
    return {
      'X-Admin-Secret': oldSecret,
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json'
  };
}
