import { supabase } from "./App";
export default async function DeleteAll() {
  const { data } = await supabase.auth.admin.listUsers();
  console.log(data.users);

  data.users.map(async (element) => {
    const { deleted, error } = await supabase.auth.admin.deleteUser(element.id);
    console.log(deleted, error);
  });
}
