/**
 * HCM-T21 "Đức hay Tài" — Theory & Pedagogical Reference Data Store
 * Theoretical frameworks, presentation scripts, quadrant definitions, and AI disclosures
 * Academic source: Giáo trình Tư tưởng Hồ Chí Minh (Chương 6, tr. 134–158)
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

  const SITE_TITLE = "Đức hay Tài: Cái nào quan trọng hơn?";

  const VOTE_QUESTION_INTRO =
    "Bạn sẽ trải qua 6 tình huống ở ba tầng: sinh viên, nghề nghiệp và quyền lực. " +
    "Mỗi lựa chọn tác động đến hai trục điểm riêng, Đức và Tài, dựa trên luận điểm " +
    "của giáo trình: “đạo đức là tiêu chuẩn cho mục đích hành động, còn tài là phương " +
    "tiện thực hiện mục đích đó” (trang 136). Không có lựa chọn nào tuyệt đối đúng hay sai, " +
    "hãy chọn theo điều bạn tin, rồi xem kết quả nói gì về bạn.";

  const OPENING_THEORY = {
    duc: [
      {
        title: "Đức",
        source: "trang 134–137",
        script:
          "Giáo trình dẫn “Sửa đổi lối làm việc” (1947): “Cũng như sông thì có nguồn mới " +
          "có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây " +
          "héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy " +
          "cũng không lãnh đạo được nhân dân” (trang 134–135). Đức là mục đích đúng đắn " +
          "của hành động: “đạo đức là tiêu chuẩn cho mục đích hành động” (trang 136). " +
          "Trang 137: “Đức là gốc, là trước hết”, nghĩa là nền tảng, không phải để thay " +
          "thế Tài, phần mình nói ngay sau đây. Đây chính là lý do mọi lựa chọn của các " +
          "bạn hôm nay sẽ luôn được nhìn qua một câu hỏi: mục đích thật sự của hành động " +
          "này là gì?",
      },
    ],
    tai: [
      {
        title: "Tài",
        source: "trang 136–137",
        script:
          "Trang 136: “Nếu đạo đức là tiêu chuẩn cho mục đích hành động thì tài là phương " +
          "tiện thực hiện mục đích đó. Vì vậy, con người cần có cả đức và tài, nếu thiếu " +
          "tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, thậm chí có " +
          "hại.” Người còn dặn: “Dạy cũng như học phải biết chú trọng cả tài lẫn đức... " +
          "Nếu không có đạo đức cách mạng thì có tài cũng vô dụng” (trang 136). Vì vậy " +
          "trò chơi chấm hai trục Đức và Tài độc lập, không gộp chung. Một lựa chọn có " +
          "thể đúng nhưng chưa đủ hiệu quả, hoặc hiệu quả nhưng sai mục đích, sáu tình " +
          "huống sau đây sẽ cho thấy rõ sự khác biệt đó.",
      },
    ],
    ket_luan: [
      {
        title: "Thực trạng đạo đức hiện nay",
        source: "trang 157–158",
        script:
          "Trang 157-158: phần lớn sinh viên, thanh niên trí thức vẫn giữ được lối sống " +
          "nhân hậu, tình nghĩa, trong sạch, khiêm tốn, cần cù, sáng tạo, có chí lập " +
          "thân lập nghiệp, dám đối mặt khó khăn, dám chịu trách nhiệm. Nhưng giáo trình " +
          "cũng thẳng thắn: “tình trạng suy thoái về tư tưởng chính trị, đạo đức, lối " +
          "sống, bệnh cơ hội, chủ nghĩa cá nhân và tệ quan liêu, tham nhũng, lãng phí " +
          "trong một bộ phận cán bộ, công chức diễn ra nghiêm trọng.” Nhìn lại kết quả " +
          "cả lớp vừa chọn, các bạn đang ở nhóm nào?",
      },
      {
        title: "Liên hệ sinh viên: Học để làm gì? Học để phục vụ ai?",
        source: "trang 157",
        script:
          "Trang 157: một bộ phận sinh viên “phai nhạt niềm tin, lý tưởng, mất phương " +
          "hướng phấn đấu, không có chí lập thân, lập nghiệp, chạy theo lối sống thực " +
          "dụng, thiếu trách nhiệm.” Hồ Chí Minh đặt câu hỏi cho thanh niên trí thức: " +
          "“Học để làm gì? Học để phục vụ ai? Đó là hai câu hỏi cần phải trả lời dứt " +
          "khoát thì mới có phương hướng để sửa chữa khuyết điểm của mình.” Đức là gốc " +
          "định hướng hành động, Tài là năng lực biến mục tiêu thành kết quả thật.",
      },
    ],
  };

  const LAYER_THEORY = {
    sinh_vien: [
      {
        title: "Xây đi đôi với chống, lấy xây làm chính",
        source: "trang 146",
        script:
          "Trang 146: “không có ai cái gì cũng tốt, cái gì cũng hay”, nên ranh giới đúng " +
          "sai trong đạo đức không đơn giản. “Xây phải đi đôi với chống, muốn xây phải " +
          "chống, chống nhằm mục đích xây, lấy xây làm chính.” Ở tình huống 2, im lặng " +
          "bao che là “xây” không “chống”; tố cáo gay gắt là “chống” không “xây”; trao " +
          "đổi thẳng thắn rồi báo minh bạch mới đúng là xây đi đôi với chống, nên được " +
          "điểm cao nhất. Nguồn gốc của mọi tệ nạn, theo giáo trình, là chủ nghĩa cá " +
          "nhân, nhưng đấu tranh chống nó không phải là “giày xéo lên lợi ích cá nhân”, " +
          "mà là chống thói ích kỷ, hại tập thể.",
      },
      {
        title: "Thanh niên phải có đức, có tài",
        source: "trang 157",
        script:
          "Trang 157: Hồ Chí Minh mong muốn “Thanh niên phải có đức, có tài”, vì “thanh " +
          "niên là người chủ tương lai của nước nhà”. Ở tình huống 1, copy đồ án để đúng " +
          "hạn là “tài” giả vì đến từ gian dối, không phải năng lực thật. Xin gia hạn và " +
          "tự làm dù nộp trễ mới là có đức thật (trung thực, dám nhận thiếu sót) và có " +
          "tài thật (năng lực của chính mình), nên được điểm cao nhất cả hai trục. Giáo " +
          "trình nhấn mạnh: “nước nhà thịnh hay suy, yếu hay mạnh một phần lớn là do các " +
          "thanh niên”.",
      },
    ],
    nghe_nghiep: [
      {
        title:
          "Đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện thực hiện mục đích đó",
        source: "trang 136",
        script:
          "Trang 136: “đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện " +
          "thực hiện mục đích đó.” Tư tưởng đạo đức Hồ Chí Minh là đạo đức trong hành " +
          "động, lấy hiệu quả thực tế làm thước đo, kiên quyết chống “bệnh nói suông, " +
          "thói phô trương hình thức”. Ở tình huống 3, im lặng được Tài cao nhất vì thực " +
          "tế đạt kết quả tốt theo thước đo tổ chức. Nhưng hiệu quả thực tế thật sự là " +
          "mười hai nghìn người mất dữ liệu bốn tháng sau. Đây cũng chính là nguyên tắc " +
          "“nói đi đôi với làm” mà giáo trình đặt lên hàng đầu: đạo đức không nằm ở lời " +
          "nói, mà ở hành động và hậu quả thật.",
      },
      {
        title: "Đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống nhất làm một",
        source: "trang 136",
        script:
          "Trang 136: “đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống nhất " +
          "làm một. Trong đó, đạo đức là gốc, là nền tảng của người cách mạng.” Tình " +
          "huống 4 là tình huống duy nhất mà làm giỏi hơn thì hại nhiều hơn: viết code " +
          "càng hiệu quả, càng nhiều học sinh mất ngủ. Chuyên môn không tách rời được " +
          "đạo đức, chỉ có phương án vừa nhận làm vừa đo tác hại mới tạo ra thay đổi " +
          "thật. Trong Di chúc, Người còn dặn: mỗi đảng viên, cán bộ phải “thật sự thấm " +
          "nhuần đạo đức cách mạng, thật sự cần kiệm liêm chính, chí công vô tư” (trang " +
          "136).",
      },
    ],
    quyen_luc: [
      {
        title: "Cán bộ lấy đạo đức làm cốt cán",
        source: "trang 136",
        script:
          "Trang 136: “Việc nước lấy Đoàn thể làm cốt cán. Việc Đoàn thể lấy cán bộ làm " +
          "cốt cán. Cán bộ lấy đạo đức làm cốt cán.” Tình huống 5 đặt bạn chọn ai vào vị " +
          "trí nòng cốt: An giỏi chuyên môn nhưng từng lách luật, hay Bình năng lực trung " +
          "bình nhưng luôn trung thực. Nếu đạo đức mới là thứ làm nên “cốt cán”, chọn An " +
          "là bỏ qua đúng điều kiện gốc; chọn cả hai và giám sát chặt mới giữ được cả " +
          "năng lực lẫn đạo đức. Giáo trình cũng viết: “mọi việc thành hay bại, chủ " +
          "chốt là do cán bộ có thấm nhuần đạo đức cách mạng hay không” (trang 135).",
      },
      {
        title: "Cần – Kiệm – Liêm – Chính, Chí công vô tư",
        source: "trang 140–142",
        script:
          "Trang 140: “Liêm là trong sạch, không tham lam... chỉ có một thứ ham là ham " +
          "học, ham làm, ham tiến bộ.” Trang 141-142: “có quyền mà thiếu lương tâm là có " +
          "dịp đục khoét, có dịp ăn của đút, có dịp dĩ công vi tư. Vì vậy cán bộ phải " +
          "thực hành chữ Liêm trước, để làm kiểu mẫu cho dân.” Tình huống 6: tự ý dùng " +
          "quỹ nhóm dù định trả lại vẫn là lẫn lộn công tư; không đụng quỹ mới giữ đúng " +
          "tinh thần Liêm. Bốn đức tính Cần, Kiệm, Liêm, Chính được ví như bốn mùa của " +
          "trời, bốn phương của đất: “thiếu một đức, thì không thành người” (trang 142).",
      },
    ],
  };

  const HERO_BANNER_IMAGE = "assets/images/hero_banner.png";

  const QUADRANTS = {
    vua_hong_vua_chuyen: {
      key: "vua_hong_vua_chuyen",
      name: "Vừa hồng vừa chuyên",
      title: "Vừa hồng vừa chuyên",
      badgeImage: "assets/images/badge_vua_hong_vua_chuyen.png",
      quote: "Hồ Chí Minh: “Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết... vừa hồng vừa chuyên.”",
      desc:
        "Bạn chọn những phương án khó nhất: vừa giữ được nguyên tắc, vừa không buông kết quả. " +
        "Trong Di chúc, Hồ Chí Minh dặn phải đào tạo thế hệ kế thừa vừa hồng vừa chuyên. Đây là " +
        "kết cục mà giáo trình hướng tới, và cũng tốn công nhất, như bạn vừa thấy qua các tình huống.",
    },
    dang_tin_bat_luc: {
      key: "dang_tin_bat_luc",
      name: "Đáng tin nhưng bất lực",
      title: "Đáng tin nhưng bất lực",
      badgeImage: "assets/images/badge_dang_tin_bat_luc.png",
      quote: "Hồ Chí Minh: “Có đức mà không có tài thì làm việc gì cũng khó.”",
      desc:
        "Bạn giữ được mình sạch, nhưng thường chọn cách rút lui khỏi vấn đề thay vì giải quyết " +
        "nó. Giáo trình nói rõ: thiếu tài thì làm việc gì cũng khó (trang 136), và không có tài thì " +
        "không xây dựng, phát triển được đất nước (trang 137). Trung thực là điều kiện cần, chưa " +
        "phải điều kiện đủ.",
    },
    vo_hai_vo_dung: {
      key: "vo_hai_vo_dung",
      name: "Vô hại vì vô dụng",
      title: "Vô hại vì vô dụng",
      badgeImage: "assets/images/badge_vo_hai_vo_dung.png",
      quote: "Tư tưởng Hồ Chí Minh: Lấy hiệu quả thực tế làm thước đo, kiên quyết chống bệnh nói suông.",
      desc:
        "Bạn phần lớn chọn phương án né tránh: không làm sai rõ ràng, nhưng cũng không làm gì. " +
        "Giáo trình gọi đây là bệnh nói suông, thứ mà tư tưởng đạo đức Hồ Chí Minh, vốn lấy " +
        "hiệu quả thực tế làm thước đo, phản đối trực tiếp.",
    },
    nguy_hiem_nhat: {
      key: "nguy_hiem_nhat",
      name: "Nguy hiểm nhất",
      title: "Nguy hiểm nhất",
      badgeImage: "assets/images/badge_nguy_hiem_nhat.png",
      quote: "Hồ Chí Minh: “Có tài mà không có đức là người vô dụng, thậm chí có hại.”",
      desc:
        "Bạn đạt kết quả tốt trong hầu hết tình huống, bằng cách bỏ qua cái giá mà người khác " +
        "phải trả. Đây chính là điều giáo trình cảnh báo: thiếu đạo đức thì vô dụng, thậm chí có " +
        "hại (trang 136). Và xin lưu ý: bạn càng giỏi, thiệt hại càng lớn.",
    },
  };

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

  return {
    SITE_TITLE,
    VOTE_QUESTION_INTRO,
    HERO_BANNER_IMAGE,
    OPENING_THEORY,
    LAYER_THEORY,
    QUADRANTS,
    THEORY_SUMMARY,
    THEORY_PRINCIPLES,
    AI_DECLARATION,
    PRODUCT_SCOPE_NOTE,
    EXTERNAL_SOURCES,
  };
}));
