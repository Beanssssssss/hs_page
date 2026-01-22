'use client';

import { Card, CardContent } from '@/components/ui/card';

const positions = [
  {
    id: 1,
    title: 'Cloud-based accessibility',
    description: 'Access your projects anytime, anywhere—no downloads or installations needed.',
  },
  {
    id: 2,
    title: 'Cloud-based accessibility',
    description: 'Access your projects anytime, anywhere—no downloads or installations needed.',
  },
];

export function RecruitPositionsSection() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          모집 직군
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {positions.map((position) => (
            <Card
              key={position.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
            >
              <CardContent className="p-8">
                <div className="bg-gray-800 rounded-2xl h-48 mb-6"></div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {position.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {position.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

