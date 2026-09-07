import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import LoginSheet from "../components/LoginSheet";

/*
 * Auth falsa (sin backend) — 2026-09-06, a pedido del usuario, parte del
 * flujo de Onboarding/Login: "el login aparece cuando realmente aporta
 * valor: guardar favoritos, hacer una reserva, acceder al perfil/
 * historial" — nunca como paso obligatorio del onboarding (ver
 * Onboarding.tsx). Mismo criterio que FavoritesContext: no hay backend
 * real en todo el proyecto, así que "iniciar sesión" acá no valida nada
 * (cualquier correo, o directamente Google/Apple, "loguean" al toque) —
 * es la UI y el mecanismo del gate, no una autenticación real. Cuando
 * exista backend, el hook expuesto (`requireAuth`/`logout`) no debería
 * tener que cambiar del lado de los componentes que ya lo consumen,
 * mismo espíritu que FavoritesContext.
 *
 * `requireAuth(mensaje, onSuccess)` es el punto de entrada real: si ya
 * hay sesión, ejecuta `onSuccess` de inmediato sin mostrar nada; si no,
 * abre `LoginSheet` con el mensaje contextual de por qué (distinto en
 * favoritos/reserva/perfil, ver cada sitio de uso) y ejecuta `onSuccess`
 * recién cuando el login "falso" se completa. Así cualquier componente
 * (incluso uno anidado como FavoritoButton dentro de una card) puede
 * pedir sesión sin prop-drilling ni tener que renderizar su propio sheet
 * — un solo LoginSheet vive acá arriba, montado una vez.
 */

const STORAGE_KEY = "theaveling:auth";

interface AuthContextValue {
  loggedIn: boolean;
  email: string | null;
  logout: () => void;
  requireAuth: (mensaje: string, onSuccess: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function leerEmailGuardado(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(leerEmailGuardado);
  const [prompt, setPrompt] = useState<{
    mensaje: string;
    onSuccess: () => void;
  } | null>(null);

  useEffect(() => {
    try {
      if (email) {
        window.localStorage.setItem(STORAGE_KEY, email);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage puede fallar (modo privado, cuota) — no rompe la app.
    }
  }, [email]);

  const loggedIn = email !== null;

  function requireAuth(mensaje: string, onSuccess: () => void) {
    if (loggedIn) {
      onSuccess();
      return;
    }
    setPrompt({ mensaje, onSuccess });
  }

  // Se llama desde LoginSheet cuando el usuario "inicia sesión" (cualquier
  // correo no vacío, o un botón de Google/Apple decorativo) — ver nota
  // grande de arriba, no valida nada real.
  function completarLogin(correoIngresado: string) {
    setEmail(correoIngresado);
    const onSuccess = prompt?.onSuccess;
    setPrompt(null);
    onSuccess?.();
  }

  function logout() {
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ loggedIn, email, logout, requireAuth }}>
      {children}
      <LoginSheet
        open={prompt !== null}
        mensaje={prompt?.mensaje ?? ""}
        onClose={() => setPrompt(null)}
        onLogin={completarLogin}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
