import { ReadingPassage } from '../../types';
import { a1Vocabulary } from '../vocabulary/a1Vocabulary';

// Helper function to find vocabulary items used in a passage
const findVocabularyInText = (text: string): number[] => {
  // Get vocabulary IDs that appear in the text
  return a1Vocabulary
    .filter(item => {
      // Check if the Vietnamese word appears in the text (case insensitive)
      const vietnameseRegex = new RegExp(`\\b${item.vietnamese}\\b`, 'i');
      return vietnameseRegex.test(text);
    })
    .map(item => item.id);
};

// A1 Level reading passages
export const a1Readings: ReadingPassage[] = [
  // Passage 1: Greeting and Introduction
  {
    id: "a1-01",
    title: {
      vietnamese: "Chào hỏi và Giới thiệu",
      chinese: "问候和介绍"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào! Tôi tên là Minh. Rất vui được gặp bạn.",
        chinese: "你好！我叫明。很高兴见到你。"
      },
      {
        vietnamese: "Chào Minh! Tôi là Lý. Tôi đến từ Trung Quốc.",
        chinese: "你好明！我是李。我来自中国。"
      },
      {
        vietnamese: "Bạn học tiếng Việt bao lâu rồi?",
        chinese: "你学越南语多久了？"
      },
      {
        vietnamese: "Tôi học tiếng Việt được hai tháng. Còn bạn nói tiếng Trung rất tốt.",
        chinese: "我学越南语两个月了。你的中文说得很好。"
      },
      {
        vietnamese: "Cảm ơn! Tôi học tiếng Trung ba năm rồi.",
        chinese: "谢谢！我学中文三年了。"
      },
      {
        vietnamese: "Bạn làm nghề gì?",
        chinese: "你是做什么工作的？"
      },
      {
        vietnamese: "Tôi là giáo viên. Còn bạn?",
        chinese: "我是老师。你呢？"
      },
      {
        vietnamese: "Tôi là sinh viên. Tôi đang học ngôn ngữ.",
        chinese: "我是学生。我正在学习语言。"
      },
      {
        vietnamese: "Rất vui được gặp bạn. Hẹn gặp lại!",
        chinese: "很高兴认识你。再见！"
      },
      {
        vietnamese: "Tạm biệt! Hẹn gặp lại sau.",
        chinese: "再见！下次见。"
      }
    ],
    get vocabulary() {
      // Combine all paragraphs to find vocabulary
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      // Get vocabulary IDs
      const vocabIds = findVocabularyInText(allText);
      // Return vocabulary items
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },

  // Passage 2: At a Restaurant
  {
    id: "a1-02",
    title: {
      vietnamese: "Tại Nhà Hàng",
      chinese: "在餐厅"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào! Chúng tôi muốn đặt bàn.",
        chinese: "你好！我们想要预订一张桌子。"
      },
      {
        vietnamese: "Dạ, bàn cho mấy người ạ?",
        chinese: "好的，请问几位？"
      },
      {
        vietnamese: "Cho ba người.",
        chinese: "三个人。"
      },
      {
        vietnamese: "Vâng, mời các bạn ngồi đây.",
        chinese: "好的，请坐这里。"
      },
      {
        vietnamese: "Cảm ơn. Cho chúng tôi xem thực đơn.",
        chinese: "谢谢。请给我们看菜单。"
      },
      {
        vietnamese: "Đây là thực đơn. Bạn muốn uống gì?",
        chinese: "这是菜单。你们想喝什么？"
      },
      {
        vietnamese: "Tôi muốn uống trà. Họ muốn uống nước.",
        chinese: "我想喝茶。他们想喝水。"
      },
      {
        vietnamese: "Bạn muốn ăn món gì?",
        chinese: "你们想吃什么菜？"
      },
      {
        vietnamese: "Tôi muốn ăn cơm và rau. Cô ấy muốn ăn phở.",
        chinese: "我想吃米饭和蔬菜。她想吃越南粉。"
      },
      {
        vietnamese: "Anh ấy muốn ăn bánh mì.",
        chinese: "他想吃面包。"
      },
      {
        vietnamese: "Vâng. Xin đợi một chút.",
        chinese: "好的。请稍等。"
      },
      {
        vietnamese: "Đồ ăn của các bạn đây. Chúc ngon miệng!",
        chinese: "这是你们的食物。祝你们胃口好！"
      },
      {
        vietnamese: "Cảm ơn! Món này rất ngon.",
        chinese: "谢谢！这个菜很好吃。"
      },
      {
        vietnamese: "Xin lỗi, cho tôi xin hóa đơn.",
        chinese: "对不起，请给我账单。"
      },
      {
        vietnamese: "Dạ, tổng cộng là 250.000 đồng.",
        chinese: "好的，一共是250,000越南盾。"
      },
      {
        vietnamese: "Đây tiền. Cảm ơn nhiều.",
        chinese: "这是钱。非常感谢。"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },

  // Passage 3: My Family
  {
    id: "a1-03",
    title: {
      vietnamese: "Gia Đình Tôi",
      chinese: "我的家庭"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào, tôi muốn giới thiệu về gia đình tôi.",
        chinese: "你好，我想介绍我的家庭。"
      },
      {
        vietnamese: "Gia đình tôi có năm người.",
        chinese: "我家有五口人。"
      },
      {
        vietnamese: "Bố tôi là bác sĩ. Ông ấy năm nay 45 tuổi.",
        chinese: "我爸爸是医生。他今年45岁。"
      },
      {
        vietnamese: "Mẹ tôi là giáo viên. Bà ấy dạy tiếng Anh.",
        chinese: "我妈妈是老师。她教英语。"
      },
      {
        vietnamese: "Tôi có một anh trai và một em gái.",
        chinese: "我有一个哥哥和一个妹妹。"
      },
      {
        vietnamese: "Anh trai tôi là sinh viên đại học. Anh ấy học công nghệ thông tin.",
        chinese: "我哥哥是大学生。他学习信息技术。"
      },
      {
        vietnamese: "Em gái tôi còn nhỏ. Em ấy mới 10 tuổi.",
        chinese: "我妹妹还小。她才10岁。"
      },
      {
        vietnamese: "Chúng tôi sống trong một ngôi nhà nhỏ.",
        chinese: "我们住在一所小房子里。"
      },
      {
        vietnamese: "Nhà chúng tôi có ba phòng ngủ.",
        chinese: "我们家有三间卧室。"
      },
      {
        vietnamese: "Tôi rất yêu gia đình của mình.",
        chinese: "我非常爱我的家庭。"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },

  // Passage 4: Weather and Seasons
  {
    id: "a1-04",
    title: {
      vietnamese: "Thời Tiết và Mùa",
      chinese: "天气和季节"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Hôm nay thời tiết thế nào?",
        chinese: "今天天气怎么样？"
      },
      {
        vietnamese: "Hôm nay trời đẹp. Trời không nóng lắm.",
        chinese: "今天天气很好。天气不太热。"
      },
      {
        vietnamese: "Ở Việt Nam có bốn mùa: mùa xuân, mùa hè, mùa thu và mùa đông.",
        chinese: "在越南有四个季节：春季、夏季、秋季和冬季。"
      },
      {
        vietnamese: "Mùa xuân trời mát mẻ và có nhiều hoa.",
        chinese: "春天天气凉爽，有很多花。"
      },
      {
        vietnamese: "Mùa hè rất nóng và có nhiều mưa.",
        chinese: "夏天很热，有很多雨。"
      },
      {
        vietnamese: "Mùa thu mát mẻ và có nhiều lá vàng.",
        chinese: "秋天凉爽，有很多黄叶。"
      },
      {
        vietnamese: "Mùa đông lạnh nhưng không có tuyết ở miền Nam.",
        chinese: "冬天很冷，但南方没有雪。"
      },
      {
        vietnamese: "Bạn thích mùa nào nhất?",
        chinese: "你最喜欢哪个季节？"
      },
      {
        vietnamese: "Tôi thích mùa thu vì không nóng và không lạnh.",
        chinese: "我喜欢秋天因为不热也不冷。"
      },
      {
        vietnamese: "Ngày mai sẽ mưa. Bạn nên mang ô.",
        chinese: "明天会下雨。你应该带伞。"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },

  // Passage 5: Shopping
  {
    id: "a1-05",
    title: {
      vietnamese: "Đi Mua Sắm",
      chinese: "去购物"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Hôm nay tôi muốn đi mua sắm.",
        chinese: "今天我想去购物。"
      },
      {
        vietnamese: "Cửa hàng này bán quần áo rất đẹp.",
        chinese: "这家商店卖的衣服很漂亮。"
      },
      {
        vietnamese: "Xin chào, tôi có thể giúp gì cho bạn?",
        chinese: "你好，我能帮你什么？"
      },
      {
        vietnamese: "Tôi muốn mua một cái áo mới.",
        chinese: "我想买一件新衬衫。"
      },
      {
        vietnamese: "Bạn thích màu gì?",
        chinese: "你喜欢什么颜色？"
      },
      {
        vietnamese: "Tôi thích màu xanh.",
        chinese: "我喜欢蓝色。"
      },
      {
        vietnamese: "Đây là áo màu xanh. Bạn muốn thử không?",
        chinese: "这是蓝色的衬衫。你想试穿吗？"
      },
      {
        vietnamese: "Vâng, tôi muốn thử. Cái này bao nhiêu tiền?",
        chinese: "是的，我想试穿。这个多少钱？"
      },
      {
        vietnamese: "Cái áo này giá 200.000 đồng.",
        chinese: "这件衬衫价格是200,000越南盾。"
      },
      {
        vietnamese: "Đắt quá! Có cái nào rẻ hơn không?",
        chinese: "太贵了！有便宜一点的吗？"
      },
      {
        vietnamese: "Cái này 150.000 đồng, nhưng màu đỏ.",
        chinese: "这件150,000越南盾，但是红色的。"
      },
      {
        vietnamese: "Được, tôi sẽ lấy cái này. Đây tiền.",
        chinese: "好的，我要这件。这是钱。"
      },
      {
        vietnamese: "Cảm ơn bạn. Đây là hóa đơn và túi đựng.",
        chinese: "谢谢你。这是收据和袋子。"
      },
      {
        vietnamese: "Cảm ơn. Tạm biệt!",
        chinese: "谢谢。再见！"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  }
];

export default a1Readings;