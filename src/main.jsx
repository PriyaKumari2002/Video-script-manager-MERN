import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const emptyScript = { title: '', content: '', status: 'Draft', tags: '' };

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [scripts, setScripts] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [form, setForm] = useState(emptyScript);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');

  const request = async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
    const data = res.status === 204 ? null : await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  };
  const loadScripts = async () => { try { setScripts(await request('/scripts')); } catch (e) { setMessage(e.message); } };
  useEffect(() => { if (token) loadScripts(); }, [token]);
  const login = async e => {
    e.preventDefault(); setMessage('');
    try { const data = await request(`/auth/${authMode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(authForm) }); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); setToken(data.token); } catch (err) { setMessage(err.message); }
  };
  const saveScript = async e => {
    e.preventDefault(); setMessage('');
    const payload = { ...form, tags: form.tags.split(',').map(x => x.trim()).filter(Boolean) };
    try { await request(editing ? `/scripts/${editing}` : '/scripts', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); setForm(emptyScript); setEditing(null); await loadScripts(); setMessage(editing ? 'Script updated.' : 'Script added.'); } catch (err) { setMessage(err.message); }
  };
  const editScript = s => { setEditing(s._id); setForm({ title: s.title, content: s.content || s.excerpt || '', status: s.status, tags: s.tags.join(', ') }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const deleteScript = async id => { if (!confirm('Delete this script?')) return; await request(`/scripts/${id}`, { method: 'DELETE' }); loadScripts(); };
  const logout = () => { localStorage.clear(); setToken(null); setUser(null); setScripts([]); };
  const shown = filter === 'All' ? scripts : scripts.filter(s => s.status === filter);
  if (!token) return <Auth mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} onSubmit={login} message={message} />;
  return <div className="page"><header><b>Script Manager</b><div><span>Hello, {user?.name}</span><button onClick={logout}>Logout</button></div></header><main><h1>My Video Scripts</h1><p className="muted">A simple place to save and manage your YouTube video scripts.</p>{message && <p className="message">{message}</p>}<section className="editor"><h2>{editing ? 'Edit script' : 'Add new script'}</h2><form onSubmit={saveScript}><label>Title<input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Video title" /></label><label>Script content<textarea required value={form.content} onChange={e => setForm({...form, content:e.target.value})} placeholder="Write your script or video idea here..." /></label><div className="row"><label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Draft</option><option>Recording</option><option>Published</option></select></label><label>Tags<input value={form.tags} onChange={e => setForm({...form, tags:e.target.value})} placeholder="tech, hinglish" /></label></div><button className="primary">{editing ? 'Update script' : 'Add script'}</button>{editing && <button type="button" className="cancel" onClick={() => { setEditing(null); setForm(emptyScript); }}>Cancel</button>}</form></section><div className="list-top"><h2>Saved scripts ({shown.length})</h2><div>{['All', 'Draft', 'Recording', 'Published'].map(x => <button className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div></div><section className="scripts">{shown.map(s => <article key={s._id}><div><h3>{s.title}</h3><p>{s.content || s.excerpt}</p><small><b className={s.status.toLowerCase()}>{s.status}</b> {s.tags?.length ? ` • ${s.tags.join(', ')}` : ''}</small></div><aside><button onClick={() => editScript(s)}>Edit</button><button className="danger" onClick={() => deleteScript(s._id)}>Delete</button></aside></article>)}{!shown.length && <p className="empty">No scripts yet. Add your first video idea above.</p>}</section></main></div>;
}
function Auth({ mode, setMode, form, setForm, onSubmit, message }) { return <div className="auth"><form onSubmit={onSubmit}><h1>Script Manager</h1><p>{mode === 'login' ? 'Login to manage your video scripts.' : 'Create a free account to get started.'}</p>{message && <p className="message">{message}</p>}{mode === 'register' && <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></label>}<label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label><label>Password<input type="password" required minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></label><button className="primary">{mode === 'login' ? 'Login' : 'Create account'}</button><button type="button" className="link" onClick={()=>{setMode(mode==='login'?'register':'login');setForm({name:'',email:'',password:''})}}>{mode === 'login' ? 'New user? Create an account' : 'Already have an account? Login'}</button></form></div> }
createRoot(document.getElementById('root')).render(<App />);
