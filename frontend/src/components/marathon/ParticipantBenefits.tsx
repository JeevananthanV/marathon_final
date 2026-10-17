import { Shirt, Medal, Timer, Award, Coffee, ShoppingBag } from "lucide-react";

const benefits = [
  { icon: Shirt, title: "Event T-Shirt" },
  { icon: Medal, title: "Finisher Medal" },
  { icon: Timer, title: "Timing Chip" },
  { icon: Award, title: "E-Certificate" },
  { icon: Coffee, title: "Breakfast" },
  { icon: ShoppingBag, title: "Goodie Bag" },
];

export default function ParticipantBenefits() {
  return (
    <section className="py-20 md:py-24 bg-white dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-royal font-semibold text-sm tracking-widest uppercase">Your Registration</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-charcoal">
            What’s Included In Your Registration?
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {benefits.map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-2xl border border-border p-5 text-center hover:border-royal hover:bg-royal/5 transition">
              <Icon className="mx-auto h-8 w-8 text-royal" strokeWidth={1.75} />
              <p className="mt-3 text-sm font-semibold text-charcoal">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
