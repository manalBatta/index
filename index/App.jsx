//all files in vite should be in .jsx
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import LogU from "./LogU";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import ChatArea from "./components/ChatArea";
const supabase_url = "https://vdmvqpxmsruedrraqopy.supabase.co";
const anon_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXZxcHhtc3J1ZWRycmFxb3B5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTQ0OTU3OCwiZXhwIjoyMDI1MDI1NTc4fQ.LFen_WxoAYLhR4aKX8Hej7KQTYz7idN62piHgkLsy7o";
export const supabase = createClient(supabase_url, anon_key);

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<></>}></Route>
        <Route path="log" element={<LogU></LogU>}></Route>
        <Route path="profile" element={<Profile></Profile>}></Route>
        <Route path="Chat" element={<ChatArea></ChatArea>}></Route>
      </Routes>
      <Profile></Profile>
    </>
  );
}

export default App;
