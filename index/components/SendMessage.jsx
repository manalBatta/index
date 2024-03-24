import { supabase } from "../App";

export const SendMessage = async (SenderID, ReceiverID, MessageText) => {
  console.log(SenderID, ReceiverID, MessageText);
  const { data, error } = await supabase.from("messages").insert({
    SenderID: SenderID,
    ReceiverID: ReceiverID,
    MessageText: MessageText,
  });
  if (error) {
    console.log("error while sending message");
    console.log(error);
  } else {
    // console.log(data);
  }
};
