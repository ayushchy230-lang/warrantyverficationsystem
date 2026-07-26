export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'MANUFACTURER' | 'CUSTOMER' | 'VERIFIER';
  company?: string;
  avatarUrl?: string;
}

export const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'user-mfg-1',
    name: 'Elena Rostova',
    email: 'elena@techcorp-hardware.com',
    role: 'MANUFACTURER',
    company: 'Apex Consumer Electronics Inc.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-cust-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'CUSTOMER',
    company: 'Private Customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-verif-1',
    name: 'Sarah Jenkins',
    email: 's.jenkins@service-center.org',
    role: 'VERIFIER',
    company: 'Authorized Global Warranty Inspector',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
  }
];

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Default to signed-out or saved user
    const saved = localStorage.getItem('midnight_auth_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = null;
      }
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public signIn(persona: UserProfile) {
    this.currentUser = persona;
    localStorage.setItem('midnight_auth_user', JSON.stringify(persona));
    this.notify();
  }

  public signInCustom(name: string, email: string, role: 'MANUFACTURER' | 'CUSTOMER' | 'VERIFIER') {
    const customUser: UserProfile = {
      id: `custom-${Date.now()}`,
      name,
      email,
      role
    };
    this.signIn(customUser);
  }

  public signOut() {
    this.currentUser = null;
    localStorage.removeItem('midnight_auth_user');
    this.notify();
  }
}

export const authService = new AuthService();
