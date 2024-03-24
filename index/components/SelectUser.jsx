import { supabase } from "../App";

export default async function SelectUser(id) {
  const { data, error } = await supabase.from("users").select().eq("id", id);

  if (error) {
    alert(error);
    console.log(error);
  } else {
    // console.log(data[0]);
    return data[0];
  }
}
