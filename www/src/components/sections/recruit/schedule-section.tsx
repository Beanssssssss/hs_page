'use client';

const schedules = [
  {
    id: 1,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 2,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 3,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 4,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
];

export function ScheduleSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          모집 일정
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold mb-3">{schedule.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {schedule.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

