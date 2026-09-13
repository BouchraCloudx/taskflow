import { useState, useEffect } from 'react';
import { signUp, confirmSignUp, signIn, signOut, getCurrentSession } from './auth';
import { listTasks, createTask, updateTaskStatus, deleteTask } from './api';

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none">
      <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('signin'); // signin | signup | confirm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        const session = await signIn(email, password);
        onAuthenticated(session);
      } else if (mode === 'signup') {
        await signUp(email, password);
        setMode('confirm');
      } else if (mode === 'confirm') {
        await confirmSignUp(email, code);
        setMode('signin');
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <h1>TaskFlow</h1>
      <p className="tagline">Un registre simple pour tes tâches.</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {mode !== 'confirm' && (
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {mode === 'confirm' && (
          <div className="field">
            <label>Code de vérification (reçu par email)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading
            ? 'Un instant…'
            : mode === 'signin'
            ? 'Se connecter'
            : mode === 'signup'
            ? "S'inscrire"
            : 'Confirmer'}
        </button>
      </form>

      {mode === 'signin' && (
        <p className="switch-mode">
          Pas encore de compte ? <button onClick={() => setMode('signup')}>S'inscrire</button>
        </p>
      )}
      {mode === 'signup' && (
        <p className="switch-mode">
          Déjà inscrit ? <button onClick={() => setMode('signin')}>Se connecter</button>
        </p>
      )}
    </div>
  );
}

function TaskApp({ session, onSignOut }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const userId = session.email; // identifiant simple pour la partition key

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const result = await listTasks(session.idToken, userId);
    setTasks(result);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await createTask(session.idToken, userId, newTitle.trim());
      setNewTitle('');
      await loadTasks();
    } finally {
      setAdding(false);
    }
  }

  async function toggleDone(task) {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: newStatus } : t))
    );
    await updateTaskStatus(session.idToken, userId, task.taskId, newStatus);
  }

  async function handleDelete(task) {
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    await deleteTask(session.idToken, userId, task.taskId);
  }

  return (
    <div>
      <header className="app-header">
        <h1>TaskFlow</h1>
        <div className="user-info">
          <span>{session.email}</span>
          <button onClick={onSignOut}>Déconnexion</button>
        </div>
      </header>

      <form className="task-entry" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Ajouter une tâche…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" disabled={adding}>
          Ajouter
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="big">Rien à faire pour l'instant</div>
          <p>Ajoute ta première tâche ci-dessus.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.taskId} className={`task-row ${task.status === 'done' ? 'done' : ''}`}>
              <div className="stamp" onClick={() => toggleDone(task)}>
                <CheckIcon />
              </div>
              <span className="title">{task.title}</span>
              <button className="delete-btn" onClick={() => handleDelete(task)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentSession().then((s) => {
      setSession(s);
      setChecking(false);
    });
  }, []);

  if (checking) return null;

  if (!session) {
    return <AuthScreen onAuthenticated={setSession} />;
  }

  return (
    <TaskApp
      session={session}
      onSignOut={() => {
        signOut();
        setSession(null);
      }}
    />
  );
}
