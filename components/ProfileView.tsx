
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  isDarkMode: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateUser, isDarkMode }) => {
  const [name, setName] = useState(currentUser.name);
  const [celular, setCelular] = useState(currentUser.celular || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [fotoUrl, setFotoUrl] = useState(currentUser.fotoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({
        ...currentUser,
        name,
        celular,
        email,
        password,
        fotoUrl
      });
      setIsSaving(false);
      alert("Perfil atualizado com sucesso!");
    }, 600);
  };

  return (
    <div className={`flex-1 w-full h-full p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-500 transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-white/5 pb-8">
          <h2 className={`text-3xl font-black tracking-tighter uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Meus <span className="text-blue-500">Dados</span></h2>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Gestão de Perfil Operacional e Contato</p>
        </header>

        <div className={`rounded-[3rem] border p-12 shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
           <div className="flex flex-col items-center mb-10">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 bg-slate-950 border border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all overflow-hidden relative group shadow-2xl"
              >
                {fotoUrl ? (
                  <img src={fotoUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                     <svg className="w-10 h-10 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Alterar Foto</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              
              <div className="mt-6 text-center">
                 <h3 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h3>
                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">{currentUser.lotacao}</p>
                 <span className={`inline-block mt-3 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${currentUser.role === 'ADM' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {currentUser.role === 'ADM' ? 'GESTOR ADM' : 'OPERADOR TÁTICO'}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Matrícula (Login)</label>
                    <input type="text" readOnly value={currentUser.matricula} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black uppercase outline-none opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`} />
                 </div>
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>CPF</label>
                    <input type="text" readOnly value={currentUser.cpf} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black outline-none opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`} />
                 </div>
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Código de Acesso (Senha)</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-white/10 text-white focus:ring-2 focus:ring-blue-600' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'}`} />
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Celular de Contato</label>
                    <input type="text" placeholder="(00) 00000-0000" value={celular} onChange={e => setCelular(e.target.value)} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-white/10 text-white focus:ring-2 focus:ring-blue-600' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'}`} />
                 </div>
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>E-mail Corporativo</label>
                    <input type="email" placeholder="agente@pmce.gov.br" value={email} onChange={e => setEmail(e.target.value)} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-white/10 text-white focus:ring-2 focus:ring-blue-600' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'}`} />
                 </div>
                 <div>
                    <label className={`text-[9px] font-black uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Lotação Atual</label>
                    <input type="text" readOnly value={currentUser.lotacao} className={`w-full border rounded-2xl px-6 py-4 text-xs font-black uppercase outline-none opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`} />
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-10 border-t border-white/5">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Atualizar Credenciais"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
