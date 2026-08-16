/* ============================================================
   NỘI DUNG NHÓM ĐIỀN — chỉ sửa trong khối này, không cần đụng
   phần logic bên dưới.

   TRẠNG THÁI NỘI DUNG (2026-08-16):
   - Tình huống 3 & 4 (owner C — Hưng): lấy nguyên văn từ "PHẦN C —
     BẢN CHỐT" trong Group 7 - HCM202.docx. Đây là số liệu ĐÃ CHỐT
     của nhóm, không tự sửa.
   - Tình huống 1, 2 (owner B — Minh) và 5, 6 (owner D — Huân):
     tài liệu gốc chấm điểm bằng thang khác (Tình huống 1–2 dùng
     "Điểm Đức X/5, Điểm Tài Y/5"; Tình huống 5–6 dùng các hạng mục
     riêng như "Chính trực", "Tiến độ ngắn hạn", "Liêm chính"...).
     Các delta Đức/Tài dưới đây là BẢN NHÁP do Claude quy đổi sang
     cùng thang ±2 khi tệ/tốt nhất, ±1/0 ở mức giữa, giữ đúng chiều
     hướng mà tài liệu mô tả (án phạt nặng nhất -> -2, án tốt nhất
     -> +2). B và D cần rà lại và xác nhận trước khi coi là chính
     thức — nếu đổi, phải tính lại 729 đường chơi và ngưỡng bên dưới.
   ============================================================ */

// SCREEN 0
const SITE_TITLE = "Đức hay Tài: Cái nào quan trọng hơn?";
const VOTE_QUESTION_INTRO =
  "Bạn sẽ trải qua 6 tình huống ở ba tầng: sinh viên, nghề nghiệp và quyền lực. " +
  "Mỗi lựa chọn tác động đến hai trục điểm riêng — Đức và Tài — dựa trên luận điểm " +
  "của giáo trình: “đạo đức là tiêu chuẩn cho mục đích hành động, còn tài là phương " +
  "tiện thực hiện mục đích đó” (trang 136). Không có lựa chọn nào tuyệt đối đúng hay sai " +
  "— hãy chọn theo điều bạn tin, rồi xem kết quả nói gì về bạn.";

// SCREEN 1 — 6 tình huống, đúng thứ tự & người phụ trách ở bảng mục 2 của spec.
// Nguyên tắc thang điểm: mỗi lựa chọn tác động MẠNH 1 trục (+2/-2) và
// NHẸ/TRUNG TÍNH trục còn lại (-1/0/+1) để tạo đánh đổi thật giữa Đức và Tài.
const SCENARIOS = [
  {
    id: 1,
    layer: "sinh_vien",
    owner: "B",
    title: "Deadline & cám dỗ copy đồ án",
    stimulus:
      "Còn 12 tiếng nữa là hạn nộp đồ án nhóm. Sản phẩm của bạn chưa xong, trong khi " +
      "một anh khóa trên gửi cho bạn file đồ án gần giống đề bài, chỉ cần sửa vài chỗ là “qua”.",
    choices: [
      {
        text: "Copy & sửa nhanh để nộp đúng hạn",
        deltaDuc: -2,
        deltaTai: -2,
        feedback:
          "Bạn lấy file có sẵn, đổi tên biến và số liệu rồi nộp đúng giờ. Deadline trước mắt " +
          "được giải quyết, nhưng đây là gian dối học thuật: nếu bị phát hiện (bài giống nhau) " +
          "bạn có thể nhận điểm 0 hoặc bị kỷ luật, và không tích lũy được năng lực thật nào.",
        source: "trang 146",
      },
      {
        text: "Xin gia hạn, tự làm dù nộp trễ",
        deltaDuc: 2,
        deltaTai: 1,
        feedback:
          "Bạn chủ động liên hệ giảng viên, trình bày khó khăn và xin thêm thời gian hợp lý, " +
          "rồi hoàn thành bằng năng lực thật. Có thể bị trừ điểm vì nộp trễ, nhưng bạn giữ được " +
          "liêm chính, sản phẩm là của chính mình và được ghi nhận thái độ trung thực.",
        source: "trang 146",
      },
      {
        text: "Thức trắng đêm, chắp vá nhiều nguồn không dẫn nguồn",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn ghép nội dung từ nhiều tài liệu và AI mà không trích dẫn hay kiểm chứng. Bài " +
          "nộp đúng hạn nhưng chất lượng rời rạc, có nguy cơ đạo văn một phần, và bạn hiểu bài " +
          "khá hời hợt khi bị hỏi vấn đáp.",
        source: "trang 146",
      },
    ],
    insight:
      "Theo tinh thần “xây đi đôi với chống, lấy xây làm chính” (trang 146), sự trung thực và tự " +
      "chịu trách nhiệm quan trọng hơn việc đúng hạn về mặt hình thức — nộp đúng hạn bằng gian " +
      "dối vẫn chỉ là một “tài” giả.",
  },
  {
    id: 2,
    layer: "sinh_vien",
    owner: "B",
    title: "Bạn cùng nhóm free-riding",
    stimulus:
      "Gần nộp đồ án, bạn phát hiện một thành viên trong nhóm gần như không đóng góp gì " +
      "suốt 3 tuần, nhưng vẫn đứng tên đầy đủ trong báo cáo.",
    choices: [
      {
        text: "Im lặng, tự gánh phần việc còn lại",
        deltaDuc: -1,
        deltaTai: -1,
        feedback:
          "Bạn không nói gì, âm thầm làm bù để nhóm “êm đẹp”. Không có mâu thuẫn ngắn hạn, " +
          "nhưng bất công kéo dài, bạn quá tải và chất lượng phần việc chung giảm sút vì dồn " +
          "vào một người, còn bạn free-riding thì không hề thay đổi.",
        source: "trang 147",
      },
      {
        text: "Trao đổi thẳng thắn, rồi báo cáo minh bạch với nhóm kèm đề xuất khắc phục",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn góp ý riêng trước; nếu không cải thiện thì báo minh bạch với cả nhóm kèm đề " +
          "xuất phân công lại. Bạn free-riding có cơ hội sửa sai, nhóm công bằng hơn, và giảng " +
          "viên có căn cứ đánh giá đúng người đúng việc.",
        source: "trang 157",
      },
      {
        text: "Tố cáo gay gắt trên nhóm chat chung, quy chụp nặng nề",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn công khai chỉ trích ngay, không góp ý riêng trước, khiến bạn ấy mất mặt trước " +
          "cả nhóm. Vấn đề được nêu ra, nhưng nhóm mất đoàn kết và bạn ấy có thể phản ứng tiêu " +
          "cực, ảnh hưởng tinh thần làm việc chung.",
        source: "trang 147",
      },
    ],
    insight:
      "Bao che là “xây” mà không “chống”; tố cáo gay gắt là “chống” mà không “xây”. Lựa chọn " +
      "đúng tinh thần trang 146 là chống để xây — không dập tắt cơ hội sửa sai của người khác.",
  },
  {
    id: 3,
    layer: "nghe_nghiep",
    owner: "C",
    title: "Hai ngày trước release",
    stimulus:
      "Bạn là developer trong một team tám người. Sản phẩm chuẩn bị ra bản lớn nhất năm — " +
      "thứ mà cả team đã làm suốt năm tháng, và là cơ sở xét thưởng quý cho toàn bộ phòng. " +
      "Chiều nay, khi rà lại phần xác thực người dùng, bạn phát hiện một lỗi phân quyền: chỉ " +
      "cần sửa một tham số trong đường dẫn là xem được dữ liệu cá nhân của tài khoản khác — " +
      "họ tên, số điện thoại, lịch sử giao dịch. Vá tạm thì được, nhưng vá đúng cách phải sửa " +
      "lại toàn bộ tầng phân quyền: ít nhất năm ngày, và phải dời ngày phát hành — nghĩa là cả " +
      "team mất thưởng quý. Sáng nay quản lý của bạn vừa nói: “giai đoạn này mình tập trung ra " +
      "bản đã, đừng vẽ thêm việc”. Hiện tại, chỉ có bạn biết về lỗ hổng này.",
    choices: [
      {
        text: "Im lặng, để bản phát hành ra đúng lịch",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bản phát hành thành công, chỉ số đẹp, cả phòng nhận thưởng quý và bạn được ghi " +
          "nhận là người biết ưu tiên việc gì trước. Nhưng bốn tháng sau, dữ liệu của mười hai " +
          "nghìn người dùng bị khai thác qua đúng lỗ hổng đó — công ty gọi đây là sự cố kỹ " +
          "thuật ngoài ý muốn, và không ai truy được về bạn.",
        source: "trang 136",
      },
      {
        text: "Viết báo cáo gửi quản lý và trưởng nhóm kỹ thuật",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Ngày phát hành bị dời hai tuần, cả phòng mất thưởng quý và bạn bị xem là người " +
          "“gây chuyện”. Nhưng vấn đề giờ nằm trên giấy, có ngày giờ, có người nhận — nó không " +
          "còn là gánh nặng của riêng bạn mà là trách nhiệm của tổ chức.",
        source: "trang 136",
      },
      {
        text: "Thức đêm tự vá tạm, không báo ai",
        deltaDuc: 0,
        deltaTai: 1,
        feedback:
          "Bạn vá kịp, phát hành đúng hạn, không ai mất thưởng và không ai biết đã có chuyện " +
          "gì xảy ra. Nhưng quy trình kiểm tra đã để lọt lỗ hổng này vẫn nguyên vẹn — sáu tháng " +
          "sau, một lỗi cùng loại xuất hiện ở phần khác, và lần này người phát hiện không thức " +
          "đêm như bạn.",
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
      "Bạn được giao xây dựng tính năng mới cho ứng dụng của công ty, mục tiêu là tăng thời " +
      "gian sử dụng. Thiết kế đã duyệt: gửi thông báo vào khung giờ khuya tạo cảm giác đang bỏ " +
      "lỡ điều gì đó, ưu tiên đẩy nội dung gây tranh cãi lên đầu bảng tin, làm chậm thao tác " +
      "thoát ứng dụng thêm vài bước. Bản thử nghiệm: thời gian sử dụng trung bình tăng 22%, " +
      "riêng nhóm dưới 18 tuổi tăng gấp đôi. Không có gì bất hợp pháp, không ai bị lộ dữ liệu, " +
      "mọi thứ nằm trong điều khoản người dùng đã đồng ý. Bạn là người viết mã — không phải " +
      "người ra quyết định.",
    choices: [
      {
        text: "Triển khai đúng thiết kế, làm tốt nhất có thể",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bạn làm xuất sắc: tính năng chạy mượt, chỉ số vượt kỳ vọng, bạn được nêu tên trong " +
          "báo cáo quý và cân nhắc thăng chức. Một năm sau, bạn đọc một bài báo về tình trạng " +
          "mất ngủ ở học sinh cấp ba — trong phần bình luận có người kể lại đúng trải nghiệm mà " +
          "thuật toán của bạn được thiết kế để tạo ra. Nếu bạn làm kém hơn, ít người bị ảnh " +
          "hưởng hơn.",
        source: "trang 136",
      },
      {
        text: "Từ chối làm, xin chuyển sang nhiệm vụ khác",
        deltaDuc: 1,
        deltaTai: -1,
        feedback:
          "Quản lý không gây khó dễ, bạn được chuyển sang nhiệm vụ bảo trì. Tính năng vẫn ra " +
          "mắt đúng lịch — một đồng nghiệp mới làm thay, cẩn thận nhưng thiếu kinh nghiệm nên " +
          "phần thông báo còn dồn dập hơn cả thiết kế ban đầu. Bạn giữ được tay mình sạch, " +
          "nhưng không còn ở trong phòng để nói bất cứ điều gì nữa.",
        source: "trang 136",
      },
      {
        text: "Nhận làm, đồng thời đo chỉ số tác hại và đề xuất giới hạn",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn mất thêm hai tuần và bị hỏi vì sao chậm; một nửa phòng cho rằng bạn đang làm " +
          "quá lên. Đề xuất của bạn bị cắt còn một nửa: công ty chỉ đồng ý tắt thông báo khuya " +
          "cho tài khoản dưới 18 tuổi. Đó không phải một chiến thắng, nhưng là thay đổi duy " +
          "nhất trong ba lựa chọn thật sự xảy ra — vì bạn có số liệu, thứ người đứng ngoài " +
          "không thể đưa ra.",
        source: "trang 136",
      },
    ],
    insight:
      "Đây là tình huống duy nhất mà làm giỏi hơn thì hại nhiều hơn. Nếu chuyên môn có thể " +
      "tách rời khỏi đạo đức thì phương án A phải trung tính — nhưng bạn vừa thấy nó không hề " +
      "trung tính.",
  },
  {
    id: 5,
    layer: "quyen_luc",
    owner: "D",
    title: "Ai sẽ vào nhóm nòng cốt?",
    stimulus:
      "Bạn được giao làm trưởng một nhóm dự án quan trọng, chỉ được chọn một người vào vị " +
      "trí phó nhóm. An rất giỏi chuyên môn, nhanh nhạy, từng “lách luật” để nhóm cũ về đích " +
      "trước và hay nói quá thành tích của mình khi báo cáo. Bình năng lực trung bình, chưa " +
      "nhiều kinh nghiệm, nhưng luôn nói thật kết quả — kể cả khi thất bại — và không bao giờ " +
      "nhận công lao không phải của mình.",
    choices: [
      {
        text: "Chọn An — ưu tiên năng lực, bỏ qua tư cách",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Dự án ban đầu chạy nhanh, nhưng An dần thao túng báo cáo để nhóm trông “hoàn hảo” " +
          "trước cấp trên, che giấu rủi ro thật. Đến giữa dự án, sai lầm bị giấu kín bùng phát, " +
          "gây thiệt hại lớn hơn nhiều so với nếu được phát hiện sớm.",
        source: "trang 92",
      },
      {
        text: "Chọn Bình — ưu tiên trung thực, bỏ qua năng lực",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Nhóm chạy chậm hơn ban đầu vì Bình cần thời gian học hỏi, nhưng mọi báo cáo đều " +
          "chính xác, vấn đề được phát hiện sớm và xử lý kịp thời. Về dài hạn, nhóm phát triển " +
          "bền vững và được tin tưởng giao thêm dự án.",
        source: "trang 141",
      },
      {
        text: "Chọn cả hai, phân vai rõ ràng và giám sát An chặt",
        deltaDuc: 1,
        deltaTai: 1,
        feedback:
          "Nhóm vừa có tốc độ từ An, vừa có độ tin cậy nhờ Bình giám sát chéo. Cách này đòi " +
          "hỏi bạn phải liên tục theo dõi, tốn công sức quản lý hơn, nhưng nếu duy trì tốt sẽ " +
          "đạt kết quả cân bằng nhất.",
        source: "trang 141",
      },
    ],
    insight:
      "“Để làm người thay mặt nhân dân phải gồm đủ cả đức và tài, phải vừa hiền lại vừa minh” " +
      "(trang 92) — nếu chỉ có “minh” mà thiếu “hiền”, tài năng có thể trở thành công cụ gây hại.",
  },
  {
    id: 6,
    layer: "quyen_luc",
    owner: "D",
    title: "Quỹ nhóm trong tay bạn",
    stimulus:
      "Bạn được giao giữ quỹ chung của nhóm (2 triệu đồng, dùng để mua vật tư cho dự án). " +
      "Vào phút cuối, bạn phát hiện có thể “linh động” chi 300.000đ từ quỹ này cho việc cá " +
      "nhân, mà gần như chắc chắn không ai trong nhóm biết, vì bạn là người duy nhất nắm sổ " +
      "chi tiêu.",
    choices: [
      {
        text: "Tự ý dùng 300.000đ, định bụng “trả lại sau”",
        deltaDuc: -2,
        deltaTai: 0,
        feedback:
          "Việc cá nhân giải quyết được ngay, nhưng đến ngày cần chi vật tư, quỹ thiếu hụt và " +
          "nhóm bị động. Dù sau đó bạn hoàn trả đủ, niềm tin của nhóm dành cho bạn đã rạn nứt " +
          "khi sự việc lộ ra — minh bạch tài chính luôn để lại dấu vết.",
        source: "trang 141",
      },
      {
        text: "Không đụng đến quỹ, tự xoay xở việc cá nhân bằng cách khác",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Việc cá nhân giải quyết chậm hơn hoặc khó khăn hơn, nhưng quỹ nhóm nguyên vẹn, " +
          "minh bạch tuyệt đối. Nhóm tín nhiệm giao bạn quản lý các quỹ lớn hơn trong tương lai.",
        source: "trang 141",
      },
      {
        text: "Chủ động hỏi ý kiến cả nhóm trước khi dùng, công khai minh bạch mục đích",
        deltaDuc: 1,
        deltaTai: 0,
        feedback:
          "Mất thêm thời gian trao đổi, nhưng nếu nhóm đồng ý, việc chi tiêu trở thành quyết " +
          "định tập thể chứ không phải hành vi đơn phương. Nếu nhóm không đồng ý, bạn buộc " +
          "phải tìm cách khác — nhưng không có ai bị “qua mặt”.",
        source: "trang 142",
      },
    ],
    insight:
      "“Có quyền mà thiếu lương tâm là có dịp đục khoét, có dịp ăn của đút, có dịp ‘dĩ công vi " +
      "tư’” (trang 141–142). Liêm không phải là không có nhu cầu cá nhân, mà là không lợi dụng vị " +
      "trí được giao phó để giải quyết nhu cầu đó.",
  },
];

// SCREEN 2 — Ngưỡng phân loại (BẢN NHÁP, xem cảnh báo ở đầu file).
// Với bộ delta hiện tại: biên độ Đức chạy -11..+12, biên độ Tài chạy -7..+9.
// Áp dụng đúng nguyên tắc nhóm đã chốt ("ngưỡng đặt gần trung điểm biên độ thực
// tế của từng trục"): trung điểm Đức ~0.5 -> ngưỡng 1; trung điểm Tài ~1 -> ngưỡng 1.
// Đây KHÔNG PHẢI ngưỡng "Đức>1, Tài>4" trong tài liệu gốc — con số đó được tính
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
      "kết cục mà giáo trình hướng tới — và cũng tốn công nhất, như bạn vừa thấy qua các tình huống.",
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
      "Giáo trình gọi đây là bệnh nói suông — thứ mà tư tưởng đạo đức Hồ Chí Minh, vốn lấy " +
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
  "người cần cả hai — thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, " +
  "thậm chí có hại. Đó là lý do trò chơi đo hai trục riêng biệt thay vì một thang điểm duy nhất.";

const THEORY_PRINCIPLES =
  "Ba nguyên tắc xây dựng đạo đức cách mạng: (1) Nói đi đôi với làm, nêu gương về đạo đức " +
  "(trang 145) — “một tấm gương sống còn có giá trị hơn một trăm bài diễn văn tuyên truyền”; " +
  "(2) Xây đi đôi với chống (trang 146) — “xây phải đi đôi với chống, muốn xây phải chống, chống " +
  "nhằm mục đích xây, lấy xây làm chính”; (3) Tu dưỡng đạo đức suốt đời (trang 148) — “đạo đức " +
  "cách mạng không phải trên trời sa xuống, nó do đấu tranh, rèn luyện bền bỉ hằng ngày mà " +
  "phát triển và củng cố”.";

const AI_DECLARATION =
  "Nhóm có sử dụng công cụ trí tuệ nhân tạo trong quá trình xây dựng sản phẩm này. Công cụ " +
  "được dùng để: tóm tắt và hệ thống hóa nội dung giáo trình, soạn bản nháp cho các tình " +
  "huống, gợi ý cấu trúc trình bày, và tìm kiếm trường hợp thực tế để đối chiếu. Công cụ " +
  "không được dùng để quyết định luận điểm của nhóm, gán điểm số cho các lựa chọn, hoặc thay " +
  "thế việc đọc giáo trình gốc. Toàn bộ trích dẫn giáo trình đã được từng thành viên đối chiếu " +
  "trực tiếp với bản gốc.";

// Phần B (bảng phân định nội dung web) yêu cầu ghi chú ranh giới hiện ở CẢ trang kết quả
// lẫn trang cơ sở lý luận — tách riêng khỏi AI_DECLARATION để dùng ở cả hai nơi.
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

// SCREEN 4 — Phương án lưu dữ liệu đã chọn: B (Google Form).
// Nhóm cập nhật TAY các số dưới đây sau khi tổng hợp Google Form, trước buổi thuyết trình.
const CLASS_STATS = {
  totalPlays: 0,
  votePercentDuc: 0,
  votePercentTai: 0,
  quadrantPercents: {
    vua_hong_vua_chuyen: 0,
    dang_tin_bat_luc: 0,
    vo_hai_vo_dung: 0,
    nguy_hiem_nhat: 0,
  },
};

/* ============================================================
   LOGIC — không cần sửa phần dưới đây để điền nội dung.
   ============================================================ */

const state = {
  initialVote: null,
  scenarioIndex: 0,
  totalDuc: 0,
  totalTai: 0,
  answeredCurrent: false,
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

// Footer AI Declaration link — hoạt động từ bất kỳ màn hình nào (screen 0/1/2/4).
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

$("link-class-stats") && $("link-class-stats").addEventListener("click", (e) => {
  e.preventDefault();
  renderClassStats();
  showScreen("screen-4");
});

/* ---------- SCREEN 3 ---------- */
function renderReference() {
  $("theory-summary").textContent = THEORY_SUMMARY;
  $("theory-principles").textContent = THEORY_PRINCIPLES;
  $("ai-declaration").textContent = AI_DECLARATION;
  $("scope-note-theory").textContent = PRODUCT_SCOPE_NOTE;

  const citationList = $("scenario-citations");
  citationList.innerHTML = "";
  SCENARIOS.forEach((s) => {
    const li = document.createElement("li");
    const sources = s.choices.map((c) => c.source).filter(Boolean).join(", ");
    li.textContent = `${s.id}. ${s.title} — ${sources || "(chưa có trích dẫn)"}`;
    citationList.appendChild(li);
  });

  const sourceList = $("external-sources");
  sourceList.innerHTML = "";
  if (EXTERNAL_SOURCES.length === 0) {
    const li = document.createElement("li");
    li.textContent = "[Chưa có nguồn ngoài giáo trình — nhóm điền nếu có]";
    sourceList.appendChild(li);
  } else {
    EXTERNAL_SOURCES.forEach((src) => {
      const li = document.createElement("li");
      li.textContent = `${src.label} — ${src.note}`;
      sourceList.appendChild(li);
    });
  }
}

$("btn-back-from-reference") && $("btn-back-from-reference").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- SCREEN 4 ---------- */
function renderClassStats() {
  $("stat-total-plays").textContent = CLASS_STATS.totalPlays;
  $("stat-vote-duc").textContent = `${CLASS_STATS.votePercentDuc}%`;
  $("stat-vote-tai").textContent = `${CLASS_STATS.votePercentTai}%`;

  const list = $("stats-quadrants");
  list.innerHTML = "";
  Object.keys(QUADRANTS).forEach((key) => {
    const li = document.createElement("li");
    const pct = CLASS_STATS.quadrantPercents[key] ?? 0;
    li.innerHTML = `<span>${QUADRANTS[key].name}</span><span>${pct}%</span>`;
    list.appendChild(li);
  });
}

$("btn-back-from-stats") && $("btn-back-from-stats").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- Khởi động ---------- */
initScreen0();
