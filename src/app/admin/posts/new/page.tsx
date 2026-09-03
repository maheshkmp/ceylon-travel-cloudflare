import AdminPostEditorPage from "../[id]/page";

export const runtime = 'edge';

export default function NewPostPage() {
  return <AdminPostEditorPage params={Promise.resolve({ id: "new" })} />;
}
