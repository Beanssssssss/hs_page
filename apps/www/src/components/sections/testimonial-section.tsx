'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Maya Zong',
    role: 'Product Designer, Pixio',
    content: 'We spend less time fixing layouts 💅 and more time shipping.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Ethan Miller',
    role: 'UI Designer, Bright',
    content:
      "Handoff is clear and predictable now. Developers don't have to guess spacing or styles anymore. Real-time collaboration made reviews smoother and faster.",
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Hannah Lee',
    role: 'UI Designer, Novaa',
    content: 'Version history gives us confidence to experiment without fear.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Daniel Perez',
    role: 'Frontend Developer, Coden',
    content:
      'Auto Layout saved us a lot of cleanup time. Layout changes finally behave the way you expect.',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'Laura Kim',
    role: 'Engineering Lead, Flow',
    content: 'HateSlop은 집중된 커리큘럼과 실전 프로젝트가 좋아요 🎯',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Priya Shah',
    role: 'Product Manager, Workly',
    content: 'Everything lives in one place now. That alone changed how we work.',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-16">
          In HateSlop
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {testimonial.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white rounded-full px-8"
          >
            View all Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}

