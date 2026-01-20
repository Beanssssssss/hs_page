'use client';

import Image from 'next/image';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    id: 1,
    image: '/image/session.JPG',
    title: 'Session',
    description: 'Create stunning designs effortlessly with a user-friendly interface.',
  },
  {
    id: 2,
    image: '/image/project.JPG',
    title: 'Project',
    description: 'Turn ideas into interactive prototypes without writing a single line of code.',
  },
  {
    id: 3,
    image: '/image/networking.PNG',
    title: 'Networking',
    description: 'Work seamlessly with your team, get instant feedback.',
  },
];

export function WhySection() {
  return (
    <section className="w-full flex flex-col justify-center items-center py-[101px] gap-[10px] overflow-hidden">
      {/* Container: Max Width 1200 (네비게이션과 동일), Gap 41, Padding 0 30 */}
      <div className="w-full max-w-[1200px] flex flex-col justify-center items-center px-[30px] gap-[41px] overflow-visible">
        
        {/* Section Title: Max Width 600, Gap 20, Padding 0 */}
        <div className="w-full max-w-[600px] flex flex-col justify-center items-center gap-[20px] p-0 overflow-hidden">
          {/* Heading 3: 40px, Weight 600, Letter -0.04em */}
          <Text 
            variant="heading3" 
            as="h2" 
            className="w-full h-auto text-center whitespace-pre-wrap break-words"
          >
            Why HateSlop
          </Text>
        </div>

        {/* Feature Grid: Grid template columns 3×1fr, Gap 30, Auto rows, Justify center */}
        <div 
          className="w-full grid overflow-visible justify-center p-0 gap-[30px]"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(50px, 1fr))',
            gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
            gridAutoRows: 'minmax(0, 1fr)',
          }}
        >
          {features.map((feature) => {
            return (
              <div
                key={feature.id}
                className="w-[360px] flex flex-col justify-start items-start p-[6px] gap-0 rounded-[30px] bg-white overflow-hidden"
                style={{
                  boxShadow: '0px 4px 30px 0px rgba(45, 30, 133, 0.1)',
                }}
              >
                {/* Feature Image: 300px, Aspect 1.16/1, Border-radius 25px */}
                <div 
                  className="w-full h-[300px] relative rounded-[25px] overflow-hidden"
                  style={{ aspectRatio: '1.16 / 1' }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Feature Content: Padding 20px, Gap 10px */}
                <div className="w-full flex flex-col justify-start items-start p-5 gap-[10px] max-w-[600px] overflow-hidden">
                  {/* Title: Heading 6 */}
                  <Text variant="heading6" as="h3" className="text-black">
                    {feature.title}
                  </Text>
                  
                  {/* Content: Text Small */}
                  <Text variant="small" as="p" className="text-[#606266]">
                    {feature.description}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}

