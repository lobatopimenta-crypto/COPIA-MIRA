
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';

interface AdminViewProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onToggleUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ users, onAddUser, onUpdateUser, onToggleUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newMatricula, setNewMatricula] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('OPERATOR');
  const [newCpf, setNewCpf] = useState('');
  const [newDataNascimento, setNewDataNascimento] = useState('');
  const [newLotacao, setNewLotacao] = useState('');
  const [newCelular, setNewCelular] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFotoUrl, setNewFotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setNewName(user.name);
    setNewMatricula(user.matricula);
    setNewPassword(user.password || '');
    setNewRole(user.role);
    setNewCpf(user.cpf);
    setNewDataNascimento(user.dataNascimento);
    setNewLotacao(user.lotacao);
    setNewCelular(user.celular || '');
    setNewEmail(user.email || '');
    setNewFotoUrl(user.fotoUrl || '');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMatricula || !newPassword || !newCpf || !newLotacao) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const userData: User = {
      id: editingUser ? editingUser.id : Math.random().toString(36).substr(2, 9),
      name: newName.toUpperCase(),
      matricula: newMatricula.toLowerCase().trim(),
      password: newPassword.trim(),
      role: newRole,
      active: editingUser ? editingUser.active : true,
      cpf: newCpf,
      dataNascimento: newDataNascimento,
      lotacao: newLotacao,
      celular: newCelular,
      email: newEmail,
      fotoUrl: newFotoUrl
    };

    if (editingUser) {
      onUpdateUser(userData);
    } else {
      onAddUser(userData);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewMatricula('');
    setNewPassword('');
    setNewRole('OPERATOR');
    setNewCpf('');
    setNewDataNascimento('');
    setNewLotacao('');
    setNewCelular('');
    setNewEmail('');
    setNewFotoUrl('');
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Gestão de <span className="text-blue-500">Efetivo</span></h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Controle Central de Operadores e Credenciais</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all border border-white/10"
          >
            Novo Operador
          </button>
        </header>

        <div className="bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                <th className="p-8">Identificação / Matrícula</th>
                <th className="p-8">Lotação / Cargo</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Comandos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-8">
                     <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mr-6 border border-white/5 overflow-hidden text-blue-400">
                           {user.fotoUrl ? (
                             <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
                           ) : (
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                           )}
                        </div>
                        <div>
                           <p className="text-xs font-black text-white uppercase">{user.name}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Matrícula: {user.matricula}</p>
                        </div>
                     </div>
                  </td>
                  <td className="p-8">
                     <p className="text-[10px] text-white font-black uppercase mb-1">{user.lotacao}</p>
                     <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${user.role === 'ADM' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                        {user.role === 'OPERATOR' ? 'OPERADOR' : user.role}
                     </span>
                  </td>
                  <td className="p-8">
                     <div className="flex items-center">
                        <span className={`w-2.5 h-2.5 rounded-full mr-3 ${user.active ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-emerald-500' : 'text-red-500'}`}>
                           {user.active ? 'Em Serviço' : 'Acesso Revogado'}
                        </span>
                     </div>
                  </td>
                  <td className="p-8 text-right">
                     <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-xl bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
                        >
                           Editar
                        </button>
                        <button 
                          onClick={() => onToggleUser(user.id)} 
                          className={`text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${user.active ? 'bg-slate-950 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20'}`}
                        >
                           {user.active ? 'Revogar' : 'Autorizar'}
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[500] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-slate-900 rounded-[3rem] p-12 max-w-2xl w-full border border-white/5 shadow-2xl animate-in zoom-in overflow-y-auto max-h-[90vh] custom-scrollbar">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 text-center italic">
                {editingUser ? 'Editar' : 'Novo'} <span className="text-blue-500">Credenciamento</span>
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 
                 <div className="flex flex-col items-center mb-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-all overflow-hidden relative group"
                    >
                      {newFotoUrl ? (
                        <img src={newFotoUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                           <svg className="w-8 h-8 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                           <p className="text-[6px] font-black text-slate-500 uppercase mt-2">Foto</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[8px] font-black text-white uppercase">Mudar</span>
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nome Completo *</label>
                        <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="NOME DO AGENTE" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">CPF *</label>
                        <input type="text" required value={newCpf} onChange={e => setNewCpf(e.target.value)} placeholder="000.000.000-00" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Matrícula *</label>
                       <input type="text" required value={newMatricula} onChange={e => setNewMatricula(e.target.value)} placeholder="login" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white lowercase outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Perfil Tático</label>
                       <select value={newRole} onChange={e => setNewRole(e.target.value as any)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white outline-none focus:ring-2 focus:ring-blue-600">
                          <option value="OPERATOR">OPERADOR</option>
                          <option value="ADM">GESTOR (ADM)</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Data de Nascimento</label>
                       <input type="date" value={newDataNascimento} onChange={e => setNewDataNascimento(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Lotação *</label>
                       <input type="text" required value={newLotacao} onChange={e => setNewLotacao(e.target.value)} placeholder="UNIDADE / PELOTÃO" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Celular</label>
                       <input type="text" value={newCelular} onChange={e => setNewCelular(e.target.value)} placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">E-mail</label>
                       <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="agente@pmce.gov.br" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                 </div>

                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Código de Acesso (Senha) *</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                 </div>

                 <div className="flex space-x-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                    <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/30">
                      {editingUser ? 'Atualizar' : 'Autorizar'} Acesso
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
