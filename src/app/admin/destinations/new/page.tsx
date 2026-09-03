import EditDestinationPage from "../[id]/page";

export const runtime = 'edge';

export default function NewDestinationPage() {
  return <EditDestinationPage params={Promise.resolve({ id: "new" })} />;
}
