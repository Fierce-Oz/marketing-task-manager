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

function OrangeBtn({onClick,children,style={}}){ return <button onClick={onClick} style={{background:ORANGE,border:"none",color:"#fff",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:500,...style}}>{children}</button>; }
function GhostBtn({onClick,children,style={}}){ return <button onClick={onClick} style={{background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",...style}}>{children}</button>; }

function ModalOverlay({children,onClose,isMobile}){
  const mStyle=isMobile?{position:"fixed",inset:0,background:BG,zIndex:200,overflowY:"auto",padding:"0 0 40px"}:{position:"fixed",inset:0,background:"#00000099",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"};
  const innerStyle=isMobile?{padding:"16px 20px"}:{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:32,width:560,maxWidth:"92vw",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 32px 80px #00000099"};
  return(
    <div style={mStyle} onClick={isMobile?undefined:onClose}>
      <div style={innerStyle} onClick={e=>e.stopPropagation()}>
        {isMobile&&<div style={{display:"flex",alignItems:"center",padding:"16px 0 20px",borderBottom:`1px solid ${BORDER}`,marginBottom:20}}><button onClick={onClose} style={{background:"none",border:"none",color:ORANGE,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button></div>}
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

function ProgressBar({value,height=4}){
  return <div style={{height,background:SURFACE2,borderRadius:height,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,Math.max(0,value))}%`,background:value===100?"#4a9e60":ORANGE,borderRadius:height,transition:"width 0.3s"}}/></div>;
}

// ── Carousel image uploader ──────────────────────────────────────────────────
function CarouselUploader({images,setImages,uploadImage}){
  const fileRef=useRef();
  const [uploading,setUploading]=useState(false);
  const [dragIdx,setDragIdx]=useState(null);

  const handleFiles=async(files)=>{
    setUploading(true);
    const newImgs=[...images];
    for(const file of Array.from(files)){
      if(!file.type.startsWith("image/")) continue;
      const url=await uploadImage(file);
      if(url) newImgs.push({url,id:Date.now()+Math.random()});
    }
    setImages(newImgs);
    setUploading(false);
  };

  const removeImage=(idx)=>{ setImages(images.filter((_,i)=>i!==idx)); };

  const onDragStart=(idx)=>setDragIdx(idx);
  const onDragOver=(e,idx)=>{ e.preventDefault(); if(dragIdx===null||dragIdx===idx) return; const arr=[...images]; const [moved]=arr.splice(dragIdx,1); arr.splice(idx,0,moved); setImages(arr); setDragIdx(idx); };
  const onDragEnd=()=>setDragIdx(null);

  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <FL>Images {images.length>0&&<span style={{color:TEXT3,fontSize:10,fontWeight:400}}>({images.length} · drag to reorder)</span>}</FL>
        <button onClick={()=>fileRef.current.click()} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT2;}}
        >+ Add Images</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>

      {/* Drop zone */}
      <div onDragOver={e=>{e.preventDefault();}} onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}
        style={{border:`1px dashed ${BORDER2}`,borderRadius:8,padding:"12px",background:BG,marginBottom:images.length>0?12:0,minHeight:images.length>0?0:80,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
        onClick={()=>fileRef.current.click()}
      >
        {uploading
          ? <span style={{fontSize:13,color:TEXT3}}>Uploading...</span>
          : images.length===0
            ? <span style={{fontSize:13,color:TEXT3}}>Click or drop images here · select multiple for carousel</span>
            : <span style={{fontSize:12,color:TEXT3}}>Drop more images to add</span>
        }
      </div>

      {/* Image thumbnails */}
      {images.length>0&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {images.map((img,idx)=>(
            <div key={img.id||idx} draggable onDragStart={()=>onDragStart(idx)} onDragOver={e=>onDragOver(e,idx)} onDragEnd={onDragEnd}
              style={{position:"relative",width:72,height:72,borderRadius:6,overflow:"hidden",border:dragIdx===idx?`2px solid ${ORANGE}`:`2px solid ${BORDER}`,cursor:"grab",flexShrink:0}}>
              <img src={img.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {idx===0&&<div style={{position:"absolute",top:2,left:2,background:"#000000aa",borderRadius:3,fontSize:9,color:"#fff",padding:"1px 4px"}}>Cover</div>}
              <button onClick={()=>removeImage(idx)} style={{position:"absolute",top:2,right:2,background:"#000000bb",border:"none",color:"#fff",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
              <div style={{position:"absolute",bottom:2,left:0,right:0,textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.7)"}}>{idx+1}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Carousel viewer (shared by week view + preview) ──────────────────────────
function CarouselViewer({images,style={},imgStyle={}}){
  const [idx,setIdx]=useState(0);
  if(!images||images.length===0) return <div style={{width:"100%",aspectRatio:"1/1",background:SURFACE2,display:"flex",alignItems:"center",justifyContent:"center",...style}}><span style={{fontSize:22,opacity:0.3}}>🖼</span></div>;
  const url=typeof images[idx]==="string"?images[idx]:images[idx]?.url||images[idx]?.image_url;
  return(
    <div style={{position:"relative",overflow:"hidden",...style}}>
      <img src={url} alt="" style={{width:"100%",objectFit:"cover",display:"block",...imgStyle}}/>
      {images.length>1&&(
        <>
          {idx>0&&<button onClick={e=>{e.stopPropagation();setIdx(i=>i-1);}} style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>}
          {idx<images.length-1&&<button onClick={e=>{e.stopPropagation();setIdx(i=>i+1);}} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>}
          <div style={{position:"absolute",bottom:6,left:0,right:0,display:"flex",justifyContent:"center",gap:4}}>
            {images.map((_,i)=><div key={i} style={{width:i===idx?12:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"width 0.2s"}}/>)}
          </div>
          <div style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.5)",borderRadius:4,fontSize:10,color:"#fff",padding:"2px 6px"}}>⧉ {images.length}</div>
        </>
      )}
    </div>
  );
}

// ── Platform preview modal ───────────────────────────────────────────────────
function PostPreview({post,images,members,onClose,onEdit,isMobile}){
  const creator=post.created_by?members.find(m=>m.id===post.created_by):null;
  const platform=post.platform||"Instagram";
  const pc=PLATFORM_COLORS[platform];
  const handle=post.account_handle?(post.account_handle.startsWith("@")?post.account_handle:`@${post.account_handle}`):creator?`@${creator.name.toLowerCase().replace(/\s+/g,"_")}`:"@fiercearms";
  const displayName=post.account_handle?post.account_handle.replace(/^@/,""):creator?creator.name:"Fierce Firearms";
  const hasImages=images&&images.length>0;
  const imgEl=hasImages?<CarouselViewer images={images} style={{width:"100%"}} imgStyle={{aspectRatio:"1/1"}}/>:post.image_url?<img src={post.image_url} alt="" style={{width:"100%",aspectRatio:"1/1",objectFit:"cover",display:"block"}}/>:<div style={{width:"100%",aspectRatio:"1/1",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:32,opacity:0.2}}>🖼</span></div>;

  const renderPreview=()=>{
    if(platform==="Instagram") return(
      <div style={{background:"#fff",borderRadius:4,overflow:"hidden",maxWidth:380,width:"100%",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",padding:2,flexShrink:0}}>
            <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              {creator?<Avatar name={creator.name} color={creator.color} size={26}/>:<div style={{width:26,height:26,borderRadius:"50%",background:"#ddd"}}/>}
            </div>
          </div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#000"}}>{displayName}</div><div style={{fontSize:11,color:"#666"}}>Fierce Firearms</div></div>
          <div style={{fontSize:20,color:"#000"}}>···</div>
        </div>
        {imgEl}
        <div style={{padding:"10px 12px 4px"}}>
          <div style={{display:"flex",gap:14,marginBottom:8}}>
            <span style={{fontSize:22}}>🤍</span><span style={{fontSize:22}}>💬</span><span style={{fontSize:22}}>📤</span>
            <span style={{marginLeft:"auto",fontSize:22}}>🔖</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:"#000",marginBottom:4}}>1,247 likes</div>
          <div style={{fontSize:13,color:"#000",lineHeight:1.5}}><span style={{fontWeight:600}}>{handle} </span>{post.caption||""}</div>
          <div style={{fontSize:12,color:"#8e8e8e",marginTop:6}}>View all 48 comments</div>
          <div style={{fontSize:11,color:"#8e8e8e",marginTop:4,textTransform:"uppercase",letterSpacing:"0.03em"}}>2 hours ago</div>
        </div>
      </div>
    );
    if(platform==="Facebook") return(
      <div style={{background:"#fff",borderRadius:8,overflow:"hidden",maxWidth:400,width:"100%",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",boxShadow:"0 1px 2px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"#1877F2",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
            {creator?<Avatar name={creator.name} color={creator.color} size={38}/>:<div style={{color:"#fff",fontWeight:700,fontSize:16}}>F</div>}
          </div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#050505"}}>{displayName}</div><div style={{fontSize:12,color:"#65676b"}}>2h · 🌐</div></div>
          <div style={{fontSize:20,color:"#65676b"}}>···</div>
        </div>
        <div style={{fontSize:14,color:"#050505",padding:"0 16px 12px",lineHeight:1.6}}>{post.caption||""}</div>
        {imgEl}
        <div style={{padding:"4px 16px",borderTop:"1px solid #e4e6eb",borderBottom:"1px solid #e4e6eb",margin:"8px 0",display:"flex",justifyContent:"space-between"}}>
          <div style={{fontSize:13,color:"#65676b"}}>👍 ❤️ 😮 847</div>
          <div style={{fontSize:13,color:"#65676b"}}>124 comments</div>
        </div>
        <div style={{display:"flex",padding:"4px 8px 8px"}}>
          {["👍 Like","💬 Comment","↗ Share"].map(a=><button key={a} style={{flex:1,background:"none",border:"none",color:"#65676b",fontSize:13,fontWeight:600,padding:"8px 0",cursor:"pointer",borderRadius:4}}>{a}</button>)}
        </div>
      </div>
    );
    if(platform==="Twitter") return(
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",maxWidth:400,width:"100%",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",border:"1px solid #2f3336"}}>
        <div style={{display:"flex",gap:12,padding:"12px 16px 0"}}>
          <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>{creator?<Avatar name={creator.name} color={creator.color} size={40}/>:<div style={{width:40,height:40,borderRadius:"50%",background:"#333"}}/>}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:700,color:"#e7e9ea"}}>{displayName}</span><span style={{fontSize:13,color:"#71767b"}}>{handle} · 2h</span></div>
            <div style={{fontSize:14,color:"#e7e9ea",lineHeight:1.6,marginBottom:10}}>{post.caption||""}</div>
            <div style={{borderRadius:12,overflow:"hidden",marginBottom:10}}>{imgEl}</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0 12px"}}>
              {[["💬","48"],["🔁","124"],["❤️","847"],["📊","12K"],["↗",""]].map(([icon,count])=>(
                <div key={icon} style={{display:"flex",alignItems:"center",gap:4,color:"#71767b",fontSize:13}}><span style={{fontSize:16}}>{icon}</span>{count&&<span>{count}</span>}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    if(platform==="LinkedIn") return(
      <div style={{background:"#fff",borderRadius:8,overflow:"hidden",maxWidth:400,width:"100%",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",boxShadow:"0 0 0 1px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px"}}>
          <div style={{width:48,height:48,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>{creator?<Avatar name={creator.name} color={creator.color} size={48}/>:<div style={{width:48,height:48,borderRadius:"50%",background:"#ddd"}}/>}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"rgba(0,0,0,0.9)"}}>{displayName}</div><div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>Precision Rifle Manufacturer</div><div style={{fontSize:12,color:"rgba(0,0,0,0.6)"}}>2h · 🌐</div></div>
        </div>
        <div style={{fontSize:14,color:"rgba(0,0,0,0.9)",padding:"0 16px 12px",lineHeight:1.6}}>{post.caption||""}</div>
        {imgEl}
        <div style={{padding:"8px 16px",borderTop:"1px solid #e0e0e0"}}>
          <div style={{fontSize:12,color:"rgba(0,0,0,0.6)",marginBottom:8}}>👍 ❤️ 💡 847 reactions</div>
          <div style={{display:"flex",borderTop:"1px solid #e0e0e0",paddingTop:4}}>
            {[["👍","Like"],["💬","Comment"],["↗","Share"],["✉️","Send"]].map(([icon,label])=>(
              <button key={label} style={{flex:1,background:"none",border:"none",color:"rgba(0,0,0,0.6)",fontSize:12,fontWeight:600,padding:"8px 0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><span>{icon}</span>{label}</button>
            ))}
          </div>
        </div>
      </div>
    );
    if(platform==="TikTok") return(
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",maxWidth:260,width:"100%",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",aspectRatio:"9/16",display:"flex",alignItems:"flex-end"}}>
        {hasImages?<CarouselViewer images={images} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} imgStyle={{height:"100%",objectFit:"cover"}}/>:post.image_url?<img src={post.image_url} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"#111",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:40,opacity:0.2}}>🖼</span></div>}
        <div style={{position:"relative",zIndex:2,width:"100%",padding:"12px 8px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.7))"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:4}}>{handle}</div>
              <div style={{fontSize:12,color:"#fff",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.caption||""}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,paddingBottom:4}}>
              <div style={{width:40,height:40,borderRadius:"50%",border:"2px solid #fff",overflow:"hidden",background:"#333"}}>{creator&&<Avatar name={creator.name} color={creator.color} size={38}/>}</div>
              {[["❤️","24.7K"],["💬","847"],["↗","3.2K"],["🔖","1.1K"]].map(([icon,count])=>(
                <div key={icon} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><span style={{fontSize:22}}>{icon}</span><span style={{fontSize:10,color:"#fff",fontWeight:600}}>{count}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    return <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,maxWidth:380,width:"100%",overflow:"hidden"}}>{imgEl}<div style={{padding:16}}><div style={{fontSize:13,color:TEXT1,lineHeight:1.6}}>{post.caption||"No caption"}</div></div></div>;
  };

  return(
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,maxHeight:"90vh",overflowY:"auto",padding:"20px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,color:pc,border:`1px solid ${pc}55`,borderRadius:6,padding:"4px 12px",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{platform}</span>
          <span style={{fontSize:12,color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Preview{images&&images.length>1?` · ${images.length} slides`:""}</span>
        </div>
        {renderPreview()}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onEdit} style={{background:ORANGE,border:"none",color:"#fff",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Edit Post</button>
          <button onClick={onClose} style={{background:SURFACE,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:8,padding:"10px 24px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>Close</button>
        </div>
      </div>
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
        <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addSubtask();}} placeholder="Add a step..." style={{...inputStyle,flex:1}}/>
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
            <div style={{width:12,height:12,borderRadius:3,background:t.color,flexShrink:0}}/><span style={{flex:1,fontSize:14,color:TEXT1}}>{t.name}</span>
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
      <FL>Name</FL><input value={name} onChange={e=>setName(e.target.value)} style={{...inputStyle,marginBottom:14}}/>
      <FL>Email Address</FL><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@fiercearms.com" style={{...inputStyle,marginBottom:8}}/>
      <div style={{fontSize:12,color:TEXT3,marginBottom:20}}>Used for task assignment notifications</div>
      {msg&&<div style={{fontSize:13,color:"#4a9e60",marginBottom:12}}>{msg}</div>}
      <MA onCancel={onClose} onSave={save} saveLabel={saving?"Saving...":"Save Profile"} isMobile={isMobile}/>
    </ModalOverlay>
  );
}

function SocialAccountManager({socialAccounts,setSocialAccounts,onClose,isMobile}){
  const [platform,setPlatform]=useState("Instagram");
  const [handle,setHandle]=useState("");
  const [label,setLabel]=useState("");
  const [err,setErr]=useState("");

  const addAccount=async()=>{
    if(!handle.trim()){setErr("Enter a handle."); return;}
    const cleanHandle=handle.replace(/^@/,"").trim();
    if(socialAccounts.find(a=>a.platform===platform&&a.handle.toLowerCase()===cleanHandle.toLowerCase())){setErr("That account already exists."); return;}
    const{data,error}=await supabase.from("social_accounts").insert({platform,handle:cleanHandle,label:label.trim()}).select().single();
    if(error){setErr("Error saving."); return;}
    setSocialAccounts(prev=>[...prev,data]);
    setHandle(""); setLabel(""); setErr("");
  };

  const deleteAccount=async(id)=>{
    await supabase.from("social_accounts").delete().eq("id",id);
    setSocialAccounts(prev=>prev.filter(a=>a.id!==id));
  };

  const platformAccounts=socialAccounts.filter(a=>a.platform===platform);

  return(
    <ModalOverlay onClose={onClose} isMobile={isMobile}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4,color:TEXT1}}>Manage Social Accounts</div>
      <div style={{fontSize:13,color:TEXT3,marginBottom:20}}>Save handles for quick selection when creating posts</div>

      {/* Platform tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
        {Object.entries(PLATFORM_COLORS).map(([p,c])=>(
          <button key={p} onClick={()=>setPlatform(p)} style={{fontSize:12,color:platform===p?c:TEXT3,background:platform===p?`${c}22`:"transparent",border:`1px solid ${platform===p?c:BORDER}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:platform===p?500:400}}>
            {p} {socialAccounts.filter(a=>a.platform===p).length>0&&<span style={{fontSize:10,opacity:0.7}}>({socialAccounts.filter(a=>a.platform===p).length})</span>}
          </button>
        ))}
      </div>

      {/* Existing accounts for selected platform */}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
        {platformAccounts.length===0&&<div style={{fontSize:13,color:TEXT3,padding:"8px 0"}}>No {platform} accounts saved yet</div>}
        {platformAccounts.map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:SURFACE2,border:`1px solid ${BORDER}`,borderRadius:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:PLATFORM_COLORS[a.platform],flexShrink:0}}/>
            <span style={{flex:1,fontSize:13,color:TEXT1,fontWeight:500}}>@{a.handle}</span>
            {a.label&&<span style={{fontSize:12,color:TEXT3}}>{a.label}</span>}
            <button onClick={()=>deleteAccount(a.id)} style={{background:"none",border:"none",color:TEXT3,cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1}}
              onMouseEnter={e=>e.currentTarget.style.color="#a05050"}
              onMouseLeave={e=>e.currentTarget.style.color=TEXT3}
            >×</button>
          </div>
        ))}
      </div>

      {/* Add new account */}
      <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:16}}>
        <FL>Add {platform} Account</FL>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input value={handle} onChange={e=>setHandle(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addAccount();}} placeholder="@handle" style={{...inputStyle,flex:1}}/>
          <input value={label} onChange={e=>setLabel(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addAccount();}} placeholder="Label (optional)" style={{...inputStyle,flex:1}}/>
        </div>
        {err&&<div style={{fontSize:12,color:"#c47a30",marginBottom:10}}>{err}</div>}
        <OrangeBtn onClick={addAccount} style={{width:"100%"}}>+ Add Account</OrangeBtn>
      </div>
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
        {mode==="pick"&&(<>
          <div style={{fontSize:14,color:TEXT2,marginBottom:14}}>Who are you?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {members.map(m=>(<button key={m.id} onClick={()=>onAuth(m)} style={{display:"flex",alignItems:"center",gap:12,background:SURFACE2,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",color:TEXT1,fontFamily:"'DM Sans',sans-serif",fontSize:14,textAlign:"left",width:"100%"}}><Avatar name={m.name} color={m.color} size={36}/><div><div style={{fontWeight:500}}>{m.name}</div><div style={{fontSize:12,color:TEXT3}}>{m.role}{m.email?` · ${m.email}`:""}</div></div></button>))}
          </div>
          <button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>+ Create new account</button>
        </>)}
        {(mode==="login"||mode==="register")&&(<>
          <FL>Team Password</FL>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") mode==="login"?handleLogin():handleRegister();}} placeholder="Enter team password" style={{...inputStyle,marginBottom:16}}/>
          {mode==="register"&&(<><FL>Your Name</FL><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{...inputStyle,marginBottom:12}}/><FL>Email Address</FL><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@fiercearms.com" style={{...inputStyle,marginBottom:12}}/><FL>Role</FL><select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,marginBottom:20}}>{["Admin","Manager","Member","Contractor"].map(r=><option key={r}>{r}</option>)}</select></>)}
          {err&&<div style={{fontSize:13,color:"#c47a30",marginBottom:12}}>{err}</div>}
          <OrangeBtn onClick={mode==="login"?handleLogin:handleRegister} style={{width:"100%",marginBottom:14,padding:"13px 0",fontSize:15}}>{mode==="login"?"Enter":"Create Account & Enter"}</OrangeBtn>
          {mode==="login"?<button onClick={()=>{setMode("register");setErr("");}} style={{background:"none",border:"none",color:ORANGE,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>New here? Create an account</button>:<button onClick={()=>{setMode("login");setErr("");}} style={{background:"none",border:"none",color:TEXT3,fontSize:13,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>Back to login</button>}
        </>)}
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
  const [postImagesMap,setPostImagesMap]=useState({});
  const [socialAccounts,setSocialAccounts]=useState([]);
  const [showAccountManager,setShowAccountManager]=useState(false); // postId -> [{url,id,position}]
  const [events,setEvents]=useState([]);
  const [members,setMembers]=useState([]);
  const [eventTypes,setEventTypes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showTypeManager,setShowTypeManager]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);

  const [eventsChannelFilter,setEventsChannelFilter]=useState("All");
  const [calView,setCalView]=useState("month");
  const [eventsView,setEventsView]=useState("month");
  const [contentYear,setContentYear]=useState(today.getFullYear());
  const [contentMonth,setContentMonth]=useState(today.getMonth());
  const [weekStart,setWeekStart]=useState(()=>{ const d=new Date(today); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d; });
  const [eventsYear,setEventsYear]=useState(today.getFullYear());
  const [eventsMonth,setEventsMonth]=useState(today.getMonth());
  const [eventsWeekStart,setEventsWeekStart]=useState(()=>{ const d=new Date(today); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d; });

  const [postModal,setPostModal]=useState(null);
  const [postForm,setPostForm]=useState({caption:"",platform:"Instagram",account_id:"",account_handle:"",campaign_id:"",task_id:""});
  const [postImages,setPostImages]=useState([]); // [{url, id}] for current modal
  const [previewPost,setPreviewPost]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [draggingPost,setDraggingPost]=useState(null); // post being dragged

  const [eventModal,setEventModal]=useState(null);
  const [eventForm,setEventForm]=useState({title:"",event_date:"",end_date:"",location:"",description:"",event_type:"",assignee_id:""});

  const [activeList,setActiveList]=useState("tasks");
  const [taskView,setTaskView]=useState("active");
  const [channelFilter,setChannelFilter]=useState("All");
  const [itemModal,setItemModal]=useState(null);
  const [itemForm,setItemForm]=useState({});
  const [searchQ,setSearchQ]=useState("");

  useEffect(()=>{
    async function fetchAll(){
      const [m,p,ca,t,po,ev,et,pi,sa]=await Promise.all([
        supabase.from("members").select("*").order("created_at"),
        supabase.from("programs").select("*").order("created_at"),
        supabase.from("campaigns").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
        supabase.from("posts").select("*").order("post_date"),
        supabase.from("events").select("*").order("event_date"),
        supabase.from("event_types").select("*").order("created_at"),
        supabase.from("post_images").select("*").order("position"),
        supabase.from("social_accounts").select("*").order("platform"),
      ]);
      setMembers(m.data||[]); setPrograms(p.data||[]); setCampaigns(ca.data||[]);
      setTasks(t.data||[]); setPosts(po.data||[]); setEvents(ev.data||[]);
      setEventTypes(et.data||[]); setSocialAccounts(sa.data||[]);
      // Build postImagesMap
      const map={};
      (pi.data||[]).forEach(img=>{ if(!map[img.post_id]) map[img.post_id]=[]; map[img.post_id].push(img); });
      setPostImagesMap(map);
      setLoading(false);
    }
    fetchAll();
  },[]);

  // ── Image upload ──────────────────────────────────────────────────────────
  const uploadImage=async(file)=>{
    if(!file||!file.type.startsWith("image/")) return null;
    const ext=file.name.split(".").pop();
    const path=`${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const{error}=await supabase.storage.from("post-images").upload(path,file,{contentType:file.type});
    if(error){ console.error("Upload error",error); return null; }
    const{data}=supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Get images for a post (carousel or legacy single) ────────────────────
  const getPostImages=(post)=>{
    const imgs=postImagesMap[post.id];
    if(imgs&&imgs.length>0) return imgs;
    if(post.image_url) return [{url:post.image_url,id:"legacy"}];
    return [];
  };

  const getCoverImage=(post)=>{ const imgs=getPostImages(post); return imgs[0]?.url||imgs[0]?.image_url||null; };

  // ── Progress ──────────────────────────────────────────────────────────────
  const getCampaignProgress=(campaignId)=>{ const linked=tasks.filter(t=>t.campaign_id===campaignId); if(!linked.length) return null; const done=linked.filter(t=>t.status==="Complete").length; return{done,total:linked.length,pct:Math.round((done/linked.length)*100)}; };
  const getProgramProgress=(programId)=>{ const linkedTasks=tasks.filter(t=>{ if(t.campaign_id){ const camp=campaigns.find(c=>c.id===t.campaign_id); return camp&&camp.program_id===programId; } return false; }); if(!linkedTasks.length) return null; const done=linkedTasks.filter(t=>t.status==="Complete").length; return{done,total:linkedTasks.length,pct:Math.round((done/linkedTasks.length)*100)}; };

  const getEventTypeColor=(name)=>{ const t=eventTypes.find(t=>t.name===name); return t?t.color:TEXT3; };
  const prevContent=()=>{ if(contentMonth===0){setContentMonth(11);setContentYear(y=>y-1);}else setContentMonth(m=>m-1); };
  const nextContent=()=>{ if(contentMonth===11){setContentMonth(0);setContentYear(y=>y+1);}else setContentMonth(m=>m+1); };
  const prevWeek=()=>{ const d=new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d); };
  const nextWeek=()=>{ const d=new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d); };
  const getWeekDays=()=>{ const days=[]; for(let i=0;i<7;i++){ const d=new Date(weekStart); d.setDate(d.getDate()+i); days.push(d); } return days; };
  const isTodayDate=(d)=>d.getDate()===today.getDate()&&d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
  const getPostsByDate=(d)=>{ const ds=mkDate(d.getFullYear(),d.getMonth(),d.getDate()); return posts.filter(p=>p.post_date===ds); };
  const prevEvents=()=>{ if(eventsMonth===0){setEventsMonth(11);setEventsYear(y=>y-1);}else setEventsMonth(m=>m-1); };
  const nextEvents=()=>{ if(eventsMonth===11){setEventsMonth(0);setEventsYear(y=>y+1);}else setEventsMonth(m=>m+1); };
  const prevEventsWeek=()=>{ const d=new Date(eventsWeekStart); d.setDate(d.getDate()-7); setEventsWeekStart(d); };
  const nextEventsWeek=()=>{ const d=new Date(eventsWeekStart); d.setDate(d.getDate()+7); setEventsWeekStart(d); };
  const getEventsWeekDays=()=>{ const days=[]; for(let i=0;i<7;i++){ const d=new Date(eventsWeekStart); d.setDate(d.getDate()+i); days.push(d); } return days; };

  // ── Post modal ────────────────────────────────────────────────────────────
  const openAddPost=(day,month=contentMonth,year=contentYear)=>{
    setPostModal({day,ds:mkDate(year,month,day)});
    setPostForm({caption:"",platform:"Instagram",account_id:"",account_handle:"",campaign_id:"",task_id:""});
    setPostImages([]);
  };
  const openEditPost=(post)=>{
    setPostModal({day:parseInt(post.post_date.split("-")[2]),ds:post.post_date,editId:post.id});
    setPostForm({caption:post.caption,platform:post.platform,account_id:post.account_id||"",account_handle:post.account_handle||"",campaign_id:post.campaign_id||"",task_id:post.task_id||""});
    // Load carousel images
    const imgs=postImagesMap[post.id];
    if(imgs&&imgs.length>0) setPostImages(imgs.map(i=>({url:i.image_url||i.url,id:i.id,position:i.position})));
    else if(post.image_url) setPostImages([{url:post.image_url,id:"legacy"}]);
    else setPostImages([]);
  };

  const savePost=async()=>{
    const payload={caption:postForm.caption,platform:postForm.platform,account_id:postForm.account_id||null,account_handle:postForm.account_handle||null,campaign_id:postForm.campaign_id||null,task_id:postForm.task_id||null};
    // Set cover image_url to first image for backwards compat
    if(postImages.length>0) payload.image_url=postImages[0].url;
    else payload.image_url="";

    let postId=postModal.editId;
    if(postModal.editId){
      const{data}=await supabase.from("posts").update({...payload,post_date:postModal.ds}).eq("id",postModal.editId).select().single();
      setPosts(p=>p.map(post=>post.id===postModal.editId?data:post));
    }else{
      const{data}=await supabase.from("posts").insert({...payload,post_date:postModal.ds,created_by:currentUser.id}).select().single();
      setPosts(p=>[...p,data]);
      postId=data.id;
    }

    // Save carousel images to post_images table
    // Delete existing then reinsert
    await supabase.from("post_images").delete().eq("post_id",postId);
    if(postImages.length>0){
      const rows=postImages.map((img,i)=>({post_id:postId,image_url:img.url,position:i}));
      await supabase.from("post_images").insert(rows);
      setPostImagesMap(prev=>({...prev,[postId]:rows.map((r,i)=>({...r,id:postImages[i].id||`new-${i}`}))}));
    }else{
      setPostImagesMap(prev=>{ const n={...prev}; delete n[postId]; return n; });
    }
    setPostModal(null);
  };

  const deletePost=async(id)=>{
    await supabase.from("posts").delete().eq("id",id);
    setPosts(p=>p.filter(post=>post.id!==id));
    setPostImagesMap(prev=>{ const n={...prev}; delete n[id]; return n; });
    setPostModal(null);
  };

  const movePost=async(post,newDs)=>{
    if(post.post_date===newDs) return;
    const{data}=await supabase.from("posts").update({post_date:newDs}).eq("id",post.id).select().single();
    if(data) setPosts(p=>p.map(px=>px.id===post.id?data:px));
    setDraggingPost(null); setDragOver(null);
  };

  const getDayPosts=(day)=>{ const ds=mkDate(contentYear,contentMonth,day); return posts.filter(p=>p.post_date===ds); };
  const isToday=(y,m,day)=>day===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();

  const getDayEventsAndTasks=(day)=>{
    const ds=mkDate(eventsYear,eventsMonth,day);
    const dayEvents=events.filter(ev=>{ if(ev.event_date===ds) return true; if(ev.end_date&&ev.event_date<=ds&&ev.end_date>=ds) return true; return false; }).map(ev=>({...ev,_type:"event"}));
    const dayTasks=tasks.filter(t=>t.due_date===ds&&(eventsChannelFilter==="All"||t.channel===eventsChannelFilter)).map(t=>({...t,_type:"task"}));
    return [...dayEvents,...dayTasks];
  };
  const getDayEventsAndTasksByDate=(d)=>{
    const ds=mkDate(d.getFullYear(),d.getMonth(),d.getDate());
    const dayEvents=events.filter(ev=>{ if(ev.event_date===ds) return true; if(ev.end_date&&ev.event_date<=ds&&ev.end_date>=ds) return true; return false; }).map(ev=>({...ev,_type:"event"}));
    const dayTasks=tasks.filter(t=>t.due_date===ds&&(eventsChannelFilter==="All"||t.channel===eventsChannelFilter)).map(t=>({...t,_type:"task"}));
    return [...dayEvents,...dayTasks];
  };

  const openAddEvent=(day)=>{ const ds=mkDate(eventsYear,eventsMonth,day); setEventModal({day}); setEventForm({title:"",event_date:ds,end_date:"",location:"",description:"",event_type:eventTypes[0]?.name||"",assignee_id:""}); };
  const openEditEvent=(ev)=>{ setEventModal({editId:ev.id}); setEventForm({title:ev.title,event_date:ev.event_date,end_date:ev.end_date||"",location:ev.location||"",description:ev.description||"",event_type:ev.event_type||"",assignee_id:ev.assignee_id||""}); };
  const saveEvent=async()=>{
    const payload={...eventForm,assignee_id:eventForm.assignee_id||null,end_date:eventForm.end_date||null};
    if(eventModal.editId){ const{data}=await supabase.from("events").update(payload).eq("id",eventModal.editId).select().single(); setEvents(e=>e.map(ev=>ev.id===eventModal.editId?data:ev)); }
    else{ const{data}=await supabase.from("events").insert(payload).select().single(); setEvents(e=>[...e,data]); }
    setEventModal(null);
  };
  const deleteEvent=async(id)=>{ await supabase.from("events").delete().eq("id",id); setEvents(e=>e.filter(ev=>ev.id!==id)); setEventModal(null); };

  const listConfig={ programs:{label:"Programs",data:programs,setData:setPrograms,table:"programs"}, campaigns:{label:"Campaigns",data:campaigns,setData:setCampaigns,table:"campaigns"}, tasks:{label:"Tasks",data:tasks,setData:setTasks,table:"tasks"} };
  const openNewItem=()=>{ const defaults={ programs:{name:"",status:"Not Started",description:""}, campaigns:{name:"",status:"Not Started",priority:"Medium",program_id:"",description:""}, tasks:{name:"",status:"Not Started",priority:"Medium",campaign_id:"",due_date:"",description:"",assignee_id:"",channel:""} }; setItemModal({type:activeList}); setItemForm(defaults[activeList]); };
  const openEditItem=(type,item)=>{ const{_type,...cleanItem}=item; setItemModal({type,editId:cleanItem.id}); setItemForm({...cleanItem}); };
  const saveItem=async()=>{
    const{table,setData,data}=listConfig[itemModal.type];
    const payload={...itemForm};
    ["program_id","campaign_id","assignee_id","due_date","channel"].forEach(k=>{ if(payload[k]==="") payload[k]=null; });
    delete payload.id; delete payload.created_at; delete payload._type;
    if(itemModal.editId){ const{data:updated}=await supabase.from(table).update(payload).eq("id",itemModal.editId).select().single(); setData(data.map(i=>i.id===itemModal.editId?updated:i)); }
    else{ const{data:created}=await supabase.from(table).insert(payload).select().single(); setData([...data,created]); }
    setItemModal(null);
  };
  const deleteItem=async()=>{ const{table,setData,data}=listConfig[itemModal.type]; await supabase.from(table).delete().eq("id",itemModal.editId); setData(data.filter(i=>i.id!==itemModal.editId)); setItemModal(null); };
  const filteredData=(type)=>{ const{data}=listConfig[type]; let result=data; if(type==="tasks") result=taskView==="complete"?result.filter(i=>i.status==="Complete"):result.filter(i=>i.status!=="Complete"); if(searchQ) result=result.filter(i=>i.name.toLowerCase().includes(searchQ.toLowerCase())); if(type==="tasks"&&channelFilter!=="All") result=result.filter(i=>i.channel===channelFilter); return result; };
  const memberStats=members.map(m=>{ const myTasks=tasks.filter(t=>t.assignee_id===m.id); const byStatus={}; Object.keys(STATUS_COLORS).forEach(s=>{ byStatus[s]=myTasks.filter(t=>t.status===s).length; }); return{...m,tasks:myTasks,byStatus,total:myTasks.length}; });
  const activeTasks=tasks.filter(t=>t.status!=="Complete");
  const completedTasks=tasks.filter(t=>t.status==="Complete");

  if(loading) return <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",color:TEXT3,fontFamily:"'DM Sans',sans-serif"}}>Loading...</div>;

  const tabs=[["content","Calendar"],["events","Events"],["tasks","Tasks"],["team","Team"]];
  const pad=isMobile?"16px":"32px 40px";

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
                return(
                  <div key={i} style={{minHeight:isMobile?90:110,background:day?SURFACE:"transparent",border:day?`1px solid ${BORDER}`:"none",borderRadius:5,padding:day?"6px":0,position:"relative",overflow:"hidden"}}>
                    {day&&(<>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:11,fontWeight:isToday(year,month,day)?600:400,color:isToday(year,month,day)?ORANGE:TEXT3,background:isToday(year,month,day)?ORANGE+"22":"transparent",borderRadius:3,padding:isToday(year,month,day)?"1px 4px":0}}>{day}</span>
                        <button onClick={()=>onAddItem(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:3,width:16,height:16,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        {dayItems.slice(0,3).map(item=>renderDayItem(item))}
                        {dayItems.length>3&&<div style={{fontSize:9,color:TEXT3}}>+{dayItems.length-3}</div>}
                      </div>
                    </>)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
        {!isMobile&&<div style={{display:"flex"}}>{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:tab===id?`2px solid ${ORANGE}`:"2px solid transparent",color:tab===id?TEXT1:TEXT3,padding:"0 18px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===id?500:400,height:52}}>{id==="content"?"Content Calendar":id==="events"?"Events & Deadlines":label}</button>)}</div>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:0}}>
            <Avatar name={currentUser.name} color={currentUser.color} size={26}/>
            {!isMobile&&<div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:500,color:TEXT1}}>{currentUser.name}</div><div style={{fontSize:11,color:TEXT2}}>{currentUser.email||"Add email"}</div></div>}
          </button>
          {!isMobile&&<button onClick={onLogout} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",marginLeft:4}}>Switch</button>}
          {isMobile&&<button onClick={()=>setMenuOpen(v=>!v)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:18,lineHeight:1}}>☰</button>}
        </div>
      </div>

      {isMobile&&menuOpen&&(
        <div style={{position:"fixed",top:52,right:0,left:0,background:SURFACE,borderBottom:`1px solid ${BORDER}`,zIndex:19,padding:"8px 0"}}>
          {[["content","Content Calendar"],["events","Events & Deadlines"],["tasks","Task Manager"],["team","Team"]].map(([id,label])=>(<button key={id} onClick={()=>{setTab(id);setMenuOpen(false);}} style={{width:"100%",background:tab===id?SURFACE2:"transparent",border:"none",borderLeft:tab===id?`3px solid ${ORANGE}`:"3px solid transparent",color:tab===id?TEXT1:TEXT2,padding:"14px 20px",cursor:"pointer",fontSize:15,fontFamily:"'DM Sans',sans-serif",textAlign:"left",display:"block"}}>{label}</button>))}
          <div style={{borderTop:`1px solid ${BORDER}`,margin:"8px 0"}}/>
          <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{width:"100%",background:"transparent",border:"none",color:TEXT3,padding:"12px 20px",cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>Switch Account</button>
        </div>
      )}

      {/* CONTENT CALENDAR */}
      {tab==="content"&&(
        <div style={{padding:pad}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={calView==="month"?prevContent:prevWeek} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?16:20,color:TEXT1,minWidth:isMobile?140:200,textAlign:"center"}}>
                {calView==="month"
                  ?`${isMobile?MONTHS_SHORT[contentMonth]:MONTHS[contentMonth]} ${contentYear}`
                  :(()=>{ const days=getWeekDays(); const s=days[0]; const e=days[6]; return s.getMonth()===e.getMonth()?`${MONTHS_SHORT[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`:`${MONTHS_SHORT[s.getMonth()]} ${s.getDate()} – ${MONTHS_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`; })()
                }
              </span>
              <button onClick={calView==="month"?nextContent:nextWeek} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
            <div style={{display:"flex",gap:2,background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:6,padding:3}}>
              {["month","week"].map(v=><button key={v} onClick={()=>setCalView(v)} style={{background:calView===v?SURFACE2:"transparent",border:calView===v?`1px solid ${BORDER2}`:"1px solid transparent",color:calView===v?TEXT1:TEXT3,borderRadius:4,padding:"5px 14px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:calView===v?500:400,textTransform:"capitalize"}}>{v}</button>)}
            </div>
          </div>

          {/* MONTH VIEW */}
          {calView==="month"&&(()=>{
            const daysInMonth=getDaysInMonth(contentYear,contentMonth);
            const firstDay=getFirstDay(contentYear,contentMonth);
            const cells=[];
            for(let i=0;i<firstDay;i++) cells.push(null);
            for(let d=1;d<=daysInMonth;d++) cells.push(d);
            return(
              <div style={{overflowX:isMobile?"auto":"visible"}}>
                <div style={{minWidth:isMobile?420:"auto"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
                    {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:TEXT3,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 0"}}>{isMobile?d[0]:d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                    {cells.map((day,i)=>{
                      const dayPosts=day?getDayPosts(day):[];
                      const isDragOver=dragOver===`month-${i}`&&draggingPost;
                      return(
                        <div key={i}
                          onDragOver={day?(e)=>{e.preventDefault();if(draggingPost) setDragOver(`month-${i}`);}:undefined}
                          onDragLeave={day?()=>setDragOver(null):undefined}
                          onDrop={day?async(e)=>{
                            e.preventDefault();
                            if(draggingPost){ await movePost(draggingPost,mkDate(contentYear,contentMonth,day)); }
                            else{
                              // file drop
                              const file=e.dataTransfer.files[0];
                              if(file&&file.type.startsWith("image/")){
                                const url=await uploadImage(file);
                                if(!url) return;
                                const ds=mkDate(contentYear,contentMonth,day);
                                const{data}=await supabase.from("posts").insert({caption:"",platform:"Instagram",image_url:url,post_date:ds,created_by:currentUser.id}).select().single();
                                setPosts(p=>[...p,data]);
                                await supabase.from("post_images").insert({post_id:data.id,image_url:url,position:0});
                                setPostImagesMap(prev=>({...prev,[data.id]:[{url,image_url:url,id:"new",position:0}]}));
                                setPostModal({day,ds,editId:data.id});
                                setPostForm({caption:"",platform:"Instagram",account_id:"",account_handle:"",campaign_id:"",task_id:""});
                                setPostImages([{url,id:"new"}]);
                              }
                            }
                            setDragOver(null);
                          }:undefined}
                          style={{minHeight:isMobile?90:110,background:day?(isDragOver?ORANGE+"11":SURFACE):"transparent",border:isDragOver?`1px dashed ${ORANGE}`:day?`1px solid ${BORDER}`:"none",borderRadius:5,padding:day?"6px":0,position:"relative",overflow:"hidden"}}
                        >
                          {day&&(<>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <span style={{fontSize:11,fontWeight:isToday(contentYear,contentMonth,day)?600:400,color:isToday(contentYear,contentMonth,day)?ORANGE:TEXT3,background:isToday(contentYear,contentMonth,day)?ORANGE+"22":"transparent",borderRadius:3,padding:isToday(contentYear,contentMonth,day)?"1px 4px":0}}>{day}</span>
                              <button onClick={()=>openAddPost(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:3,width:16,height:16,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:2}}>
                              {dayPosts.slice(0,3).map(post=>{
                                const cover=getCoverImage(post);
                                const imgs=getPostImages(post);
                                const linked=post.campaign_id?campaigns.find(c=>c.id===post.campaign_id):null;
                                return(
                                  <div key={post.id}
                                    draggable
                                    onDragStart={e=>{ e.stopPropagation(); setDraggingPost(post); }}
                                    onDragEnd={()=>{ setDraggingPost(null); setDragOver(null); }}
                                    onClick={()=>openEditPost(post)}
                                    style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"grab",borderLeft:`2px solid ${PLATFORM_COLORS[post.platform]}`,opacity:draggingPost?.id===post.id?0.4:1}}
                                  >
                                    {cover&&<img src={cover} alt="" style={{width:14,height:14,objectFit:"cover",borderRadius:2,flexShrink:0}}/>}
                                    <span style={{fontSize:9,color:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{post.caption||"Post"}</span>
                                    {imgs.length>1&&<span style={{fontSize:8,color:TEXT3,flexShrink:0}}>⧉{imgs.length}</span>}
                                    {linked&&<span style={{fontSize:8,color:ORANGE,flexShrink:0}}>●</span>}
                                  </div>
                                );
                              })}
                              {dayPosts.length>3&&<div style={{fontSize:9,color:TEXT3}}>+{dayPosts.length-3}</div>}
                            </div>
                            {isDragOver&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:ORANGE+"22",fontSize:10,color:ORANGE,pointerEvents:"none",borderRadius:5}}>Move here</div>}
                          </>)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* WEEK VIEW */}
          {calView==="week"&&(()=>{
            const weekDays=getWeekDays();
            return(
              <div style={{overflowX:"auto"}}>
                <div style={{minWidth:isMobile?600:700}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:6}}>
                    {weekDays.map((d,i)=>(
                      <div key={i} style={{textAlign:"center",padding:"6px 4px",background:isTodayDate(d)?ORANGE+"22":SURFACE,border:`1px solid ${isTodayDate(d)?ORANGE:BORDER}`,borderRadius:6}}>
                        <div style={{fontSize:10,color:isTodayDate(d)?ORANGE:TEXT3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{DAYS[d.getDay()]}</div>
                        <div style={{fontSize:isMobile?14:18,fontWeight:600,color:isTodayDate(d)?ORANGE:TEXT1,fontFamily:"'Playfair Display',serif"}}>{d.getDate()}</div>
                        <div style={{fontSize:10,color:TEXT3}}>{MONTHS_SHORT[d.getMonth()]}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,alignItems:"start"}}>
                    {weekDays.map((d,i)=>{
                      const dayPosts=getPostsByDate(d);
                      const newDs=mkDate(d.getFullYear(),d.getMonth(),d.getDate());
                      const isDragOver=dragOver===`week-${i}`&&draggingPost;
                      const isFileDrop=dragOver===`week-${i}`&&!draggingPost;
                      return(
                        <div key={i}
                          onDragOver={e=>{e.preventDefault();setDragOver(`week-${i}`);}}
                          onDragLeave={()=>setDragOver(null)}
                          onDrop={async e=>{
                            e.preventDefault(); setDragOver(null);
                            if(draggingPost){ await movePost(draggingPost,newDs); return; }
                            const file=e.dataTransfer.files[0];
                            if(file&&file.type.startsWith("image/")){
                              const url=await uploadImage(file);
                              if(!url) return;
                              const{data}=await supabase.from("posts").insert({caption:"",platform:"Instagram",image_url:url,post_date:newDs,created_by:currentUser.id}).select().single();
                              setPosts(p=>[...p,data]);
                              await supabase.from("post_images").insert({post_id:data.id,image_url:url,position:0});
                              setPostImagesMap(prev=>({...prev,[data.id]:[{url,image_url:url,id:"new",position:0}]}));
                              setPostModal({day:d.getDate(),ds:newDs,editId:data.id});
                              setPostForm({caption:"",platform:"Instagram",account_id:"",account_handle:"",campaign_id:"",task_id:""});
                              setPostImages([{url,id:"new"}]);
                            }
                          }}
                          style={{display:"flex",flexDirection:"column",gap:6,minHeight:120,background:isDragOver?ORANGE+"11":isFileDrop?"#1a2218":"transparent",border:isDragOver?`1px dashed ${ORANGE}`:isFileDrop?`1px dashed #4a7a4a`:"1px solid transparent",borderRadius:6,padding:4,position:"relative"}}
                        >
                          <button onClick={()=>openAddPost(d.getDate(),d.getMonth(),d.getFullYear())} style={{background:"none",border:`1px dashed ${BORDER}`,color:TEXT3,borderRadius:5,padding:"4px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",width:"100%",textAlign:"center"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT3;}}
                          >+ Add</button>
                          {dayPosts.map(post=>{
                            const imgs=getPostImages(post);
                            const linked=post.campaign_id?campaigns.find(c=>c.id===post.campaign_id):null;
                            const creator=post.created_by?members.find(m=>m.id===post.created_by):null;
                            return(
                              <div key={post.id}
                                draggable
                                onDragStart={e=>{ e.stopPropagation(); setDraggingPost(post); }}
                                onDragEnd={()=>{ setDraggingPost(null); setDragOver(null); }}
                                style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:7,overflow:"hidden",borderTop:`3px solid ${PLATFORM_COLORS[post.platform]}`,opacity:draggingPost?.id===post.id?0.4:1,cursor:"grab"}}
                              >
                                <CarouselViewer images={imgs} style={{width:"100%"}} imgStyle={{aspectRatio:"1/1",objectFit:"cover"}}/>
                                <div style={{padding:"7px 8px"}}>
                                  <div style={{fontSize:11,color:TEXT2,lineHeight:1.4,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                                    {post.caption||<span style={{color:TEXT3,fontStyle:"italic"}}>No caption</span>}
                                  </div>
                                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4,marginBottom:6}}>
                                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                                      <span style={{fontSize:10,color:PLATFORM_COLORS[post.platform]}}>{post.platform}</span>
                                      {post.account_handle&&<span style={{fontSize:10,color:TEXT3}}>@{post.account_handle}</span>}
                                      {imgs.length>1&&<span style={{fontSize:10,color:TEXT3}}>⧉ {imgs.length}</span>}
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                                      {linked&&<span style={{fontSize:9,color:ORANGE}}>●</span>}
                                      {creator&&<Avatar name={creator.name} color={creator.color} size={14}/>}
                                    </div>
                                  </div>
                                  <div style={{display:"flex",gap:4}}>
                                    <button onClick={e=>{e.stopPropagation();setPreviewPost(post);}} style={{flex:1,background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:4,padding:"4px 0",cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif"}}
                                      onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
                                      onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT2;}}
                                    >Preview</button>
                                    <button onClick={e=>{e.stopPropagation();openEditPost(post);}} style={{flex:1,background:SURFACE2,border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:4,padding:"4px 0",cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif"}}
                                      onMouseEnter={e=>{e.currentTarget.style.borderColor=BORDER2;e.currentTarget.style.color=TEXT1;}}
                                      onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT2;}}
                                    >Edit</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {isDragOver&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:ORANGE+"22",fontSize:10,color:ORANGE,pointerEvents:"none",borderRadius:6}}>Move here</div>}
                          {isFileDrop&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#00000066",fontSize:10,color:"#4a7a4a",pointerEvents:"none",borderRadius:6}}>Drop image</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* EVENTS & DEADLINES */}
      {tab==="events"&&(
        <div style={{padding:pad}}>
          {/* Header: nav + view toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={eventsView==="month"?prevEvents:prevEventsWeek} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?16:20,color:TEXT1,minWidth:isMobile?140:200,textAlign:"center"}}>
                {eventsView==="month"
                  ?`${isMobile?MONTHS_SHORT[eventsMonth]:MONTHS[eventsMonth]} ${eventsYear}`
                  :(()=>{ const days=getEventsWeekDays(); const s=days[0]; const e=days[6]; return s.getMonth()===e.getMonth()?`${MONTHS_SHORT[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`:`${MONTHS_SHORT[s.getMonth()]} ${s.getDate()} – ${MONTHS_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`; })()
                }
              </span>
              <button onClick={eventsView==="month"?nextEvents:nextEventsWeek} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT2,borderRadius:6,width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </div>
            <div style={{display:"flex",gap:2,background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:6,padding:3}}>
              {["month","week"].map(v=><button key={v} onClick={()=>setEventsView(v)} style={{background:eventsView===v?SURFACE2:"transparent",border:eventsView===v?`1px solid ${BORDER2}`:"1px solid transparent",color:eventsView===v?TEXT1:TEXT3,borderRadius:4,padding:"5px 14px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:eventsView===v?500:400,textTransform:"capitalize"}}>{v}</button>)}
            </div>
          </div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
              {eventTypes.map(t=><span key={t.id} style={{fontSize:11,color:t.color,border:`1px solid ${t.color}44`,borderRadius:4,padding:"2px 8px"}}>{t.name}</span>)}
              <button onClick={()=>setShowTypeManager(true)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:4,padding:"2px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>+ Tags</button>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:TEXT3}}>Tasks:</span>
              {["All",...CHANNELS].map(ch=><button key={ch} onClick={()=>setEventsChannelFilter(ch)} style={{fontSize:10,color:eventsChannelFilter===ch?(ch==="All"?TEXT1:CHANNEL_COLORS[ch]||TEXT1):TEXT3,background:eventsChannelFilter===ch?SURFACE2:"transparent",border:`1px solid ${eventsChannelFilter===ch?(ch==="All"?BORDER2:CHANNEL_COLORS[ch]||BORDER2):BORDER}`,borderRadius:4,padding:"2px 7px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{ch}</button>)}
            </div>
          </div>

          {/* MONTH VIEW */}
          {eventsView==="month"&&(()=>{
            const daysInMonth=getDaysInMonth(eventsYear,eventsMonth);
            const firstDay=getFirstDay(eventsYear,eventsMonth);
            const cells=[];
            for(let i=0;i<firstDay;i++) cells.push(null);
            for(let d=1;d<=daysInMonth;d++) cells.push(d);
            return(
              <div style={{overflowX:isMobile?"auto":"visible"}}>
                <div style={{minWidth:isMobile?420:"auto"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
                    {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:TEXT3,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 0"}}>{isMobile?d[0]:d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                    {cells.map((day,i)=>{
                      const dayItems=day?getDayEventsAndTasks(day):[];
                      return(
                        <div key={i} style={{minHeight:isMobile?90:110,background:day?SURFACE:"transparent",border:day?`1px solid ${BORDER}`:"none",borderRadius:5,padding:day?"6px":0,position:"relative",overflow:"hidden"}}>
                          {day&&(<>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <span style={{fontSize:11,fontWeight:isToday(eventsYear,eventsMonth,day)?600:400,color:isToday(eventsYear,eventsMonth,day)?ORANGE:TEXT3,background:isToday(eventsYear,eventsMonth,day)?ORANGE+"22":"transparent",borderRadius:3,padding:isToday(eventsYear,eventsMonth,day)?"1px 4px":0}}>{day}</span>
                              <button onClick={()=>openAddEvent(day)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:3,width:16,height:16,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:2}}>
                              {dayItems.slice(0,3).map(item=>{
                                if(item._type==="task"){
                                  const chColor=item.channel?CHANNEL_COLORS[item.channel]||TEXT3:TEXT3;
                                  const statusBg=item.status==="Complete"?"#0d2a14":item.status==="In Progress"?"#2a2200":item.status==="Review"?"#0d1a2a":"#2a0a0a";
                                  const statusBorder=item.status==="Complete"?"#4a9e60":item.status==="In Progress"?"#c47a30":item.status==="Review"?"#4a8cc4":"#c43030";
                                  const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
                                  return <div key={`task-${item.id}`} onClick={()=>openEditItem("tasks",item)} style={{display:"flex",alignItems:"center",gap:3,background:statusBg,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${statusBorder}`}}><span style={{fontSize:9,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>📌 {item.name}</span>{assignee&&<div style={{width:8,height:8,borderRadius:"50%",background:assignee.color,flexShrink:0}}/>}</div>;
                                }
                                const c=getEventTypeColor(item.event_type);
                                return <div key={`event-${item.id}`} onClick={()=>openEditEvent(item)} style={{display:"flex",alignItems:"center",gap:3,background:SURFACE2,borderRadius:3,padding:"2px 4px",cursor:"pointer",borderLeft:`2px solid ${c}`}}><span style={{fontSize:9,color:TEXT2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{item.title}</span></div>;
                              })}
                              {dayItems.length>3&&<div style={{fontSize:9,color:TEXT3}}>+{dayItems.length-3}</div>}
                            </div>
                          </>)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* WEEK VIEW */}
          {eventsView==="week"&&(()=>{
            const weekDays=getEventsWeekDays();
            return(
              <div style={{overflowX:isMobile?"auto":"visible"}}>
                <div style={{minWidth:isMobile?500:"auto"}}>
                  {/* Day headers */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:6}}>
                    {weekDays.map((d,i)=>(
                      <div key={i} style={{textAlign:"center",padding:"6px 4px",background:isTodayDate(d)?ORANGE+"22":SURFACE,border:`1px solid ${isTodayDate(d)?ORANGE:BORDER}`,borderRadius:6}}>
                        <div style={{fontSize:10,color:isTodayDate(d)?ORANGE:TEXT3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{DAYS[d.getDay()]}</div>
                        <div style={{fontSize:isMobile?14:18,fontWeight:600,color:isTodayDate(d)?ORANGE:TEXT1,fontFamily:"'Playfair Display',serif"}}>{d.getDate()}</div>
                        <div style={{fontSize:10,color:TEXT3}}>{MONTHS_SHORT[d.getMonth()]}</div>
                      </div>
                    ))}
                  </div>
                  {/* Event/task columns */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,alignItems:"start"}}>
                    {weekDays.map((d,i)=>{
                      const dayItems=getDayEventsAndTasksByDate(d);
                      return(
                        <div key={i} style={{display:"flex",flexDirection:"column",gap:5,minHeight:80}}>
                          <button onClick={()=>{ setEventsMonth(d.getMonth()); setEventsYear(d.getFullYear()); setTimeout(()=>openAddEvent(d.getDate()),10); }} style={{background:"none",border:`1px dashed ${BORDER}`,color:TEXT3,borderRadius:5,padding:"4px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",width:"100%",textAlign:"center"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT3;}}
                          >+ Add</button>
                          {dayItems.map(item=>{
                            if(item._type==="task"){
                              const chColor=item.channel?CHANNEL_COLORS[item.channel]||TEXT3:TEXT3;
                              const statusBg=item.status==="Complete"?"#0d2a14":item.status==="In Progress"?"#2a2200":item.status==="Review"?"#0d1a2a":"#2a0a0a";
                              const statusBorder=item.status==="Complete"?"#4a9e60":item.status==="In Progress"?"#c47a30":item.status==="Review"?"#4a8cc4":"#c43030";
                              const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
                              return(
                                <div key={`task-${item.id}`} onClick={()=>openEditItem("tasks",item)} style={{background:statusBg,border:`1px solid ${statusBorder}44`,borderLeft:`3px solid ${statusBorder}`,borderRadius:6,padding:"8px 10px",cursor:"pointer"}}>
                                  <div style={{fontSize:11,color:TEXT2,marginBottom:4,lineHeight:1.3}}>📌 {item.name}</div>
                                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                                    <span style={{fontSize:10,color:chColor}}>{item.channel||"Task"}</span>
                                    {assignee&&<Avatar name={assignee.name} color={assignee.color} size={14}/>}
                                  </div>
                                </div>
                              );
                            }
                            const c=getEventTypeColor(item.event_type);
                            const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
                            return(
                              <div key={`event-${item.id}`} onClick={()=>openEditEvent(item)} style={{background:SURFACE,border:`1px solid ${c}44`,borderLeft:`3px solid ${c}`,borderRadius:6,padding:"8px 10px",cursor:"pointer"}}>
                                <div style={{fontSize:12,color:TEXT1,fontWeight:500,marginBottom:4,lineHeight:1.3}}>{item.title}</div>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                                  <span style={{fontSize:10,color:c}}>{item.event_type}</span>
                                  {item.location&&<span style={{fontSize:9,color:TEXT3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:60}}>📍{item.location}</span>}
                                </div>
                                {assignee&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><Avatar name={assignee.name} color={assignee.color} size={14}/><span style={{fontSize:10,color:TEXT3}}>{assignee.name.split(" ")[0]}</span></div>}
                              </div>
                            );
                          })}
                          {dayItems.length===0&&<div style={{fontSize:10,color:TEXT3,textAlign:"center",padding:"8px 0",opacity:0.5}}>—</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TASK MANAGER */}
      {tab==="tasks"&&(
        <div style={{padding:pad}}>
          <div style={{display:"flex",gap:4,marginBottom:16,background:SURFACE,borderRadius:8,padding:4,border:`1px solid ${BORDER}`}}>
            {Object.entries(listConfig).map(([key,{label}])=>(<button key={key} onClick={()=>{setActiveList(key);setSearchQ("");setChannelFilter("All");setTaskView("active");}} style={{flex:1,background:activeList===key?SURFACE2:"transparent",border:activeList===key?`1px solid ${BORDER2}`:"1px solid transparent",color:activeList===key?TEXT1:TEXT3,borderRadius:6,padding:"8px 4px",cursor:"pointer",fontSize:isMobile?12:13,fontFamily:"'DM Sans',sans-serif",fontWeight:activeList===key?500:400,textAlign:"center"}}>{label} <span style={{fontSize:10,color:TEXT3}}>({listConfig[key].data.length})</span></button>))}
          </div>
          {activeList==="tasks"&&(
            <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:`1px solid ${BORDER}`}}>
              <button onClick={()=>setTaskView("active")} style={{background:"none",border:"none",borderBottom:taskView==="active"?`2px solid ${ORANGE}`:"2px solid transparent",color:taskView==="active"?TEXT1:TEXT3,padding:"8px 20px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:taskView==="active"?500:400,marginBottom:-1}}>Active <span style={{fontSize:11,color:TEXT3,marginLeft:4}}>({activeTasks.length})</span></button>
              <button onClick={()=>setTaskView("complete")} style={{background:"none",border:"none",borderBottom:taskView==="complete"?`2px solid #4a9e60`:"2px solid transparent",color:taskView==="complete"?"#4a9e60":TEXT3,padding:"8px 20px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:taskView==="complete"?500:400,marginBottom:-1}}>Complete <span style={{fontSize:11,color:TEXT3,marginLeft:4}}>({completedTasks.length})</span></button>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." style={{...inputStyle,flex:1,minWidth:120}}/>
            {(activeList!=="tasks"||taskView==="active")&&<OrangeBtn onClick={openNewItem} style={{whiteSpace:"nowrap",padding:"10px 14px",fontSize:13}}>+ New</OrangeBtn>}
          </div>
          {activeList==="tasks"&&taskView==="active"&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
              <span style={{fontSize:11,color:TEXT3}}>Channel:</span>
              {["All",...CHANNELS].map(ch=><button key={ch} onClick={()=>setChannelFilter(ch)} style={{fontSize:11,color:channelFilter===ch?(ch==="All"?TEXT1:CHANNEL_COLORS[ch]||TEXT1):TEXT3,background:channelFilter===ch?SURFACE2:"transparent",border:`1px solid ${channelFilter===ch?(ch==="All"?BORDER2:CHANNEL_COLORS[ch]||BORDER2):BORDER}`,borderRadius:4,padding:"3px 9px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{ch}</button>)}
            </div>
          )}
          {activeList==="tasks"&&taskView==="complete"&&completedTasks.length>0&&<div style={{fontSize:12,color:TEXT3,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><span style={{color:"#4a9e60"}}>✓</span>{completedTasks.length} task{completedTasks.length!==1?"s":""} completed</div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filteredData(activeList).length===0&&<div style={{textAlign:"center",padding:"40px 0",color:TEXT3,fontSize:14}}>{activeList==="tasks"&&taskView==="complete"?"No completed tasks yet":"No "+listConfig[activeList].label.toLowerCase()+" yet"}</div>}
            {filteredData(activeList).map(item=>{
              const sc=STATUS_COLORS[item.status]||STATUS_COLORS["Not Started"];
              const pc=item.priority?PRIORITY_COLORS[item.priority]:null;
              const linkedProgram=item.program_id?programs.find(p=>p.id===item.program_id):null;
              const linkedCampaign=item.campaign_id?campaigns.find(c=>c.id===item.campaign_id):null;
              const assignee=item.assignee_id?members.find(m=>m.id===item.assignee_id):null;
              const chColor=item.channel?CHANNEL_COLORS[item.channel]||TEXT3:null;
              const progress=activeList==="campaigns"?getCampaignProgress(item.id):activeList==="programs"?getProgramProgress(item.id):null;
              const isComplete=item.status==="Complete";
              return(
                <div key={item.id} onClick={()=>openEditItem(activeList,item)} style={{padding:"14px 16px",background:SURFACE,border:`1px solid ${isComplete?"#1a3020":BORDER}`,borderRadius:10,cursor:"pointer",borderLeft:chColor?`3px solid ${chColor}`:isComplete?`3px solid #4a9e60`:`3px solid transparent`,opacity:isComplete?0.75:1}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,gap:8}}>
                    <span style={{fontSize:14,color:isComplete?TEXT3:TEXT1,fontWeight:500,flex:1,textDecoration:isComplete?"line-through":"none"}}>{item.name}</span>
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
                  {progress&&<div><ProgressBar value={progress.pct}/><div style={{fontSize:10,color:progress.pct===100?"#4a9e60":TEXT3,marginTop:3}}>{progress.done}/{progress.total} tasks complete · {progress.pct}%</div></div>}
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
          <div style={{fontSize:12,color:TEXT3,marginBottom:20}}>{members.length} members · {tasks.length} tasks · {completedTasks.length} complete</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:24}}>
            {Object.entries(STATUS_COLORS).map(([s,c])=>{ const count=tasks.filter(t=>t.status===s).length; return <div key={s} style={{background:SURFACE,border:`1px solid ${c.border}`,borderRadius:8,padding:"12px 14px"}}><div style={{fontSize:10,color:c.text,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontWeight:500}}>{s}</div><div style={{fontSize:24,fontWeight:500,color:c.text,fontFamily:"'Playfair Display',serif"}}>{count}</div></div>; })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {memberStats.map(m=>(
              <div key={m.id} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <Avatar name={m.name} color={m.color} size={40}/>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:15,color:TEXT1,display:"flex",alignItems:"center",gap:6}}>{m.name}{m.id===currentUser.id&&<span style={{fontSize:10,color:ORANGE,border:`1px solid ${ORANGE}44`,borderRadius:4,padding:"1px 5px"}}>You</span>}</div><div style={{fontSize:12,color:TEXT3}}>{m.role}{m.email?` · ${m.email}`:""}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:600,color:TEXT1,fontFamily:"'Playfair Display',serif"}}>{m.total}</div><div style={{fontSize:10,color:TEXT3}}>tasks</div></div>
                </div>
                {m.total>0&&<div style={{marginBottom:10}}><ProgressBar value={Math.round(((m.byStatus["Complete"]||0)/m.total)*100)}/></div>}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:m.tasks.length?10:0}}>
                  {Object.entries(STATUS_COLORS).map(([s,c])=>{ const count=m.byStatus[s]||0; if(!count) return null; return<span key={s} style={{fontSize:10,color:c.text,background:c.bg,border:`1px solid ${c.border}`,borderRadius:4,padding:"2px 6px"}}>{count} {s}</span>; })}
                  {m.total===0&&<span style={{fontSize:12,color:TEXT3}}>No tasks assigned</span>}
                </div>
                {m.tasks.filter(t=>t.status!=="Complete").slice(0,3).map(t=>{ const sc=STATUS_COLORS[t.status]||STATUS_COLORS["Not Started"]; const chColor=t.channel?CHANNEL_COLORS[t.channel]:null; return(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:BG,borderRadius:6,border:`1px solid ${BORDER}`,marginBottom:4,borderLeft:chColor?`2px solid ${chColor}`:`2px solid ${BORDER}`}}>
                    <span style={{fontSize:12,color:TEXT2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
                    {t.channel&&<span style={{fontSize:9,color:chColor,flexShrink:0}}>{t.channel}</span>}
                    <span style={{fontSize:10,color:sc.text,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:3,padding:"1px 5px",flexShrink:0,whiteSpace:"nowrap"}}>{t.status}</span>
                  </div>
                ); })}
                {m.tasks.filter(t=>t.status!=="Complete").length>3&&<div style={{fontSize:11,color:TEXT3,paddingLeft:4}}>+{m.tasks.filter(t=>t.status!=="Complete").length-3} more active</div>}
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
          <CarouselUploader images={postImages} setImages={setPostImages} uploadImage={uploadImage}/>
          <FL>Platform</FL>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {Object.entries(PLATFORM_COLORS).map(([p,c])=><button key={p} onClick={()=>setPostForm(f=>({...f,platform:p,account_id:"",account_handle:""}))} style={{background:postForm.platform===p?`${c}22`:"transparent",border:`1px solid ${postForm.platform===p?c:BORDER}`,color:postForm.platform===p?c:TEXT3,borderRadius:6,padding:"6px 12px",fontSize:13,cursor:"pointer"}}>{p}</button>)}
          </div>
          {/* Account picker */}
          <FL>Account / Handle</FL>
          <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              {/* Saved accounts for this platform */}
              {socialAccounts.filter(a=>a.platform===postForm.platform).length>0&&(
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {socialAccounts.filter(a=>a.platform===postForm.platform).map(a=>(
                    <button key={a.id} onClick={()=>setPostForm(f=>({...f,account_id:a.id,account_handle:a.handle}))}
                      style={{fontSize:12,color:postForm.account_id===a.id?PLATFORM_COLORS[postForm.platform]:TEXT2,background:postForm.account_id===a.id?`${PLATFORM_COLORS[postForm.platform]}22`:SURFACE2,border:`1px solid ${postForm.account_id===a.id?PLATFORM_COLORS[postForm.platform]:BORDER}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      @{a.handle}{a.label?` · ${a.label}`:""}
                    </button>
                  ))}
                </div>
              )}
              <input value={postForm.account_handle} onChange={e=>setPostForm(f=>({...f,account_handle:e.target.value,account_id:""}))} placeholder={`@handle (or select above)`} style={{...inputStyle,fontSize:13}}/>
            </div>
            <button onClick={()=>setShowAccountManager(true)} style={{background:"none",border:`1px solid ${BORDER}`,color:TEXT3,borderRadius:6,padding:"11px 12px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",flexShrink:0}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=TEXT3;}}
            >Manage</button>
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
          <FL>Event Title</FL><input value={eventForm.title} onChange={e=>setEventForm(f=>({...f,title:e.target.value}))} placeholder="e.g. SHOT Show 2026" style={{...inputStyle,marginBottom:14}}/>
          <FL>Event Type</FL>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{eventTypes.map(t=>{ const c=t.color; return <button key={t.id} onClick={()=>setEventForm(f=>({...f,event_type:t.name}))} style={{background:eventForm.event_type===t.name?`${c}22`:"transparent",border:`1px solid ${eventForm.event_type===t.name?c:BORDER}`,color:eventForm.event_type===t.name?c:TEXT3,borderRadius:6,padding:"6px 12px",fontSize:13,cursor:"pointer"}}>{t.name}</button>; })}</div>
          <FL>Start Date</FL><input type="date" value={eventForm.event_date} onChange={e=>setEventForm(f=>({...f,event_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
          <FL>End Date (optional)</FL><input type="date" value={eventForm.end_date} onChange={e=>setEventForm(f=>({...f,end_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
          <FL>Location</FL><input value={eventForm.location} onChange={e=>setEventForm(f=>({...f,location:e.target.value}))} placeholder="City, venue, or virtual" style={{...inputStyle,marginBottom:12}}/>
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
          <FL>Name</FL><input value={itemForm.name||""} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} placeholder="Name..." style={{...inputStyle,marginBottom:14}}/>
          <FL>Status</FL><select value={itemForm.status||"Not Started"} onChange={e=>setItemForm(f=>({...f,status:e.target.value}))} style={{...inputStyle,marginBottom:12}}>{Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}</select>
          {itemModal.type!=="programs"&&<><FL>Priority</FL><select value={itemForm.priority||"Medium"} onChange={e=>setItemForm(f=>({...f,priority:e.target.value}))} style={{...inputStyle,marginBottom:12}}>{Object.keys(PRIORITY_COLORS).map(p=><option key={p} value={p}>{p}</option>)}</select></>}
          {itemModal.type==="campaigns"&&<><FL>Program (optional)</FL><select value={itemForm.program_id||""} onChange={e=>setItemForm(f=>({...f,program_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}><option value="">— No program —</option>{programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></>}
          {itemModal.type==="tasks"&&(<>
            <FL>Channel</FL>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              <button onClick={()=>setItemForm(f=>({...f,channel:""}))} style={{fontSize:12,color:!itemForm.channel?TEXT1:TEXT3,background:!itemForm.channel?SURFACE2:"transparent",border:`1px solid ${!itemForm.channel?BORDER2:BORDER}`,borderRadius:5,padding:"5px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>None</button>
              {CHANNELS.map(ch=>{ const c=CHANNEL_COLORS[ch]; return <button key={ch} onClick={()=>setItemForm(f=>({...f,channel:ch}))} style={{fontSize:12,color:itemForm.channel===ch?c:TEXT3,background:itemForm.channel===ch?`${c}22`:"transparent",border:`1px solid ${itemForm.channel===ch?c:BORDER}`,borderRadius:5,padding:"5px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{ch}</button>; })}
            </div>
            <FL>Campaign (optional)</FL><select value={itemForm.campaign_id||""} onChange={e=>setItemForm(f=>({...f,campaign_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}><option value="">— None —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <FL>Assign To</FL><select value={itemForm.assignee_id||""} onChange={e=>setItemForm(f=>({...f,assignee_id:e.target.value}))} style={{...inputStyle,marginBottom:12}}><option value="">— Unassigned —</option>{members.map(m=><option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}</select>
            <FL>Due Date</FL><input type="date" value={itemForm.due_date||""} onChange={e=>setItemForm(f=>({...f,due_date:e.target.value}))} style={{...inputStyle,colorScheme:"dark",marginBottom:12}}/>
          </>)}
          <FL>Description</FL>
          <textarea value={itemForm.description||""} onChange={e=>setItemForm(f=>({...f,description:e.target.value}))} placeholder="Optional notes..." rows={3} style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:8,color:TEXT1,fontSize:14,padding:"11px 13px",resize:"vertical",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:20}}/>
          {itemModal.type==="tasks"&&itemModal.editId&&<div style={{borderTop:`1px solid ${BORDER}`,paddingTop:20,marginBottom:4}}><SubtaskPanel taskId={itemModal.editId}/></div>}
          {itemModal.type==="tasks"&&!itemModal.editId&&<div style={{fontSize:12,color:TEXT3,marginBottom:20,fontStyle:"italic"}}>Save the task first to add steps.</div>}
          <MA onCancel={()=>setItemModal(null)} onSave={saveItem} onDelete={itemModal.editId?deleteItem:null} saveLabel={itemModal.editId?"Save Changes":`Create ${listConfig[itemModal.type].label.slice(0,-1)}`} isMobile={isMobile}/>
        </ModalOverlay>
      )}

      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:SURFACE,borderTop:`1px solid ${BORDER}`,display:"flex",zIndex:20}}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",borderTop:tab===id?`2px solid ${ORANGE}`:"2px solid transparent",color:tab===id?ORANGE:TEXT3,padding:"10px 4px 8px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===id?500:400,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <span style={{fontSize:18}}>{id==="content"?"📅":id==="events"?"🗓️":id==="tasks"?"✅":"👥"}</span>{label}
            </button>
          ))}
        </div>
      )}

      {showTypeManager&&<EventTypeManager eventTypes={eventTypes} setEventTypes={setEventTypes} onClose={()=>setShowTypeManager(false)} isMobile={isMobile}/>}
      {showProfile&&<ProfileModal currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={()=>setShowProfile(false)} isMobile={isMobile}/>}
      {showAccountManager&&<SocialAccountManager socialAccounts={socialAccounts} setSocialAccounts={setSocialAccounts} onClose={()=>setShowAccountManager(false)} isMobile={isMobile}/>}
      {previewPost&&<PostPreview post={previewPost} images={getPostImages(previewPost)} members={members} onClose={()=>setPreviewPost(null)} onEdit={()=>{openEditPost(previewPost);setPreviewPost(null);}} isMobile={isMobile}/>}
    </div>
  );
}
