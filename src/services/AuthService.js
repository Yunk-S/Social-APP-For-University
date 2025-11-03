// Pure frontend admin auth service (no backend required)
// Admin credentials: Admin / 123456

export async function adminLogin(username, password) {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!username || !password) {
    return { ok: false, message: '用户名或密码不能为空' };
  }
  
  const isAdmin = username === 'Admin' && password === '123456';
  
  if (isAdmin) {
    // Store admin session in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('seer_admin_session', JSON.stringify({
          username,
          isAdmin: true,
          timestamp: Date.now(),
        }));
      } catch (_) {}
    }
    return { ok: true, isAdmin: true };
  } else if (password) {
    // Normal user login
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('seer_admin_session', JSON.stringify({
          username,
          isAdmin: false,
          timestamp: Date.now(),
        }));
      } catch (_) {}
    }
    return { ok: true, isAdmin: false };
  }
  
  return { ok: false, message: '用户名或密码错误' };
}

export async function adminMe() {
  // Check if admin session exists in localStorage
  if (typeof window === 'undefined') return false;
  
  try {
    const sessionStr = localStorage.getItem('seer_admin_session');
    if (!sessionStr) return false;
    
    const session = JSON.parse(sessionStr);
    
    // Check if session is still valid (24 hours)
    const age = Date.now() - (session.timestamp || 0);
    if (age > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('seer_admin_session');
      return false;
    }
    
    return session.isAdmin === true;
  } catch (_) {
    return false;
  }
}

export async function adminLogout() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('seer_admin_session');
    } catch (_) {}
  }
}
