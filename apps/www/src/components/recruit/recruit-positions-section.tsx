'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Text } from '@/components/ui/text';

const positions = [
  {
    id: 1,
    type: 'engineer',
    image: '/image/featurebox_engineer.png',
    title: 'ENGINEER',
    description: '엔지니어 트랙은 LLM Agent 개발자, AI 모델 엔지니어 등의 직무에 필요한 역량을 기를 수 있도록 구성되어 있습니다. RAG, 파인튜닝, Agent 구현 등 실무에서 활용되는 핵심 기술을 학습하고, 이를 바탕으로 LLM 프로젝트를 진행합니다. 특히 LLM Agent 중심의 실전 프로젝트 경험은 최근 수요가 증가하고 있는 AI Agent 개발 또는 LLM 기반 서비스 개발 직무에 필요한 포트폴리오를 쌓을 수 있는 기회가 될 것입니다.',
  },
  {
    id: 2,
    type: 'producer',
    image: '/image/featurebox_producer.png',
    title: 'PRODUCER',
    description: '광고/마케팅/크리에이티브 직군에 관심이 있다면, "AI PD 역량"에 주목해야 합니다. CJ ENM이 25년 상반기에 AI 제작 PD를 정식 채용한 것처럼, 생성형 AI는 콘텐츠 제작의 핵심 기술로 자리잡고 있습니다. Hateslop의 프로듀서는 이러한 산업 흐름에서 경쟁력을 갖추기 위해 AI 광고, 단편 영화, 브랜디드 콘텐츠 등 실무 중심 프로젝트를 경험, 실무 포지션에 어필할 수 있는 포트폴리오를 쌓을 수 있습니다.',
  },
];

const keyLessons = [
  {
    id: 1,
    icon: '/image/icon_rocket.png',
    title: 'AI 리터러시',
    description: '"AI를 잘 쓰는 사람이 살아 남을 것이다" 라는 말을 들어보셨을 텐데요. 단순히 ChatGPT 같은 AI 툴을 사용하는 것을 넘어 마이크로소프트와 구글이 전 직원에게 요구하는 것처럼, 이제는 AI를 내 업무 시스템으로 직접 설계하고 문제를 해결하는 능력이 중요해졌습니다. 헤이트슬롭은 이러한 트렌드에 맞춰 Gemini CLI로 AI 에이전트와 협업하는 교육을 진행합니다.',
  },
  {
    id: 2,
    icon: '/image/icon_target.png',
    title: 'JD 기반의 커리큘럼',
    description: '직군간 경계가 허물어지는 것은 업무 형태의 변화일 뿐, 본인 커리어의 내실을 다지는 것은 여전히 중요합니다. 이를 위해 헤이트슬롭은 산업계에서 실제 사용되는 내용 기반의 커리큘럼을 구성하였습니다.',
  },
  {
    id: 3,
    icon: '/image/icon_handshake.png',
    title: '합동 캐릭터 챗봇 프로젝트',
    description: '프로듀서는 전체 기획을 맡으며 관련된 비주얼을 AI 로 생성하고, 엔지니어는 이를 직접 구현합니다. 이를 통해 각 파트별 역량과 함께 타직군과의 커뮤니케이션 역량도 증진합니다.',
  },
];

export function RecruitPositionsSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) setVisibleItems([]);
  }, [isVisible]);

  // Stagger animation for items (replay when section comes back into view)
  useEffect(() => {
    if (isVisible) {
      positions.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 150);
      });
      keyLessons.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, positions.length + index]);
        }, (positions.length + index) * 150);
      });
    }
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } py-12 sm:py-16 md:py-20 gap-4 overflow-hidden`}
    >
      <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1100px] py-8 sm:py-10 md:py-[50px] bg-[#101011] overflow-hidden gap-4 rounded-2xl sm:rounded-[30px] mx-4 sm:mx-6">
        <div className="flex flex-col justify-center items-center flex-1 max-w-[1350px] px-4 sm:px-6 md:px-[30px] gap-8 sm:gap-10 md:gap-[44px]">
          {/* Section Title */}
          <Text variant="heading3" as="h2" className="text-white text-center">
            모집 직군
          </Text>

          {/* Grid Wrapper */}
          <div
            className="w-full flex justify-center"
            style={{
              maxWidth: '100%',
            }}
          >
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1000px] gap-6 sm:gap-8 md:gap-[40px] overflow-hidden">
            {positions.map((position, index) => (
              <div 
                key={position.id} 
                className={`w-full transition-all duration-700 ease-out ${
                  visibleItems.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                className="min-h-[380px] sm:min-h-[420px] md:min-h-[460px]"
              >
                {/* Feature Box */}
                <div
                  className="w-full flex flex-col justify-start items-start"
                  style={{
                    padding: '8px',
                    backgroundColor: '#1a1a1b',
                    overflow: 'hidden',
                    gap: '12px',
                    borderRadius: '30px',
                    height: '100%',
                  }}
                >
                  {/* Image Container */}
                  <div
                    className="w-full flex flex-col justify-center items-center"
                    style={{
                      height: '260px',
                      gap: '30px',
                      backgroundColor: '#000000',
                      borderRadius: '25px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={position.image}
                      alt={position.title}
                      className="w-full h-full object-cover"
                      style={{
                        borderRadius: '12px',
                      }}
                    />
                  </div>
                  
                  {/* Feature Content */}
                  <div className="w-full flex flex-col justify-start items-start flex-1 max-w-full overflow-visible p-5 sm:p-6 md:p-[35px] gap-4 sm:gap-[16px] rounded-none">
                    <Text 
                      variant="heading5" 
                      as="h3" 
                      className="text-white"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        lineHeight: '1.3',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      {position.title}
                    </Text>
                    <Text 
                      variant="small" 
                      className="text-[#a7a7a7]"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      {position.description}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Key Lessons */}
          <Text variant="heading4" as="h3" className="text-white">
            Key Lessons
          </Text>

          {/* Icon Feature Grid */}
          <div className="flex flex-col sm:flex-row justify-center items-start w-full max-w-[1000px] gap-8 sm:gap-10 md:gap-[40px]">
            {keyLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`flex flex-col justify-start items-start transition-all duration-700 ease-out flex-1 max-w-[300px] w-full gap-6 sm:gap-[30px] ${
                  visibleItems.includes(positions.length + index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Icon Box */}
                <div
                  className="flex flex-row justify-center items-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#2b2b2c',
                    overflow: 'hidden',
                    padding: '0px',
                    gap: '10px',
                    borderRadius: '10px',
                  }}
                >
                  {/* Icon */}
                  <img
                    src={lesson.icon}
                    alt={lesson.title}
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'contain',
                      filter: 'invert(1)',
                    }}
                  />
                </div>
                
                {/* Icon Content */}
                <div
                  className="w-full flex flex-col justify-start items-start"
                  style={{
                    maxWidth: '600px',
                    overflow: 'hidden',
                    padding: '0px',
                    gap: '16px',
                  }}
                >
                  <Text 
                    variant="heading6" 
                    className="text-white"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      height: 'auto',
                    }}
                  >
                    {lesson.title}
                  </Text>
                  <Text 
                    variant="small" 
                    className="text-[#a7a7a7]"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      height: 'auto',
                    }}
                  >
                    {lesson.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
