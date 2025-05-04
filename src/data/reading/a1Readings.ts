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
  },


    // Passage 6: Daily Routine
    {
        id: "a1-06",
        title: {
        vietnamese: "Thời Gian Biểu Hàng Ngày",
        chinese: "每日时间表"
        },
        level: "A1",
        paragraphs: [
        {
            vietnamese: "Tôi thường thức dậy lúc sáu giờ sáng.",
            chinese: "我通常早上六点起床。"
        },
        {
            vietnamese: "Sau đó, tôi đánh răng và rửa mặt.",
            chinese: "然后，我刷牙和洗脸。"
        },
        {
            vietnamese: "Tôi ăn sáng lúc bảy giờ. Tôi thường ăn bánh mì và uống cà phê.",
            chinese: "我七点吃早饭。我通常吃面包和喝咖啡。"
        },
        {
            vietnamese: "Tôi đi làm lúc tám giờ. Công ty tôi không xa nhà.",
            chinese: "我八点去上班。我的公司离家不远。"
        },
        {
            vietnamese: "Tôi làm việc từ chín giờ đến mười hai giờ trưa.",
            chinese: "我从九点工作到中午十二点。"
        },
        {
            vietnamese: "Tôi ăn trưa với đồng nghiệp ở một nhà hàng gần công ty.",
            chinese: "我和同事在公司附近的一家餐厅吃午饭。"
        },
        {
            vietnamese: "Buổi chiều, tôi làm việc từ một giờ đến năm giờ.",
            chinese: "下午，我从一点工作到五点。"
        },
        {
            vietnamese: "Sau khi tan làm, tôi đi mua sắm hoặc gặp bạn bè.",
            chinese: "下班后，我去购物或见朋友。"
        },
        {
            vietnamese: "Tôi ăn tối lúc bảy giờ tối ở nhà.",
            chinese: "我晚上七点在家吃晚饭。"
        },
        {
            vietnamese: "Tôi thích xem tivi một chút trước khi đi ngủ.",
            chinese: "我喜欢在睡觉前看一会儿电视。"
        },
        {
            vietnamese: "Tôi thường đi ngủ vào lúc mười một giờ đêm.",
            chinese: "我通常晚上十一点睡觉。"
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
        chinese: "问路"
        },
        level: "A1",
        paragraphs: [
        {
            vietnamese: "Xin lỗi, tôi bị lạc. Bạn có thể giúp tôi không?",
            chinese: "对不起，我迷路了。你能帮我吗？"
        },
        {
            vietnamese: "Vâng, tôi có thể giúp bạn. Bạn muốn đi đâu?",
            chinese: "是的，我可以帮你。你想去哪里？"
        },
        {
            vietnamese: "Tôi muốn đến bệnh viện. Bệnh viện ở đâu?",
            chinese: "我想去医院。医院在哪里？"
        },
        {
            vietnamese: "Bệnh viện ở gần đây. Đi thẳng hai trăm mét.",
            chinese: "医院就在附近。直走两百米。"
        },
        {
            vietnamese: "Sau đó rẽ phải ở ngã tư.",
            chinese: "然后在十字路口向右转。"
        },
        {
            vietnamese: "Đi thêm một trăm mét nữa.",
            chinese: "再走一百米。"
        },
        {
            vietnamese: "Bệnh viện sẽ ở bên tay trái của bạn, đối diện với cửa hàng lớn.",
            chinese: "医院就在你的左边，对面是一家大商店。"
        },
        {
            vietnamese: "Bạn có thể đi bộ đến đó trong khoảng năm phút.",
            chinese: "你可以步行到那里，大约需要五分钟。"
        },
        {
            vietnamese: "Hoặc bạn có thể đi taxi, nhưng không cần thiết vì rất gần.",
            chinese: "或者你可以乘出租车，但没有必要，因为很近。"
        },
        {
            vietnamese: "Cảm ơn bạn rất nhiều. Bạn thật tốt.",
            chinese: "非常感谢你。你真好。"
        },
        {
            vietnamese: "Không có gì. Chúc bạn may mắn!",
            chinese: "不客气。祝你好运！"
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
        chinese: "与朋友相约"
        },
        level: "A1",
        paragraphs: [
        {
            vietnamese: "Chào Lan, cuối tuần này bạn có rảnh không?",
            chinese: "你好兰，这个周末你有空吗？"
        },
        {
            vietnamese: "Chào Hải. Có, tôi rảnh vào thứ bảy. Tại sao bạn hỏi vậy?",
            chinese: "你好海。有，我周六有空。你为什么问？"
        },
        {
            vietnamese: "Tôi muốn mời bạn đi xem phim. Có một bộ phim mới rất hay.",
            chinese: "我想邀请你去看电影。有一部新电影很好看。"
        },
        {
            vietnamese: "Nghe có vẻ thú vị! Phim chiếu lúc mấy giờ?",
            chinese: "听起来很有趣！电影几点开始？"
        },
        {
            vietnamese: "Phim bắt đầu lúc bảy giờ tối thứ bảy.",
            chinese: "电影周六晚上七点开始。"
        },
        {
            vietnamese: "Chúng ta gặp nhau ở đâu?",
            chinese: "我们在哪里见面？"
        },
        {
            vietnamese: "Chúng ta có thể gặp nhau ở quán cà phê gần rạp chiếu phim lúc sáu giờ.",
            chinese: "我们可以在电影院附近的咖啡馆六点见面。"
        },
        {
            vietnamese: "Tốt, vậy trước khi xem phim, chúng ta có thể uống cà phê và nói chuyện.",
            chinese: "好的，这样看电影前，我们可以喝咖啡和聊天。"
        },
        {
            vietnamese: "Đúng vậy. Sau phim, chúng ta có thể đi ăn tối nếu bạn muốn.",
            chinese: "是的。电影之后，如果你想，我们可以去吃晚餐。"
        },
        {
            vietnamese: "Đó là ý kiến hay! Tôi sẽ gặp bạn vào thứ bảy.",
            chinese: "那是个好主意！我周六见你。"
        },
        {
            vietnamese: "Tuyệt! Hẹn gặp lại sau.",
            chinese: "太好了！回头见。"
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
        chinese: "描述一个人"
        },
        level: "A1",
        paragraphs: [
        {
            vietnamese: "Đây là bạn tôi, Minh. Anh ấy là giáo viên tiếng Anh.",
            chinese: "这是我的朋友，明。他是英语老师。"
        },
        {
            vietnamese: "Minh hai mươi tám tuổi. Anh ấy cao và gầy.",
            chinese: "明二十八岁。他又高又瘦。"
        },
        {
            vietnamese: "Anh ấy có mái tóc đen và ngắn. Mắt anh ấy màu nâu.",
            chinese: "他有一头黑色短发。他的眼睛是棕色的。"
        },
        {
            vietnamese: "Minh rất thông minh và vui tính. Anh ấy luôn mỉm cười.",
            chinese: "明很聪明也很幽默。他总是微笑。"
        },
        {
            vietnamese: "Anh ấy thích đọc sách và học ngôn ngữ mới.",
            chinese: "他喜欢读书和学习新语言。"
        },
        {
            vietnamese: "Minh nói được ba thứ tiếng: tiếng Việt, tiếng Anh và tiếng Trung.",
            chinese: "明会说三种语言：越南语，英语和中文。"
        },
        {
            vietnamese: "Anh ấy cũng thích nấu ăn. Anh ấy nấu món Việt Nam rất ngon.",
            chinese: "他也喜欢烹饪。他做的越南菜很好吃。"
        },
        {
            vietnamese: "Vào cuối tuần, Minh thích đi leo núi và chụp ảnh.",
            chinese: "在周末，明喜欢去爬山和拍照。"
        },
        {
            vietnamese: "Anh ấy là người bạn tốt. Anh ấy luôn giúp đỡ mọi người.",
            chinese: "他是一个好朋友。他总是帮助别人。"
        },
        {
            vietnamese: "Tôi rất vui khi có một người bạn như Minh.",
            chinese: "我很高兴有一个像明这样的朋友。"
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
        chinese: "爱好"
        },
        level: "A1",
        paragraphs: [
        {
            vietnamese: "Mọi người có nhiều sở thích khác nhau.",
            chinese: "人们有许多不同的爱好。"
        },
        {
            vietnamese: "Tôi thích chơi thể thao. Tôi đá bóng mỗi cuối tuần.",
            chinese: "我喜欢运动。我每个周末踢足球。"
        },
        {
            vietnamese: "Em gái tôi thích vẽ tranh. Cô ấy vẽ rất đẹp.",
            chinese: "我妹妹喜欢画画。她画得很漂亮。"
        },
        {
            vietnamese: "Anh trai tôi thích nghe nhạc. Anh ấy cũng biết chơi đàn piano.",
            chinese: "我哥哥喜欢听音乐。他也会弹钢琴。"
        },
        {
            vietnamese: "Mẹ tôi thích làm vườn. Bà ấy trồng nhiều loại hoa và rau.",
            chinese: "我妈妈喜欢园艺。她种植各种花卉和蔬菜。"
        },
        {
            vietnamese: "Bố tôi thích nấu ăn. Ông ấy nấu nhiều món ăn ngon.",
            chinese: "我爸爸喜欢烹饪。他做很多美味的菜肴。"
        },
        {
            vietnamese: "Bạn tôi, Hoa, thích chụp ảnh. Cô ấy có một chiếc máy ảnh rất tốt.",
            chinese: "我的朋友，花，喜欢摄影。她有一台很好的相机。"
        },
        {
            vietnamese: "Bạn tôi, Nam, thích du lịch. Anh ấy đã đi nhiều nước.",
            chinese: "我的朋友，南，喜欢旅行。他去过很多国家。"
        },
        {
            vietnamese: "Tôi cũng thích đọc sách. Tôi đọc sách mỗi tối trước khi ngủ.",
            chinese: "我也喜欢读书。我每晚睡觉前读书。"
        },
        {
            vietnamese: "Sở thích giúp cuộc sống của chúng ta thú vị hơn.",
            chinese: "爱好使我们的生活更有趣。"
        },
        {
            vietnamese: "Bạn có sở thích gì? Bạn thích làm gì trong thời gian rảnh?",
            chinese: "你有什么爱好？你闲暇时喜欢做什么？"
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