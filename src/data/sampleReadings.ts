import { ReadingPassage } from '../types';
import { sampleVocabulary } from './sampleVocabulary';

export const sampleReadings: ReadingPassage[] = [
  {
    id: "1",
    title: {
      vietnamese: "Chào hỏi cơ bản",
      chinese: "基本问候"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào! Tôi tên là Minh. Rất vui được gặp bạn.",
        chinese: "你好！我叫明。很高兴见到你。"
      },
      {
        vietnamese: "Bạn tên gì? Bạn khỏe không? Cảm ơn bạn đã hỏi thăm. Tôi khỏe.",
        chinese: "你叫什么名字？你好吗？谢谢你的关心。我很好。"
      },
      {
        vietnamese: "Hôm nay là một ngày đẹp trời. Tạm biệt và hẹn gặp lại nhé!",
        chinese: "今天是个好天气。再见，下次见！"
      }
    ],
    vocabulary: sampleVocabulary.slice(0, 3),
    questions: [
      {
        question: {
          vietnamese: "Người này tên là gì?",
          chinese: "这个人叫什么？"
        },
        options: [
          {
            vietnamese: "Minh",
            chinese: "明",
            isCorrect: true
          },
          {
            vietnamese: "Hoa",
            chinese: "华",
            isCorrect: false
          },
          {
            vietnamese: "Lan",
            chinese: "兰",
            isCorrect: false
          }
        ]
      },
      {
        question: {
          vietnamese: "Hôm nay thời tiết thế nào?",
          chinese: "今天天气怎么样？"
        },
        options: [
          {
            vietnamese: "Mưa",
            chinese: "下雨",
            isCorrect: false
          },
          {
            vietnamese: "Đẹp trời",
            chinese: "好天气",
            isCorrect: true
          },
          {
            vietnamese: "Lạnh",
            chinese: "冷",
            isCorrect: false
          }
        ]
      }
    ]
  }
];