/**
 * HCM-T21 "Đức hay Tài" — Scenarios Data Store
 * Contains 6 interactive scenarios across 3 layers (Student, Career, Power)
 * Academic Citations: Giáo trình Tư tưởng Hồ Chí Minh (Chương 6, tr. 134–158)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM = root.HCM || {};
    root.HCM.Data = root.HCM.Data || {};
    Object.assign(root.HCM.Data, factory());
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LAYER_NAMES = {
    sinh_vien: "Tầng sinh viên",
    nghe_nghiep: "Tầng nghề nghiệp",
    quyen_luc: "Tầng quyền lực",
  };

  const LAYER_IMAGES = {
    sinh_vien: "assets/images/layer_student.png",
    nghe_nghiep: "assets/images/layer_career.png",
    quyen_luc: "assets/images/layer_power.png",
  };

  const SCENARIOS = [
    {
      id: 1,
      layer: "sinh_vien",
      owner: "B",
      title: "Deadline & cám dỗ copy đồ án",
      image: "assets/images/scenario_copy_project.png",
      stimulus:
        "Còn 12 tiếng nữa là hạn nộp đồ án nhóm. Sản phẩm của bạn chưa xong, trong khi " +
        "một anh khóa trên gửi cho bạn file đồ án gần giống đề bài, chỉ cần sửa vài chỗ " +
        "là “qua”.",
      choices: [
        {
          text: "Copy & sửa nhanh để nộp đúng hạn",
          deltaDuc: -2,
          deltaTai: -2,
          feedback:
            "Bạn lấy file có sẵn, đổi tên biến và số liệu rồi nộp đúng giờ. Deadline " +
            "trước mắt được giải quyết, nhưng đây là gian dối học thuật: nếu bị phát " +
            "hiện, bạn có thể nhận điểm 0 hoặc bị kỷ luật, và không tích lũy được năng " +
            "lực thật nào.",
          source: "trang 146",
        },
        {
          text: "Xin gia hạn, tự làm dù nộp trễ",
          deltaDuc: 2,
          deltaTai: 1,
          feedback:
            "Bạn chủ động liên hệ giảng viên, trình bày khó khăn và xin thêm thời gian " +
            "hợp lý, rồi hoàn thành bằng năng lực thật. Có thể bị trừ điểm vì nộp trễ, " +
            "nhưng bạn giữ được liêm chính và sản phẩm là của chính mình.",
          source: "trang 146",
        },
        {
          text: "Thức trắng đêm, chắp vá nhiều nguồn không dẫn nguồn",
          deltaDuc: -1,
          deltaTai: 0,
          feedback:
            "Bạn ghép nội dung từ nhiều tài liệu và AI mà không trích dẫn hay kiểm " +
            "chứng. Bài nộp đúng hạn nhưng chất lượng rời rạc, có nguy cơ đạo văn một " +
            "phần, và bạn hiểu bài khá hời hợt khi bị hỏi vấn đáp.",
          source: "trang 146",
        },
      ],
      insight:
        "Theo tinh thần “xây đi đôi với chống, lấy xây làm chính” (trang 146), sự trung " +
        "thực và tự chịu trách nhiệm quan trọng hơn việc đúng hạn về mặt hình thức, nộp " +
        "đúng hạn bằng gian dối vẫn chỉ là một “tài” giả.",
    },
    {
      id: 2,
      layer: "sinh_vien",
      owner: "B",
      title: "Bạn cùng nhóm free-riding",
      image: "assets/images/scenario_freeriding.png",
      stimulus:
        "Gần nộp đồ án, bạn phát hiện một thành viên trong nhóm gần như không đóng góp " +
        "gì suốt 3 tuần, nhưng vẫn đứng tên đầy đủ trong báo cáo.",
      choices: [
        {
          text: "Im lặng, tự gánh phần việc còn lại",
          deltaDuc: -1,
          deltaTai: -1,
          feedback:
            "Bạn không nói gì, âm thầm làm bù để nhóm “êm đẹp”. Không có mâu thuẫn ngắn " +
            "hạn, nhưng bất công kéo dài, bạn quá tải và chất lượng phần việc chung giảm " +
            "sút, còn bạn free-riding thì không hề thay đổi.",
          source: "trang 147",
        },
        {
          text: "Trao đổi thẳng thắn, rồi báo cáo minh bạch với nhóm kèm đề xuất khắc phục",
          deltaDuc: 2,
          deltaTai: 2,
          feedback:
            "Bạn góp ý riêng trước; nếu không cải thiện thì báo minh bạch với cả nhóm " +
            "kèm đề xuất phân công lại. Bạn free-riding có cơ hội sửa sai, nhóm công " +
            "bằng hơn, và giảng viên có căn cứ đánh giá đúng người đúng việc.",
          source: "trang 157",
        },
        {
          text: "Tố cáo gay gắt trên nhóm chat chung, quy chụp nặng nề",
          deltaDuc: -1,
          deltaTai: 0,
          feedback:
            "Bạn công khai chỉ trích ngay, không góp ý riêng trước, khiến bạn ấy mất " +
            "mặt trước cả nhóm. Vấn đề được nêu ra, nhưng nhóm mất đoàn kết và bạn ấy có " +
            "thể phản ứng tiêu cực, ảnh hưởng tinh thần làm việc chung.",
          source: "trang 147",
        },
      ],
      insight:
        "Bao che là “xây” mà không “chống”; tố cáo gay gắt là “chống” mà không “xây”. " +
        "Lựa chọn đúng tinh thần trang 146 là chống để xây, không dập tắt cơ hội sửa " +
        "sai của người khác.",
    },
    {
      id: 3,
      layer: "nghe_nghiep",
      owner: "C",
      title: "Hai ngày trước release",
      image: "assets/images/scenario_security_bug.png",
      stimulus:
        "Bạn là developer trong một team tám người. Sản phẩm chuẩn bị ra bản lớn nhất " +
        "năm, thứ mà cả team đã làm suốt năm tháng, và là cơ sở xét thưởng quý cho toàn " +
        "bộ phòng. Chiều nay, khi rà lại phần xác thực người dùng, bạn phát hiện một lỗi " +
        "phân quyền: chỉ cần sửa một tham số trong đường dẫn là xem được dữ liệu cá nhân " +
        "của tài khoản khác, họ tên, số điện thoại, lịch sử giao dịch. Vá tạm thì được, " +
        "nhưng vá đúng cách phải sửa lại toàn bộ tầng phân quyền: ít nhất năm ngày, và " +
        "phải dời ngày phát hành, nghĩa là cả team mất thưởng quý. Sáng nay quản lý của " +
        "bạn vừa nói: “giai đoạn này mình tập trung ra bản đã, đừng vẽ thêm việc”. Hiện " +
        "tại, chỉ có bạn biết về lỗ hổng này.",
      choices: [
        {
          text: "Im lặng, để bản phát hành ra đúng lịch",
          deltaDuc: -2,
          deltaTai: 2,
          feedback:
            "Bản phát hành thành công, chỉ số đẹp, cả phòng nhận thưởng quý và bạn được " +
            "ghi nhận là người biết ưu tiên việc gì trước. Nhưng bốn tháng sau, dữ liệu " +
            "của mười hai nghìn người dùng bị khai thác qua đúng lỗ hổng đó, công ty gọi " +
            "đây là sự cố kỹ thuật ngoài ý muốn, và không ai truy được về bạn.",
          source: "trang 136",
        },
        {
          text: "Viết báo cáo gửi quản lý và trưởng nhóm kỹ thuật",
          deltaDuc: 2,
          deltaTai: -1,
          feedback:
            "Ngày phát hành bị dời hai tuần, cả phòng mất thưởng quý và bạn bị xem là " +
            "người “gây chuyện”. Nhưng vấn đề giờ nằm trên giấy, có ngày giờ, có người " +
            "nhận, nó không còn là gánh nặng của riêng bạn mà là trách nhiệm của tổ chức.",
          source: "trang 136",
        },
        {
          text: "Thức đêm tự vá tạm, không báo ai",
          deltaDuc: 0,
          deltaTai: 1,
          feedback:
            "Bạn vá kịp, phát hành đúng hạn, không ai mất thưởng và không ai biết đã có " +
            "chuyện gì xảy ra. Nhưng quy trình kiểm tra đã để lọt lỗ hổng này vẫn nguyên " +
            "vẹn, sáu tháng sau, một lỗi cùng loại xuất hiện ở phần khác, và lần này " +
            "người phát hiện không thức đêm như bạn.",
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
      image: "assets/images/scenario_addictive_algo.png",
      stimulus:
        "Bạn được giao xây dựng tính năng mới cho ứng dụng của công ty, mục tiêu là tăng " +
        "thời gian sử dụng. Thiết kế đã duyệt: gửi thông báo vào khung giờ khuya tạo cảm " +
        "giác đang bỏ lỡ điều gì đó, ưu tiên đẩy nội dung gây tranh cãi lên đầu bảng tin, " +
        "làm chậm thao tác thoát ứng dụng thêm vài bước. Bản thử nghiệm: thời gian sử " +
        "dụng trung bình tăng 22%, riêng nhóm dưới 18 tuổi tăng gấp đôi. Không có gì bất " +
        "hợp pháp, không ai bị lộ dữ liệu, mọi thứ nằm trong điều khoản người dùng đã " +
        "đồng ý. Bạn là người viết mã, không phải người ra quyết định.",
      choices: [
        {
          text: "Triển khai đúng thiết kế, làm tốt nhất có thể",
          deltaDuc: -2,
          deltaTai: 2,
          feedback:
            "Bạn làm xuất sắc: tính năng chạy mượt, chỉ số vượt kỳ vọng, bạn được nêu " +
            "tên trong báo cáo quý và cân nhắc thăng chức. Một năm sau, bạn đọc một bài " +
            "báo về tình trạng mất ngủ ở học sinh cấp ba, trong phần bình luận có người " +
            "kể lại đúng trải nghiệm mà thuật toán của bạn được thiết kế để tạo ra. Nếu " +
            "bạn làm kém hơn, ít người bị ảnh hưởng hơn.",
          source: "trang 136",
        },
        {
          text: "Từ chối làm, xin chuyển sang nhiệm vụ khác",
          deltaDuc: 1,
          deltaTai: -1,
          feedback:
            "Quản lý không gây khó dễ, bạn được chuyển sang nhiệm vụ bảo trì. Tính năng " +
            "vẫn ra mắt đúng lịch, một đồng nghiệp mới làm thay, cẩn thận nhưng thiếu " +
            "kinh nghiệm nên phần thông báo còn dồn dập hơn cả thiết kế ban đầu. Bạn giữ " +
            "được tay mình sạch, nhưng không còn ở trong phòng để nói bất cứ điều gì nữa.",
          source: "trang 136",
        },
        {
          text: "Nhận làm, đồng thời đo chỉ số tác hại và đề xuất giới hạn",
          deltaDuc: 2,
          deltaTai: 2,
          feedback:
            "Bạn mất thêm hai tuần và bị hỏi vì sao chậm; một nửa phòng cho rằng bạn " +
            "đang làm quá lên. Đề xuất của bạn bị cắt còn một nửa: công ty chỉ đồng ý " +
            "tắt thông báo khuya cho tài khoản dưới 18 tuổi. Đó không phải một chiến " +
            "thắng, nhưng là thay đổi duy nhất trong ba lựa chọn thật sự xảy ra, vì bạn " +
            "có số liệu, thứ người đứng ngoài không thể đưa ra.",
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
      image: "assets/images/scenario_vice_leader.png",
      stimulus:
        "Bạn được giao làm trưởng một nhóm dự án quan trọng, chỉ được chọn một người vào " +
        "vị trí phó nhóm. An rất giỏi chuyên môn, nhanh nhạy, từng “lách luật” để nhóm cũ " +
        "về đích trước và hay nói quá thành tích của mình khi báo cáo. Bình năng lực " +
        "trung bình, chưa nhiều kinh nghiệm, nhưng luôn nói thật kết quả, kể cả khi thất " +
        "bại, và không bao giờ nhận công lao không phải của mình.",
      choices: [
        {
          text: "Chọn An, ưu tiên năng lực, bỏ qua tư cách",
          deltaDuc: -2,
          deltaTai: 2,
          feedback:
            "Dự án ban đầu chạy nhanh, nhưng An dần thao túng báo cáo để nhóm trông " +
            "“hoàn hảo” trước cấp trên, che giấu rủi ro thật. Đến giữa dự án, sai lầm bị " +
            "giấu kín bùng phát, gây thiệt hại lớn hơn nhiều so với nếu được phát hiện sớm.",
          source: "trang 136",
        },
        {
          text: "Chọn Bình, ưu tiên trung thực, bỏ qua năng lực",
          deltaDuc: 2,
          deltaTai: -1,
          feedback:
            "Nhóm chạy chậm hơn ban đầu vì Bình cần thời gian học hỏi, nhưng mọi báo " +
            "cáo đều chính xác, vấn đề được phát hiện sớm và xử lý kịp thời. Về dài hạn, " +
            "nhóm phát triển bền vững và được tin tưởng giao thêm dự án.",
          source: "trang 141",
        },
        {
          text: "Chọn cả hai, phân vai rõ ràng và giám sát An chặt",
          deltaDuc: 1,
          deltaTai: 1,
          feedback:
            "Nhóm vừa có tốc độ từ An, vừa có độ tin cậy nhờ Bình giám sát chéo. Cách " +
            "này đòi hỏi bạn phải liên tục theo dõi, tốn công sức quản lý hơn, nhưng nếu " +
            "duy trì tốt sẽ đạt kết quả cân bằng nhất.",
          source: "trang 141",
        },
      ],
      insight:
        "“Cán bộ lấy đạo đức làm cốt cán” (trang 136): nếu chọn năng lực mà bỏ qua đạo " +
        "đức, người được chọn có thể trở thành rủi ro lớn nhất cho chính tập thể.",
    },
    {
      id: 6,
      layer: "quyen_luc",
      owner: "D",
      title: "Quỹ nhóm trong tay bạn",
      image: "assets/images/scenario_fund_management.png",
      stimulus:
        "Bạn được giao giữ quỹ chung của nhóm (2 triệu đồng, dùng để mua vật tư cho dự " +
        "án). Vào phút cuối, bạn phát hiện có thể “linh động” chi 300.000đ từ quỹ này " +
        "cho việc cá nhân, mà gần như chắc chắn không ai trong nhóm biết, vì bạn là " +
        "người duy nhất nắm sổ chi tiêu.",
      choices: [
        {
          text: "Tự ý dùng 300.000đ, định bụng “trả lại sau”",
          deltaDuc: -2,
          deltaTai: 0,
          feedback:
            "Việc cá nhân giải quyết được ngay, nhưng đến ngày cần chi vật tư, quỹ " +
            "thiếu hụt và nhóm bị động. Dù sau đó bạn hoàn trả đủ, niềm tin của nhóm " +
            "dành cho bạn đã rạn nứt khi sự việc lộ ra, minh bạch tài chính luôn để lại " +
            "dấu vết.",
          source: "trang 141",
        },
        {
          text: "Không đụng đến quỹ, tự xoay xở việc cá nhân bằng cách khác",
          deltaDuc: 2,
          deltaTai: -1,
          feedback:
            "Việc cá nhân giải quyết chậm hơn hoặc khó khăn hơn, nhưng quỹ nhóm nguyên " +
            "vẹn, minh bạch tuyệt đối. Nhóm tín nhiệm giao bạn quản lý các quỹ lớn hơn " +
            "trong tương lai.",
          source: "trang 141",
        },
        {
          text: "Chủ động hỏi ý kiến cả nhóm trước khi dùng, công khai minh bạch mục đích",
          deltaDuc: 1,
          deltaTai: 0,
          feedback:
            "Mất thêm thời gian trao đổi, nhưng nếu nhóm đồng ý, việc chi tiêu trở " +
            "thành quyết định tập thể chứ không phải hành vi đơn phương. Nếu nhóm không " +
            "đồng ý, bạn buộc phải tìm cách khác, nhưng không có ai bị “qua mặt”.",
          source: "trang 142",
        },
      ],
      insight:
        "Trang 141–142: “có quyền mà thiếu lương tâm là có dịp đục khoét, có dịp ăn của " +
        "đút, có dịp dĩ công vi tư.” Liêm không phải là không có nhu cầu cá nhân, mà là " +
        "không lợi dụng vị trí được giao phó để giải quyết nhu cầu đó.",
    },
  ];

  return {
    LAYER_NAMES,
    LAYER_IMAGES,
    SCENARIOS,
  };
}));
