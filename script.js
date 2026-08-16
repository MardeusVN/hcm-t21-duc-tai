/* ============================================================
   NỘI DUNG NHÓM ĐIỀN, chỉ sửa trong khối này, không cần đụng
   phần logic bên dưới.

   TRẠNG THÁI NỘI DUNG (2026-08-16):
   - Tình huống 3 & 4 (owner C, Hưng): lấy nguyên văn từ "PHẦN C:
     BẢN CHỐT" trong Group 7 - HCM202.docx. Đây là số liệu ĐÃ CHỐT
     của nhóm, không tự sửa.
   - Tình huống 1, 2 (owner B, Minh) và 5, 6 (owner D, Huân):
     tài liệu gốc chấm điểm bằng thang khác (Tình huống 1–2 dùng
     "Điểm Đức X/5, Điểm Tài Y/5"; Tình huống 5–6 dùng các hạng mục
     riêng như "Chính trực", "Tiến độ ngắn hạn", "Liêm chính"...).
     Các delta Đức/Tài dưới đây là BẢN NHÁP do Claude quy đổi sang
     cùng thang ±2 khi tệ/tốt nhất, ±1/0 ở mức giữa, giữ đúng chiều
     hướng mà tài liệu mô tả (án phạt nặng nhất -> -2, án tốt nhất
     -> +2). B và D cần rà lại và xác nhận trước khi coi là chính
     thức, nếu đổi, phải tính lại 729 đường chơi và ngưỡng bên dưới.
   ============================================================ */

// SCREEN 0
const SITE_TITLE = "Đức hay Tài: Cái nào quan trọng hơn?";
const VOTE_QUESTION_INTRO =
  "Bạn sẽ trải qua 6 tình huống ở ba tầng: sinh viên, nghề nghiệp và quyền lực. " +
  "Mỗi lựa chọn tác động đến hai trục điểm riêng, Đức và Tài, dựa trên luận điểm " +
  "của giáo trình: “đạo đức là tiêu chuẩn cho mục đích hành động, còn tài là phương " +
  "tiện thực hiện mục đích đó” (trang 136). Không có lựa chọn nào tuyệt đối đúng hay sai, " +
  "hãy chọn theo điều bạn tin, rồi xem kết quả nói gì về bạn.";

// Tên hiển thị cho từng tầng (dùng ở Screen 1 và bảng trích dẫn Screen 3).
const LAYER_NAMES = {
  sinh_vien: "Tầng sinh viên",
  nghe_nghiep: "Tầng nghề nghiệp",
  quyen_luc: "Tầng quyền lực",
};

// Modal "Những lý thuyết cần nắm vững": ở Screen 0 bấm nút Đức/Tài (A), ở Screen 1
// bấm vào layer-label (B/C/D), ở Screen 2 bấm nút Kết luận (E). Script CỐ TÌNH viết
// ngắn (~300-400 ký tự/điểm, ~20-25 giây đọc) vì showcase chỉ có 15-20 phút cho cả
// trình bày lẫn defense; người nói chỉ cần trích đúng câu + 1 câu áp dụng, không cần
// đọc nguyên văn. Object này gộp chung các trigger không gắn với 1 tình huống cụ
// thể (A/E); LAYER_THEORY bên dưới là loại gắn với tình huống (B/C/D).
const OPENING_THEORY = {
  duc: [
    {
      title: "Đức",
      source: "trang 134–137",
      script:
        "Giáo trình ví con người như cây, như sông: “không có đạo đức thì dù tài giỏi " +
        "mấy cũng không lãnh đạo được nhân dân” (trang 134–135). Đức là phẩm chất, là " +
        "mục đích đúng đắn của hành động: “đạo đức là tiêu chuẩn cho mục đích hành động” " +
        "(trang 136). Trang 137: “Đức là gốc, là trước hết”, nghĩa là nền tảng, không " +
        "phải để thay thế Tài.",
    },
  ],
  tai: [
    {
      title: "Tài",
      source: "trang 136–137",
      script:
        "Tài trả lời câu hỏi: mình có làm được việc đó tốt hay không? Trang 136: “tài là " +
        "phương tiện thực hiện mục đích đó; thiếu tài thì làm việc gì cũng khó, thiếu đạo " +
        "đức thì vô dụng, thậm chí có hại.” Trang 137 nói thẳng: Tài “cực kỳ quan trọng, " +
        "không có tài thì không xây dựng, phát triển được đất nước.” Vì vậy trò chơi chấm " +
        "hai trục Đức và Tài độc lập, không gộp chung.",
    },
  ],
  // E, kết luận, trang 153-157: gắn vào nút "Kết luận" ở Screen 2 (trang kết quả).
  ket_luan: [
    {
      title: "Thực trạng đạo đức hiện nay",
      source: "trang 153",
      script:
        "Trang 153: đạo đức xã hội hiện nay có cả hai mặt. Tích cực: phần lớn sinh viên " +
        "vẫn nhân hậu, trong sạch, cần cù, sáng tạo, có chí lập thân lập nghiệp. Tiêu cực: " +
        "một bộ phận suy thoái tư tưởng chính trị, đạo đức, xuất hiện chủ nghĩa cá nhân, " +
        "bệnh cơ hội, quan liêu, tham nhũng. Nhìn lại kết quả cả lớp vừa chọn, các bạn " +
        "đang ở nhóm nào?",
    },
    {
      title: "Liên hệ sinh viên: Học để làm gì? Học để phục vụ ai?",
      source: "trang 153–157",
      script:
        "Một bộ phận sinh viên phai nhạt lý tưởng, chạy theo lối sống thực dụng, thiếu " +
        "trách nhiệm. Câu hỏi khép lại hôm nay: “Học để làm gì? Học để phục vụ ai?” Đức " +
        "là gốc định hướng hành động, Tài là năng lực biến mục tiêu thành kết quả thật. " +
        "Sinh viên tốt không chỉ giỏi, mà còn trung thực và có trách nhiệm.",
    },
  ],
};

// B/C/D, mỗi tầng gắn với 2 tình huống, 2 điểm lý thuyết.
const LAYER_THEORY = {
  sinh_vien: [
    {
      title: "Xây đi đôi với chống, lấy xây làm chính",
      source: "trang 146",
      script:
        "Trang 146: “xây phải đi đôi với chống, muốn xây phải chống, chống nhằm mục đích " +
        "xây, lấy xây làm chính.” Ở tình huống 2, im lặng bao che là “xây” không “chống”; " +
        "tố cáo gay gắt là “chống” không “xây”; trao đổi thẳng thắn rồi báo minh bạch mới " +
        "đúng là xây đi đôi với chống, nên được điểm cao nhất.",
    },
    {
      title: "Thanh niên phải có đức, có tài",
      source: "trang 157",
      script:
        "Hồ Chí Minh mong muốn: “Thanh niên phải có đức, có tài” (trang 157). Ở tình " +
        "huống 1, copy đồ án để đúng hạn là “tài” giả vì đến từ gian dối. Xin gia hạn và " +
        "tự làm dù nộp trễ mới là có đức thật (trung thực) và có tài thật (năng lực của " +
        "chính mình), nên được điểm cao nhất cả hai trục.",
    },
  ],
  nghe_nghiep: [
    {
      title:
        "Đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện thực hiện mục đích đó",
      source: "trang 136",
      script:
        "Trang 136: “đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện " +
        "thực hiện mục đích đó.” Ở tình huống 3, im lặng được Tài cao nhất vì thực tế đạt " +
        "kết quả tốt theo thước đo tổ chức. Nhưng đạo đức Hồ Chí Minh lấy hiệu quả thực " +
        "tế làm thước đo: im lặng cũng là hành động, và hậu quả thật là mười hai nghìn " +
        "người mất dữ liệu.",
    },
    {
      title: "Đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống nhất làm một",
      source: "trang 136",
      script:
        "Trang 136: “đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống nhất " +
        "làm một.” Tình huống 4 là tình huống duy nhất mà làm giỏi hơn thì hại nhiều hơn: " +
        "viết code càng hiệu quả, càng nhiều học sinh mất ngủ. Chuyên môn không tách rời " +
        "được đạo đức, chỉ có phương án vừa nhận làm vừa đo tác hại mới tạo ra thay đổi " +
        "thật.",
    },
  ],
  quyen_luc: [
    {
      title: "Vừa hiền lại vừa minh",
      source: "trang 92",
      script:
        "Trang 92: “để làm người thay mặt nhân dân phải gồm đủ cả đức và tài, phải vừa " +
        "hiền lại vừa minh.” Hiền là đức, Minh là tài. Tình huống 5: chọn An là chọn minh " +
        "bỏ hiền (giỏi nhưng thao túng báo cáo); chọn Bình là chọn hiền bớt minh (trung " +
        "thực nhưng chậm). Chọn cả hai và giám sát chặt mới gần đúng tinh thần vừa hiền " +
        "vừa minh.",
    },
    {
      title: "Cần – Kiệm – Liêm – Chính, Chí công vô tư",
      source: "trang 141–143",
      script:
        "Trang 141-143: Liêm là trong sạch, không tham địa vị tiền tài, “chỉ có một thứ " +
        "ham là ham học, ham làm, ham tiến bộ.” Trang 141-142 cảnh báo: “có quyền mà thiếu " +
        "lương tâm là có dịp đục khoét, có dịp dĩ công vi tư.” Tình huống 6: tự ý dùng quỹ " +
        "nhóm dù định trả lại vẫn là lẫn lộn công tư; không đụng quỹ mới giữ đúng tinh " +
        "thần Liêm.",
    },
  ],
};

// SCREEN 1, 6 tình huống, đúng thứ tự & người phụ trách ở bảng mục 2 của spec.
// Nguyên tắc thang điểm: mỗi lựa chọn tác động MẠNH 1 trục (+2/-2) và
// NHẸ/TRUNG TÍNH trục còn lại (-1/0/+1) để tạo đánh đổi thật giữa Đức và Tài.
const SCENARIOS = [
  {
    id: 1,
    layer: "sinh_vien",
    owner: "B",
    title: "Deadline & cám dỗ copy đồ án",
    stimulus:
      "Còn 12 tiếng nữa hết hạn nộp đồ án. Sản phẩm bạn chưa xong. Một anh khóa trên " +
      "gửi file gần giống đề bài, chỉ cần sửa vài chỗ là “qua”.",
    choices: [
      {
        text: "Copy & sửa nhanh để nộp đúng hạn",
        deltaDuc: -2,
        deltaTai: -2,
        feedback:
          "Nộp đúng giờ, nhưng là gian dối học thuật. Nếu bị phát hiện, bạn nhận điểm 0 " +
          "hoặc bị kỷ luật, và không có năng lực thật đứng sau.",
        source: "trang 146",
      },
      {
        text: "Xin gia hạn, tự làm dù nộp trễ",
        deltaDuc: 2,
        deltaTai: 1,
        feedback:
          "Bạn xin giảng viên thêm thời gian, rồi tự làm bằng năng lực thật. Có thể bị " +
          "trừ điểm trễ hạn, nhưng giữ được liêm chính và sản phẩm là của chính mình.",
        source: "trang 146",
      },
      {
        text: "Thức trắng đêm, chắp vá nhiều nguồn không dẫn nguồn",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn ghép nội dung từ nhiều nguồn và AI mà không trích dẫn. Nộp đúng hạn " +
          "nhưng chất lượng rời rạc, có nguy cơ đạo văn, và hiểu bài hời hợt khi bị hỏi.",
        source: "trang 146",
      },
    ],
    insight:
      "Trung thực và tự chịu trách nhiệm quan trọng hơn đúng hạn hình thức, đúng hạn " +
      "bằng gian dối vẫn chỉ là “tài” giả (trang 146).",
  },
  {
    id: 2,
    layer: "sinh_vien",
    owner: "B",
    title: "Bạn cùng nhóm free-riding",
    stimulus:
      "Gần nộp đồ án, bạn phát hiện một bạn trong nhóm không đóng góp gì suốt 3 tuần, " +
      "nhưng vẫn đứng tên đầy đủ trong báo cáo.",
    choices: [
      {
        text: "Im lặng, tự gánh phần việc còn lại",
        deltaDuc: -1,
        deltaTai: -1,
        feedback:
          "Bạn âm thầm làm bù, nhóm “êm đẹp” trước mắt. Nhưng bất công kéo dài, bạn quá " +
          "tải, và bạn free-riding không hề thay đổi.",
        source: "trang 147",
      },
      {
        text: "Trao đổi thẳng thắn, rồi báo cáo minh bạch với nhóm kèm đề xuất khắc phục",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn góp ý riêng trước, rồi báo minh bạch với nhóm nếu không cải thiện. Bạn " +
          "free-riding có cơ hội sửa sai, nhóm công bằng hơn.",
        source: "trang 157",
      },
      {
        text: "Tố cáo gay gắt trên nhóm chat chung, quy chụp nặng nề",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn công khai chỉ trích ngay, khiến bạn ấy mất mặt trước cả nhóm. Vấn đề được " +
          "nêu ra, nhưng nhóm mất đoàn kết, ảnh hưởng tinh thần chung.",
        source: "trang 147",
      },
    ],
    insight:
      "Bao che là “xây” không “chống”; tố cáo gay gắt là “chống” không “xây”. Đúng tinh " +
      "thần trang 146 là chống để xây.",
  },
  {
    id: 3,
    layer: "nghe_nghiep",
    owner: "C",
    title: "Hai ngày trước release",
    stimulus:
      "Bạn là developer, team 8 người, sắp ra bản lớn nhất năm (ảnh hưởng thưởng quý cả " +
      "phòng). Bạn phát hiện lỗi phân quyền: sửa một tham số là xem được dữ liệu cá nhân " +
      "người khác. Vá đúng cách mất 5 ngày, phải dời ngày phát hành. Sáng nay quản lý vừa " +
      "nói “đừng vẽ thêm việc”. Chỉ mình bạn biết lỗ hổng này.",
    choices: [
      {
        text: "Im lặng, để bản phát hành ra đúng lịch",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bản phát hành thành công, cả phòng nhận thưởng. Nhưng 4 tháng sau, dữ liệu " +
          "của 12.000 người dùng bị khai thác đúng lỗ hổng đó, công ty gọi là sự cố ngoài " +
          "ý muốn, không ai truy được về bạn.",
        source: "trang 136",
      },
      {
        text: "Viết báo cáo gửi quản lý và trưởng nhóm kỹ thuật",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Ngày phát hành dời 2 tuần, cả phòng mất thưởng, bạn bị xem là người “gây " +
          "chuyện”. Nhưng vấn đề giờ có ngày giờ, có người nhận, thành trách nhiệm của " +
          "tổ chức.",
        source: "trang 136",
      },
      {
        text: "Thức đêm tự vá tạm, không báo ai",
        deltaDuc: 0,
        deltaTai: 1,
        feedback:
          "Bạn vá kịp, không ai mất thưởng, không ai biết chuyện gì xảy ra. Nhưng quy " +
          "trình để lọt lỗ hổng vẫn nguyên vẹn, 6 tháng sau lỗi cùng loại xuất hiện ở " +
          "phần khác, lần này người phát hiện không thức đêm như bạn.",
        source: "trang 144",
      },
    ],
    insight:
      "Ba lựa chọn trên đều có cái giá thật. Điều khác nhau là ai trả cái giá đó: người dùng, " +
      "cả team, hay chính bạn và người đến sau.",
  },
  {
    id: 4,
    layer: "nghe_nghiep",
    owner: "C",
    title: "Chỉ số phải tăng",
    stimulus:
      "Bạn được giao xây tính năng tăng thời gian dùng app: thông báo giờ khuya, đẩy nội " +
      "dung gây tranh cãi lên đầu, làm chậm thao tác thoát. Kết quả thử nghiệm: thời gian " +
      "dùng tăng 22%, riêng nhóm dưới 18 tuổi tăng gấp đôi. Không bất hợp pháp, không lộ " +
      "dữ liệu. Bạn viết mã, không phải người ra quyết định.",
    choices: [
      {
        text: "Triển khai đúng thiết kế, làm tốt nhất có thể",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bạn làm xuất sắc, được cân nhắc thăng chức. Một năm sau, bạn đọc bài báo về " +
          "mất ngủ ở học sinh cấp ba, có người kể đúng trải nghiệm thuật toán của bạn " +
          "tạo ra. Làm kém hơn thì ít người bị ảnh hưởng hơn.",
        source: "trang 136",
      },
      {
        text: "Từ chối làm, xin chuyển sang nhiệm vụ khác",
        deltaDuc: 1,
        deltaTai: -1,
        feedback:
          "Bạn chuyển sang bảo trì. Tính năng vẫn ra mắt, người làm thay thiếu kinh " +
          "nghiệm nên còn dồn dập hơn thiết kế gốc. Bạn giữ tay sạch, nhưng không còn ở " +
          "đó để lên tiếng nữa.",
        source: "trang 136",
      },
      {
        text: "Nhận làm, đồng thời đo chỉ số tác hại và đề xuất giới hạn",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn mất thêm 2 tuần, bị hỏi vì sao chậm. Đề xuất bị cắt còn một nửa: chỉ tắt " +
          "thông báo khuya cho tài khoản dưới 18 tuổi. Không phải chiến thắng, nhưng là " +
          "thay đổi thật duy nhất, vì bạn có số liệu.",
        source: "trang 136",
      },
    ],
    insight:
      "Tình huống duy nhất mà làm giỏi hơn thì hại nhiều hơn. Nếu chuyên môn tách rời " +
      "được đạo đức, phương án A phải trung tính, nhưng nó không hề trung tính.",
  },
  {
    id: 5,
    layer: "quyen_luc",
    owner: "D",
    title: "Ai sẽ vào nhóm nòng cốt?",
    stimulus:
      "Bạn làm trưởng nhóm, chỉ chọn một người làm phó. An giỏi chuyên môn nhưng từng " +
      "“lách luật” và hay nói quá thành tích. Bình năng lực trung bình nhưng luôn nói " +
      "thật, kể cả khi thất bại.",
    choices: [
      {
        text: "Chọn An, ưu tiên năng lực, bỏ qua tư cách",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Dự án ban đầu chạy nhanh, nhưng An dần thao túng báo cáo, che giấu rủi ro " +
          "thật. Sai lầm bị giấu kín sẽ bùng phát nặng nề hơn nhiều so với phát hiện sớm.",
        source: "trang 92",
      },
      {
        text: "Chọn Bình, ưu tiên trung thực, bỏ qua năng lực",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Nhóm chạy chậm hơn vì Bình cần thời gian học hỏi, nhưng báo cáo chính xác, " +
          "vấn đề phát hiện sớm, nhóm phát triển bền vững hơn.",
        source: "trang 141",
      },
      {
        text: "Chọn cả hai, phân vai rõ ràng và giám sát An chặt",
        deltaDuc: 1,
        deltaTai: 1,
        feedback:
          "Nhóm vừa có tốc độ từ An, vừa có độ tin cậy nhờ Bình giám sát chéo. Tốn công " +
          "sức quản lý hơn, nhưng đạt kết quả cân bằng nhất.",
        source: "trang 141",
      },
    ],
    insight:
      "“Vừa hiền lại vừa minh” (trang 92): nếu chỉ có “minh” mà thiếu “hiền”, tài năng " +
      "có thể trở thành công cụ gây hại.",
  },
  {
    id: 6,
    layer: "quyen_luc",
    owner: "D",
    title: "Quỹ nhóm trong tay bạn",
    stimulus:
      "Bạn giữ quỹ chung nhóm (2 triệu đồng). Phút cuối, bạn phát hiện có thể “linh " +
      "động” chi 300.000đ cho việc cá nhân mà gần như chắc chắn không ai biết, vì bạn " +
      "là người duy nhất nắm sổ.",
    choices: [
      {
        text: "Tự ý dùng 300.000đ, định bụng “trả lại sau”",
        deltaDuc: -2,
        deltaTai: 0,
        feedback:
          "Việc cá nhân giải quyết ngay, nhưng đến lúc cần chi vật tư thì quỹ thiếu " +
          "hụt, nhóm bị động. Dù hoàn trả đủ, niềm tin nhóm đã rạn nứt khi sự việc lộ ra.",
        source: "trang 141",
      },
      {
        text: "Không đụng đến quỹ, tự xoay xở việc cá nhân bằng cách khác",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Việc cá nhân giải quyết chậm hơn, nhưng quỹ nhóm nguyên vẹn, minh bạch tuyệt " +
          "đối. Nhóm tín nhiệm giao bạn quản lý quỹ lớn hơn sau này.",
        source: "trang 141",
      },
      {
        text: "Chủ động hỏi ý kiến cả nhóm trước khi dùng, công khai minh bạch mục đích",
        deltaDuc: 1,
        deltaTai: 0,
        feedback:
          "Mất thêm thời gian trao đổi, nhưng chi tiêu trở thành quyết định tập thể, " +
          "không phải hành vi đơn phương. Không có ai bị “qua mặt”.",
        source: "trang 142",
      },
    ],
    insight:
      "Trang 141–142: “có quyền mà thiếu lương tâm là có dịp dĩ công vi tư.” Liêm không " +
      "phải là không có nhu cầu cá nhân, mà là không lợi dụng vị trí được giao để giải " +
      "quyết nhu cầu đó.",
  },
];

// SCREEN 2, Ngưỡng phân loại (BẢN NHÁP, xem cảnh báo ở đầu file).
// Với bộ delta hiện tại: biên độ Đức chạy -11..+12, biên độ Tài chạy -7..+9.
// Áp dụng đúng nguyên tắc nhóm đã chốt ("ngưỡng đặt gần trung điểm biên độ thực
// tế của từng trục"): trung điểm Đức ~0.5 -> ngưỡng 1; trung điểm Tài ~1 -> ngưỡng 1.
// Đây KHÔNG PHẢI ngưỡng "Đức>1, Tài>4" trong tài liệu gốc, con số đó được tính
// từ delta thật của T1,T2,T5,T6 mà nhóm chưa cung cấp ở định dạng Đức/Tài. Khi B/D
// chốt lại delta thật, phải tính lại ngưỡng (khuyến nghị: liệt kê lại toàn bộ 729
// đường chơi như nhóm đã làm với T3/T4).
const THRESHOLD_DUC = 1;
const THRESHOLD_TAI = 1;

const QUADRANTS = {
  vua_hong_vua_chuyen: {
    name: "Vừa hồng vừa chuyên",
    desc:
      "Bạn chọn những phương án khó nhất: vừa giữ được nguyên tắc, vừa không buông kết quả. " +
      "Trong Di chúc, Hồ Chí Minh dặn phải đào tạo thế hệ kế thừa vừa hồng vừa chuyên. Đây là " +
      "kết cục mà giáo trình hướng tới, và cũng tốn công nhất, như bạn vừa thấy qua các tình huống.",
  },
  dang_tin_bat_luc: {
    name: "Đáng tin nhưng bất lực",
    desc:
      "Bạn giữ được mình sạch, nhưng thường chọn cách rút lui khỏi vấn đề thay vì giải quyết " +
      "nó. Giáo trình nói rõ: thiếu tài thì làm việc gì cũng khó (trang 136), và không có tài thì " +
      "không xây dựng, phát triển được đất nước (trang 137). Trung thực là điều kiện cần, chưa " +
      "phải điều kiện đủ.",
  },
  vo_hai_vo_dung: {
    name: "Vô hại vì vô dụng",
    desc:
      "Bạn phần lớn chọn phương án né tránh: không làm sai rõ ràng, nhưng cũng không làm gì. " +
      "Giáo trình gọi đây là bệnh nói suông, thứ mà tư tưởng đạo đức Hồ Chí Minh, vốn lấy " +
      "hiệu quả thực tế làm thước đo, phản đối trực tiếp.",
  },
  nguy_hiem_nhat: {
    name: "Nguy hiểm nhất",
    desc:
      "Bạn đạt kết quả tốt trong hầu hết tình huống, bằng cách bỏ qua cái giá mà người khác " +
      "phải trả. Đây chính là điều giáo trình cảnh báo: thiếu đạo đức thì vô dụng, thậm chí có " +
      "hại (trang 136). Và xin lưu ý: bạn càng giỏi, thiệt hại càng lớn.",
  },
};

// SCREEN 3
const THEORY_SUMMARY =
  "Trò chơi này dựa trên Giáo trình Tư tưởng Hồ Chí Minh dành cho bậc đại học không chuyên, " +
  "chương 6, mục nói về vai trò của đạo đức cách mạng, các trang 135–148. Luận điểm nền: đạo " +
  "đức là tiêu chuẩn cho mục đích hành động, còn tài là phương tiện thực hiện mục đích đó. Con " +
  "người cần cả hai, thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, " +
  "thậm chí có hại. Đó là lý do trò chơi đo hai trục riêng biệt thay vì một thang điểm duy nhất.";

const THEORY_PRINCIPLES =
  "Ba nguyên tắc xây dựng đạo đức cách mạng: (1) Nói đi đôi với làm, nêu gương về đạo đức " +
  "(trang 145), “một tấm gương sống còn có giá trị hơn một trăm bài diễn văn tuyên truyền”; " +
  "(2) Xây đi đôi với chống (trang 146), “xây phải đi đôi với chống, muốn xây phải chống, chống " +
  "nhằm mục đích xây, lấy xây làm chính”; (3) Tu dưỡng đạo đức suốt đời (trang 148), “đạo đức " +
  "cách mạng không phải trên trời sa xuống, nó do đấu tranh, rèn luyện bền bỉ hằng ngày mà " +
  "phát triển và củng cố”.";

const AI_DECLARATION =
  "Nhóm có sử dụng công cụ trí tuệ nhân tạo (Claude, Anthropic) xuyên suốt quá trình xây " +
  "dựng sản phẩm này, với vai trò lớn hơn một công cụ hỗ trợ đơn thuần: tóm tắt và hệ thống " +
  "hóa nội dung giáo trình, soạn nội dung 6 tình huống, viết script thuyết trình chi tiết " +
  "cho cả năm người, soạn 10 câu hỏi ôn tập, tìm trường hợp thực tế để đối chiếu, và viết " +
  "toàn bộ mã nguồn website (HTML, CSS, JavaScript). Điểm số Đức và Tài của bốn trong sáu " +
  "tình huống do AI quy đổi từ thang điểm gốc của nhóm sang thang thống nhất; phần này chưa " +
  "được toàn bộ nhóm xác nhận chính thức. Công cụ không được dùng để tự đặt ra luận điểm " +
  "học thuật ngoài phạm vi giáo trình, và không bịa trích dẫn hay số trang. Toàn bộ trích " +
  "dẫn giáo trình đã được đối chiếu trực tiếp với bản gốc trước khi đưa lên web.";

// Phần B (bảng phân định nội dung web) yêu cầu ghi chú ranh giới hiện ở CẢ trang kết quả
// lẫn trang cơ sở lý luận, tách riêng khỏi AI_DECLARATION để dùng ở cả hai nơi.
const PRODUCT_SCOPE_NOTE =
  "Các tình huống trong trò chơi là mô phỏng do nhóm xây dựng, không phải sự kiện có thật. " +
  "Bảng điểm hai trục và ngưỡng phân loại bốn kết cục là quy ước của nhóm nhằm phân loại kết " +
  "quả, không phải con số lấy từ giáo trình.";

const EXTERNAL_SOURCES = [
  {
    label: "Vụ Joseph Sullivan tại Uber (2016–2022)",
    note:
      "Giám đốc An ninh của Uber trả tin tặc 100.000 đô để giấu vụ rò rỉ dữ liệu của 57 triệu " +
      "người dùng, không báo cơ quan điều tra; bị kết tội cản trở công lý năm 2022. Nguồn: " +
      "thông cáo Bộ Tư pháp Hoa Kỳ.",
  },
  {
    label: "Hồ sơ nghiên cứu nội bộ Instagram (2021)",
    note:
      "Tài liệu nội bộ cho thấy công ty tự nghiên cứu và ghi nhận tác động tiêu cực lên người " +
      "dùng trẻ, rõ nhất ở nhóm nữ thiếu niên về vấn đề hình thể; công ty phản bác cách diễn " +
      "giải này. Nguồn: BBC, Al Jazeera, tài liệu điều trần Hạ viện Hoa Kỳ.",
  },
  {
    label: "Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Việt Nam)",
    note:
      "Có hiệu lực từ 1/1/2026, thay Nghị định 13/2023; mức phạt có thể lên tới 5% doanh thu. " +
      "Nguồn: Thư viện Pháp luật, bản tin pháp lý EY Việt Nam.",
  },
];

// SCREEN 5/6, Ôn tập kiến thức (10 câu trắc nghiệm), truy cập từ nút trên Screen 2.
// Toàn bộ trích dẫn/số trang dưới đây lấy từ Group 7 - HCM202.docx (đã đối chiếu),
// không phải nội dung suy diễn thêm.
const QUIZ_QUESTIONS = [
  {
    question: "Theo giáo trình, đạo đức và tài năng có quan hệ như thế nào?",
    options: [
      "Đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện thực hiện mục đích đó",
      "Đạo đức và tài năng không liên quan đến nhau",
      "Tài năng quan trọng hơn đạo đức trong mọi trường hợp",
      "Đạo đức chỉ cần thiết với cán bộ lãnh đạo, không cần với sinh viên",
    ],
    correct: 0,
    explanation:
      "“Đạo đức là tiêu chuẩn cho mục đích hành động thì tài là phương tiện thực hiện mục " +
      "đích đó” (trang 136).",
  },
  {
    question:
      "Câu “có tài mà không có đạo đức là người vô dụng, thậm chí có hại” nên hiểu như thế nào?",
    options: [
      "Người không có tài thì không thể làm được việc gì",
      "Người có tài nhưng thiếu đạo đức có thể dùng năng lực để gây hại, chứ không chỉ là vô ích",
      "Người có đạo đức thì không cần rèn luyện tài năng nữa",
      "Câu này chỉ áp dụng cho cán bộ, không áp dụng cho sinh viên",
    ],
    correct: 1,
    explanation:
      "Trang 136: thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, thậm " +
      "chí có hại, năng lực bị dùng sai mục đích sẽ gây hại chứ không chỉ đơn thuần vô ích.",
  },
  {
    question: "“Đức là gốc” trong tư tưởng Hồ Chí Minh nghĩa là gì?",
    options: [
      "Chỉ cần có đạo đức là đủ, không cần rèn luyện chuyên môn",
      "Đức và tài là hai thứ tách biệt, không liên quan đến nhau",
      "Đạo đức là nền tảng, định hướng mục đích hành động; tài vẫn cực kỳ quan trọng để thực hiện mục đích đó",
      "Đạo đức quan trọng hơn tài năng nên có thể bỏ qua việc học chuyên môn",
    ],
    correct: 2,
    explanation:
      "Trang 137: “Đức là gốc, là trước hết; tài là cực kỳ quan trọng, không có tài thì " +
      "không xây dựng, phát triển được đất nước.” Chữ “gốc” chỉ thứ tự nền tảng, không phải " +
      "sự thay thế.",
  },
  {
    question:
      "Nguyên tắc xây dựng đạo đức cách mạng nào đối lập trực tiếp với “bệnh nói suông”?",
    options: [
      "Nói đi đôi với làm, nêu gương về đạo đức",
      "Xây đi đôi với chống",
      "Tu dưỡng đạo đức suốt đời",
      "Chí công vô tư",
    ],
    correct: 0,
    explanation:
      "Trang 145: nguyên tắc “nói đi đôi với làm, nêu gương về đạo đức” đối lập hoàn toàn với " +
      "thói đạo đức giả, nói một đằng làm một nẻo.",
  },
  {
    question: "“Xây đi đôi với chống, lấy xây làm chính” (trang 146) nghĩa là gì?",
    options: [
      "Chỉ cần phê phán cái xấu, không cần xây dựng cái tốt",
      "Xây và chống là hai việc tách biệt, làm việc nào trước cũng được",
      "Chỉ áp dụng cho tổ chức Đảng, không áp dụng cho cá nhân",
      "Khơi dậy ý thức đạo đức lành mạnh phải đi liền với chống biểu hiện vô đạo đức, nhưng trọng tâm là xây dựng cái tốt",
    ],
    correct: 3,
    explanation:
      "Trang 146: “Xây phải đi đôi với chống, muốn xây phải chống, chống nhằm mục đích xây, " +
      "lấy xây làm chính.”",
  },
  {
    question: "Theo giáo trình, đạo đức cách mạng được hình thành như thế nào?",
    options: [
      "Có sẵn từ khi sinh ra, không cần rèn luyện",
      "Do đấu tranh, rèn luyện bền bỉ hằng ngày mà phát triển và củng cố",
      "Chỉ hình thành sau khi trở thành cán bộ, đảng viên",
      "Chỉ cần học thuộc lý thuyết là đủ",
    ],
    correct: 1,
    explanation:
      "Trang 148: “Đạo đức cách mạng không phải trên trời sa xuống. Nó do đấu tranh, rèn " +
      "luyện bền bỉ hằng ngày mà phát triển và củng cố. Cũng như ngọc càng mài càng sáng, " +
      "vàng càng luyện càng trong.”",
  },
  {
    question: "Trong trò chơi này, ngưỡng phân loại 4 kết cục được đặt theo nguyên tắc nào?",
    options: [
      "Lấy đúng số liệu ghi trong giáo trình",
      "Chọn ngẫu nhiên cho phân bố đẹp",
      "Đặt gần trung điểm biên độ thực tế của từng trục điểm Đức, Tài",
      "Luôn đặt bằng 0 cho cả hai trục",
    ],
    correct: 2,
    explanation:
      "Ngưỡng là quy ước của nhóm nhằm phân loại kết quả (không lấy từ giáo trình), được đặt " +
      "gần trung điểm biên độ thực tế của mỗi trục, tránh tình trạng phần lớn người chơi dồn " +
      "vào một kết cục duy nhất.",
  },
  {
    question:
      "Kết cục nào trong trò chơi được xem là “nguy hiểm nhất”, và vì sao?",
    options: [
      "Đức cao, Tài thấp, vì không làm được việc gì",
      "Đức thấp, Tài cao, vì năng lực càng giỏi thì thiệt hại gây ra càng lớn",
      "Đức thấp, Tài thấp, vì không đóng góp được gì",
      "Đức cao, Tài cao, vì tốn nhiều công sức nhất",
    ],
    correct: 1,
    explanation:
      "Trang 136: “thiếu đạo đức thì vô dụng, thậm chí có hại”, khi Đức thấp mà Tài cao, " +
      "năng lực bị dùng sai mục đích khiến hậu quả nặng nề hơn, càng giỏi thiệt hại càng lớn.",
  },
  {
    question:
      "Đối với thanh niên trí thức, giáo trình đặt ra câu hỏi liên hệ nào để xác định phương hướng học tập, rèn luyện?",
    options: [
      "“Học ngành nào thì dễ xin việc?”",
      "“Học để có bằng cấp hay để có việc làm tốt?”",
      "“Học để trở thành cán bộ lãnh đạo?”",
      "“Học để làm gì? Học để phục vụ ai?”",
    ],
    correct: 3,
    explanation:
      "Mục thực trạng đạo đức và liên hệ sinh viên (trang 153–157): giáo trình đặt vấn đề " +
      "trực tiếp với thanh niên trí thức “Học để làm gì? Học để phục vụ ai?”, làm cơ sở để mỗi " +
      "người xác định phương hướng học tập và sửa chữa khuyết điểm.",
  },
  {
    question:
      "Trong 5 chuẩn mực “Cần, Kiệm, Liêm, Chính, Chí công vô tư”, chữ “Liêm” được hiểu như thế nào?",
    options: [
      "Chỉ đơn giản là không nhận hối lộ bằng tiền",
      "Trong sạch, không tham địa vị, tiền tài; chỉ ham học, ham làm, ham tiến bộ",
      "Không được có bất kỳ nhu cầu vật chất cá nhân nào",
      "Chỉ áp dụng cho cán bộ cấp cao, không áp dụng cho sinh viên",
    ],
    correct: 1,
    explanation:
      "Trang 141–143: Liêm là trong sạch, không tham địa vị, tiền tài, sung sướng, “chỉ có " +
      "một thứ ham là ham học, ham làm, ham tiến bộ.”",
  },
];

/* ============================================================
   LOGIC, không cần sửa phần dưới đây để điền nội dung.
   ============================================================ */

const state = {
  initialVote: null,
  scenarioIndex: 0,
  totalDuc: 0,
  totalTai: 0,
  answeredCurrent: false,
};

const quizState = {
  index: 0,
  score: 0,
  answered: false,
  wrong: [],
};

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo(0, 0);
}

/* ---------- SCREEN 0 ---------- */
function initScreen0() {
  $("site-title").textContent = SITE_TITLE;
  document.querySelector(".intro-text").textContent = VOTE_QUESTION_INTRO;

  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.initialVote = btn.dataset.vote;
      $("btn-start").disabled = false;
    });
  });

  $("btn-start").addEventListener("click", () => {
    localStorage.setItem("hcm_t21_initialVote", state.initialVote);
    renderScenario();
    showScreen("screen-1");
  });
}

/* ---------- SCREEN 1 ---------- */
function renderScenario() {
  const scenario = SCENARIOS[state.scenarioIndex];
  state.answeredCurrent = false;

  $("layer-label").textContent = LAYER_NAMES[scenario.layer] || "";

  $("progress-label").textContent = `Tình huống ${state.scenarioIndex + 1}/${SCENARIOS.length}`;
  $("progress-fill").style.width = `${((state.scenarioIndex + 1) / SCENARIOS.length) * 100}%`;
  $("stimulus-text").textContent = scenario.stimulus;

  const list = $("choices-list");
  list.innerHTML = "";
  scenario.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleChoice(idx, btn));
    list.appendChild(btn);
  });

  $("feedback-block").classList.add("hidden");
  $("insight-block").classList.add("hidden");
}

/* ---------- Modal "Những lý thuyết cần nắm vững" (dùng chung A/B/C/D) ---------- */
function openTheoryModal(points) {
  const body = $("modal-body");
  body.innerHTML = "";
  (points || []).forEach((point, idx) => {
    const block = document.createElement("div");
    block.className = "theory-point";

    const title = document.createElement("h4");
    title.className = "theory-point-title";
    title.textContent = points.length > 1 ? `${idx + 1}. ${point.title} ` : `${point.title} `;
    const source = document.createElement("span");
    source.className = "theory-point-source";
    source.textContent = `(${point.source})`;
    title.appendChild(source);

    const script = document.createElement("p");
    script.className = "theory-point-script";
    script.textContent = point.script;

    block.appendChild(title);
    block.appendChild(script);
    body.appendChild(block);
  });

  $("theory-modal").classList.remove("hidden");
}

function closeTheoryModal() {
  $("theory-modal").classList.add("hidden");
  $("layer-label") && $("layer-label").setAttribute("aria-expanded", "false");
}

$("layer-label") && $("layer-label").addEventListener("click", () => {
  const scenario = SCENARIOS[state.scenarioIndex];
  openTheoryModal(LAYER_THEORY[scenario.layer]);
  $("layer-label").setAttribute("aria-expanded", "true");
});

document.querySelectorAll(".theory-trigger").forEach((btn) => {
  btn.addEventListener("click", () => {
    openTheoryModal(OPENING_THEORY[btn.dataset.theoryKey]);
  });
});

$("modal-close") && $("modal-close").addEventListener("click", closeTheoryModal);
$("theory-modal") && $("theory-modal").addEventListener("click", (e) => {
  if (e.target.id === "theory-modal") closeTheoryModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("theory-modal").classList.contains("hidden")) closeTheoryModal();
});

function handleChoice(idx, btnEl) {
  if (state.answeredCurrent) return;
  state.answeredCurrent = true;

  const scenario = SCENARIOS[state.scenarioIndex];
  const choice = scenario.choices[idx];

  document.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
  btnEl.classList.add("chosen");

  state.totalDuc += choice.deltaDuc;
  state.totalTai += choice.deltaTai;

  $("feedback-text").textContent = choice.feedback;
  $("delta-duc").textContent = `Đức: ${choice.deltaDuc >= 0 ? "+" : ""}${choice.deltaDuc}`;
  $("delta-tai").textContent = `Tài: ${choice.deltaTai >= 0 ? "+" : ""}${choice.deltaTai}`;
  $("feedback-source").textContent = choice.source ? `Nguồn: ${choice.source}` : "";
  $("feedback-block").classList.remove("hidden");

  $("insight-text").textContent = scenario.insight;
  $("btn-next-scenario").textContent =
    state.scenarioIndex === SCENARIOS.length - 1 ? "Xem kết quả" : "Tình huống tiếp theo";
  $("insight-block").classList.remove("hidden");
}

$("btn-next-scenario") && $("btn-next-scenario").addEventListener("click", () => {
  if (state.scenarioIndex === SCENARIOS.length - 1) {
    renderResult();
    showScreen("screen-2");
  } else {
    state.scenarioIndex += 1;
    renderScenario();
  }
});

/* ---------- SCREEN 2 ---------- */
function classify(totalDuc, totalTai) {
  const goodDuc = totalDuc > THRESHOLD_DUC;
  const goodTai = totalTai > THRESHOLD_TAI;
  if (goodDuc && goodTai) return "vua_hong_vua_chuyen";
  if (goodDuc && !goodTai) return "dang_tin_bat_luc";
  if (!goodDuc && !goodTai) return "vo_hai_vo_dung";
  return "nguy_hiem_nhat";
}

function renderResult() {
  const key = classify(state.totalDuc, state.totalTai);
  const quadrant = QUADRANTS[key];

  $("quadrant-name").textContent = quadrant.name;
  $("quadrant-desc").textContent = quadrant.desc;

  document.querySelectorAll(".quad-bg").forEach((el) => el.classList.remove("quad-active"));
  const activeQuad = document.querySelector(`.quad-bg[data-quad="${key}"]`);
  activeQuad && activeQuad.classList.add("quad-active");

  const initialVote = state.initialVote || localStorage.getItem("hcm_t21_initialVote");
  const voteLabel = initialVote === "tai" ? "Tài" : "Đức";
  $("vote-compare").textContent = `Đầu game bạn chọn: ${voteLabel}. Kết quả cuối: ${quadrant.name}.`;
  $("scope-note-result").textContent = PRODUCT_SCOPE_NOTE;

  // Vẽ chấm kết quả trên biểu đồ SVG (viewBox 300x300, tâm 150,150).
  // Biên độ thực tế hiện tại: Đức -11..+12, Tài -7..+9 (đều nằm trong ±12).
  // Thang điểm mỗi trục tối đa ±12 (6 tình huống x ±2) → scale = 120/12 = 10px/điểm.
  const SCALE = 10;
  const clampedDuc = Math.max(-12, Math.min(12, state.totalDuc));
  const clampedTai = Math.max(-12, Math.min(12, state.totalTai));
  const cx = 150 + clampedTai * SCALE;
  const cy = 150 - clampedDuc * SCALE;
  $("result-dot").setAttribute("cx", cx);
  $("result-dot").setAttribute("cy", cy);
}

$("btn-view-reference") && $("btn-view-reference").addEventListener("click", () => {
  renderReference();
  showScreen("screen-3");
});

// Footer AI Declaration link, hoạt động từ bất kỳ màn hình nào (screen 0/1/2/4).
$("footer-ai-link") && $("footer-ai-link").addEventListener("click", (e) => {
  e.preventDefault();
  renderReference();
  showScreen("screen-3");
});

$("btn-replay") && $("btn-replay").addEventListener("click", () => {
  state.scenarioIndex = 0;
  state.totalDuc = 0;
  state.totalTai = 0;
  state.answeredCurrent = false;
  document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
  $("btn-start").disabled = true;
  showScreen("screen-0");
});

/* ---------- SCREEN 3 ---------- */
function renderReference() {
  $("theory-summary").textContent = THEORY_SUMMARY;
  $("theory-principles").textContent = THEORY_PRINCIPLES;
  $("ai-declaration").textContent = AI_DECLARATION;
  $("scope-note-theory").textContent = PRODUCT_SCOPE_NOTE;

  const citationList = $("scenario-citations");
  citationList.innerHTML = "";
  let lastLayer = null;
  SCENARIOS.forEach((s) => {
    if (s.layer !== lastLayer) {
      const heading = document.createElement("li");
      heading.className = "citation-layer-heading";
      heading.textContent = LAYER_NAMES[s.layer] || s.layer;
      citationList.appendChild(heading);
      lastLayer = s.layer;
    }
    const li = document.createElement("li");
    const sources = s.choices.map((c) => c.source).filter(Boolean).join(", ");
    li.textContent = `${s.id}. ${s.title}: ${sources || "(chưa có trích dẫn)"}`;
    citationList.appendChild(li);
  });

  const sourceList = $("external-sources");
  sourceList.innerHTML = "";
  if (EXTERNAL_SOURCES.length === 0) {
    const li = document.createElement("li");
    li.textContent = "[Chưa có nguồn ngoài giáo trình, nhóm điền nếu có]";
    sourceList.appendChild(li);
  } else {
    EXTERNAL_SOURCES.forEach((src) => {
      const li = document.createElement("li");
      li.textContent = `${src.label}: ${src.note}`;
      sourceList.appendChild(li);
    });
  }
}

$("btn-back-from-reference") && $("btn-back-from-reference").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- SCREEN 5/6, Ôn tập câu hỏi ---------- */
function startQuiz() {
  quizState.index = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.wrong = [];
  renderQuizQuestion();
  showScreen("screen-5");
}

function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[quizState.index];
  quizState.answered = false;

  $("quiz-progress-label").textContent = `Câu ${quizState.index + 1}/${QUIZ_QUESTIONS.length}`;
  $("quiz-progress-fill").style.width =
    `${((quizState.index + 1) / QUIZ_QUESTIONS.length) * 100}%`;
  $("quiz-question-text").textContent = q.question;

  const list = $("quiz-options-list");
  list.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleQuizAnswer(idx, q));
    list.appendChild(btn);
  });

  $("quiz-feedback-block").classList.add("hidden");
}

function handleQuizAnswer(idx, q) {
  if (quizState.answered) return;
  quizState.answered = true;

  const isCorrect = idx === q.correct;
  if (isCorrect) quizState.score += 1;
  else quizState.wrong.push(q);

  document.querySelectorAll("#quiz-options-list .quiz-option").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === idx) btn.classList.add("incorrect");
  });

  $("quiz-feedback-label").textContent = isCorrect ? "Chính xác" : "Chưa đúng";
  $("quiz-feedback-label").classList.toggle("feedback-correct", isCorrect);
  $("quiz-feedback-label").classList.toggle("feedback-incorrect", !isCorrect);
  $("quiz-feedback-text").textContent = q.explanation;
  $("btn-next-quiz").textContent =
    quizState.index === QUIZ_QUESTIONS.length - 1 ? "Xem kết quả ôn tập" : "Câu tiếp theo";
  $("quiz-feedback-block").classList.remove("hidden");
}

$("btn-next-quiz") && $("btn-next-quiz").addEventListener("click", () => {
  if (quizState.index === QUIZ_QUESTIONS.length - 1) {
    renderQuizResult();
    showScreen("screen-6");
  } else {
    quizState.index += 1;
    renderQuizQuestion();
  }
});

function renderQuizResult() {
  $("quiz-score-text").textContent =
    `Bạn trả lời đúng ${quizState.score}/${QUIZ_QUESTIONS.length} câu.`;

  const list = $("quiz-review-list");
  list.innerHTML = "";
  if (quizState.wrong.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Bạn trả lời đúng tất cả, không có câu nào cần xem lại.";
    list.appendChild(li);
  } else {
    quizState.wrong.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = `${q.question} Đáp án đúng: “${q.options[q.correct]}”.`;
      list.appendChild(li);
    });
  }
}

$("btn-view-quiz") && $("btn-view-quiz").addEventListener("click", startQuiz);
$("btn-retry-quiz") && $("btn-retry-quiz").addEventListener("click", startQuiz);

$("btn-back-from-quiz") && $("btn-back-from-quiz").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- Khởi động ---------- */
initScreen0();
