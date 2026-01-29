'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';

const faqs = [
  {
    id: 1,
    question: '학회 활동이 커리어에 어떤 도움이 될까요?',
    answer:
      '엔지니어 트랙은 LLM Agent 개발자, AI 모델 엔지니어 등의 직무에 필요한 역량을 기를 수 있도록 구성되어 있습니다. RAG, 파인튜닝, Agent 구현 등 실무에서 활용되는 핵심 기술을 학습하고, 이를 바탕으로 LLM 프로젝트를 진행합니다. 특히 LLM Agent 중심의 실전 프로젝트 경험은 최근 수요가 증가하고 있는 AI Agent 개발 또는 LLM 기반 서비스 개발 직무에 필요한 포트폴리오를 쌓을 수 있는 기회가 될 것입니다.\n\n프로듀서의 경우, 광고/마케팅/크리에이티브 직군에 관심이 있다면, "AI PD 역량"에 주목해야 합니다. CJ ENM이 25년 상반기에 AI 제작 PD를 정식 채용한 것처럼, 생성형 AI는 콘텐츠 제작의 핵심 기술로 자리잡고 있습니다. Hateslop의 프로듀서는 이러한 산업 흐름에서 경쟁력을 갖추기 위해 AI 광고, 단편 영화, 브랜디드 콘텐츠 등 실무 중심 프로젝트를 경험, 실무 포지션에 어필할 수 있는 포트폴리오를 쌓을 수 있습니다.',
  },
  {
    id: 2,
    question: '엔지니어 세션에서 웹 프론트엔드 백엔드 교육도 진행하나요?',
    answer:
      '헤이트슬롭은 AI 학회다보니 웹 개발에 대한 교육은 정규 세션으로 진행하지 않습니다. 다만 바이브 코딩을 이용해 웹 프로덕트를 어떻게 만들 수 있는지에 대한 실질적인 가이드를 특강 형태로 제공합니다. 이때 Gemini CLI 등의 무료 툴을 이용해 어떻게 개발을 진행할 수 있을지와 PRD, TRD 설계, Context 를 보존하여 일관된 퀄리티로 Agent와 함께 개발을 할 수 있는 방법에 대해 교육합니다. Next.js 의 오픈소스 보일러플레이트를 이용해 프론트엔드를 구성하고 Supabase 를 이용해 DB와 API를 구성합니다. 웹을 구성하고 학회에서 배운 내용을 기반으로 AI 모델을 서빙할 수 있게 교육자료가 구성될 예정입니다.',
  },
  {
    id: 3,
    question: '방학 중 파이널 프로젝트를 진행하는 커리큘럼인데, 일정이 있으면 지원이 불가한가요?',
    answer:
      '파이널 프로젝트는 팀 단위로 자율적으로 진행되며, 해당 기간 중 대면 세션은 없습니다. 따라서 릴리즈데이 대면 세션(26.01.29)에만 참석이 가능하다면 지원 가능합니다.',
  },
  {
    id: 4,
    question: '면접은 어떻게 진행되나요?',
    answer:
      '다대일 면접으로 진행되며, 8월 30일(토) 또는 31일(일)에 서강대학교 우정원에서 약 30분간 진행될 예정입니다. 자세한 일정은 서류 합격자에 한해 별도로 안내드립니다.',
  },
  {
    id: 5,
    question: '세션은 몇 시간 동안 진행되나요?',
    answer:
      '기본 세션 시간은 약 2시간이며, 실습 진행 상황에 따라 다소 연장될 수 있습니다.',
  },
  {
    id: 6,
    question: '세션은 언제, 어디서 진행되나요?',
    answer:
      '세션은 매주 목요일 오후 7시, 서강대학교 우정원 7층 700호에서 진행됩니다. 파이널 프로젝트 이전까지 총 12회차 세션은 모두 대면으로 진행되며, 공휴일 등 일정에 따라 일부 일정은 조정될 수 있습니다.',
  }
];

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        padding: '100px 0px',
        gap: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Wrapper for centering */}
      <div className="w-full flex justify-center" style={{ padding: '0px 30px' }}>
        {/* Container */}
        <div
          className="flex flex-row justify-start items-start"
          style={{
            maxWidth: '1100px',
            width: '100%',
            gap: '150px',
            overflow: 'visible',
          }}
        >
          {/* Section Title (Left) */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              width: '200px',
              flexShrink: 0,
            }}
          >
            <Text variant="heading3" as="h2">
              FAQ
            </Text>
          </div>

          {/* FAQ Accordion (Right) */}
          <div 
            className="flex-1 flex flex-col justify-start items-start"
            style={{
              maxWidth: '800px',
              overflow: 'visible',
              padding: '0px',
              gap: '10px',
            }}
          >
            {/* Accordion Wrap */}
            <Accordion
              type="single"
              collapsible
              className="w-full flex flex-col"
              style={{
                gap: '15px',
                overflow: 'visible',
              }}
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="px-6 border-0"
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    backgroundColor: '#f0f2f6',
                    borderRadius: '30px',
                    overflow: 'hidden',
                  }}
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    <Text variant="medium" as="h3" style={{ width: '100%', textAlign: 'left' }}>
                      {faq.question}
                    </Text>
                  </AccordionTrigger>
                  <AccordionContent 
                    className="text-gray-600 pb-6" 
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                  >
                    <Text variant="small" className="text-gray-600" style={{ width: '100%', textAlign: 'left', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {faq.answer}
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

