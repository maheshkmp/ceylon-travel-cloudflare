import EditItineraryPage from "../[id]/page";

export const runtime = 'edge';

export default function NewItineraryPage() {
  return <EditItineraryPage params={Promise.resolve({ id: "new" })} />;
}
