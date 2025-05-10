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
      chinese: "问候和介绍",
      pinyin: "Wènhòu hé jièshào"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào! Tôi tên là Minh. Rất vui được gặp bạn.",
        chinese: "你好！我叫明。很高兴见到你。",
        pinyin: "Nǐ hǎo! Wǒ jiào Míng. Hěn gāoxìng jiàn dào nǐ."
      },
      {
        vietnamese: "Chào Minh! Tôi là Lý. Tôi đến từ Trung Quốc.",
        chinese: "你好明！我是李。我来自中国。",
        pinyin: "Nǐ hǎo Míng! Wǒ shì Lǐ. Wǒ lái zì Zhōngguó."
      },
      {
        vietnamese: "Bạn học tiếng Việt bao lâu rồi?",
        chinese: "你学越南语多久了？",
        pinyin: "Nǐ xué Yuènányǔ duō jiǔ le?"
      },
      {
        vietnamese: "Tôi học tiếng Việt được hai tháng. Còn bạn nói tiếng Trung rất tốt.",
        chinese: "我学越南语两个月了。你的中文说得很好。",
        pinyin: "Wǒ xué Yuènányǔ liǎng gè yuè le. Nǐ de Zhōngwén shuō de hěn hǎo."
      },
      {
        vietnamese: "Cảm ơn! Tôi học tiếng Trung ba năm rồi.",
        chinese: "谢谢！我学中文三年了。",
        pinyin: "Xièxie! Wǒ xué Zhōngwén sān nián le."
      },
      {
        vietnamese: "Bạn làm nghề gì?",
        chinese: "你是做什么工作的？",
        pinyin: "Nǐ shì zuò shénme gōngzuò de?"
      },
      {
        vietnamese: "Tôi là giáo viên. Còn bạn?",
        chinese: "我是老师。你呢？",
        pinyin: "Wǒ shì lǎoshī. Nǐ ne?"
      },
      {
        vietnamese: "Tôi là sinh viên. Tôi đang học ngôn ngữ.",
        chinese: "我是学生。我正在学习语言。",
        pinyin: "Wǒ shì xuésheng. Wǒ zhèngzài xuéxí yǔyán."
      },
      {
        vietnamese: "Rất vui được gặp bạn. Hẹn gặp lại!",
        chinese: "很高兴认识你。再见！",
        pinyin: "Hěn gāoxìng rènshi nǐ. Zàijiàn!"
      },
      {
        vietnamese: "Tạm biệt! Hẹn gặp lại sau.",
        chinese: "再见！下次见。",
        pinyin: "Zàijiàn! Xià cì jiàn."
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
      chinese: "在餐厅",
      pinyin: "Zài cāntīng"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào! Chúng tôi muốn đặt bàn.",
        chinese: "你好！我们想要预订一张桌子。",
        pinyin: "Nǐ hǎo! Wǒmen xiǎng yào yùdìng yī zhāng zhuōzi."
      },
      {
        vietnamese: "Dạ, bàn cho mấy người ạ?",
        chinese: "好的，请问几位？",
        pinyin: "Hǎo de, qǐng wèn jǐ wèi?"
      },
      {
        vietnamese: "Cho ba người.",
        chinese: "三个人。",
        pinyin: "Sān gè rén."
      },
      {
        vietnamese: "Vâng, mời các bạn ngồi đây.",
        chinese: "好的，请坐这里。",
        pinyin: "Hǎo de, qǐng zuò zhèlǐ."
      },
      {
        vietnamese: "Cảm ơn. Cho chúng tôi xem thực đơn.",
        chinese: "谢谢。请给我们看菜单。",
        pinyin: "Xièxie. Qǐng gěi wǒmen kàn càidān."
      },
      {
        vietnamese: "Đây là thực đơn. Bạn muốn uống gì?",
        chinese: "这是菜单。你们想喝什么？",
        pinyin: "Zhè shì càidān. Nǐmen xiǎng hē shénme?"
      },
      {
        vietnamese: "Tôi muốn uống trà. Họ muốn uống nước.",
        chinese: "我想喝茶。他们想喝水。",
        pinyin: "Wǒ xiǎng hē chá. Tāmen xiǎng hē shuǐ."
      },
      {
        vietnamese: "Bạn muốn ăn món gì?",
        chinese: "你们想吃什么菜？",
        pinyin: "Nǐmen xiǎng chī shénme cài?"
      },
      {
        vietnamese: "Tôi muốn ăn cơm và rau. Cô ấy muốn ăn phở.",
        chinese: "我想吃米饭和蔬菜。她想吃越南粉。",
        pinyin: "Wǒ xiǎng chī mǐfàn hé shūcài. Tā xiǎng chī Yuènán fěn."
      },
      {
        vietnamese: "Anh ấy muốn ăn bánh mì.",
        chinese: "他想吃面包。",
        pinyin: "Tā xiǎng chī miànbāo."
      },
      {
        vietnamese: "Vâng. Xin đợi một chút.",
        chinese: "好的。请稍等。",
        pinyin: "Hǎo de. Qǐng shāo děng."
      },
      {
        vietnamese: "Đồ ăn của các bạn đây. Chúc ngon miệng!",
        chinese: "这是你们的食物。祝你们胃口好！",
        pinyin: "Zhè shì nǐmen de shíwù. Zhù nǐmen wèikǒu hǎo!"
      },
      {
        vietnamese: "Cảm ơn! Món này rất ngon.",
        chinese: "谢谢！这个菜很好吃。",
        pinyin: "Xièxie! Zhège cài hěn hǎochī."
      },
      {
        vietnamese: "Xin lỗi, cho tôi xin hóa đơn.",
        chinese: "对不起，请给我账单。",
        pinyin: "Duìbùqǐ, qǐng gěi wǒ zhàngdān."
      },
      {
        vietnamese: "Dạ, tổng cộng là 250.000 đồng.",
        chinese: "好的，一共是250,000越南盾。",
        pinyin: "Hǎo de, yígòng shì 250,000 Yuènán dùn."
      },
      {
        vietnamese: "Đây tiền. Cảm ơn nhiều.",
        chinese: "这是钱。非常感谢。",
        pinyin: "Zhè shì qián. Fēicháng gǎnxiè."
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
      chinese: "我的家庭",
      pinyin: "Wǒ de jiātíng"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin chào, tôi muốn giới thiệu về gia đình tôi.",
        chinese: "你好，我想介绍我的家庭。",
        pinyin: "Nǐ hǎo, wǒ xiǎng jièshào wǒ de jiātíng."
      },
      {
        vietnamese: "Gia đình tôi có năm người.",
        chinese: "我家有五口人。",
        pinyin: "Wǒ jiā yǒu wǔ kǒu rén."
      },
      {
        vietnamese: "Bố tôi là bác sĩ. Ông ấy năm nay 45 tuổi.",
        chinese: "我爸爸是医生。他今年45岁。",
        pinyin: "Wǒ bàba shì yīshēng. Tā jīnnián 45 suì."
      },
      {
        vietnamese: "Mẹ tôi là giáo viên. Bà ấy dạy tiếng Anh.",
        chinese: "我妈妈是老师。她教英语。",
        pinyin: "Wǒ māma shì lǎoshī. Tā jiāo Yīngyǔ."
      },
      {
        vietnamese: "Tôi có một anh trai và một em gái.",
        chinese: "我有一个哥哥和一个妹妹。",
        pinyin: "Wǒ yǒu yí gè gēge hé yí gè mèimei."
      },
      {
        vietnamese: "Anh trai tôi là sinh viên đại học. Anh ấy học công nghệ thông tin.",
        chinese: "我哥哥是大学生。他学习信息技术。",
        pinyin: "Wǒ gēge shì dàxuéshēng. Tā xuéxí xìnxī jìshù."
      },
      {
        vietnamese: "Em gái tôi còn nhỏ. Em ấy mới 10 tuổi.",
        chinese: "我妹妹还小。她才10岁。",
        pinyin: "Wǒ mèimei hái xiǎo. Tā cái 10 suì."
      },
      {
        vietnamese: "Chúng tôi sống trong một ngôi nhà nhỏ.",
        chinese: "我们住在一所小房子里。",
        pinyin: "Wǒmen zhù zài yì suǒ xiǎo fángzi lǐ."
      },
      {
        vietnamese: "Nhà chúng tôi có ba phòng ngủ.",
        chinese: "我们家有三间卧室。",
        pinyin: "Wǒmen jiā yǒu sān jiān wòshì."
      },
      {
        vietnamese: "Tôi rất yêu gia đình của mình.",
        chinese: "我非常爱我的家庭。",
        pinyin: "Wǒ fēicháng ài wǒ de jiātíng."
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
      chinese: "天气和季节",
      pinyin: "Tiānqì hé jìjié"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Hôm nay thời tiết thế nào?",
        chinese: "今天天气怎么样？",
        pinyin: "Jīntiān tiānqì zěnme yàng?"
      },
      {
        vietnamese: "Hôm nay trời đẹp. Trời không nóng lắm.",
        chinese: "今天天气很好。天气不太热。",
        pinyin: "Jīntiān tiānqì hěn hǎo. Tiānqì bú tài rè."
      },
      {
        vietnamese: "Ở Việt Nam có bốn mùa: mùa xuân, mùa hè, mùa thu và mùa đông.",
        chinese: "在越南有四个季节：春季、夏季、秋季和冬季。",
        pinyin: "Zài Yuènán yǒu sì gè jìjié: chūnjì, xiàjì, qiūjì hé dōngjì."
      },
      {
        vietnamese: "Mùa xuân trời mát mẻ và có nhiều hoa.",
        chinese: "春天天气凉爽，有很多花。",
        pinyin: "Chūntiān tiānqì liángshuǎng, yǒu hěn duō huā."
      },
      {
        vietnamese: "Mùa hè rất nóng và có nhiều mưa.",
        chinese: "夏天很热，有很多雨。",
        pinyin: "Xiàtiān hěn rè, yǒu hěn duō yǔ."
      },
      {
        vietnamese: "Mùa thu mát mẻ và có nhiều lá vàng.",
        chinese: "秋天凉爽，有很多黄叶。",
        pinyin: "Qiūtiān liángshuǎng, yǒu hěn duō huáng yè."
      },
      {
        vietnamese: "Mùa đông lạnh nhưng không có tuyết ở miền Nam.",
        chinese: "冬天很冷，但南方没有雪。",
        pinyin: "Dōngtiān hěn lěng, dàn nánfāng méiyǒu xuě."
      },
      {
        vietnamese: "Bạn thích mùa nào nhất?",
        chinese: "你最喜欢哪个季节？",
        pinyin: "Nǐ zuì xǐhuan nǎ gè jìjié?"
      },
      {
        vietnamese: "Tôi thích mùa thu vì không nóng và không lạnh.",
        chinese: "我喜欢秋天因为不热也不冷。",
        pinyin: "Wǒ xǐhuan qiūtiān yīnwèi bú rè yě bù lěng."
      },
      {
        vietnamese: "Ngày mai sẽ mưa. Bạn nên mang ô.",
        chinese: "明天会下雨。你应该带伞。",
        pinyin: "Míngtiān huì xià yǔ. Nǐ yīnggāi dài sǎn."
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
      chinese: "去购物",
      pinyin: "Qù gòuwù"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Hôm nay tôi muốn đi mua sắm.",
        chinese: "今天我想去购物。",
        pinyin: "Jīntiān wǒ xiǎng qù gòuwù."
      },
      {
        vietnamese: "Cửa hàng này bán quần áo rất đẹp.",
        chinese: "这家商店卖的衣服很漂亮。",
        pinyin: "Zhè jiā shāngdiàn mài de yīfu hěn piàoliang."
      },
      {
        vietnamese: "Xin chào, tôi có thể giúp gì cho bạn?",
        chinese: "你好，我能帮你什么？",
        pinyin: "Nǐ hǎo, wǒ néng bāng nǐ shénme?"
      },
      {
        vietnamese: "Tôi muốn mua một cái áo mới.",
        chinese: "我想买一件新衬衫。",
        pinyin: "Wǒ xiǎng mǎi yí jiàn xīn chènshān."
      },
      {
        vietnamese: "Bạn thích màu gì?",
        chinese: "你喜欢什么颜色？",
        pinyin: "Nǐ xǐhuan shénme yánsè?"
      },
      {
        vietnamese: "Tôi thích màu xanh.",
        chinese: "我喜欢蓝色。",
        pinyin: "Wǒ xǐhuan lánsè."
      },
      {
        vietnamese: "Đây là áo màu xanh. Bạn muốn thử không?",
        chinese: "这是蓝色的衬衫。你想试穿吗？",
        pinyin: "Zhè shì lánsè de chènshān. Nǐ xiǎng shì chuān ma?"
      },
      {
        vietnamese: "Vâng, tôi muốn thử. Cái này bao nhiêu tiền?",
        chinese: "是的，我想试穿。这个多少钱？",
        pinyin: "Shì de, wǒ xiǎng shì chuān. Zhège duōshao qián?"
      },
      {
        vietnamese: "Cái áo này giá 200.000 đồng.",
        chinese: "这件衬衫价格是200,000越南盾。",
        pinyin: "Zhè jiàn chènshān jiàgé shì 200,000 Yuènán dùn."
      },
      {
        vietnamese: "Đắt quá! Có cái nào rẻ hơn không?",
        chinese: "太贵了！有便宜一点的吗？",
        pinyin: "Tài guì le! Yǒu piányi yìdiǎn de ma?"
      },
      {
        vietnamese: "Cái này 150.000 đồng, nhưng màu đỏ.",
        chinese: "这件150,000越南盾，但是红色的。",
        pinyin: "Zhè jiàn 150,000 Yuènán dùn, dànshì hóngsè de."
      },
      {
        vietnamese: "Được, tôi sẽ lấy cái này. Đây tiền.",
        chinese: "好的，我要这件。这是钱。",
        pinyin: "Hǎo de, wǒ yào zhè jiàn. Zhè shì qián."
      },
      {
        vietnamese: "Cảm ơn bạn. Đây là hóa đơn và túi đựng.",
        chinese: "谢谢你。这是收据和袋子。",
        pinyin: "Xièxie nǐ. Zhè shì shōujù hé dàizi."
      },
      {
        vietnamese: "Cảm ơn. Tạm biệt!",
        chinese: "谢谢。再见！",
        pinyin: "Xièxie. Zàijiàn!"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },

  // Passage 6: Daily Routine
  {
    id: "a1-06",
    title: {
      vietnamese: "Thời Gian Biểu Hàng Ngày",
      chinese: "每日时间表",
      pinyin: "Měi rì shíjiān biǎo"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Tôi thường thức dậy lúc sáu giờ sáng.",
        chinese: "我通常早上六点起床。",
        pinyin: "Wǒ tōngcháng zǎoshang liù diǎn qǐchuáng."
      },
      {
        vietnamese: "Sau đó, tôi đánh răng và rửa mặt.",
        chinese: "然后，我刷牙和洗脸。",
        pinyin: "Ránhòu, wǒ shuā yá hé xǐ liǎn."
      },
      {
        vietnamese: "Tôi ăn sáng lúc bảy giờ. Tôi thường ăn bánh mì và uống cà phê.",
        chinese: "我七点吃早饭。我通常吃面包和喝咖啡。",
        pinyin: "Wǒ qī diǎn chī zǎofàn. Wǒ tōngcháng chī miànbāo hé hē kāfēi."
      },
      {
        vietnamese: "Tôi đi làm lúc tám giờ. Công ty tôi không xa nhà.",
        chinese: "我八点去上班。我的公司离家不远。",
        pinyin: "Wǒ bā diǎn qù shàngbān. Wǒ de gōngsī lí jiā bù yuǎn."
      },
      {
        vietnamese: "Tôi làm việc từ chín giờ đến mười hai giờ trưa.",
        chinese: "我从九点工作到中午十二点。",
        pinyin: "Wǒ cóng jiǔ diǎn gōngzuò dào zhōngwǔ shí'èr diǎn."
      },
      {
        vietnamese: "Tôi ăn trưa với đồng nghiệp ở một nhà hàng gần công ty.",
        chinese: "我和同事在公司附近的一家餐厅吃午饭。",
        pinyin: "Wǒ hé tóngshì zài gōngsī fùjìn de yì jiā cāntīng chī wǔfàn."
      },
      {
        vietnamese: "Buổi chiều, tôi làm việc từ một giờ đến năm giờ.",
        chinese: "下午，我从一点工作到五点。",
        pinyin: "Xiàwǔ, wǒ cóng yī diǎn gōngzuò dào wǔ diǎn."
      },
      {
        vietnamese: "Sau khi tan làm, tôi đi mua sắm hoặc gặp bạn bè.",
        chinese: "下班后，我去购物或见朋友。",
        pinyin: "Xiàbān hòu, wǒ qù gòuwù huò jiàn péngyou."
      },
      {
        vietnamese: "Tôi ăn tối lúc bảy giờ tối ở nhà.",
        chinese: "我晚上七点在家吃晚饭。",
        pinyin: "Wǒ wǎnshang qī diǎn zài jiā chī wǎnfàn."
      },
      {
        vietnamese: "Tôi thích xem tivi một chút trước khi đi ngủ.",
        chinese: "我喜欢在睡觉前看一会儿电视。",
        pinyin: "Wǒ xǐhuan zài shuìjiào qián kàn yíhuìr diànshì."
      },
      {
        vietnamese: "Tôi thường đi ngủ vào lúc mười một giờ đêm.",
        chinese: "我通常晚上十一点睡觉。",
        pinyin: "Wǒ tōngcháng wǎnshang shíyī diǎn shuìjiào."
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },
  
  // Passage 7: Asking for Directions
  {
    id: "a1-07",
    title: {
      vietnamese: "Hỏi Đường",
      chinese: "问路",
      pinyin: "Wèn lù"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Xin lỗi, tôi bị lạc. Bạn có thể giúp tôi không?",
        chinese: "对不起，我迷路了。你能帮我吗？",
        pinyin: "Duìbùqǐ, wǒ mílù le. Nǐ néng bāng wǒ ma?"
      },
      {
        vietnamese: "Vâng, tôi có thể giúp bạn. Bạn muốn đi đâu?",
        chinese: "是的，我可以帮你。你想去哪里？",
        pinyin: "Shì de, wǒ kěyǐ bāng nǐ. Nǐ xiǎng qù nǎlǐ?"
      },
      {
        vietnamese: "Tôi muốn đến bệnh viện. Bệnh viện ở đâu?",
        chinese: "我想去医院。医院在哪里？",
        pinyin: "Wǒ xiǎng qù yīyuàn. Yīyuàn zài nǎlǐ?"
      },
      {
        vietnamese: "Bệnh viện ở gần đây. Đi thẳng hai trăm mét.",
        chinese: "医院就在附近。直走两百米。",
        pinyin: "Yīyuàn jiù zài fùjìn. Zhí zǒu liǎng bǎi mǐ."
      },
      {
        vietnamese: "Sau đó rẽ phải ở ngã tư.",
        chinese: "然后在十字路口向右转。",
        pinyin: "Ránhòu zài shízì lùkǒu xiàng yòu zhuǎn."
      },
      {
        vietnamese: "Đi thêm một trăm mét nữa.",
        chinese: "再走一百米。",
        pinyin: "Zài zǒu yì bǎi mǐ."
      },
      {
        vietnamese: "Bệnh viện sẽ ở bên tay trái của bạn, đối diện với cửa hàng lớn.",
        chinese: "医院就在你的左边，对面是一家大商店。",
        pinyin: "Yīyuàn jiù zài nǐ de zuǒbiān, duìmiàn shì yì jiā dà shāngdiàn."
      },
      {
        vietnamese: "Bạn có thể đi bộ đến đó trong khoảng năm phút.",
        chinese: "你可以步行到那里，大约需要五分钟。",
        pinyin: "Nǐ kěyǐ bùxíng dào nàlǐ, dàyuē xūyào wǔ fēnzhōng."
      },
      {
        vietnamese: "Hoặc bạn có thể đi taxi, nhưng không cần thiết vì rất gần.",
        chinese: "或者你可以乘出租车，但没有必要，因为很近。",
        pinyin: "Huòzhě nǐ kěyǐ chéng chūzūchē, dàn méiyǒu bìyào, yīnwèi hěn jìn."
      },
      {
        vietnamese: "Cảm ơn bạn rất nhiều. Bạn thật tốt.",
        chinese: "非常感谢你。你真好。",
        pinyin: "Fēicháng gǎnxiè nǐ. Nǐ zhēn hǎo."
      },
      {
        vietnamese: "Không có gì. Chúc bạn may mắn!",
        chinese: "不客气。祝你好运！",
        pinyin: "Bú kèqi. Zhù nǐ hǎo yùn!"
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },
  
  // Passage 8: Making Plans with Friends
  {
    id: "a1-08",
    title: {
      vietnamese: "Hẹn Gặp Bạn Bè",
      chinese: "与朋友相约",
      pinyin: "Yǔ péngyou xiāngyuē"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Chào Lan, cuối tuần này bạn có rảnh không?",
        chinese: "你好兰，这个周末你有空吗？",
        pinyin: "Nǐ hǎo Lán, zhège zhōumò nǐ yǒu kòng ma?"
      },
      {
        vietnamese: "Chào Hải. Có, tôi rảnh vào thứ bảy. Tại sao bạn hỏi vậy?",
        chinese: "你好海。有，我周六有空。你为什么问？",
        pinyin: "Nǐ hǎo Hǎi. Yǒu, wǒ zhōuliù yǒu kòng. Nǐ wèishénme wèn?"
      },
      {
        vietnamese: "Tôi muốn mời bạn đi xem phim. Có một bộ phim mới rất hay.",
        chinese: "我想邀请你去看电影。有一部新电影很好看。",
        pinyin: "Wǒ xiǎng yāoqǐng nǐ qù kàn diànyǐng. Yǒu yí bù xīn diànyǐng hěn hǎokàn."
      },
      {
        vietnamese: "Nghe có vẻ thú vị! Phim chiếu lúc mấy giờ?",
        chinese: "听起来很有趣！电影几点开始？",
        pinyin: "Tīng qǐlái hěn yǒuqù! Diànyǐng jǐ diǎn kāishǐ?"
      },
      {
        vietnamese: "Phim bắt đầu lúc bảy giờ tối thứ bảy.",
        chinese: "电影周六晚上七点开始。",
        pinyin: "Diànyǐng zhōuliù wǎnshang qī diǎn kāishǐ."
      },
      {
        vietnamese: "Chúng ta gặp nhau ở đâu?",
        chinese: "我们在哪里见面？",
        pinyin: "Wǒmen zài nǎlǐ jiànmiàn?"
      },
      {
        vietnamese: "Chúng ta có thể gặp nhau ở quán cà phê gần rạp chiếu phim lúc sáu giờ.",
        chinese: "我们可以在电影院附近的咖啡馆六点见面。",
        pinyin: "Wǒmen kěyǐ zài diànyǐngyuàn fùjìn de kāfēiguǎn liù diǎn jiànmiàn."
      },
      {
        vietnamese: "Tốt, vậy trước khi xem phim, chúng ta có thể uống cà phê và nói chuyện.",
        chinese: "好的，这样看电影前，我们可以喝咖啡和聊天。",
        pinyin: "Hǎo de, zhèyàng kàn diànyǐng qián, wǒmen kěyǐ hē kāfēi hé liáotiān."
      },
      {
        vietnamese: "Đúng vậy. Sau phim, chúng ta có thể đi ăn tối nếu bạn muốn.",
        chinese: "是的。电影之后，如果你想，我们可以去吃晚餐。",
        pinyin: "Shì de. Diànyǐng zhīhòu, rúguǒ nǐ xiǎng, wǒmen kěyǐ qù chī wǎncān."
      },
      {
        vietnamese: "Đó là ý kiến hay! Tôi sẽ gặp bạn vào thứ bảy.",
        chinese: "那是个好主意！我周六见你。",
        pinyin: "Nà shì ge hǎo zhǔyì! Wǒ zhōuliù jiàn nǐ."
      },
      {
        vietnamese: "Tuyệt! Hẹn gặp lại sau.",
        chinese: "太好了！回头见。",
        pinyin: "Tài hǎo le! Huítóu jiàn."
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },
  
  // Passage 9: Describing a Person
  {
    id: "a1-09",
    title: {
      vietnamese: "Miêu Tả Một Người",
      chinese: "描述一个人",
      pinyin: "Miáoshù yí gè rén"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Đây là bạn tôi, Minh. Anh ấy là giáo viên tiếng Anh.",
        chinese: "这是我的朋友，明。他是英语老师。",
        pinyin: "Zhè shì wǒ de péngyou, Míng. Tā shì Yīngyǔ lǎoshī."
      },
      {
        vietnamese: "Minh hai mươi tám tuổi. Anh ấy cao và gầy.",
        chinese: "明二十八岁。他又高又瘦。",
        pinyin: "Míng èr shí bā suì. Tā yòu gāo yòu shòu."
      },
      {
        vietnamese: "Anh ấy có mái tóc đen và ngắn. Mắt anh ấy màu nâu.",
        chinese: "他有一头黑色短发。他的眼睛是棕色的。",
        pinyin: "Tā yǒu yì tóu hēisè duǎnfà. Tā de yǎnjing shì zōngsè de."
      },
      {
        vietnamese: "Minh rất thông minh và vui tính. Anh ấy luôn mỉm cười.",
        chinese: "明很聪明也很幽默。他总是微笑。",
        pinyin: "Míng hěn cōngmíng yě hěn yōumò. Tā zǒngshì wēixiào."
      },
      {
        vietnamese: "Anh ấy thích đọc sách và học ngôn ngữ mới.",
        chinese: "他喜欢读书和学习新语言。",
        pinyin: "Tā xǐhuan dú shū hé xuéxí xīn yǔyán."
      },
      {
        vietnamese: "Minh nói được ba thứ tiếng: tiếng Việt, tiếng Anh và tiếng Trung.",
        chinese: "明会说三种语言：越南语，英语和中文。",
        pinyin: "Míng huì shuō sān zhǒng yǔyán: Yuènányǔ, Yīngyǔ hé Zhōngwén."
      },
      {
        vietnamese: "Anh ấy cũng thích nấu ăn. Anh ấy nấu món Việt Nam rất ngon.",
        chinese: "他也喜欢烹饪。他做的越南菜很好吃。",
        pinyin: "Tā yě xǐhuan pēngrèn. Tā zuò de Yuènán cài hěn hǎochī."
      },
      {
        vietnamese: "Vào cuối tuần, Minh thích đi leo núi và chụp ảnh.",
        chinese: "在周末，明喜欢去爬山和拍照。",
        pinyin: "Zài zhōumò, Míng xǐhuan qù páshān hé pāizhào."
      },
      {
        vietnamese: "Anh ấy là người bạn tốt. Anh ấy luôn giúp đỡ mọi người.",
        chinese: "他是一个好朋友。他总是帮助别人。",
        pinyin: "Tā shì yí gè hǎo péngyou. Tā zǒngshì bāngzhù biérén."
      },
      {
        vietnamese: "Tôi rất vui khi có một người bạn như Minh.",
        chinese: "我很高兴有一个像明这样的朋友。",
        pinyin: "Wǒ hěn gāoxìng yǒu yí gè xiàng Míng zhèyàng de péngyou."
      }
    ],
    get vocabulary() {
      const allText = this.paragraphs.map(p => p.vietnamese).join(' ');
      const vocabIds = findVocabularyInText(allText);
      return a1Vocabulary.filter(item => vocabIds.includes(item.id));
    }
  },
  
  // Passage 10: Hobbies and Interests
  {
    id: "a1-10",
    title: {
      vietnamese: "Sở Thích",
      chinese: "爱好",
      pinyin: "Àihào"
    },
    level: "A1",
    paragraphs: [
      {
        vietnamese: "Mọi người có nhiều sở thích khác nhau.",
        chinese: "人们有许多不同的爱好。",
        pinyin: "Rénmen yǒu xǔduō bùtóng de àihào."
      },
      {
        vietnamese: "Tôi thích chơi thể thao. Tôi đá bóng mỗi cuối tuần.",
        chinese: "我喜欢运动。我每个周末踢足球。",
        pinyin: "Wǒ xǐhuan yùndòng. Wǒ měi gè zhōumò tī zúqiú."
      },
      {
        vietnamese: "Em gái tôi thích vẽ tranh. Cô ấy vẽ rất đẹp.",
        chinese: "我妹妹喜欢画画。她画得很漂亮。",
        pinyin: "Wǒ mèimei xǐhuan huà huà. Tā huà de hěn piàoliang."
      },
      {
        vietnamese: "Anh trai tôi thích nghe nhạc. Anh ấy cũng biết chơi đàn piano.",
        chinese: "我哥哥喜欢听音乐。他也会弹钢琴。",
        pinyin: "Wǒ gēge xǐhuan tīng yīnyuè. Tā yě huì tán gāngqín."
      },
      {
        vietnamese: "Mẹ tôi thích làm vườn. Bà ấy trồng nhiều loại hoa và rau.",
        chinese: "我妈妈喜欢园艺。她种植各种花卉和蔬菜。",
        pinyin: "Wǒ māma xǐhuan yuányì. Tā zhòngzhí gèzhǒng huāhuì hé shūcài."
      },
      {
        vietnamese: "Bố tôi thích nấu ăn. Ông ấy nấu nhiều món ăn ngon.",
        chinese: "我爸爸喜欢烹饪。他做很多美味的菜肴。",
        pinyin: "Wǒ bàba xǐhuan pēngrèn. Tā zuò hěn duō měiwèi de càiyáo."
      },
      {
        vietnamese: "Bạn tôi, Hoa, thích chụp ảnh. Cô ấy có một chiếc máy ảnh rất tốt.",
        chinese: "我的朋友，花，喜欢摄影。她有一台很好的相机。",
        pinyin: "Wǒ de péngyou, Huā, xǐhuan shèyǐng. Tā yǒu yì tái hěn hǎo de xiàngjī."
      },
      {
        vietnamese: "Bạn tôi, Nam, thích du lịch. Anh ấy đã đi nhiều nước.",
        chinese: "我的朋友，南，喜欢旅行。他去过很多国家。",
        pinyin: "Wǒ de péngyou, Nán, xǐhuan lǚxíng. Tā qùguò hěn duō guójiā."
      },
      {
        vietnamese: "Tôi cũng thích đọc sách. Tôi đọc sách mỗi tối trước khi ngủ.",
        chinese: "我也喜欢读书。我每晚睡觉前读书。",
        pinyin: "Wǒ yě xǐhuan dú shū. Wǒ měi wǎn shuìjiào qián dú shū."
      },
      {
        vietnamese: "Sở thích giúp cuộc sống của chúng ta thú vị hơn.",
        chinese: "爱好使我们的生活更有趣。",
        pinyin: "Àihào shǐ wǒmen de shēnghuó gèng yǒuqù."
      },
      {
        vietnamese: "Bạn có sở thích gì? Bạn thích làm gì trong thời gian rảnh?",
        chinese: "你有什么爱好？你闲暇时喜欢做什么？",
        pinyin: "Nǐ yǒu shénme àihào? Nǐ xiánxiá shí xǐhuan zuò shénme?"
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