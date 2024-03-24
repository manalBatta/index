import { supabase } from "../App";

export default async function GetMessages(id) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`ReceiverID.eq.${id},SenderID.eq.${id}`);

  if (error) {
    console.log(error);
  } else {
    return data;
  }
}
