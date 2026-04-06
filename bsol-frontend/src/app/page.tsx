import SearchFilter from "@/components/SearchFilter";
import EventCard from "@/components/EventCard";

const SAMPLE_EVENTS = [
  {
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop",
    date: "Every Sat • Apr 11 • 8:00 PM IST",
    title: "Oracle Java 21 certification preparation discussion",
    host: "Oracle Java Certification preparation",
    rating: 4.8,
    attendees: 17,
    isOnline: true,
    price: "Free",
  },
  {
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
    date: "Every Sun, Thu • Apr 9 • 7:00 AM IST",
    title: "Practice Meditation, explore inner world and enlighten yourself from virtual world",
    host: "PCMC Morning Meditation Wakad",
    rating: 2.5,
    attendees: 1,
    price: "₹25.00",
  },
  {
    image: "https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?q=80&w=600&auto=format&fit=crop",
    date: "Sat, Apr 11 • 10:30 AM IST",
    title: "React Pune - April Edition",
    host: "React Pune",
    rating: 4.5,
    attendees: 3,
    isWaitlist: true,
  },
  {
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    date: "Sat, Apr 18 • 10:30 AM IST",
    title: "JSLovers Pune April 2026 Meetup",
    host: "JSLovers Pune",
    rating: 4.7,
    attendees: 126,
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    date: "Sat, Apr 11 • 10:00 AM IST",
    title: "April PythonPune Meetup 2026",
    host: "PythonPune",
    rating: 4.6,
    attendees: 46,
  },
  {
    image: "https://images.unsplash.com/photo-1551847677-dc82d764db13?q=80&w=600&auto=format&fit=crop",
    date: "Sun, Apr 12 • 4:00 PM IST",
    title: "The Enterprise R Stack: Scaling for Production",
    host: "R-User Group Pune",
    rating: 4.9,
    attendees: 22,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col pb-24">
      <SearchFilter />
      
      {/* Event Grid Section */}
      <main className="max-w-7xl mx-auto px-6 mt-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {SAMPLE_EVENTS.map((event, idx) => (
            <EventCard key={idx} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
}

