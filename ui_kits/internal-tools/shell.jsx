// Shared shell for Internal Tools: roles, nav gating, sidebar, ThemeToggle. Loaded via <script type="text/babel" src="./shell.js"> before each page's own script.
(function(){
const NS = window.Flow || {};
const { Select, Avatar } = NS;

const ROLES = [
  {id:'admin', label:'Admin'},
  {id:'agente', label:'Agente de soporte'},
  {id:'pricing', label:'Pricing / Finanzas'},
  {id:'ops', label:'Ops / Back-office'},
  {id:'growth', label:'Growth / Producto'},
];

const NAV = [
  {id:'resumen', label:'Resumen', icon:'space_dashboard', href:'./index.html', roles:['admin','agente','pricing','ops','growth']},
  {id:'tickets', label:'Tickets', icon:'confirmation_number', href:'./tickets.html', roles:['admin','agente']},
  {id:'cuentas', label:'Cuentas', icon:'apartment', href:'./accounts.html', roles:['admin','agente','pricing','ops','growth']},
  {id:'pricing', label:'Pricing', icon:'sell', href:'./pricing.html', roles:['admin','pricing']},
  {id:'casos', label:'Casos', icon:'gavel', href:'./cases.html', roles:['admin','agente']},
  {id:'backoffice', label:'Back-office', icon:'fact_check', href:'./backoffice.html', roles:['admin','ops']},
  {id:'growth', label:'Growth · Onboarding', icon:'trending_up', href:'./growth.html', roles:['admin','growth']},
];

function useRole(){
  const [role, setRoleState] = React.useState('admin');
  React.useEffect(()=>{ const saved = localStorage.getItem('flow-it-role'); if(saved) setRoleState(saved); },[]);
  const setRole = (r)=>{ setRoleState(r); localStorage.setItem('flow-it-role', r); };
  return [role, setRole];
}

const THEMES = [
  {id:'light', icon:'light_mode', label:'Claro'},
  {id:'dark', icon:'dark_mode', label:'Oscuro'},
];

function ThemeToggle(){
  const [theme,setTheme] = React.useState('light');
  React.useEffect(()=>{
    const saved = localStorage.getItem('flow-theme');
    const t = THEMES.some(x=>x.id===saved) ? saved : 'light';
    setTheme(t);
    document.documentElement.setAttribute('data-mode', t);
  },[]);
  const pick = (t)=>{
    setTheme(t);
    document.documentElement.setAttribute('data-mode', t);
    localStorage.setItem('flow-theme', t);
  };
  return <div role="group" aria-label="Tema" style={{display:'flex',border:'1px solid var(--border-subtle)',borderRadius:10,padding:2,gap:2}}>
    {THEMES.map(t=>{
      const active = t.id===theme;
      return <button key={t.id} onClick={()=>pick(t.id)} aria-label={t.label} aria-pressed={active} title={t.label}
        style={{width:'var(--hit-target-min)',height:'var(--hit-target-min)',border:'none',background:active?'var(--surface-sunken)':'transparent',borderRadius:'var(--radius-sm)',cursor:'pointer',color:active?'var(--text-primary)':'var(--text-muted)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
        <span className="flow-icon" aria-hidden="true" style={{fontSize:16}}>{t.icon}</span>
      </button>;
    })}
  </div>;
}

function Shell({active, role, setRole, children}){
  const visibleNav = NAV.filter(n=>n.roles.includes(role));
  const roleLabel = (ROLES.find(r=>r.id===role)||ROLES[0]).label;
  return <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
    <nav aria-label="Internal Tools" style={{width:240,flex:'none',background:'var(--surface-card)',borderRight:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',padding:'20px 12px',gap:2,boxSizing:'border-box'}}>
      <a href="./index.html" style={{display:'flex',alignItems:'center',gap:8,margin:'4px 10px 2px'}}>
        <img src="../../assets/flow-logo.png" alt="Flow" style={{height:22}} />
      </a>
      <div style={{fontSize:10.5,fontWeight:700,letterSpacing:'.08em',color:'var(--text-accent)',padding:'0 14px 10px'}}>INTERNAL TOOLS</div>
      <div style={{padding:'0 14px 14px'}}>
        <div style={{fontSize:10.5,fontWeight:700,color:'var(--text-muted)',marginBottom:5,letterSpacing:'.04em'}}>VIENDO COMO</div>
        {Select ? <Select value={role} onChange={setRole} options={ROLES.map(r=>({value:r.id,label:r.label}))} /> : null}
      </div>
      {visibleNav.map(n=>{
        const isActive = n.id===active;
        return <a key={n.id} href={n.href} style={{display:'flex',alignItems:'center',gap:12,minHeight:44,padding:'0 14px',textDecoration:'none',borderRadius:14,fontSize:13.5,fontWeight:isActive?700:500,background:isActive?'var(--surface-accent-subtle)':'transparent',color:isActive?'var(--text-accent)':'var(--text-secondary)'}}>
          <span className={'flow-icon'+(isActive?' flow-icon--fill':'')} aria-hidden="true" style={{fontSize:20}}>{n.icon}</span>{n.label}
        </a>;
      })}
      <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 6px'}}>
          <Avatar name={roleLabel} size="sm" status="online" />
          <div style={{flex:1,minWidth:0,fontSize:12.5,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{roleLabel}</div>
          <ThemeToggle/>
        </div>
      </div>
    </nav>
    <main style={{flex:1,overflowY:'auto',padding:32,boxSizing:'border-box'}} data-screen-label={active}>{children}</main>
  </div>;
}

function Guard({allowed, role, children}){
  const EmptyState = (window.Flow||{}).EmptyState;
  if (allowed.includes(role)) return children;
  const roleLabel = (ROLES.find(r=>r.id===role)||ROLES[0]).label;
  if (!EmptyState) return null;
  return <EmptyState icon="lock" title="Sin permiso para esta sección"
    description={'Tu rol actual ("'+roleLabel+'") no tiene acceso a este módulo. Cambia de rol en la barra lateral para explorarlo.'}
    style={{minHeight:'60vh',justifyContent:'center'}} />;
}

window.FlowIT = { ROLES, NAV, useRole, Shell, Guard };
})();
