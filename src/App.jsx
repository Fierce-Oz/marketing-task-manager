import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const ACCESS_PASSWORD = "F!ercearms2026";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const PLATFORM_COLORS = { Instagram:"#E1306C", Twitter:"#1DA1F2", Facebook:"#1877F2", LinkedIn:"#0A66C2", TikTok:"#69C9D0" };

// Fierce Arms palette: dark charcoal + orange accent
const BG       = "#111213";   // page background
const SURFACE  = "#1c1d1f";   // card/panel background
const SURFACE2 = "#252729";   // elevated surface
const BORDER   = "#2e3033";   // default border
const BORDER2  = "#3a3d42";   // hover border
const TEXT1    = "#f2f3f4";   // primary text
const TEXT2    = "#9a9da3";   // secondary text
const TEXT3    = "#5a5d63";   // muted text
const ORANGE   = "#d4420a";   // Fierce orange
const ORANGEHI = "#e85520";   // orange hover

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
const EVENT_TYPES = ["Tradeshow","Expo","Sponsorship","Industry Event","Conference","Other"];
const EVENT_TYPE_COLORS = {
  Tradeshow:"#d4420a", Expo:"#c47a30", Sponsorship:"#6b8ccc",
  "Industry Event":"#4a9e60", Conference:"#a07acc", Other:"#5a5d63"
};

function getDaysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m){ return new Date(y,m,1).getDay(); }
function dateStr(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
const today = new Date();

const FL = ({children})=><div style={{fontSize:11,color:TEXT3,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:6,fontWeight:500}}>{children}</div>;
const navBtn = {background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:34,height:34,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"};
const inputStyle = {width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT1,fontSize:13,padding:"9px 11px",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"};

function ModalOverlay({children,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:32,width:540,maxWidth:"92vw",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 32px 80px #00000099"}}>
        {children}
      </div>
    </div>
  );
}

function MA({onCancel,onSave,onDelete,saveLabel}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>{onDelete&&<button onClick={onDelete} style={{background:"#1f1010",border:"1px solid #3a1818",color:"#a05050",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Delete</button>}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancel} style={{background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
        <button onClick={onSave} style={{background:ORANGE,border:"none",color:"#fff",borderRadius:6,padding:"8px 20px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}
          onMouseEnter={e=>e.currentTarget.style.background=ORANGEHI}
          onMouseLeave={e=>e.currentTarget.style.background=ORANGE}
        >{saveLabel}</button>
      </div>
    </div>
  );
}

function Avatar({name,color,size=28}){
  const initials=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",border:`1px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,color,fontWeight:600,flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>
      {initials}
    </div>
  );
}

function SubtaskPanel({taskId}){
  const [subtasks,setSubtasks]=useState([]);
  const [newName,setNewName]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(!taskId){setLoading(false);return;}
    supabase.from("subtasks").select("*").eq("task_id",taskId).order("position").then(({data})=>{ setSubtasks(data||[]); setLoading(false); });
  },[taskId]);

  const completed=subtasks.filter(s=>s.completed).length;
  const total=subtasks.length;
  const pct=total>0?Math.round((completed/total)*100):0;

  const addSubtask=async()=>{
    if(!newName.trim()) return;
    const{data}=await supabase.from("subtasks").insert({task_id:taskId,name:newName.trim(),position:total}).select().single();
    setSubtasks(s=>[...s,data]); setNewName("");
  };
  const toggleSubtask=async(sub)=>{
    const{data}=await supabase.from("subtasks").update({completed:!sub.completed}).eq("id",sub.id).select().single();
    setSubtasks(s=>s.map(x=>x.id===sub.id?data:x));
  };
  const deleteSubtask=async(id)=>{
    await supabase.from("subtasks").delete().eq("id",id);
    setSubtasks(s=>s.filter(x=>x.id!==id));
  };

  if(loading) return <div style={{fontSize:12,color:TEXT3,padding:"8px 0"}}>Loading steps...</div>;

  return(
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <FL>Steps</FL>
        {total>0&&<span style={{fontSize:11,color:TEXT3}}>{completed}/{total} complete</span>}
      </div>
      {total>0&&(
        <div style={{marginBottom:12}}>
          <div style={{height:4,background:SURFACE2,borderRadius:2,overflow:"hidden",marginBottom:4}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#4a9e60":ORANGE,borderRadius:2,transition:"width 0.3s ease"}}/>
          </div>
          <div style={{fontSize:10,color:pct===100?"#4a9e60":TEXT3,textAlign:"right"}}>{pct}%</div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
        {subtasks.map((sub,idx)=>(
          <div key={sub.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:BG,borderRadius:6,border:`1px solid ${sub.completed?"#1a3020":BORDER}`}}>
            <button onClick={()=>toggleSubtask(sub)} style={{width:16,height:16,borderRadius:3,border:`1px solid ${sub.completed?"#4a9e60":BORDER2}`,background:sub.completed?"#4a9e6022":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0}}>
              {sub.completed&&<span style={{fontSize:10,color:"#4a9e60"}}>✓</span>}
            </button>
            <span style={{flex:1,fontSize:12,color:sub.completed?TEXT3:TEXT2,textDecoration:sub.completed?"line-through":"none"}}>{idx+1}. {sub.name}</span>
            <button onClick={()=>deleteSubtask(sub.id)} style={{background:"none",border:"none",color:TEXT3,cursor:"pointer",fontSize:14,padding:"0 2px",lineHeight:1}}
              onMouseEnter={e=>e.currentTarget.style.color="#a05050"}
              onMouseLeave={e=>e.currentTarget.style.color=TEXT3}
            >×</button>
          </div>
        ))}
        {subtasks.length===0&&<div style={{fontSize:12,color:TEXT3,padding:"6px 0"}}>No steps yet — add one below</div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addSubtask();}} placeholder="Add a step..." style={{...inputStyle,fontSize:12,padding:"7px 10px"}}/>
        <button onClick={addSubtask} style={{background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT2;}}
        >+ Add</button>
      </div>
    </div>
  );
}

function CalendarShell({currentMonth,currentYear,onPrev,onNext,legend,children}){
  return(
    <div style={{padding:"32px 40px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <button onClick={onPrev} style={navBtn}>‹</button>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:TEXT1}}>{MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={onNext} style={navBtn}>›</button>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{legend}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
        {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:TEXT3,letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {(()=>{
          const daysInMonth=getDaysInMonth(currentYear,currentMonth);
          const firstDay=getFirstDay(currentYear,currentMonth);
          const cells=[];
          for(let i=0;i<firstDay;i++) cells.push(null);
          for(let d=1;d<=daysInMonth;d++) cells.push(d);
          return cells.map((day,i)=>children(day,i));
        })()}
      </div>
    </div>
  );
}

function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [pw,setPw]=useState("");
  const [name,setName]=useState("");
  const [role,setRole]=useState("Member");
  const [err,setErr]=useState("");
  const [members,setMembers]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    supabase.from("members").select("*").order("created_at").then(({data})=>{ setMembers(data||[]); setLoading(false); });
  },[]);

  const handleLogin=()=>{
    if(pw!==ACCESS_PASSWORD){setErr("Incorrect password."); return;}
    if(members.length===0){setMode("register"); setErr("No accounts yet — create yours first."); return;}
    setErr("Password accepted — who are you?"); setMode("pick");
  };
  const handleRegister=async()=>{
    if(pw!==ACCESS_PASSWORD){setErr("Incorrect password."); return;}
    if(!name.trim()){setErr("Enter your name."); return;}
    if(members.find(m=>m.name.toLowerCase()===name.trim().toLowerCase())){setErr("That name is taken."); return;}
    const color=MEMBER_COLORS[members.length%MEMBER_COLORS.length];
    const{data,error}=await supabase.from("members").insert({name:name.trim(),role,color}).select().single();
    if(error){setErr("Error creating account."); return;}
    onAuth(data);
  };

  if(loading) return <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Loading...</div>;

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <div style={{width:420,background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:14,padding:40,boxShadow:"0 24px 80px #00000099"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <div style={{width:4,height:32,background:ORANGE,borderRadius:2}}/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:TEXT1,lineHeight:1.2}}>Sales & Marketing</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:ORANGE,lineHeight:1.2}}>Task Manager</div>
          </div>
        </div>
        <div style={{fontSize:11,color:TEXT3,marginBottom:28,letterSpacing:"0.1em",textTransform:"uppercase"}}>Team Access · Fierce Firearms</div>

        {mode==="pick"&&(
          <>
            <div style={{fontSize:13,color:TEXT2,marginBottom:14}}>Who are you?</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
              {members.map(m=>(
                <button key={m.id} onClick={()=>onAuth(m)} style={{display:"flex",alignItems:"center",gap:12,background:SURFACE2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",cursor:"pointer",color:TEXT1,fontFamily:"'DM Sans',sans-serif",fontSize:13,textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=ORANGE}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}
                >
                  <Avatar name={m.name} color={m.color} size={32}/>
                  <div><div style={{fontWeight:500}}>{m.name}</div><div style={{fontSize:11,color:TEXT3}}>{m.role}</div></div>
                </button>
              ))}
            </div>
            <button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:12,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>+ Create new account</button>
          </>
        )}
        {(mode==="login"||mode==="register")&&(
          <>
            <FL>Team Password</FL>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") mode==="login"?handleLogin():handleRegister();}} placeholder="Enter team password" style={{...inputStyle,marginBottom:16}}/>
            {mode==="register"&&(
              <>
                <FL>Your Name</FL>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{...inputStyle,marginBottom:12}}/>
                <FL>Role</FL>
                <select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,marginBottom:20}}>
                  {["Admin","Manager","Member","Contractor"].map(r=><option key={r}>{r}</option>)}
                </select>
              </>
            )}
            {err&&<div style={{fontSize:12,color:"#c47a30",marginBottom:12}}>{err}</div>}
            <button onClick={mode==="login"?handleLogin:handleRegister} style={{width:"100%",background:ORANGE,border:"none",color:"#fff",borderRadius:8,padding:"11px 0",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:500,marginBottom:14}}
              onMouseEnter={e=>e.currentTarget.style.background=ORANGEHI}
              onMouseLeave={e=>e.currentTarget.style.background=ORANGE}
            >{mode==="login"?"Enter":"Create Account & Enter"}</button>
            {mode==="login"
              ?<button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:12,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>New here? Create an account</button>
              :<button onClick={()=>{setMode("login");setErr("");}} style={{background:"none",border:"none",color:TEXT3,fontSize:12,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>Back to login</button>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [currentUser,setCurrentUser]=useState(()=>{
    try{ const s=localStorage.getItem("cp_user"); return s?JSON.parse(s):null; }catch(e){ return null; }
  });
  const handleAuth=(user)=>{ localStorage.setItem("cp_user",JSON.stringify(user)); setCurrentUser(user); };
  const handleLogout=()=>{ localStorage.removeItem("cp_user"); setCurrentUser(null); };
  if(!currentUser) return <AuthScreen onAuth={handleAuth}/>;
  return <MainApp currentUser={currentUser} onLogout={handleLogout}/>;
}

function MainApp({currentUser,onLogout}){
  const [tab,setTab]=useState("content");
  const [programs,setPrograms]=useState([]);
  const [campaigns,setCampaigns]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [posts,setPosts]=useState([]);
  const [events,setEvents]=useState([]);
  const [members,setMembers]=useState([]);
  const [loading,setLoading]=useState(true);

  const [contentYear,setContentYear]=useState(today.getFullYear());
  const [contentMonth,setContentMonth]=useState(today.getMonth());
  const [eventsYear,setEventsYear]=useState(today.getFullYear());
  const [eventsMonth,setEventsMonth]=useState(today.getMonth());

  const [postModal,setPostModal]=useState(null);
  const [postForm,setPostForm]=useState({caption:"",platform:"Instagram",image_url:"",campaign_id:"",task_id:""});
  const [dragOver,setDragOver]=useState(null);
  const fileRef=useRef();

  const [eventModal,setEventModal]=useState(null);
  const [eventForm,setEventForm]=useState({title:"",event_date:"",end_date:"",location:"",description:"",event_type:"Tradeshow",assignee_id:""});

  const [activeList,setActiveList]=useState("tasks");
  const [itemModal,setItemModal]=useState(null);
  const [itemForm,setItemForm]=useState({});
  const [searchQ,setSearchQ]=useState("");

  useEffect(()=>{
    async function fetchAll(){
      const [m,p,ca,t,po,ev]=await Promise.all([
        supabase.from("members").select("*").order("created_at"),
        supabase.from("programs").select("*").order("created_at"),
        supabase.from("campaigns").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
        supabase.from("posts").select("*").order("post_date"),
        supabase.from("events").select("*").order("event_date"),
      ]);
      setMembers(m.data||[]); setPrograms(p.data||[]); setCampaigns(ca.data||[]);
      setTasks(t.data||[]); setPosts(po.data||[]); setEvents(ev.data||[]);
      setLoading(false);
    }
    fetchAll();
  },[]);

  const prevContent=()=>{ if(contentMonth===0){setContentMonth(11);setContentYear(y=>y-1);}else setContentMonth(m=>m-1); };
  const nextContent=()=>{ if(contentMonth===11){setContentMonth(0);setContentYear(y=>y+1);}else setContentMonth(m=>m+1); };
  const prevEvents=()=>{ if(eventsMonth===0){setEventsMonth(11);setEventsYear(y=>y-1);}else setEventsMonth(m=>m-1); };
  const nextEvents=()=>{ if(eventsMonth===11){setEventsMonth(0);setEventsYear(y=>y+1);}else setEventsMonth(m=>m+1); };

  const openAddPost=(day)=>{ setPostModal({day,dateStr:dateStr(contentYear,contentMonth,day)}); setPostForm({caption:"",platform:"Instagram",image_url:"",campaign_id:"",task_id:""}); };
  const openEditPost=(post)=>{ setPostModal({day:parseInt(post.post_date.split("-")[2]),dateStr:post.post_date,editId:post.id}); setPostForm({caption:post.caption,platform:post.platform,image_url:post.image_url||"",campaign_id:post.campaign_id||"",task_id:post.task_id||""}); };
  const savePost=async()=>{
    if(postModal.editId){
      const{data}=await supabase.from("posts").update({...postForm,campaign_id:postForm.campaign_id||null,task_id:postForm.task_id||null}).eq("id",postModal.editId).select().single();
      setPosts(p=>p.map(post=>post.id===postModal.editId?data:post));
    }else{
      const{data}=await supabase.from("posts").insert({...postForm,post_date:postModal.dateStr,created_by:currentUser.id,campaign_id:postForm.campaign_id||null,task_id:postForm.task_id||null}).select().single();
      setPosts(p=>[...p,data]);
    }
    setPostModal(null);
  };
  const deletePost=async(id)=>{ await supabase.from("posts").delete().eq("id",id); setPosts(p=>p.filter(post=>post.id!==id)); setPostModal(null); };
  const handleImageFile=(file)=>{ if(!file||!file.type.startsWith("image/")) return; setPostForm(f=>({...f,image_url:URL.createObjectURL(file)})); };
  const handleCalDrop=async(e,day)=>{
    e.preventDefault(); setDragOver(null);
    const file=e.dataTransfer.files[0];
    if(file&&file.type.startsWith("image/")){
      const url=URL.createObjectURL(file);
      const ds=dateStr(contentYear,contentMonth,day);
      const{data}=await supabase.from("posts").insert({caption:"",platform:"Instagram",image_url:url,post_date:ds,created_by:currentUser.id}).select().single();
      setPosts(p=>[...p,data]); setPostModal({day,dateStr:ds,editId:data.id});
      setPostForm({caption:"",platform:"Instagram",image_url:url,campaign_id:"",task_id:""});
    }
  };
  const getDayPosts=(day)=>{ const ds=dateStr(contentYear,contentMonth,day); return posts.filter(p=>p.post_date===ds); };
  const isToday=(y,m,day)=>day===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();

  const openAddEvent=(day)=>{ const ds=dateStr(eventsYear,eventsMonth,day); setEventModal({day}); setEventForm({title:"",event_date:ds,end_date:"",location:"",description:"",event_type:"Tradeshow",assignee_id:""}); };
  const openEditEvent=(ev)=>{ setEventModal({editId:ev.id}); setEventForm({title:ev.title,event_date:ev.event_date,end_date:ev.end_date||"",location:ev.location||"",description:ev.description||"",event_type:ev.event_type||"Tradeshow",assignee_id:ev.assignee_id||""}); };
  const saveEvent=async()=>{
    const payload={...eventForm,assignee_id:eventForm.assignee_id||null,end_date:eventForm.end_date||null};
    if(eventModal.editId){
      const{data}=await supabase.from("events").update(payload).eq("id",eventModal.editId).select().single();
      setEvents(e=>e.map(ev=>ev.id===eventModal.editId?data:ev));
    }else{
      const{data}=await supabase.from("events").insert(payload).select().single();
      setEvents(e=>[...e,data]);
    }
    setEventModal(null);
  };
  const deleteEvent=async(id)=>{ await supabase.from("events").delete().eq("id",id); setEvents(e=>e.filter(ev=>ev.id!==id)); setEventModal(null); };
  const getDayEvents=(day)=>{
    const ds=dateStr(eventsYear,eventsMonth,day);
    return events.filter(ev=>{ if(ev.event_date===ds) return true; if(ev.end_date&&ev.event_date<=ds&&ev.end_date>=ds) return true; return false; });
  };

  const listConfig={
    programs:{label:"Programs",data:programs,setData:setPrograms,table:"programs"},
    campaigns:{label:"Campaigns",data:campaigns,setData:setCampaigns,table:"campaigns"},
    tasks:{label:"Tasks",data:tasks,setData:setTasks,table:"tasks"},
  };
  const openNewItem=()=>{
    const defaults={
      programs:{name:"",status:"Not Started",description:""},
      campaigns:{name:"",status:"Not Started",priority:"Medium",program_id:"",description:""},
      tasks:{name:"",status:"Not Started",priority:"Medium",campaign_id:"",due_date:"",description:"",assignee_id:""},
    };
    setItemModal({type:activeList}); setItemForm(defaults[activeList]);
  };
  const openEditItem=(type,item)=>{ setItemModal({type,editId:item.id}); setItemForm({...item}); };
  const saveItem=async()=>{
    const{table,setData,data}=listConfig[itemModal.type];
    const payload={...itemForm};
    if(payload.program_id==="") payload.program_id=null;
    if(payload.campaign_id==="") payload.campaign_id=null;
    if(payload.assignee_id==="") payload.assignee_id=null;
    if(payload.due_date==="") payload.due_date=null;
    delete payload.id; delete payload.created_at;
    if(itemModal.editId){
      const{data:updated}=await supabase.from(table).update(payload).eq("id",itemModal.editId).select().single();
      setData(data.map(i=>i.id===itemModal.editId?updated:i));
    }else{
      const{data:created}=await supabase.from(table).insert(payload).select().single();
      setData([...data,created]);
    }
    setItemModal(null);
  };
  const deleteItem=async()=>{
    const{table,setData,data}=listConfig[itemModal.type];
    await supabase.from(table).delete().eq("id",itemModal.editId);
    setData(data.filter(i=>i.id!==itemModal.editId)); setItemModal(null);
  };
  const filteredData=(type)=>{ const{data}=listConfig[type]; if(!searchQ) return data; return data.filter(i=>i.name.toLowerCase().includes(searchQ.toLowerCase())); };

  const memberStats=members.map(m=>{
    const myTasks=tasks.filter(t=>t.assignee_id===m.id);
    const byStatus={};
    Object.keys(STATUS_COLORS).forEach(s=>{ byStatus[s]=myTasks.filter(t=>t.status===s).length; });
    return{...m,tasks:myTasks,byStatus,total:myTasks.length};
  });

  if(loading) return <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Loading your workspace...</div>;

  const tabs=[["content","Content Calendar"],["events","Events"],["tasks","Task Manager"],["team","Team"]];

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'DM Sans',sans-serif",color:TEXT1}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${BORDER}`,padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:SURFACE,position:"sticky",top:0,zIndex:20,height:56}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:3,height:22,background:ORANGE,borderRadius:2}}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:TEXT1}}>Sales & Marketing <span style={{color:ORANGE}}>Task Manager</span></span>
        </div>
        <div style={{display:"flex"}}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:tab===id?`2px solid ${ORANGE}`:"2px solid transparent",color:tab===id?TEXT1:TEXT3,padding:"0 18px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===id?500:400,height:56,transition:"color 0.15s"}}>{label}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={currentUser.name} color={currentUser.color} size={28}/>
          <div>
            <div style={{fontSize:13,fontWeight:500,lineHeight:1.2,color:TEXT1}}>{currentUser.name}</div>
            <div style={{fontSize:11,color:TEXT3}}>{currentUser.role}</div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",marginLeft:6}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT3;}}
          >Switch</button>
        </div>
      </div>

      {/* CONTENT CALENDAR */}
      {tab==="content"&&(
        <CalendarShell currentMonth={contentMonth} currentYear={contentYear} onPrev={prevContent} onNext={nextContent}
          legend={Object.entries(PLATFORM_COLORS).map(([p,c])=>(
            <span key={p} style={{fontSize:11,color:c,border:`1px solid ${c}44`,borderRadius:4,padding:"2px 8px"}}>{p}</span>
          ))}
        >
          {(day,i)=>{
            const dayPosts=day?getDayPosts(day):[];
            const isDrag=dragOver===i;
            return(
              <div key={i}
                onDragOver={day?(e)=>{e.preventDefault();setDragOver(i);}:undefined}
                onDragLeave={day?()=>setDragOver(null):undefined}
                onDrop={day?(e)=>handleCalDrop(e,day):undefined}
                style={{minHeight:110,background:day?(isDrag?"#1a2218":SURFACE):"transparent",border:isDrag?`1px dashed ${ORANGE}`:day?`1px solid ${BORDER}`:"none",borderRadius:6,padding:day?"8px":0,position:"relative",overflow:"hidden"}}
              >
                {day&&(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:12,fontWeight:isToday(contentYear,contentMonth,day)?600:400,color:isToday(contentYear,contentMonth,day)?ORANGE:TEXT3,background:isToday(contentYear,contentMonth,day)?ORANGE+"22":"transparent",borderRadius:4,padding:isToday(contentYear,contentMonth,day)?"1px 6px":0}}>{day}</span>
                      <button onClick={()=>openAddPost(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:4,width:18,height:18,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}
                        onMouseEnter={e=>{e.currentTarget.style.color=ORANGE;e.currentTarget.style.borderColor=ORANGE;}}
                        onMouseLeave={e=>{e.currentTarget.style.color=TEXT3;e.currentTarget.style.borderColor=BORDER;}}
                      >+</button>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {dayPosts.slice(0,3).map(post=>{
                        const linked=post.campaign_id?campaigns.find(c=>c.id===post.campaign_id):null;
                        const creator=post.created_by?members.find(m=>m.id===post.created_by):null;
                        return(
                          <div key={post.id} onClick={()=>openEditPost(post)}
                            style={{display:"flex",alignItems:"center",gap:4,background:SURFACE2,borderRadius:4,padding:"3px 5px",cursor:"pointer",borderLeft:`2px solid ${PLATFORM_COLORS[post.platform]}`}}>
                            {post.image_url&&<img src={post.image_url} alt="" style={{width:18,height:18,objectFit:"cover",borderRadius:2,flexShrink:0}}/>}
                            <span style={{fontSize:10,color:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{post.caption||"No caption"}</span>
                            {creator&&<div style={{width:14,height:14,borderRadius:"50%",background:creator.color+"33",border:`1px solid ${creator.color}44`,fontSize:7,display:"flex",alignItems:"center",justifyContent:"center",color:creator.color,flexShrink:0}}>{creator.name[0]}</div>}
                            {linked&&<span style={{fontSize:9,color:ORANGE,flexShrink:0}}>●</span>}
                          </div>
                        );
                      })}
                      {dayPosts.length>3&&<div style={{fontSize:10,color:TEXT3}}>+{dayPosts.length-3} more</div>}
                    </div>
                    {isDrag&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#00000066",fontSize:10,color:ORANGE,pointerEvents:"none"}}>Drop image</div>}
                  </>
                )}
              </div>
            );
          }}
        </CalendarShell>
      )}

      {/* EVENTS CALENDAR */}
      {tab==="events"&&(
        <CalendarShell currentMonth={eventsMonth} currentYear={eventsYear} onPrev={prevEvents} onNext={nextEvents}
          legend={Object.entries(EVENT_TYPE_COLORS).map(([t,c])=>(
            <span key={t} style={{fontSize:11,color:c,border:`1px solid ${c}44`,borderRadius:4,padding:"2px 8px"}}>{t}</span>
          ))}
        >
          {(day,i)=>{
            const dayEvents=day?getDayEvents(day):[];
            return(
              <div key={i}
                style={{minHeight:110,background:day?SURFACE:"transparent",border:day?`1px solid ${BORDER}`:"none",borderRadius:6,padding:day?"8px":0,position:"relative",overflow:"hidden"}}
              >
                {day&&(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:12,fontWeight:isToday(eventsYear,eventsMonth,day)?600:400,color:isToday(eventsYear,eventsMonth,day)?ORANGE:TEXT3,background:isToday(eventsYear,eventsMonth,day)?ORANGE+"22":"transparent",borderRadius:4,padding:isToday(eventsYear,eventsMonth,day)?"1px 6px":0}}>{day}</span>
                      <button onClick={()=>openAddEvent(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:4,width:18,height:18,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}
                        onMouseEnter={e=>{e.currentTarget.style.color=ORANGE;e.currentTarget.style.borderColor=ORANGE;}}
                        onMouseLeave={e=>{e.currentTarget.style.color=TEXT3;e.currentTarget.style.borderColor=BORDER;}}
                      >+</button>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {dayEvents.slice(0,3).map(ev=>{
                        const c=EVENT_TYPE_COLORS[ev.event_type]||TEXT3;
                        const assignee=ev.assignee_id?members.find(m=>m.id===ev.assignee_id):null;
                        return(
                          <div key={ev.id} onClick={()=>openEditEvent(ev)}
                            style={{display:"flex",alignItems:"center",gap:4,background:SURFACE2,borderRadius:4,padding:"3px 5px",cursor:"pointer",borderLeft:`2px solid ${c}`}}>
                            <span style={{fontSize:10,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{ev.title}</span>
                            {assignee&&<div style={{width:14,height:14,borderRadius:"50%",background:assignee.color+"33",border:`1px solid ${assignee.color}44`,fontSize:7,display:"flex",alignItems:"center",justifyContent:"center",color:assignee.color,flexShrink:0}}>{assignee.name[0]}</div>}
                          </div>
                        );
                      })}
                      {dayEvents.length>3&&<div style={{fontSize:10,color:TEXT3}}>+{dayEvents.length-3} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          }}
        </CalendarShell>
      )}

      {/* TASK MANAGER */}
      {tab==="tasks"&&(
        <div style={{padding:"32px 40px",display:"flex",gap:28}}>
          <div style={{width:190,flexShrink:0}}>
            <div style={{fontSize:11,color:TEXT3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontWeight:500}}>Lists</div>
            {Object.entries(listConfig).map(([key,{label}])=>(
              <button key={key} onClick={()=>{setActiveList(key);setSearchQ("");}} style={{width:"100%",background:activeList===key?SURFACE2:"transparent",border:activeList===key?`1px solid ${BORDER2}`:"1px solid transparent",borderLeft:activeList===key?`3px solid ${ORANGE}`:"3px solid transparent",color:activeList===key?TEXT1:TEXT3,borderRadius:6,padding:"9px 12px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:activeList===key?500:400,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <span>{label}</span>
                <span style={{fontSize:11,color:TEXT3,background:SURFACE,borderRadius:10,padding:"1px 7px"}}>{listConfig[key].data.length}</span>
              </button>
            ))}
            <div style={{borderTop:`1px solid ${BORDER}`,marginTop:20,paddingTop:16}}>
              <div style={{fontSize:11,color:TEXT3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontWeight:500}}>Status Key</div>
              {Object.entries(STATUS_COLORS).map(([s,c])=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                  <span style={{width:8,height:8,borderRadius:2,background:c.border,flexShrink:0}}/>
                  <span style={{fontSize:12,color:TEXT3}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:TEXT1}}>{listConfig[activeList].label}</div>
                <div style={{fontSize:12,color:TEXT3,marginTop:2}}>{listConfig[activeList].data.length} items</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT1,fontSize:13,padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",outline:"none",width:160}}/>
                <button onClick={openNewItem} style={{background:ORANGE,border:"none",color:"#fff",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",fontWeight:500}}
                  onMouseEnter={e=>e.currentTarget.style.background=ORANGEHI}
                  onMouseLeave={e=>e.currentTarget.style.background=ORANGE}
                >+ New {listConfig[activeList].label.slice(0,-1)}</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:activeList==="tasks"?"1fr 120px 80px 150px 130px 110px":activeList==="campaigns"?"1fr 120px 80px 1fr":"1fr 120px",gap:8,padding:"6px 12px",marginBottom:4}}>
              {["Name","Status",...(activeList!=="programs"?["Priority"]:[]),...(activeList==="campaigns"?["Program"]:[]),...(activeList==="tasks"?["Campaign","Assignee","Due Date"]:[])].map(h=>(
                <span key={h} style={{fontSize:11,color:TEXT3,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:500}}>{h}</span>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {filteredData(activeList).length===0&&<div style={{textAlign:"center",padding:"48px 0",color:TEXT3,fontSize:13}}>No {listConfig[activeList].label.toLowerCase()} yet</div>}
              {filteredData(activeList).map(item=>{
                const sc=STATUS_COLORS[item.status]||STATUS_COLORS["Not Started"];
                const pc=item.priority?PRIORITY_COLORS[item.priority]:null;
                const linkedProgram=item.program_id?programs.find(p=>p.id===item.program_id):null;
                const linkedCampaign=item.campaign_id?campaigns.find(c=>c.id===item.campaign_id):null;
                const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
                return(
                  <div key={item.id} onClick={()=>openEditItem(activeList,item)}
                    style={{display:"grid",gridTemplateColumns:activeList==="tasks"?"1fr 120px 80px 150px 130px 110px":activeList==="campaigns"?"1fr 120px 80px 1fr":"1fr 120px",gap:8,padding:"10px 12px",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:6,cursor:"pointer",alignItems:"center"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=BORDER2}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}
                  >
                    <span style={{fontSize:13,color:TEXT1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</span>
                    <span style={{fontSize:11,color:sc.text,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:4,padding:"3px 8px",display:"inline-block",whiteSpace:"nowrap"}}>{item.status}</span>
                    {activeList!=="programs"&&<span style={{fontSize:11,color:pc?.text||TEXT3,border:`1px solid ${pc?.border||BORDER}`,borderRadius:4,padding:"3px 7px",display:"inline-block"}}>{item.priority}</span>}
                    {activeList==="campaigns"&&<span style={{fontSize:11,color:linkedProgram?ORANGE:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{linkedProgram?linkedProgram.name:"—"}</span>}
                    {activeList==="tasks"&&<span style={{fontSize:11,color:linkedCampaign?ORANGE:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{linkedCampaign?linkedCampaign.name:"—"}</span>}
                    {activeList==="tasks"&&(
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        {assignee?<><Avatar name={assignee.name} color={assignee.color} size={20}/><span style={{fontSize:11,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{assignee.name.split(" ")[0]}</span></>:<span style={{fontSize:11,color:TEXT3}}>Unassigned</span>}
                      </div>
                    )}
                    {activeList==="tasks"&&<span style={{fontSize:11,color:item.due_date?TEXT2:TEXT3}}>{item.due_date||"—"}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TEAM */}
      {tab==="team"&&(
        <div style={{padding:"32px 40px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:4,color:TEXT1}}>Team Overview</div>
          <div style={{fontSize:12,color:TEXT3,marginBottom:28}}>{members.length} member{members.length!==1?"s":""} · {tasks.length} tasks total</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32}}>
            {Object.entries(STATUS_COLORS).map(([s,c])=>{
              const count=tasks.filter(t=>t.status===s).length;
              return(
                <div key={s} style={{background:SURFACE,border:`1px solid ${c.border}`,borderRadius:8,padding:"16px 18px"}}>
                  <div style={{fontSize:11,color:c.text,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,fontWeight:500}}>{s}</div>
                  <div style={{fontSize:28,fontWeight:500,color:c.text,fontFamily:"'Playfair Display',serif"}}>{count}</div>
                  <div style={{fontSize:11,color:TEXT3,marginTop:4}}>task{count!==1?"s":""}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {memberStats.map(m=>(
              <div key={m.id} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"20px 22px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <Avatar name={m.name} color={m.color} size={38}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500,fontSize:14,display:"flex",alignItems:"center",gap:8,color:TEXT1}}>
                      {m.name}{m.id===currentUser.id&&<span style={{fontSize:10,color:ORANGE,border:`1px solid ${ORANGE}44`,borderRadius:4,padding:"1px 6px"}}>You</span>}
                    </div>
                    <div style={{fontSize:11,color:TEXT3}}>{m.role}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:20,fontWeight:600,color:TEXT1,fontFamily:"'Playfair Display',serif"}}>{m.total}</div>
                    <div style={{fontSize:10,color:TEXT3}}>task{m.total!==1?"s":""}</div>
                  </div>
                </div>
                {m.total>0&&(
                  <div style={{display:"flex",height:4,borderRadius:2,overflow:"hidden",marginBottom:12,gap:1}}>
                    {Object.entries(STATUS_COLORS).map(([s,c])=>{ const pct=(m.byStatus[s]||0)/m.total*100; return pct>0?<div key={s} style={{width:`${pct}%`,background:c.border,borderRadius:2}}/>:null; })}
                  </div>
                )}
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:m.tasks.length>0?14:0}}>
                  {Object.entries(STATUS_COLORS).map(([s,c])=>{ const count=m.byStatus[s]||0; if(!count) return null; return<span key={s} style={{fontSize:10,color:c.text,background:c.bg,border:`1px solid ${c.border}`,borderRadius:4,padding:"2px 7px"}}>{count} {s}</span>; })}
                  {m.total===0&&<span style={{fontSize:11,color:TEXT3}}>No tasks assigned</span>}
                </div>
                {m.tasks.length>0&&(
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {m.tasks.slice(0,4).map(t=>{ const sc=STATUS_COLORS[t.status]||STATUS_COLORS["Not Started"]; const pc=t.priority?PRIORITY_COLORS[t.priority]:null; return(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:BG,borderRadius:5,border:`1px solid ${BORDER}`}}>
                        <span style={{fontSize:11,color:TEXT2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
                        {t.priority&&<span style={{fontSize:9,color:pc?.text,border:`1px solid ${pc?.border}`,borderRadius:3,padding:"1px 5px",flexShrink:0}}>{t.priority}</span>}
                        <span style={{fontSize:9,color:sc.text,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:3,padding:"1px 5px",flexShrink:0,whiteSpace:"nowrap"}}>{t.status}</span>
                      </div>
                    ); })}
                    {m.tasks.length>4&&<div style={{fontSize:10,color:TEXT3,paddingLeft:4}}>+{m.tasks.length-4} more</div>}
                  </div>
                )}
              </div>
            ))}
            {members.length===0&&<div style={{color:TEXT3,fontSize:13,gridColumn:"1/-1",paddingTop:40,textAlign:"center"}}>No team members yet</div>}
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {postModal&&(
        <ModalOverlay onClose={()=>setPostModal(null)}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:4,color:TEXT1}}>{postModal.editId?"Edit Post":"New Post"}</div>
          <div style={{fontSize:12,color:TEXT3,marginBottom:18}}>{MONTHS[contentMonth]} {postModal.day}, {contentYear}</div>
          <div onClick={()=>fileRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleImageFile(e.dataTransfer.files[0]);}}
            style={{border:`1px dashed ${BORDER2}`,borderRadius:8,minHeight:postForm.image_url?"auto":90,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:14,overflow:"hidden",background:BG}}>
            {postForm.image_url?<img src={postForm.image_url} alt="" style={{width:"100%",maxHeight:190,objectFit:"cover",display:"block"}}/>:<div style={{textAlign:"center",color:TEXT3,fontSize:12}}>Click or drop an image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageFile(e.target.files[0])}/>
          <FL>Platform</FL>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
            {Object.entries(PLATFORM_COLORS).map(([p,c])=>(
              <button key={p} onClick={()=>setPostForm(f=>({...f,platform:p}))} style={{background:postForm.platform===p?`${c}22`:"transparent",border:`1px solid ${postForm.platform===p?c:BORDER}`,color:postForm.platform===p?c:TEXT3,borderRadius:5,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
          <FL>Caption</FL>
          <textarea value={postForm.caption} onChange={e=>setPostForm(f=>({...f,caption:e.target.value}))} placeholder="Write your caption..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT1,fontSize:13,padding:"9px 11px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:14}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            <div>
              <FL>Link to Campaign</FL>
              <select value={postForm.campaign_id} onChange={e=>setPostForm(f=>({...f,campaign_id:e.target.value}))} style={{...inputStyle}}>
                <option value="">— None —</option>
                {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <FL>Link to Task</FL>
              <select value={postForm.task_id} onChange={e=>setPostForm(f=>({...f,task_id:e.target.value}))} style={{...inputStyle}}>
                <option value="">— None —</option>
                {tasks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <MA onCancel={()=>setPostModal(null)} onSave={savePost} onDelete={postModal.editId?()=>deletePost(postModal.editId):null} saveLabel={postModal.editId?"Save Changes":"Add Post"}/>
        </ModalOverlay>
      )}

      {/* EVENT MODAL */}
      {eventModal&&(
        <ModalOverlay onClose={()=>setEventModal(null)}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:18,color:TEXT1}}>{eventModal.editId?"Edit Event":"New Event"}</div>
          <FL>Event Title</FL>
          <input value={eventForm.title} onChange={e=>setEventForm(f=>({...f,title:e.target.value}))} placeholder="e.g. SHOT Show 2026" style={{...inputStyle,marginBottom:14}}/>
          <FL>Event Type</FL>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
            {EVENT_TYPES.map(t=>{ const c=EVENT_TYPE_COLORS[t]||TEXT3; return<button key={t} onClick={()=>setEventForm(f=>({...f,event_type:t}))} style={{background:eventForm.event_type===t?`${c}22`:"transparent",border:`1px solid ${eventForm.event_type===t?c:BORDER}`,color:eventForm.event_type===t?c:TEXT3,borderRadius:5,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>{t}</button>; })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div><FL>Start Date</FL><input type="date" value={eventForm.event_date} onChange={e=>setEventForm(f=>({...f,event_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark"}}/></div>
            <div><FL>End Date (optional)</FL><input type="date" value={eventForm.end_date} onChange={e=>setEventForm(f=>({...f,end_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark"}}/></div>
          </div>
          <FL>Location</FL>
          <input value={eventForm.location} onChange={e=>setEventForm(f=>({...f,location:e.target.value}))} placeholder="City, venue, or virtual" style={{...inputStyle,marginBottom:14}}/>
          <FL>Assign To</FL>
          <select value={eventForm.assignee_id} onChange={e=>setEventForm(f=>({...f,assignee_id:e.target.value}))} style={{...inputStyle,marginBottom:14}}>
            <option value="">— Unassigned —</option>
            {members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
          </select>
          <FL>Description</FL>
          <textarea value={eventForm.description} onChange={e=>setEventForm(f=>({...f,description:e.target.value}))} placeholder="Notes, booth number, contacts..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT1,fontSize:13,padding:"9px 11px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:20}}/>
          <MA onCancel={()=>setEventModal(null)} onSave={saveEvent} onDelete={eventModal.editId?()=>deleteEvent(eventModal.editId):null} saveLabel={eventModal.editId?"Save Changes":"Add Event"}/>
        </ModalOverlay>
      )}

      {/* ITEM MODAL */}
      {itemModal&&(
        <ModalOverlay onClose={()=>setItemModal(null)}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:18,color:TEXT1}}>{itemModal.editId?"Edit":"New"} {listConfig[itemModal.type].label.slice(0,-1)}</div>
          <FL>Name</FL>
          <input value={itemForm.name||""} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} placeholder="Name..." style={{...inputStyle,marginBottom:14}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <FL>Status</FL>
              <select value={itemForm.status||"Not Started"} onChange={e=>setItemForm(f=>({...f,status:e.target.value}))} style={{...inputStyle}}>
                {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {itemModal.type!=="programs"&&(
              <div>
                <FL>Priority</FL>
                <select value={itemForm.priority||"Medium"} onChange={e=>setItemForm(f=>({...f,priority:e.target.value}))} style={{...inputStyle}}>
                  {Object.keys(PRIORITY_COLORS).map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
          </div>
          {itemModal.type==="campaigns"&&(
            <div style={{marginBottom:14}}>
              <FL>Program (optional)</FL>
              <select value={itemForm.program_id||""} onChange={e=>setItemForm(f=>({...f,program_id:e.target.value}))} style={{...inputStyle}}>
                <option value="">— No program —</option>
                {programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          {itemModal.type==="tasks"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <FL>Campaign (optional)</FL>
                <select value={itemForm.campaign_id||""} onChange={e=>setItemForm(f=>({...f,campaign_id:e.target.value}))} style={{...inputStyle}}>
                  <option value="">— None —</option>
                  {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <FL>Due Date</FL>
                <input type="date" value={itemForm.due_date||""} onChange={e=>setItemForm(f=>({...f,due_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark"}}/>
              </div>
            </div>
          )}
          {itemModal.type==="tasks"&&(
            <div style={{marginBottom:14}}>
              <FL>Assign To</FL>
              <select value={itemForm.assignee_id||""} onChange={e=>setItemForm(f=>({...f,assignee_id:e.target.value}))} style={{...inputStyle}}>
                <option value="">— Unassigned —</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}
          <FL>Description</FL>
          <textarea value={itemForm.description||""} onChange={e=>setItemForm(f=>({...f,description:e.target.value}))} placeholder="Optional notes..." rows={2} style={{...inputStyle,resize:"vertical",lineHeight:1.6,marginBottom:20}}/>
          {itemModal.type==="tasks"&&itemModal.editId&&(
            <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:20,marginBottom:4}}>
              <SubtaskPanel taskId={itemModal.editId}/>
            </div>
          )}
          {itemModal.type==="tasks"&&!itemModal.editId&&(
            <div style={{fontSize:11,color:TEXT3,marginBottom:20,fontStyle:"italic"}}>Save the task first to add steps.</div>
          )}
          <MA onCancel={()=>setItemModal(null)} onSave={saveItem} onDelete={itemModal.editId?deleteItem:null} saveLabel={itemModal.editId?"Save Changes":`Create ${listConfig[itemModal.type].label.slice(0,-1)}`}/>
        </ModalOverlay>
      )}
    </div>
  );
}
