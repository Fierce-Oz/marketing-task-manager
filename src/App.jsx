import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const ACCESS_PASSWORD = "F!ercearms2026";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const PLATFORM_COLORS = { Instagram:"#E1306C", Twitter:"#1DA1F2", Facebook:"#1877F2", LinkedIn:"#0A66C2", TikTok:"#69C9D0" };

const BG       = "#111213";
const SURFACE  = "#1c1d1f";
const SURFACE2 = "#252729";
const BORDER   = "#2e3033";
const BORDER2  = "#3a3d42";
const TEXT1    = "#f2f3f4";
const TEXT2    = "#9a9da3";
const TEXT3    = "#5a5d63";
const ORANGE   = "#d4420a";
const ORANGEHI = "#e85520";

const STATUS_COLORS = {
  "Not Started":{ bg:"#1c1d1f", text:"#5a5d63", border:"#2e3033" },
  "In Progress": { bg:"#1e2028", text:"#6b8ccc", border:"#2a3050" },
  "Review":      { bg:"#221a12", text:"#c47a30", border:"#3a2a18" },
  "Complete":    { bg:"#121e15", text:"#4a9e60", border:"#1a3020" },
};
const PRIORITY_COLORS = {
  Low:    { text:"#5a5d63", border:"#2e3033" },
  Medium: { text:"#c47a30", border:"#3a2a18" },
  High:   { text:"#c43030", border:"#3a1818" },
};
const MEMBER_COLORS = ["#d4420a","#6b8ccc","#4a9e60","#c47a30","#a07acc","#e85520","#3a9acc","#c43060"];
const COLOR_OPTIONS = ["#d4420a","#e85520","#c47a30","#4a9e60","#6b8ccc","#a07acc","#3a9acc","#c43060","#c43030","#5a5d63","#888","#2a9acc"];

// ── Channel tags ──────────────────────────────────────────────────────────────
const CHANNELS = ["Email","SMS","Social","Programmatic","Website","Influencer","Dealer","Other"];
const CHANNEL_COLORS = {
  Email:"#6b8ccc", SMS:"#4a9e60", Social:"#E1306C", Programmatic:"#a07acc",
  Website:"#c47a30", Influencer:"#e85520", Dealer:"#3a9acc", Other:"#5a5d63"
};

function getDaysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m){ return new Date(y,m,1).getDay(); }
function mkDate(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
const today = new Date();

function useIsMobile(){ const [m,setM]=useState(window.innerWidth<768); useEffect(()=>{ const h=()=>setM(window.innerWidth<768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]); return m; }

const FL = ({children})=><div style={{fontSize:11,color:TEXT3,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:6,fontWeight:500}}>{children}</div>;
const inputStyle = {width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT1,fontSize:14,padding:"11px 13px",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"};

function OrangeBtn({onClick,children,style={}}){
  return <button onClick={onClick} style={{background:ORANGE,border:"none",color:"#fff",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:500,...style}}>{children}</button>;
}
function GhostBtn({onClick,children,style={}}){
  return <button onClick={onClick} style={{background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",...style}}>{children}</button>;
}

function ModalOverlay({children,onClose,isMobile}){
  const mStyle=isMobile?{position:"fixed",inset:0,background:BG,zIndex:200,overflowY:"auto",padding:"0 0 40px"}:{position:"fixed",inset:0,background:"#00000099",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"};
  const innerStyle=isMobile?{padding:"16px 20px"}:{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:32,width:540,maxWidth:"92vw",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 32px 80px #00000099"};
  return(
    <div style={mStyle} onClick={isMobile?undefined:onClose}>
      <div style={innerStyle} onClick={e=>e.stopPropagation()}>
        {isMobile&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 20px",borderBottom:`1px solid ${BORDER}`,marginBottom:20}}><button onClick={onClose} style={{background:"none",border:"none",color:ORANGE,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button></div>}
        {children}
      </div>
    </div>
  );
}

function MA({onCancel,onSave,onDelete,saveLabel,isMobile}){
  return(
    <div style={{display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",alignItems:isMobile?"stretch":"center",gap:isMobile?10:0,marginTop:isMobile?8:0}}>
      {onDelete&&<button onClick={onDelete} style={{background:"#1f1010",border:"1px solid #3a1818",color:"#a05050",borderRadius:8,padding:"11px 16px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",order:isMobile?1:0}}>Delete</button>}
      <div style={{display:"flex",gap:8,order:isMobile?0:1}}>
        {!isMobile&&<GhostBtn onClick={onCancel}>Cancel</GhostBtn>}
        <OrangeBtn onClick={onSave} style={{flex:isMobile?1:undefined}}>{saveLabel}</OrangeBtn>
      </div>
    </div>
  );
}

function Avatar({name,color,size=28}){
  const initials=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",border:`1px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,color,fontWeight:600,flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>{initials}</div>;
}

// ── Progress bar component (for campaigns/programs) ───────────────────────────
function ProgressBar({value,color=ORANGE,height=4}){
  return(
    <div style={{height,background:SURFACE2,borderRadius:height,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,Math.max(0,value))}%`,background:value===100?"#4a9e60":color,borderRadius:height,transition:"width 0.3s"}}/>
    </div>
  );
}

function SubtaskPanel({taskId}){
  const [subtasks,setSubtasks]=useState([]);
  const [newName,setNewName]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ if(!taskId){setLoading(false);return;} supabase.from("subtasks").select("*").eq("task_id",taskId).order("position").then(({data})=>{ setSubtasks(data||[]); setLoading(false); }); },[taskId]);
  const completed=subtasks.filter(s=>s.completed).length;
  const total=subtasks.length;
  const pct=total>0?Math.round((completed/total)*100):0;
  const addSubtask=async()=>{ if(!newName.trim()) return; const{data}=await supabase.from("subtasks").insert({task_id:taskId,name:newName.trim(),position:total}).select().single(); setSubtasks(s=>[...s,data]); setNewName(""); };
  const toggleSubtask=async(sub)=>{ const{data}=await supabase.from("subtasks").update({completed:!sub.completed}).eq("id",sub.id).select().single(); setSubtasks(s=>s.map(x=>x.id===sub.id?data:x)); };
  const deleteSubtask=async(id)=>{ await supabase.from("subtasks").delete().eq("id",id); setSubtasks(s=>s.filter(x=>x.id!==id)); };
  if(loading) return <div style={{fontSize:13,color:TEXT3,padding:"8px 0"}}>Loading steps...</div>;
  return(
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><FL>Steps</FL>{total>0&&<span style={{fontSize:12,color:TEXT3}}>{completed}/{total} complete</span>}</div>
      {total>0&&<div style={{marginBottom:12}}><ProgressBar value={pct}/><div style={{fontSize:10,color:pct===100?"#4a9e60":TEXT3,textAlign:"right",marginTop:4}}>{pct}%</div></div>}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
        {subtasks.map((sub,idx)=>(
          <div key={sub.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:BG,borderRadius:8,border:`1px solid ${sub.completed?"#1a3020":BORDER}`}}>
            <button onClick={()=>toggleSubtask(sub)} style={{width:20,height:20,borderRadius:4,border:`1px solid ${sub.completed?"#4a9e60":BORDER2}`,background:sub.completed?"#4a9e6022":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0}}>{sub.completed&&<span style={{fontSize:12,color:"#4a9e60"}}>✓</span>}</button>
            <span style={{flex:1,fontSize:14,color:sub.completed?TEXT3:TEXT2,textDecoration:sub.completed?"line-through":"none"}}>{idx+1}. {sub.name}</span>
            <button onClick={()=>deleteSubtask(sub.id)} style={{background:"none",border:"none",color:TEXT3,cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1}}>×</button>
          </div>
        ))}
        {subtasks.length===0&&<div style={{fontSize:13,color:TEXT3,padding:"6px 0"}}>No steps yet</div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addSubtask();}} placeholder="Add a step..." style={{...inputStyle,flex:1,fontSize:14}}/>
        <button onClick={addSubtask} style={{background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:8,padding:"11px 16px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>+ Add</button>
      </div>
    </div>
  );
}

function EventTypeManager({eventTypes,setEventTypes,onClose,isMobile}){
  const [newName,setNewName]=useState("");
  const [newColor,setNewColor]=useState(COLOR_OPTIONS[0]);
  const [err,setErr]=useState("");
  const addType=async()=>{ if(!newName.trim()){setErr("Enter a name."); return;} if(eventTypes.find(t=>t.name.toLowerCase()===newName.trim().toLowerCase())){setErr("Already exists."); return;} const{data,error}=await supabase.from("event_types").insert({name:newName.trim(),color:newColor}).select().single(); if(error){setErr("Error saving."); return;} setEventTypes(prev=>[...prev,data]); setNewName(""); setErr(""); };
  const deleteType=async(id)=>{ await supabase.from("event_types").delete().eq("id",id); setEventTypes(prev=>prev.filter(t=>t.id!==id)); };
  return(
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4,color:TEXT1}}>Manage Event Types</div>
      <div style={{fontSize:13,color:TEXT3,marginBottom:20}}>Add or remove tags for the Events calendar</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {eventTypes.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:SURFACE2,border:`1px solid ${BORDER}`,borderRadius:8}}>
            <div style={{width:12,height:12,borderRadius:3,background:t.color,flexShrink:0}}/>
            <span style={{flex:1,fontSize:14,color:TEXT1}}>{t.name}</span>
            <button onClick={()=>deleteType(t.id)} style={{background:"none",border:"none",color:TEXT3,cursor:"pointer",fontSize:20,padding:"0 4px",lineHeight:1}}>×</button>
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:18}}>
        <FL>Add New Type</FL>
        <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addType();}} placeholder="Type name..." style={{...inputStyle,marginBottom:12}}/>
        <FL>Color</FL>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>{COLOR_OPTIONS.map(c=><button key={c} onClick={()=>setNewColor(c)} style={{width:28,height:28,borderRadius:5,background:c,border:newColor===c?`2px solid ${TEXT1}`:`2px solid transparent`,cursor:"pointer",padding:0,flexShrink:0}}/>)}</div>
        {err&&<div style={{fontSize:13,color:"#c47a30",marginBottom:12}}>{err}</div>}
        <OrangeBtn onClick={addType} style={{width:"100%"}}>+ Add Type</OrangeBtn>
      </div>
    </ModalOverlay>
  );
}

function ProfileModal({currentUser,setCurrentUser,onClose,isMobile}){
  const [email,setEmail]=useState(currentUser.email||"");
  const [name,setName]=useState(currentUser.name||"");
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const save=async()=>{ setSaving(true); const{data,error}=await supabase.from("members").update({email:email.trim(),name:name.trim()}).eq("id",currentUser.id).select().single(); setSaving(false); if(error){setMsg("Error saving."); return;} const updated={...currentUser,...data}; localStorage.setItem("cp_user",JSON.stringify(updated)); setCurrentUser(updated); setMsg("Saved!"); setTimeout(()=>onClose(),800); };
  return(
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4,color:TEXT1}}>Edit Profile</div>
      <div style={{fontSize:13,color:TEXT3,marginBottom:20}}>Update your name or email</div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><Avatar name={currentUser.name} color={currentUser.color} size={60}/></div>
      <FL>Name</FL>
      <input value={name} onChange={e=>setName(e.target.value)} style={{...inputStyle,marginBottom:14}}/>
      <FL>Email Address</FL>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@fiercearms.com" style={{...inputStyle,marginBottom:8}}/>
      <div style={{fontSize:12,color:TEXT3,marginBottom:20}}>Used for task assignment notifications</div>
      {msg&&<div style={{fontSize:13,color:"#4a9e60",marginBottom:12}}>{msg}</div>}
      <MA onCancel={onClose} onSave={save} saveLabel={saving?"Saving...":"Save Profile"} isMobile={isMobile}/>
    </ModalOverlay>
  );
}

function AuthScreen({onAuth}){
  const isMobile=useIsMobile();
  const [mode,setMode]=useState("login");
  const [pw,setPw]=useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [role,setRole]=useState("Member");
  const [err,setErr]=useState("");
  const [members,setMembers]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ supabase.from("members").select("*").order("created_at").then(({data})=>{ setMembers(data||[]); setLoading(false); }); },[]);
  const handleLogin=()=>{ if(pw!==ACCESS_PASSWORD){setErr("Incorrect password."); return;} if(members.length===0){setMode("register"); setErr("No accounts yet — create yours first."); return;} setErr("Password accepted — who are you?"); setMode("pick"); };
  const handleRegister=async()=>{ if(pw!==ACCESS_PASSWORD){setErr("Incorrect password."); return;} if(!name.trim()){setErr("Enter your name."); return;} if(members.find(m=>m.name.toLowerCase()===name.trim().toLowerCase())){setErr("That name is taken."); return;} const color=MEMBER_COLORS[members.length%MEMBER_COLORS.length]; const{data,error}=await supabase.from("members").insert({name:name.trim(),email:email.trim(),role,color}).select().single(); if(error){setErr("Error creating account."); return;} onAuth(data); };
  if(loading) return <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Loading...</div>;
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:"20px 16px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <div style={{width:"100%",maxWidth:420,background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:14,padding:isMobile?"24px 20px":40,boxShadow:"0 24px 80px #00000099"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:4,height:32,background:ORANGE,borderRadius:2}}/>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?18:22,color:TEXT1,lineHeight:1.2}}>Sales & Marketing</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?18:22,color:ORANGE,lineHeight:1.2}}>Task Manager</div></div>
        </div>
        <div style={{fontSize:11,color:TEXT3,marginBottom:24,letterSpacing:"0.1em",textTransform:"uppercase"}}>Team Access · Fierce Firearms</div>
        {mode==="pick"&&(
          <>
            <div style={{fontSize:14,color:TEXT2,marginBottom:14}}>Who are you?</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {members.map(m=>(
                <button key={m.id} onClick={()=>onAuth(m)} style={{display:"flex",alignItems:"center",gap:12,background:SURFACE2,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",color:TEXT1,fontFamily:"'DM Sans',sans-serif",fontSize:14,textAlign:"left",width:"100%"}}>
                  <Avatar name={m.name} color={m.color} size={36}/>
                  <div><div style={{fontWeight:500}}>{m.name}</div><div style={{fontSize:12,color:TEXT3}}>{m.role}{m.email?` · ${m.email}`:""}</div></div>
                </button>
              ))}
            </div>
            <button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>+ Create new account</button>
          </>
        )}
        {(mode==="login"||mode==="register")&&(
          <>
            <FL>Team Password</FL>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") mode==="login"?handleLogin():handleRegister();}} placeholder="Enter team password" style={{...inputStyle,marginBottom:16}}/>
            {mode==="register"&&(<><FL>Your Name</FL><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{...inputStyle,marginBottom:12}}/><FL>Email Address</FL><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@fiercearms.com" style={{...inputStyle,marginBottom:12}}/><FL>Role</FL><select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,marginBottom:20}}>{["Admin","Manager","Member","Contractor"].map(r=><option key={r}>{r}</option>)}</select></>)}
            {err&&<div style={{fontSize:13,color:"#c47a30",marginBottom:12}}>{err}</div>}
            <OrangeBtn onClick={mode==="login"?handleLogin:handleRegister} style={{width:"100%",marginBottom:14,padding:"13px 0",fontSize:15}}>{mode==="login"?"Enter":"Create Account & Enter"}</OrangeBtn>
            {mode==="login"?<button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>New here? Create an account</button>:<button onClick={()=>{setMode("login");setErr("");}} style={{background:"none",border:"none",color:TEXT3,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>Back to login</button>}
          </>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [currentUser,setCurrentUser]=useState(()=>{ try{ const s=localStorage.getItem("cp_user"); return s?JSON.parse(s):null; }catch(e){ return null; } });
  const handleAuth=(user)=>{ localStorage.setItem("cp_user",JSON.stringify(user)); setCurrentUser(user); };
  const handleLogout=()=>{ localStorage.removeItem("cp_user"); setCurrentUser(null); };
  if(!currentUser) return <AuthScreen onAuth={handleAuth}/>;
  return <MainApp currentUser={currentUser} setCurrentUser={(u)=>{ localStorage.setItem("cp_user",JSON.stringify(u)); setCurrentUser(u); }} onLogout={handleLogout}/>;
}

function MainApp({currentUser,setCurrentUser,onLogout}){
  const isMobile=useIsMobile();
  const [tab,setTab]=useState("content");
  const [programs,setPrograms]=useState([]);
  const [campaigns,setCampaigns]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [posts,setPosts]=useState([]);
  const [events,setEvents]=useState([]);
  const [members,setMembers]=useState([]);
  const [eventTypes,setEventTypes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showTypeManager,setShowTypeManager]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);

  // calendar filter
  const [calChannelFilter,setCalChannelFilter]=useState("All");

  const [contentYear,setContentYear]=useState(today.getFullYear());
  const [contentMonth,setContentMonth]=useState(today.getMonth());
  const [eventsYear,setEventsYear]=useState(today.getFullYear());
  const [eventsMonth,setEventsMonth]=useState(today.getMonth());

  const [postModal,setPostModal]=useState(null);
  const [postForm,setPostForm]=useState({caption:"",platform:"Instagram",image_url:"",campaign_id:"",task_id:""});
  const [dragOver,setDragOver]=useState(null);
  const fileRef=useRef();

  const [eventModal,setEventModal]=useState(null);
  const [eventForm,setEventForm]=useState({title:"",event_date:"",end_date:"",location:"",description:"",event_type:"",assignee_id:""});

  const [activeList,setActiveList]=useState("tasks");
  const [channelFilter,setChannelFilter]=useState("All");
  const [itemModal,setItemModal]=useState(null);
  const [itemForm,setItemForm]=useState({});
  const [searchQ,setSearchQ]=useState("");

  useEffect(()=>{
    async function fetchAll(){
      const [m,p,ca,t,po,ev,et]=await Promise.all([
        supabase.from("members").select("*").order("created_at"),
        supabase.from("programs").select("*").order("created_at"),
        supabase.from("campaigns").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
        supabase.from("posts").select("*").order("post_date"),
        supabase.from("events").select("*").order("event_date"),
        supabase.from("event_types").select("*").order("created_at"),
      ]);
      setMembers(m.data||[]); setPrograms(p.data||[]); setCampaigns(ca.data||[]);
      setTasks(t.data||[]); setPosts(po.data||[]); setEvents(ev.data||[]);
      setEventTypes(et.data||[]); setLoading(false);
    }
    fetchAll();
  },[]);

  // ── Progress helpers ──────────────────────────────────────────────────────
  const getCampaignProgress=(campaignId)=>{
    const linked=tasks.filter(t=>t.campaign_id===campaignId);
    if(!linked.length) return null;
    const done=linked.filter(t=>t.status==="Complete").length;
    return{done,total:linked.length,pct:Math.round((done/linked.length)*100)};
  };
  const getProgramProgress=(programId)=>{
    const linkedCampaigns=campaigns.filter(c=>c.program_id===programId);
    const linkedTasks=tasks.filter(t=>{
      if(t.campaign_id){ const camp=campaigns.find(c=>c.id===t.campaign_id); return camp&&camp.program_id===programId; }
      return false;
    });
    if(!linkedTasks.length&&!linkedCampaigns.length) return null;
    const allTasks=linkedTasks.length?linkedTasks:[];
    if(!allTasks.length) return null;
    const done=allTasks.filter(t=>t.status==="Complete").length;
    return{done,total:allTasks.length,pct:Math.round((done/allTasks.length)*100)};
  };

  const getEventTypeColor=(name)=>{ const t=eventTypes.find(t=>t.name===name); return t?t.color:TEXT3; };
  const prevContent=()=>{ if(contentMonth===0){setContentMonth(11);setContentYear(y=>y-1);}else setContentMonth(m=>m-1); };
  const nextContent=()=>{ if(contentMonth===11){setContentMonth(0);setContentYear(y=>y+1);}else setContentMonth(m=>m+1); };
  const prevEvents=()=>{ if(eventsMonth===0){setEventsMonth(11);setEventsYear(y=>y-1);}else setEventsMonth(m=>m-1); };
  const nextEvents=()=>{ if(eventsMonth===11){setEventsMonth(0);setEventsYear(y=>y+1);}else setEventsMonth(m=>m+1); };

  const openAddPost=(day)=>{ setPostModal({day,ds:mkDate(contentYear,contentMonth,day)}); setPostForm({caption:"",platform:"Instagram",image_url:"",campaign_id:"",task_id:""}); };
  const openEditPost=(post)=>{ setPostModal({day:parseInt(post.post_date.split("-")[2]),ds:post.post_date,editId:post.id}); setPostForm({caption:post.caption,platform:post.platform,image_url:post.image_url||"",campaign_id:post.campaign_id||"",task_id:post.task_id||""}); };
  const savePost=async()=>{
    if(postModal.editId){ const{data}=await supabase.from("posts").update({...postForm,campaign_id:postForm.campaign_id||null,task_id:postForm.task_id||null}).eq("id",postModal.editId).select().single(); setPosts(p=>p.map(post=>post.id===postModal.editId?data:post)); }
    else{ const{data}=await supabase.from("posts").insert({...postForm,post_date:postModal.ds,created_by:currentUser.id,campaign_id:postForm.campaign_id||null,task_id:postForm.task_id||null}).select().single(); setPosts(p=>[...p,data]); }
    setPostModal(null);
  };
  const deletePost=async(id)=>{ await supabase.from("posts").delete().eq("id",id); setPosts(p=>p.filter(post=>post.id!==id)); setPostModal(null); };
  const handleImageFile=(file)=>{ if(!file||!file.type.startsWith("image/")) return; setPostForm(f=>({...f,image_url:URL.createObjectURL(file)})); };
  const handleCalDrop=async(e,day)=>{
    e.preventDefault(); setDragOver(null);
    const file=e.dataTransfer.files[0];
    if(file&&file.type.startsWith("image/")){
      const url=URL.createObjectURL(file); const ds=mkDate(contentYear,contentMonth,day);
      const{data}=await supabase.from("posts").insert({caption:"",platform:"Instagram",image_url:url,post_date:ds,created_by:currentUser.id}).select().single();
      setPosts(p=>[...p,data]); setPostModal({day,ds,editId:data.id}); setPostForm({caption:"",platform:"Instagram",image_url:url,campaign_id:"",task_id:""});
    }
  };

  // ── Calendar day data ─────────────────────────────────────────────────────
  const getDayPosts=(day)=>{ const ds=mkDate(contentYear,contentMonth,day); return posts.filter(p=>p.post_date===ds); };
  const getDayTasks=(day)=>{
    const ds=mkDate(contentYear,contentMonth,day);
    return tasks.filter(t=>t.due_date===ds&&(calChannelFilter==="All"||t.channel===calChannelFilter));
  };
  const isToday=(y,m,day)=>day===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();

  const openAddEvent=(day)=>{ const ds=mkDate(eventsYear,eventsMonth,day); const defaultType=eventTypes[0]?.name||""; setEventModal({day}); setEventForm({title:"",event_date:ds,end_date:"",location:"",description:"",event_type:defaultType,assignee_id:""}); };
  const openEditEvent=(ev)=>{ setEventModal({editId:ev.id}); setEventForm({title:ev.title,event_date:ev.event_date,end_date:ev.end_date||"",location:ev.location||"",description:ev.description||"",event_type:ev.event_type||"",assignee_id:ev.assignee_id||""}); };
  const saveEvent=async()=>{
    const payload={...eventForm,assignee_id:eventForm.assignee_id||null,end_date:eventForm.end_date||null};
    if(eventModal.editId){ const{data}=await supabase.from("events").update(payload).eq("id",eventModal.editId).select().single(); setEvents(e=>e.map(ev=>ev.id===eventModal.editId?data:ev)); }
    else{ const{data}=await supabase.from("events").insert(payload).select().single(); setEvents(e=>[...e,data]); }
    setEventModal(null);
  };
  const deleteEvent=async(id)=>{ await supabase.from("events").delete().eq("id",id); setEvents(e=>e.filter(ev=>ev.id!==id)); setEventModal(null); };
  const getDayEvents=(day)=>{ const ds=mkDate(eventsYear,eventsMonth,day); return events.filter(ev=>{ if(ev.event_date===ds) return true; if(ev.end_date&&ev.event_date<=ds&&ev.end_date>=ds) return true; return false; }); };

  const listConfig={ programs:{label:"Programs",data:programs,setData:setPrograms,table:"programs"}, campaigns:{label:"Campaigns",data:campaigns,setData:setCampaigns,table:"campaigns"}, tasks:{label:"Tasks",data:tasks,setData:setTasks,table:"tasks"} };
  const openNewItem=()=>{ const defaults={ programs:{name:"",status:"Not Started",description:""}, campaigns:{name:"",status:"Not Started",priority:"Medium",program_id:"",description:""}, tasks:{name:"",status:"Not Started",priority:"Medium",campaign_id:"",due_date:"",description:"",assignee_id:"",channel:""} }; setItemModal({type:activeList}); setItemForm(defaults[activeList]); };
  const openEditItem=(type,item)=>{ setItemModal({type,editId:item.id}); setItemForm({...item}); };
  const saveItem=async()=>{
    const{table,setData,data}=listConfig[itemModal.type];
    const payload={...itemForm};
    if(payload.program_id==="") payload.program_id=null;
    if(payload.campaign_id==="") payload.campaign_id=null;
    if(payload.assignee_id==="") payload.assignee_id=null;
    if(payload.due_date==="") payload.due_date=null;
    if(payload.channel==="") payload.channel=null;
    delete payload.id; delete payload.created_at;
    if(itemModal.editId){ const{data:updated}=await supabase.from(table).update(payload).eq("id",itemModal.editId).select().single(); setData(data.map(i=>i.id===itemModal.editId?updated:i)); }
    else{ const{data:created}=await supabase.from(table).insert(payload).select().single(); setData([...data,created]); }
    setItemModal(null);
  };
  const deleteItem=async()=>{ const{table,setData,data}=listConfig[itemModal.type]; await supabase.from(table).delete().eq("id",itemModal.editId); setData(data.filter(i=>i.id!==itemModal.editId)); setItemModal(null); };

  const filteredData=(type)=>{
    const{data}=listConfig[type];
    let result=data;
    if(searchQ) result=result.filter(i=>i.name.toLowerCase().includes(searchQ.toLowerCase()));
    if(type==="tasks"&&channelFilter!=="All") result=result.filter(i=>i.channel===channelFilter);
    return result;
  };

  const memberStats=members.map(m=>{ const myTasks=tasks.filter(t=>t.assignee_id===m.id); const byStatus={}; Object.keys(STATUS_COLORS).forEach(s=>{ byStatus[s]=myTasks.filter(t=>t.status===s).length; }); return{...m,tasks:myTasks,byStatus,total:myTasks.length}; });

  if(loading) return <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Loading...</div>;

  const tabs=[["content","Calendar"],["events","Events"],["tasks","Tasks"],["team","Team"]];
  const pad=isMobile?"16px":"32px 40px";

  // ── Calendar renderer ─────────────────────────────────────────────────────
  const renderCalendar=(year,month,onPrev,onNext,getDayItems,renderDayItem,onAddItem,extraHeader)=>{
    const daysInMonth=getDaysInMonth(year,month);
    const firstDay=getFirstDay(year,month);
    const cells=[];
    for(let i=0;i<firstDay;i++) cells.push(null);
    for(let d=1;d<=daysInMonth;d++) cells.push(d);
    return(
      <div style={{padding:pad}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={onPrev} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?18:22,color:TEXT1}}>{isMobile?MONTHS_SHORT[month]:MONTHS[month]} {year}</span>
          <button onClick={onNext} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </div>
        {extraHeader&&<div style={{marginBottom:14}}>{extraHeader}</div>}
        <div style={{overflowX:isMobile?"auto":"visible"}}>
          <div style={{minWidth:isMobile?420:"auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
              {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:TEXT3,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 0"}}>{isMobile?d[0]:d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
              {cells.map((day,i)=>{
                const dayItems=day?getDayItems(day):[];
                const isDrag=dragOver===i;
                return(
                  <div key={i}
                    onDragOver={day?(e)=>{e.preventDefault();setDragOver(i);}:undefined}
                    onDragLeave={day?()=>setDragOver(null):undefined}
                    onDrop={day?(e)=>handleCalDrop(e,day):undefined}
                    style={{minHeight:isMobile?90:110,background:day?(isDrag?"#1a2218":SURFACE):"transparent",border:isDrag?`1px dashed ${ORANGE}`:day?`1px solid ${BORDER}`:"none",borderRadius:5,padding:day?"6px":0,position:"relative",overflow:"hidden"}}
                  >
                    {day&&(
                      <>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:11,fontWeight:isToday(year,month,day)?600:400,color:isToday(year,month,day)?ORANGE:TEXT3,background:isToday(year,month,day)?ORANGE+"22":"transparent",borderRadius:3,padding:isToday(year,month,day)?"1px 4px":0}}>{day}</span>
                          <button onClick={()=>onAddItem(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:3,width:16,height:16,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:2}}>
                          {dayItems.slice(0,3).map(item=>renderDayItem(item))}
                          {dayItems.length>3&&<div style={{fontSize:9,color:TEXT3}}>+{dayItems.length-3}</div>}
                        </div>
                        {isDrag&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#00000066",fontSize:9,color:ORANGE,pointerEvents:"none"}}>Drop</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Combined content calendar day items ───────────────────────────────────
  const getContentDayItems=(day)=>{
    const postItems=getDayPosts(day).map(p=>({...p,_type:"post"}));
    const taskItems=getDayTasks(day).map(t=>({...t,_type:"task"}));
    return [...postItems,...taskItems];
  };

  const renderContentDayItem=(item)=>{
    if(item._type==="post"){
      const linked=item.campaign_id?campaigns.find(c=>c.id===item.campaign_id):null;
      return(
        <div key={`post-${item.id}`} onClick={()=>openEditPost(item)} style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${PLATFORM_COLORS[item.platform]}`}}>
          {item.image_url&&<img src={item.image_url} alt="" style={{width:14,height:14,objectFit:"cover",borderRadius:2,flexShrink:0}}/>}
          <span style={{fontSize:9,color:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{item.caption||"Post"}</span>
          {linked&&<span style={{fontSize:8,color:ORANGE,flexShrink:0}}>●</span>}
        </div>
      );
    }
    // task due date chip
    const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
    const chColor=item.channel?CHANNEL_COLORS[item.channel]||TEXT3:TEXT3;
    return(
      <div key={`task-${item.id}`} onClick={()=>openEditItem("tasks",item)} style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${chColor}`}}>
        <span style={{fontSize:9,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>📌 {item.name}</span>
        {assignee&&<div style={{width:10,height:10,borderRadius:"50%",background:assignee.color,flexShrink:0}}/>}
      </div>
    );
  };

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'DM Sans',sans-serif",color:TEXT1,paddingBottom:isMobile?70:0}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${BORDER}`,padding:isMobile?"0 16px":"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:SURFACE,position:"sticky",top:0,zIndex:20,height:52}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:3,height:20,background:ORANGE,borderRadius:2}}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?14:17,color:TEXT1}}>{isMobile?"Task Manager":<>Sales & Marketing <span style={{color:ORANGE}}>Task Manager</span></>}</span>
        </div>
        {!isMobile&&<div style={{display:"flex"}}>{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:tab===id?`2px solid ${ORANGE}`:"2px solid transparent",color:tab===id?TEXT1:TEXT3,padding:"0 18px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===id?500:400,height:52}}>{id==="content"?"Content Calendar":label}</button>)}</div>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:0}}>
            <Avatar name={currentUser.name} color={currentUser.color} size={26}/>
            {!isMobile&&<div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:500,color:TEXT1}}>{currentUser.name}</div><div style={{fontSize:11,color:TEXT2}}>{currentUser.email||"Add email"}</div></div>}
          </button>
          {!isMobile&&<button onClick={onLogout} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",marginLeft:4}}>Switch</button>}
          {isMobile&&<button onClick={()=>setMenuOpen(v=>!v)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:18,lineHeight:1}}>☰</button>}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile&&menuOpen&&(
        <div style={{position:"fixed",top:52,right:0,left:0,background:SURFACE,borderBottom:`1px solid ${BORDER}`,zIndex:19,padding:"8px 0"}}>
          {[["content","Content Calendar"],["events","Events"],["tasks","Task Manager"],["team","Team"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setTab(id);setMenuOpen(false);}} style={{width:"100%",background:tab===id?SURFACE2:"transparent",border:"none",borderLeft:tab===id?`3px solid ${ORANGE}`:"3px solid transparent",color:tab===id?TEXT1:TEXT2,padding:"14px 20px",cursor:"pointer",fontSize:15,fontFamily:"'DM Sans',sans-serif",textAlign:"left",display:"block"}}>{label}</button>
          ))}
          <div style={{borderTop:`1px solid ${BORDER}`,margin:"8px 0"}}/>
          <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{width:"100%",background:"transparent",border:"none",color:TEXT3,padding:"12px 20px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>Switch Account</button>
        </div>
      )}

      {/* CONTENT CALENDAR */}
      {tab==="content"&&renderCalendar(
        contentYear,contentMonth,prevContent,nextContent,
         getDayPosts,
        (post)=>{
          const linked=post.campaign_id?campaigns.find(c=>c.id===post.campaign_id):null;
          return(
            <div key={`post-${post.id}`} onClick={()=>openEditPost(post)} style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${PLATFORM_COLORS[post.platform]}`}}>
              {post.image_url&&<img src={post.image_url} alt="" style={{width:14,height:14,objectFit:"cover",borderRadius:2,flexShrink:0}}/>}
              <span style={{fontSize:9,color:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{post.caption||"Post"}</span>
              {linked&&<span style={{fontSize:8,color:ORANGE,flexShrink:0}}>●</span>}
            </div>
          );
        },
        openAddPost,
        // channel filter bar
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:TEXT3,marginRight:4}}>Filter:</span>
          {["All",...CHANNELS].map(ch=>(
            <button key={ch} onClick={()=>setCalChannelFilter(ch)} style={{fontSize:11,color:calChannelFilter===ch?(ch==="All"?TEXT1:CHANNEL_COLORS[ch]||TEXT1):TEXT3,background:calChannelFilter===ch?SURFACE2:"transparent",border:`1px solid ${calChannelFilter===ch?(ch==="All"?BORDER2:CHANNEL_COLORS[ch]||BORDER2):BORDER}`,borderRadius:4,padding:"3px 9px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {ch}
            </button>
          ))}
        </div>
      )}

      {/* EVENTS CALENDAR */}
      {tab==="events"&&(
        <div>
          {renderCalendar(eventsYear,eventsMonth,prevEvents,nextEvents,getDayEvents,
            (ev)=>{
              const c=getEventTypeColor(ev.event_type);
              return <div key={ev.id} onClick={()=>openEditEvent(ev)} style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${c}`}}><span style={{fontSize:9,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{ev.title}</span></div>;
            },openAddEvent
          )}
          <div style={{padding:isMobile?"0 16px 16px":"0 40px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            {eventTypes.map(t=><span key={t.id} style={{fontSize:11,color:t.color,border:`1px solid ${t.color}44`,borderRadius:4,padding:"2px 8px"}}>{t.name}</span>)}
            <button onClick={()=>setShowTypeManager(true)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:4,padding:"2px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>+ Manage Tags</button>
          </div>
        </div>
      )}

      {/* TASK MANAGER */}
      {tab==="tasks"&&(
        <div style={{padding:pad}}>
          {/* List switcher */}
          <div style={{display:"flex",gap:4,marginBottom:16,background:SURFACE,borderRadius:8,padding:4,border:`1px solid ${BORDER}`}}>
            {Object.entries(listConfig).map(([key,{label}])=>(
              <button key={key} onClick={()=>{setActiveList(key);setSearchQ("");setChannelFilter("All");}} style={{flex:1,background:activeList===key?SURFACE2:"transparent",border:activeList===key?`1px solid ${BORDER2}`:"1px solid transparent",color:activeList===key?TEXT1:TEXT3,borderRadius:6,padding:"8px 4px",cursor:"pointer",fontSize:isMobile?12:13,fontFamily:"'DM Sans',sans-serif",fontWeight:activeList===key?500:400,textAlign:"center"}}>
                {label} <span style={{fontSize:10,color:TEXT3}}>({listConfig[key].data.length})</span>
              </button>
            ))}
          </div>

          {/* Search + channel filter + add */}
          <div style={{display:"flex",gap:8,marginBottom:activeList==="tasks"?10:16,flexWrap:"wrap"}}>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." style={{...inputStyle,flex:1,minWidth:120}}/>
            <OrangeBtn onClick={openNewItem} style={{whiteSpace:"nowrap",padding:"10px 14px",fontSize:13}}>+ New</OrangeBtn>
          </div>

          {/* Channel filter — tasks only */}
          {activeList==="tasks"&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
              <span style={{fontSize:11,color:TEXT3}}>Channel:</span>
              {["All",...CHANNELS].map(ch=>(
                <button key={ch} onClick={()=>setChannelFilter(ch)} style={{fontSize:11,color:channelFilter===ch?(ch==="All"?TEXT1:CHANNEL_COLORS[ch]||TEXT1):TEXT3,background:channelFilter===ch?SURFACE2:"transparent",border:`1px solid ${channelFilter===ch?(ch==="All"?BORDER2:CHANNEL_COLORS[ch]||BORDER2):BORDER}`,borderRadius:4,padding:"3px 9px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  {ch}
                </button>
              ))}
            </div>
          )}

          {/* Items */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filteredData(activeList).length===0&&<div style={{textAlign:"center",padding:"40px 0",color:TEXT3,fontSize:14}}>No {listConfig[activeList].label.toLowerCase()} yet</div>}
            {filteredData(activeList).map(item=>{
              const sc=STATUS_COLORS[item.status]||STATUS_COLORS["Not Started"];
              const pc=item.priority?PRIORITY_COLORS[item.priority]:null;
              const linkedProgram=item.program_id?programs.find(p=>p.id===item.program_id):null;
              const linkedCampaign=item.campaign_id?campaigns.find(c=>c.id===item.campaign_id):null;
              const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
              const chColor=item.channel?CHANNEL_COLORS[item.channel]||TEXT3:null;

              // Progress for programs and campaigns
              const progress=activeList==="campaigns"?getCampaignProgress(item.id):activeList==="programs"?getProgramProgress(item.id):null;

              return(
                <div key={item.id} onClick={()=>openEditItem(activeList,item)}
                  style={{padding:"14px 16px",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,cursor:"pointer",borderLeft:chColor?`3px solid ${chColor}`:`3px solid transparent`}}
                >
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,gap:8}}>
                    <span style={{fontSize:14,color:TEXT1,fontWeight:500,flex:1}}>{item.name}</span>
                    <span style={{fontSize:11,color:sc.text,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:4,padding:"3px 8px",whiteSpace:"nowrap",flexShrink:0}}>{item.status}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:progress?8:0}}>
                    {activeList!=="programs"&&<span style={{fontSize:11,color:pc?.text||TEXT3,border:`1px solid ${pc?.border||BORDER}`,borderRadius:4,padding:"2px 7px"}}>{item.priority}</span>}
                    {item.channel&&<span style={{fontSize:11,color:chColor,border:`1px solid ${chColor}44`,borderRadius:4,padding:"2px 7px"}}>{item.channel}</span>}
                    {activeList==="campaigns"&&linkedProgram&&<span style={{fontSize:11,color:ORANGE}}>↳ {linkedProgram.name}</span>}
                    {activeList==="tasks"&&linkedCampaign&&<span style={{fontSize:11,color:ORANGE}}>↳ {linkedCampaign.name}</span>}
                    {activeList==="tasks"&&assignee&&<div style={{display:"flex",alignItems:"center",gap:5}}><Avatar name={assignee.name} color={assignee.color} size={16}/><span style={{fontSize:11,color:TEXT2}}>{assignee.name.split(" ")[0]}</span></div>}
                    {activeList==="tasks"&&item.due_date&&<span style={{fontSize:11,color:TEXT3}}>Due {item.due_date}</span>}
                  </div>
                  {/* Rolled-up progress bar for campaigns and programs */}
                  {progress&&(
                    <div>
                      <ProgressBar value={progress.pct}/>
                      <div style={{fontSize:10,color:progress.pct===100?"#4a9e60":TEXT3,marginTop:3}}>{progress.done}/{progress.total} tasks complete · {progress.pct}%</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEAM */}
      {tab==="team"&&(
        <div style={{padding:pad}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?20:22,marginBottom:4,color:TEXT1}}>Team Overview</div>
          <div style={{fontSize:12,color:TEXT3,marginBottom:20}}>{members.length} members · {tasks.length} tasks</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:24}}>
            {Object.entries(STATUS_COLORS).map(([s,c])=>{ const count=tasks.filter(t=>t.status===s).length; return <div key={s} style={{background:SURFACE,border:`1px solid ${c.border}`,borderRadius:8,padding:"12px 14px"}}><div style={{fontSize:10,color:c.text,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontWeight:500}}>{s}</div><div style={{fontSize:24,fontWeight:500,color:c.text,fontFamily:"'Playfair Display',serif"}}>{count}</div></div>; })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {memberStats.map(m=>(
              <div key={m.id} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <Avatar name={m.name} color={m.color} size={40}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500,fontSize:15,color:TEXT1,display:"flex",alignItems:"center",gap:6}}>{m.name}{m.id===currentUser.id&&<span style={{fontSize:10,color:ORANGE,border:`1px solid ${ORANGE}44`,borderRadius:4,padding:"1px 5px"}}>You</span>}</div>
                    <div style={{fontSize:12,color:TEXT3}}>{m.role}{m.email?` · ${m.email}`:""}</div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:600,color:TEXT1,fontFamily:"'Playfair Display',serif"}}>{m.total}</div><div style={{fontSize:10,color:TEXT3}}>tasks</div></div>
                </div>
                {m.total>0&&<div style={{marginBottom:10}}><ProgressBar value={Math.round(((m.byStatus["Complete"]||0)/m.total)*100)}/></div>}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:m.tasks.length?10:0}}>
                  {Object.entries(STATUS_COLORS).map(([s,c])=>{ const count=m.byStatus[s]||0; if(!count) return null; return<span key={s} style={{fontSize:10,color:c.text,background:c.bg,border:`1px solid ${c.border}`,borderRadius:4,padding:"2px 6px"}}>{count} {s}</span>; })}
                  {m.total===0&&<span style={{fontSize:12,color:TEXT3}}>No tasks assigned</span>}
                </div>
                {m.tasks.slice(0,3).map(t=>{ const sc=STATUS_COLORS[t.status]||STATUS_COLORS["Not Started"]; const pc=t.priority?PRIORITY_COLORS[t.priority]:null; const chColor=t.channel?CHANNEL_COLORS[t.channel]:null; return(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:BG,borderRadius:6,border:`1px solid ${BORDER}`,marginBottom:4,borderLeft:chColor?`2px solid ${chColor}`:`2px solid ${BORDER}`}}>
                    <span style={{fontSize:12,color:TEXT2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
                    {t.channel&&<span style={{fontSize:9,color:chColor,flexShrink:0}}>{t.channel}</span>}
                    <span style={{fontSize:10,color:sc.text,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:3,padding:"1px 5px",flexShrink:0,whiteSpace:"nowrap"}}>{t.status}</span>
                  </div>
                ); })}
                {m.tasks.length>3&&<div style={{fontSize:11,color:TEXT3,paddingLeft:4}}>+{m.tasks.length-3} more</div>}
              </div>
            ))}
            {members.length===0&&<div style={{color:TEXT3,fontSize:14,paddingTop:40,textAlign:"center"}}>No team members yet</div>}
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {postModal&&(
        <ModalOverlay onClose={()=>setPostModal(null)} isMobile={isMobile}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4,color:TEXT1}}>{postModal.editId?"Edit Post":"New Post"}</div>
          <div style={{fontSize:13,color:TEXT3,marginBottom:18}}>{MONTHS[contentMonth]} {postModal.day}, {contentYear}</div>
          <div onClick={()=>fileRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleImageFile(e.dataTransfer.files[0]);}}
            style={{border:`1px dashed ${BORDER2}`,borderRadius:10,minHeight:postForm.image_url?"auto":100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:16,overflow:"hidden",background:BG}}>
            {postForm.image_url?<img src={postForm.image_url} alt="" style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block"}}/>:<div style={{textAlign:"center",color:TEXT3,fontSize:13,padding:20}}>Tap or drop an image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageFile(e.target.files[0])}/>
          <FL>Platform</FL>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {Object.entries(PLATFORM_COLORS).map(([p,c])=>(
              <button key={p} onClick={()=>setPostForm(f=>({...f,platform:p}))} style={{background:postForm.platform===p?`${c}22`:"transparent",border:`1px solid ${postForm.platform===p?c:BORDER}`,color:postForm.platform===p?c:TEXT3,borderRadius:6,padding:"6px 12px",fontSize:13,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
          <FL>Caption</FL>
          <textarea value={postForm.caption} onChange={e=>setPostForm(f=>({...f,caption:e.target.value}))} placeholder="Write your caption..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:8,color:TEXT1,fontSize:14,padding:"11px 13px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:14}}/>
          <FL>Link to Campaign</FL>
          <select value={postForm.campaign_id} onChange={e=>setPostForm(f=>({...f,campaign_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}>
            <option value="">— None —</option>
            {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <FL>Link to Task</FL>
          <select value={postForm.task_id} onChange={e=>setPostForm(f=>({...f,task_id:e.target.value}))} style={{...inputStyle,marginBottom:20}}>
            <option value="">— None —</option>
            {tasks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <MA onCancel={()=>setPostModal(null)} onSave={savePost} onDelete={postModal.editId?()=>deletePost(postModal.editId):null} saveLabel={postModal.editId?"Save Changes":"Add Post"} isMobile={isMobile}/>
        </ModalOverlay>
      )}

      {/* EVENT MODAL */}
      {eventModal&&(
        <ModalOverlay onClose={()=>setEventModal(null)} isMobile={isMobile}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:18,color:TEXT1}}>{eventModal.editId?"Edit Event":"New Event"}</div>
          <FL>Event Title</FL>
          <input value={eventForm.title} onChange={e=>setEventForm(f=>({...f,title:e.target.value}))} placeholder="e.g. SHOT Show 2026" style={{...inputStyle,marginBottom:14}}/>
          <FL>Event Type</FL>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {eventTypes.map(t=>{ const c=t.color; return <button key={t.id} onClick={()=>setEventForm(f=>({...f,event_type:t.name}))} style={{background:eventForm.event_type===t.name?`${c}22`:"transparent",border:`1px solid ${eventForm.event_type===t.name?c:BORDER}`,color:eventForm.event_type===t.name?c:TEXT3,borderRadius:6,padding:"6px 12px",fontSize:13,cursor:"pointer"}}>{t.name}</button>; })}
          </div>
          <FL>Start Date</FL>
          <input type="date" value={eventForm.event_date} onChange={e=>setEventForm(f=>({...f,event_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
          <FL>End Date (optional)</FL>
          <input type="date" value={eventForm.end_date} onChange={e=>setEventForm(f=>({...f,end_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
          <FL>Location</FL>
          <input value={eventForm.location} onChange={e=>setEventForm(f=>({...f,location:e.target.value}))} placeholder="City, venue, or virtual" style={{...inputStyle,marginBottom:12}}/>
          <FL>Assign To</FL>
          <select value={eventForm.assignee_id} onChange={e=>setEventForm(f=>({...f,assignee_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}>
            <option value="">— Unassigned —</option>
            {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <FL>Description</FL>
          <textarea value={eventForm.description} onChange={e=>setEventForm(f=>({...f,description:e.target.value}))} placeholder="Notes, booth number, contacts..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:8,color:TEXT1,fontSize:14,padding:"11px 13px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:20}}/>
          <MA onCancel={()=>setEventModal(null)} onSave={saveEvent} onDelete={eventModal.editId?()=>deleteEvent(eventModal.editId):null} saveLabel={eventModal.editId?"Save Changes":"Add Event"} isMobile={isMobile}/>
        </ModalOverlay>
      )}

      {/* ITEM MODAL */}
      {itemModal&&(
        <ModalOverlay onClose={()=>setItemModal(null)} isMobile={isMobile}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:18,color:TEXT1}}>{itemModal.editId?"Edit":"New"} {listConfig[itemModal.type].label.slice(0,-1)}</div>
          <FL>Name</FL>
          <input value={itemForm.name||""} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} placeholder="Name..." style={{...inputStyle,marginBottom:14}}/>
          <FL>Status</FL>
          <select value={itemForm.status||"Not Started"} onChange={e=>setItemForm(f=>({...f,status:e.target.value}))} style={{...inputStyle,marginBottom:12}}>
            {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {itemModal.type!=="programs"&&<><FL>Priority</FL><select value={itemForm.priority||"Medium"} onChange={e=>setItemForm(f=>({...f,priority:e.target.value}))} style={{...inputStyle,marginBottom:12}}>{Object.keys(PRIORITY_COLORS).map(p=><option key={p} value={p}>{p}</option>)}</select></>}
          {itemModal.type==="campaigns"&&<><FL>Program (optional)</FL><select value={itemForm.program_id||""} onChange={e=>setItemForm(f=>({...f,program_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}><option value="">— No program —</option>{programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></>}
          {itemModal.type==="tasks"&&(
            <>
              <FL>Channel</FL>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                <button onClick={()=>setItemForm(f=>({...f,channel:""}))} style={{fontSize:12,color:!itemForm.channel?TEXT1:TEXT3,background:!itemForm.channel?SURFACE2:"transparent",border:`1px solid ${!itemForm.channel?BORDER2:BORDER}`,borderRadius:5,padding:"5px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>None</button>
                {CHANNELS.map(ch=>{ const c=CHANNEL_COLORS[ch]; return <button key={ch} onClick={()=>setItemForm(f=>({...f,channel:ch}))} style={{fontSize:12,color:itemForm.channel===ch?c:TEXT3,background:itemForm.channel===ch?`${c}22`:"transparent",border:`1px solid ${itemForm.channel===ch?c:BORDER}`,borderRadius:5,padding:"5px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{ch}</button>; })}
              </div>
              <FL>Campaign (optional)</FL>
              <select value={itemForm.campaign_id||""} onChange={e=>setItemForm(f=>({...f,campaign_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}>
                <option value="">— None —</option>
                {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <FL>Assign To</FL>
              <select value={itemForm.assignee_id||""} onChange={e=>setItemForm(f=>({...f,assignee_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}>
                <option value="">— Unassigned —</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
              <FL>Due Date</FL>
              <input type="date" value={itemForm.due_date||""} onChange={e=>setItemForm(f=>({...f,due_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
            </>
          )}
          <FL>Description</FL>
          <textarea value={itemForm.description||""} onChange={e=>setItemForm(f=>({...f,description:e.target.value}))} placeholder="Optional notes..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:8,color:TEXT1,fontSize:14,padding:"11px 13px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:20}}/>
          {itemModal.type==="tasks"&&itemModal.editId&&<div style={{borderTop:`1px solid ${BORDER}`,paddingTop:20,marginBottom:4}}><SubtaskPanel taskId={itemModal.editId}/></div>}
          {itemModal.type==="tasks"&&!itemModal.editId&&<div style={{fontSize:12,color:TEXT3,marginBottom:20,fontStyle:"italic"}}>Save the task first to add steps.</div>}
          <MA onCancel={()=>setItemModal(null)} onSave={saveItem} onDelete={itemModal.editId?deleteItem:null} saveLabel={itemModal.editId?"Save Changes":`Create ${listConfig[itemModal.type].label.slice(0,-1)}`} isMobile={isMobile}/>
        </ModalOverlay>
      )}

      {/* Mobile bottom nav */}
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:SURFACE,borderTop:`1px solid ${BORDER}`,display:"flex",zIndex:20}}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",borderTop:tab===id?`2px solid ${ORANGE}`:"2px solid transparent",color:tab===id?ORANGE:TEXT3,padding:"10px 4px 8px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===id?500:400,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <span style={{fontSize:18}}>{id==="content"?"📅":id==="events"?"🎪":id==="tasks"?"✅":"👥"}</span>
              {label}
            </button>
          ))}
        </div>
      )}

      {showTypeManager&&<EventTypeManager eventTypes={eventTypes} setEventTypes={setEventTypes} onClose={()=>setShowTypeManager(false)} isMobile={isMobile}/>}
      {showProfile&&<ProfileModal currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={()=>setShowProfile(false)} isMobile={isMobile}/>}
    </div>
  );
}
